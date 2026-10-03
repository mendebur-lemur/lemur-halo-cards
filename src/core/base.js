// Bütün Lemur kartlarının ortak tabanı. HTMLElement + shadow DOM, Lit yok, başka eklenti yok.
// Eski Safari (iOS 12) için ?. ve ?? kullanılmıyor, sınıf alanı (class field) yok.
//
// Bir kart şunları tanımlar:
//   static get TYPE()      'lemur-xxx-card'
//   static get DOMAINS()   ana varlığın alanları (['climate']); ana varlığı olmayan kart için null
//   static get DEFAULTS()  kartın varsayılan ayarları (BASE_DEFAULTS ile birleşir)
//   static nested(cfg, hass)   editörde iç içe ayar grupları ve varsayılanları: { comfort: {...} }
//   static get RESETS()    editörde bir alan değişince sıfırlanacak iç içe gruplar: { levels: ['entity', 'preset'] }
//   static schema(lang, cfg, hass)  editör şeması (ha-form)
//   static stub(hass)      kart ilk eklendiğinde örnek ayar
//   ids()                  yeniden çizimi tetikleyen varlıklar
//   view(lang)             { name, sec:[...], icon:{mdi|svg}, state, tone, band, on, powerIcon, disabled, boxes:[...], haloK, moreInfo }
//                          state: simge eşlemesinde (icons) kullanılan durum anahtarı (ör. 'cool', 'cleaning', 'zone2')
//                          tone:  renk ve hale ayarlarında (tones) kullanılan durum anahtarı ya da öncelik sırasıyla anahtar listesi
//                                 (ör. ['off', 'comfort']: kullanıcı "kapalı" için renk seçtiyse o, yoksa "konforlu")
//   static toneList(lang, cfg, hass)  editörde gösterilecek durumlar: [{ key, label, band (renk adı ya da null), effect }]
//   power()                sağ üst düğmeye basılınca
//   onStep(id, dir) / onSelect(id, value) / onButton(id)   alt satır kutuları
//
// Kutular (alt satır, eşit genişlik):
//   { type: 'step', id, value }                         − değer +
//   { type: 'select', id, icon, label, value, options: [{ value, label, icon }] }
//   { type: 'button', id, icon, label, active, confirm, showLabel }
//   { type: 'info', icon, text, entity }                sadece gösterir; dokununca ayrıntı penceresi
//
// "Bağlantı yok": cihaz unavailable / unknown ise. İsteğe bağlı olarak:
//   last_seen_sensor  son görülme zamanını tutan sensör (ör. Zigbee2MQTT'nin sensor.xxx_last_seen); stale_after (varsayılan 7200 sn) geçerse
//   stale_after       > 0 ise cihazın durumu bu kadar saniye hiç değişmezse. Dikkat: HA, değer aynı kaldıkça zamanı güncellemez;
//                     sadece sürekli değişen cihazlarda kullan.

const CARD_VERSION = '0.0.0';

const BASE_DEFAULTS = {
  name: '',
  icon: '',            // her zaman bu simge
  icon_on: '',         // açıkken
  icon_off: '',        // kapalıyken
  power_icon: '',      // sağ üst düğme
  icons: {},           // eşleme: durum / mod / seçenek / düğme / varlık → simge (ör. cool: mdi:snowflake-variant)
  show_power: true,
  show_halo: true,
  show_labels: false,
  last_seen_sensor: '',
  stale_after: 0,
  language: 'auto',
  color: '',           // kartın tek rengi (boşsa duruma göre); [r,g,b], #rrggbb ya da renk adı
  effect: 'auto',      // hale hareketi: auto, breathe, pulse, blink, still, none
  tones: {}            // durum → { color, effect } (ör. hot: { color: '#ff0000', effect: blink })
};

class LemurCard extends HTMLElement {
  static get TYPE() { return 'lemur-card'; }
  static get DOMAINS() { return null; }
  static get DEFAULTS() { return {}; }
  static get RESETS() { return {}; }
  static allDefaults() { return Object.assign({}, BASE_DEFAULTS, this.DEFAULTS); }
  static nested() { return {}; }
  static schema() { return []; }
  static toneList() { return []; }
  static stub(hass) {
    const d = this.DOMAINS;
    return d ? { entity: firstEntity(hass, d) || (d[0] + '.example') } : {};
  }
  static getConfigElement() { return document.createElement(this.TYPE + '-editor'); }
  static getStubConfig(hass) { return this.stub(hass); }

  validate(config) {
    const d = this.constructor.DOMAINS;
    if (!d) return;
    const dom = String(config.entity || '').split('.')[0];
    if (!config.entity || d.indexOf(dom) < 0) throw new Error('entity: ' + d.join(' / ') + '.xxx');
  }

  setConfig(config) {
    if (!config) throw new Error('config');
    this.validate(config);
    const D = this.constructor.allDefaults(), c = Object.assign({}, D, config);
    // YAML'da liste yerine tek değer yazılmışsa listeye çevir (lights: light.salon → [light.salon])
    Object.keys(D).forEach((k) => {
      if (!Array.isArray(D[k])) return;
      if (typeof c[k] === 'string') c[k] = c[k] ? [c[k]] : [];
      else if (!Array.isArray(c[k])) c[k] = [];
    });
    if (!c.icons || typeof c.icons !== 'object') c.icons = {};
    if (!c.tones || typeof c.tones !== 'object' || Array.isArray(c.tones)) c.tones = {};
    this._config = c;
    this._sig = '';
    this._timer();
    if (this._hass) this._render();
  }

  // Alt satırı olmayan kart kısadır (yalnız üst satır)
  getCardSize() { return this._compact ? 2 : 3; }
  getGridOptions() { return { columns: 12, rows: 'auto', min_columns: 6 }; }

  connectedCallback() {
    this._timer();
    // Kart genişliği değişince (tablet döndü, pano yeniden dizildi) kutulara sığma kontrolü
    if (!this._ro && !this._onRs) {
      if (window.ResizeObserver) { this._ro = new ResizeObserver(() => this._fit()); this._ro.observe(this); }
      else { this._onRs = () => this._fit(); window.addEventListener('resize', this._onRs); }
    }
    this._fit();
  }
  disconnectedCallback() {
    if (this._tick) { clearInterval(this._tick); this._tick = null; }
    if (this._ro) { this._ro.disconnect(); this._ro = null; }
    if (this._onRs) { window.removeEventListener('resize', this._onRs); this._onRs = null; }
  }
  // Süreye bağlı "Bağlantı yok" kontrolü açıksa dakikada bir yeniden bak (durum değişmese de)
  _timer() {
    const c = this._config, need = c && (c.stale_after > 0 || c.last_seen_sensor) && this.isConnected;
    if (need && !this._tick) this._tick = setInterval(() => { this._sig = ''; if (this._hass) this.hass = this._hass; }, 60000);
    if (!need && this._tick) { clearInterval(this._tick); this._tick = null; }
  }

  // Sığma kontrolü: kutudaki ad tam sığmıyorsa .tight (CSS: düğme/seçimde ad gizlenir, bilgi kutusunda simge gizlenir).
  // Yarım kalmış "Kap…" gibi yazılar yerine ya tamamı ya hiç.
  _fit() {
    const root = this.shadowRoot;
    if (!root || !this.offsetWidth) return;
    const boxes = root.querySelectorAll('.box.btn, .box.sel, .box.info');
    for (let i = 0; i < boxes.length; i++) boxes[i].classList.remove('tight');
    for (let i = 0; i < boxes.length; i++) {
      const l = boxes[i].querySelector('.lbl');
      if (l && l.scrollWidth > l.clientWidth + 1) boxes[i].classList.add('tight');
    }
  }

  set hass(h) {
    this._hass = h;
    if (!this._config) return;
    const dark = !(h.themes && h.themes.darkMode === false);
    const sig = pickLang(h, this._config.language) + (dark ? 'D' : 'L') + '|' +
      this.ids().concat([this._config.last_seen_sensor]).filter(Boolean)
        .map((id) => { const s = h.states[id]; return s ? id + s.last_updated + s.state : id; }).join('|');
    if (sig === this._sig) return;
    this._sig = sig;
    this._render();
  }
  get hass() { return this._hass; }

  ids() { return [this._config.entity].concat(this._config.entities || []); }
  st(id) { return id && this._hass ? this._hass.states[id] : undefined; }
  power() {}
  onStep() {}
  onSelect() {}
  onButton() {}

  // Bağlantı yok mu: cihaz unavailable/unknown, ya da (açıksa) süre aşıldı, ya da son görülme sensörü eski
  isLost(id) {
    const c = this._config;
    if (stale(this.st(id), c.stale_after)) return true;
    if (c.last_seen_sensor) {
      const s = this.st(c.last_seen_sensor), ts = s ? Date.parse(s.state) : NaN;
      const limit = c.stale_after > 0 ? c.stale_after : 7200;
      if (isFinite(ts) && (Date.now() - ts) / 1000 > limit) return true;
    }
    return false;
  }

  call(domain, service, data) {
    return this._hass.callService(domain, service, data || {});
  }

  // Art arda basışları toplar, 800 ms sonra tek komut gönderir. Değer kutusu hemen güncellenir,
  // arada kart yeniden çizilse de bekleyen değer gösterilmeye devam eder.
  stepValue(key, cur, delta, lo, hi, fmt, commit) {
    this._pend = this._pend || {};
    this._pendFmt = this._pendFmt || {};
    const base = this._pend[key] !== undefined ? this._pend[key] : cur;
    if (base === null || base === undefined) return;
    let v = Math.round((base + delta) * 100) / 100;
    if (lo !== null && lo !== undefined) v = Math.max(lo, v);
    if (hi !== null && hi !== undefined) v = Math.min(hi, v);
    this._pend[key] = v;
    this._pendFmt[key] = fmt;
    const el = this.shadowRoot && this.shadowRoot.getElementById(key + '-val');
    if (el) el.textContent = fmt(v);
    this._tmrs = this._tmrs || {};
    clearTimeout(this._tmrs[key]);
    this._tmrs[key] = setTimeout(() => { const val = this._pend[key]; delete this._pend[key]; commit(val); }, 800);
  }

  // Büyük ikon. Öncelik: icon > icon_on / icon_off > icons[durum] > kartın kendi seçimi
  _icon(v) {
    const c = this._config, map = c.icons || {};
    if (c.icon) return { mdi: c.icon };
    if (v.on && c.icon_on) return { mdi: c.icon_on };
    if (!v.on && c.icon_off) return { mdi: c.icon_off };
    if (v.state !== undefined && map[v.state]) return { mdi: map[v.state] };
    return v.icon || { mdi: 'mdi:help-circle' };
  }

  // Kutulara simge eşlemesi: seçenek değeri, düğme kimliği ya da varlık kimliği
  _mapBox(b) {
    const map = this._config.icons || {};
    if (!Object.keys(map).length) return b;
    const o = Object.assign({}, b);
    if (o.type === 'select') {
      o.options = (o.options || []).map((x) => map[x.value] ? Object.assign({}, x, { icon: map[x.value] }) : x);
      if (map[o.value]) o.icon = map[o.value];
    } else if (o.type === 'button' && map[o.id]) o.icon = map[o.id];
    else if (o.type === 'info' && o.entity && map[o.entity]) o.icon = map[o.entity];
    return o;
  }

  // Hale rengi ve hareketi. Öncelik: durumun kendi ayarı (tones) > kartın tek rengi / hareketi > kartın kendi seçimi.
  // "Bağlantı yok" durumunda kartın tek rengi uygulanmaz (uyarı görünür kalsın), ama tones.lost ile değiştirilebilir.
  _haloStyle(v, bnd) {
    const c = this._config, keys = Array.isArray(v.tone) ? v.tone : (v.tone ? [v.tone] : []);
    const isAlarm = bnd === BANDS.alarm;
    let rgb = bnd.rgb, eff = isAlarm ? 'blink' : 'breathe';
    if (keys[0] !== 'lost') {
      const fc = this._color(c.color); if (fc) rgb = fc;
      if (c.effect && c.effect !== 'auto' && EFFECTS.indexOf(c.effect) >= 0) eff = c.effect;
    }
    const T = c.tones || {};
    for (let i = 0; i < keys.length; i++) {
      const o = T[keys[i]];
      if (!o || typeof o !== 'object') continue;
      const oc = this._color(o.color), oe = o.effect && o.effect !== 'auto' && EFFECTS.indexOf(o.effect) >= 0 ? o.effect : null;
      if (!oc && !oe) continue;
      if (oc) rgb = oc;
      if (oe) eff = oe;
      break;
    }
    const dur = eff === 'blink' ? (isAlarm ? bnd.duration : 1.2) : eff === 'pulse' ? 1.6 : (isAlarm ? 4.4 : bnd.duration);
    return { rgb: rgb, eff: eff, dur: dur };
  }

  // Renk adı temada tanımlıysa (--rgb-red-color gibi) temanın rengi, değilse parseColor
  _color(v) {
    if (typeof v === 'string' && /^[a-z-]+$/.test(v.trim()) && window.getComputedStyle) {
      const css = window.getComputedStyle(this).getPropertyValue('--rgb-' + v.trim() + '-color').trim();
      const p = css && parseColor(css.replace(/\s+/g, ''));
      if (p) return p;
    }
    return parseColor(v);
  }

  _boxHtml(b, showLabels) {
    const id = esc(b.id || '');
    const lbl = (txt, force) => (txt && (showLabels || force)) ? '<span class="lbl" id="' + id + '-lbl">' + esc(txt) + '</span>' : '';
    if (b.type === 'step') {
      const pv = this._pend && this._pend[b.id], f = this._pendFmt && this._pendFmt[b.id];
      const value = pv !== undefined && f ? f(pv) : b.value;
      return '<div class="box tgt"><button data-step="' + id + '" data-dir="-1" aria-label="−">−</button>' +
        '<span class="val" id="' + id + '-val">' + esc(value) + '</span>' +
        '<button data-step="' + id + '" data-dir="1" aria-label="+">+</button></div>';
    }
    if (b.type === 'select') {
      const opts = b.options || [];
      const has = opts.some((o) => o.value === b.value);
      return '<div class="box sel" title="' + esc(b.title || '') + '"><ha-icon class="lead" id="' + id + '-ic" icon="' + esc(b.icon || 'mdi:menu') + '"></ha-icon>' +
        lbl(b.label) + '<span class="chev"><ha-icon icon="mdi:menu-down"></ha-icon></span>' +
        '<select data-sel="' + id + '" aria-label="' + esc(b.title || '') + '">' +
        (has ? '' : '<option value="" selected disabled hidden>' + esc(b.label || '') + '</option>') +
        opts.map((o) => '<option value="' + esc(o.value) + '"' + (o.value === b.value ? ' selected' : '') + '>' + esc(o.label) + '</option>').join('') +
        '</select></div>';
    }
    if (b.type === 'button') {
      return '<button class="box btn' + (b.active ? ' active' : '') + '" data-btn="' + id + '"' + (b.confirm ? ' data-confirm="1"' : '') +
        ' title="' + esc(b.label || '') + '" aria-label="' + esc(b.label || '') + '">' +
        '<ha-icon icon="' + esc(b.icon || 'mdi:gesture-tap') + '"></ha-icon>' + lbl(b.label, b.showLabel) + '</button>';
    }
    // info
    return '<div class="box info"' + (b.entity ? ' data-info="' + esc(b.entity) + '"' : '') + ' title="' + esc(b.title || '') + '">' +
      (b.icon ? '<ha-icon icon="' + esc(b.icon) + '"></ha-icon>' : '') + '<span class="lbl">' + esc(b.text) + '</span></div>';
  }

  _render() {
    if (!this._hass || !this._config) return;
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    const root = this.shadowRoot;
    // Açık bir seçim listesi varken yeniden çizme (iPad'de liste kapanır); seçim bitince çizilir
    const ae = root.activeElement;
    if (ae && ae.tagName === 'SELECT') { this._dirty = true; return; }
    this._dirty = false;
    // İskelet bir kez kurulur: hale öğesi hep aynı kalır, animasyonu durum değişince baştan başlamaz
    if (!this._card) {
      root.innerHTML = '<style>' + CSS + '</style><ha-card><div class="halo"></div><div class="content"></div></ha-card>';
      this._card = root.querySelector('ha-card');
      this._halo = root.querySelector('.halo');
      this._content = root.querySelector('.content');
    }
    const c = this._config, lang = pickLang(this._hass, c.language);
    let v;
    try { v = this.view(lang); } catch (e) { v = { name: c.name || this.constructor.TYPE, sec: [String(e && e.message || e)], icon: { mdi: 'mdi:alert' }, band: BANDS.alarm, boxes: [] }; }
    const bnd = v.band || BANDS.green;
    const hs = this._haloStyle(v, bnd);
    const alarm = hs.eff === 'blink';
    const light = this._hass.themes && this._hass.themes.darkMode === false;
    const icon = this._icon(v);
    const iconHtml = icon.svg ? svgIcon(icon.svg) : '<ha-icon icon="' + esc(icon.mdi) + '"></ha-icon>';
    // Alt yazı parçaları kendi içinde bölünmesin diye boşluklar bölünmez boşluk olur; satır yalnız " · " aralarında kırılır
    const sec = (v.sec || []).filter((x) => x !== '' && x !== null && x !== undefined).map((x) => String(x).replace(/ /g, ' ')).join(' · ');
    const boxes = (v.boxes || []).filter(Boolean).map((b) => this._mapBox(b));
    v.boxes = boxes;
    const haloK = v.haloK !== undefined ? v.haloK : 1;
    const hasPwr = c.show_power && v.powerIcon !== null;
    this._compact = !boxes.length;
    this._card.className = (v.on ? 'on' : 'off') + (alarm ? ' alarm' : '') + (hs.eff === 'still' ? ' still' : '') + (light ? ' light' : '') + (hasPwr ? '' : ' nopwr') + (boxes.length ? '' : ' compact');
    this._card.setAttribute('style', '--temp-rgb:' + hs.rgb + ';--tint-rgb:' + tint(hs.rgb) + ';--halo-dur:' + hs.dur + 's;--halo-k:' + haloK);
    this._halo.style.display = c.show_halo && hs.eff !== 'none' ? '' : 'none';
    this._content.innerHTML =
      '<div class="top"><div class="ic" data-more="1">' + iconHtml + '</div>' +
      '<div class="txt" data-more="1"><div class="name">' + esc(c.name || v.name || '') + '</div><div class="sec">' + esc(sec) + '</div></div>' +
      (hasPwr ? '<button class="pwr' + (v.on ? ' on' : '') + '" id="pwr" aria-label="' + esc(v.powerTitle || t(lang, 'power')) + '"' +
        (v.disabled ? ' disabled' : '') + '><ha-icon icon="' + esc(c.power_icon || v.powerIcon || 'mdi:power') + '"></ha-icon></button>' : '') +
      '</div>' + (boxes.length ? '<div class="bottom' + (v.disabled ? ' dis' : '') + '">' + boxes.map((b) => this._boxHtml(b, c.show_labels)).join('') + '</div>' : '');
    this._bind(v, lang);
    this._fit();
    if (window.requestAnimationFrame) requestAnimationFrame(() => this._fit());
  }

  _bind(v, lang) {
    const root = this.shadowRoot;
    const each = (sel, fn) => { const l = root.querySelectorAll(sel); for (let i = 0; i < l.length; i++) fn(l[i]); };
    const pwr = root.getElementById('pwr');
    if (pwr) pwr.addEventListener('click', (e) => { e.stopPropagation(); this.power(); });
    const mi = v.moreInfo !== undefined ? v.moreInfo : this._config.entity;
    if (mi) each('[data-more]', (el) => { el.style.cursor = 'pointer'; el.addEventListener('click', () => moreInfo(this, mi)); });
    each('[data-step]', (el) => el.addEventListener('click', () => this.onStep(el.getAttribute('data-step'), Number(el.getAttribute('data-dir')))));
    each('[data-sel]', (el) => {
      el.addEventListener('change', () => {
        const id = el.getAttribute('data-sel'), box = (v.boxes || []).filter((b) => b && b.id === id)[0];
        const opt = box && box.options.filter((o) => o.value === el.value)[0];
        if (opt && opt.icon) { const ic = root.getElementById(id + '-ic'); if (ic) ic.setAttribute('icon', opt.icon); }
        const lb = root.getElementById(id + '-lbl'); if (lb && opt) lb.textContent = opt.label;
        this.onSelect(id, el.value);
        el.blur();
      });
      // Liste açıkken gelen güncellemeler beklemişse şimdi çiz
      el.addEventListener('blur', () => { if (this._dirty) setTimeout(() => this._render(), 0); });
    });
    each('[data-btn]', (el) => el.addEventListener('click', () => {
      const id = el.getAttribute('data-btn');
      if (el.getAttribute('data-confirm') && !el.classList.contains('ask')) {
        // Riskli işlem: ilk dokunuşta "Emin misin?", 3 sn içinde ikinci dokunuş onaylar
        el.classList.add('ask');
        el.classList.remove('tight');
        const lb = el.querySelector('.lbl'); const old = lb ? lb.textContent : null;
        if (lb) lb.textContent = t(lang, 'confirm'); else el.insertAdjacentHTML('beforeend', '<span class="lbl">' + esc(t(lang, 'confirm')) + '</span>');
        setTimeout(() => { el.classList.remove('ask'); const l2 = el.querySelector('.lbl'); if (l2) { if (old === null) l2.parentNode.removeChild(l2); else l2.textContent = old; } this._fit(); }, 3000);
        return;
      }
      el.classList.remove('ask');
      this.onButton(id);
    }));
    each('[data-info]', (el) => { el.style.cursor = 'pointer'; el.addEventListener('click', () => moreInfo(this, el.getAttribute('data-info'))); });
  }
}

// ---------------------------------------------------------------------------
// Ortak editör: kartın schema() ve varsayılanlarıyla çalışır. HA'nın kendi ha-form bileşeni (ek bağımlılık değil).
class LemurEditor extends HTMLElement {
  setConfig(config) { this._config = Object.assign({}, config); this._render(); }
  set hass(h) { this._hass = h; if (this._form) this._form.hass = h; else this._render(); }

  // İç içe ayar grupları: kartın kendi grupları + renk ve hale (tones)
  _nested(cfg, lang) {
    const K = this.constructor.cardClass, N = Object.assign({}, K.nested(cfg, this._hass));
    const tl = K.toneList(lang, cfg, this._hass) || [];
    if (tl.length) {
      N.tones = {};
      tl.forEach((x) => { N.tones[x.key] = { effect: x.effect || 'auto' }; });
    }
    return N;
  }

  _clean(cfg) {
    const K = this.constructor.cardClass, D = K.allDefaults(), N = this._nested(cfg, pickLang(this._hass, cfg.language));
    const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
    const empty = (x) => x === '' || x === null || x === undefined || (Array.isArray(x) && !x.length);
    // Varsayılanla aynı ya da boş olan alt alanları at; boş kalan grubu tamamen kaldır (iki seviyeye kadar)
    const strip = (val, def) => {
      const out = {};
      Object.keys(val || {}).forEach((x) => {
        let w = val[x];
        const d = def ? def[x] : undefined;
        if (w && typeof w === 'object' && !Array.isArray(w)) { w = strip(w, d && typeof d === 'object' ? d : {}); if (!Object.keys(w).length) return; }
        else if (empty(w) || same(w, d)) return;
        out[x] = w;
      });
      return out;
    };
    Object.keys(N).forEach((k) => {
      const v = strip(cfg[k] || {}, N[k]);
      if (Object.keys(v).length) cfg[k] = v; else delete cfg[k];
    });
    Object.keys(D).forEach((k) => {
      if (Array.isArray(D[k]) && Array.isArray(cfg[k]) && cfg[k].join() === D[k].join()) delete cfg[k];
      else if (cfg[k] === D[k]) delete cfg[k];
    });
    Object.keys(cfg).forEach((k) => {
      const x = cfg[k];
      if (x === '' || x === undefined || x === null || (Array.isArray(x) && !x.length) || (typeof x === 'object' && !Array.isArray(x) && !Object.keys(x).length)) delete cfg[k];
    });
    return cfg;
  }

  _render() {
    if (!this._hass || !this._config) return;
    const K = this.constructor.cardClass;
    const lang = pickLang(this._hass, this._config.language);
    if (!this._form) {
      this._form = document.createElement('ha-form');
      this._form.computeLabel = (s) => { if (s.label) return s.label; const v = tMaybe(lang, 'ed_' + s.name); return v !== null ? v : (s.title || s.name); };
      this._form.addEventListener('value-changed', (ev) => {
        const prev = this._config, next = Object.assign({}, prev, ev.detail.value), R = K.RESETS;
        // Cihaz ya da hazır ayar değişince ona bağlı iç içe grup (ör. sensör bölgeleri) eskisinden kalmasın
        Object.keys(R).forEach((k) => { if (R[k].some((f) => String(prev[f] || '') !== String(next[f] || ''))) delete next[k]; });
        const cfg = this._clean(next);
        this._config = cfg;
        this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: cfg }, bubbles: true, composed: true }));
        this._render();
      });
      this.appendChild(this._form);
    }
    const N = this._nested(this._config, lang), data = Object.assign({}, K.allDefaults(), this._config);
    const isObj = (x) => !!x && typeof x === 'object' && !Array.isArray(x);
    Object.keys(N).forEach((k) => {
      // Varsayılanların üstüne kullanıcının değerleri; durum grupları (tones) bir seviye daha birleşir
      const cur = this._config[k] || {}, d = {};
      Object.keys(N[k]).forEach((x) => { d[x] = isObj(N[k][x]) ? Object.assign({}, N[k][x]) : N[k][x]; });
      Object.keys(cur).forEach((x) => { d[x] = isObj(cur[x]) && isObj(d[x]) ? Object.assign(d[x], cur[x]) : cur[x]; });
      data[k] = d;
    });
    // Renk seçici ad ya da #rrggbb gösterir; YAML'da [r,g,b] ya da "r,g,b" yazılmışsa #rrggbb'ye çevir
    const toPick = (v) => { if (v === undefined || v === null || v === '') return undefined; if (typeof v === 'string' && !/,/.test(v)) return v; const p = parseColor(v); return p ? rgbHex(p) : undefined; };
    data.color = toPick(data.color);
    if (data.tones) Object.keys(data.tones).forEach((x) => { const o = data.tones[x]; if (o && o.color !== undefined) o.color = toPick(o.color); });
    let schema = K.schema(lang, this._config, this._hass);
    const tl = K.toneList(lang, this._config, this._hass) || [];
    const cs = SCH.colors(lang, tl), ai = schema.map((x) => x && x.name).indexOf('adv');
    schema = ai >= 0 ? schema.slice(0, ai).concat([cs], schema.slice(ai)) : schema.concat([cs]);
    this._form.hass = this._hass;
    this._form.schema = schema;
    this._form.data = data;
  }
}

// Editör şemasında sık kullanılan parçalar
const SCH = {
  entity: (name, domains, extra) => ({ name: name, selector: { entity: Object.assign({ domain: domains }, extra || {}) } }),
  entities: (name, domains) => ({ name: name, selector: { entity: { domain: domains, multiple: true } } }),
  text: (name) => ({ name: name, selector: { text: {} } }),
  icon: () => ({ name: 'icon', selector: { icon: {} } }),
  bool: (name) => ({ name: name, selector: { boolean: {} } }),
  num: (name, min, max, step, unit) => ({ name: name, selector: { number: { min: min, max: max, step: step || 1, mode: 'box', unit_of_measurement: unit || '' } } }),
  select: (name, lang, values, prefix) => ({ name: name, selector: { select: { mode: 'dropdown',
    options: values.map((x) => ({ value: x, label: t(lang, (prefix || '') + x) })) } } }),
  color: (name, lang) => ({ name: name, selector: { select: { mode: 'dropdown', options: BAND_NAMES.map((x) => ({ value: x, label: t(lang, 'c_' + x) })) } } }),
  // Görünüm bölümü: her kartın ortak anahtarları + kartın kendi anahtarları
  appearance: (lang, extra) => ({ type: 'expandable', name: 'appearance', flatten: true, title: t(lang, 'ed_appearance'), schema: [
    { type: 'grid', name: '', flatten: true, schema: ['show_power', 'show_halo', 'show_labels'].concat(extra || []).map((k) => ({ name: k, selector: { boolean: {} } })) },
    { type: 'grid', name: '', flatten: true, schema: [{ name: 'icon', selector: { icon: {} } }, { name: 'power_icon', selector: { icon: {} } },
      { name: 'icon_on', selector: { icon: {} } }, { name: 'icon_off', selector: { icon: {} } }] },
    { name: 'icons', selector: { object: {} } },
    { name: 'language', selector: { select: { mode: 'dropdown', options: [{ value: 'auto', label: t(lang, 'ed_lang_auto') }, { value: 'tr', label: 'Türkçe' }, { value: 'en', label: 'English' }] } } }] }),
  // Renkler ve hale: kartın tek rengi ve hareketi, durum başına renk ve hareket
  colors: (lang, tones) => {
    const eff = { select: { mode: 'dropdown', options: EFFECTS.map((x) => ({ value: x, label: t(lang, 'ef_' + x) })) } };
    const col = { ui_color: { include_state: false, include_none: false } };
    const sch = [{ type: 'grid', name: '', flatten: true, schema: [{ name: 'color', selector: col }, { name: 'effect', selector: eff }] }];
    if (tones.length) {
      sch.push({ type: 'expandable', name: 'tones', title: t(lang, 'ed_tones'), schema: tones.map((x) => ({ type: 'grid', name: x.key, schema: [
        { name: 'color', label: x.label + ' · ' + t(lang, 'ed_tone_color'), selector: col },
        { name: 'effect', label: x.label + ' · ' + t(lang, 'ed_tone_effect'), selector: eff }] })) });
    }
    return { type: 'expandable', name: 'colors_sec', flatten: true, title: t(lang, 'ed_colors'), schema: sch };
  },
  // Gelişmiş bölümü: kartın kendi alanları + bağlantı kontrolü (her kartta)
  advanced: (lang, extra) => ({ type: 'expandable', name: 'adv', flatten: true, title: t(lang, 'ed_advanced'), schema: (extra || []).concat([
    { name: 'last_seen_sensor', selector: { entity: { domain: ['sensor'], device_class: 'timestamp' } } },
    { name: 'stale_after', selector: { number: { min: 0, max: 86400, step: 60, mode: 'box', unit_of_measurement: 's' } } }]) })
};

// Kartı ve editörünü kaydeder, HA'nın "Kart ekle" listesine ekler
function registerCard(cls, info) {
  const type = cls.TYPE;
  if (!customElements.get(type)) customElements.define(type, cls);
  if (!customElements.get(type + '-editor')) {
    const Ed = class extends LemurEditor {};
    Ed.cardClass = cls;
    customElements.define(type + '-editor', Ed);
  }
  window.customCards = window.customCards || [];
  if (window.customCards.some((x) => x.type === type)) return;
  const L = () => { const ha = document.querySelector('home-assistant'); return pickLang(ha && ha.hass); };
  window.customCards.push({ type: type, preview: true, documentationURL: DOCS_URL,
    get name() { return info[L()].name; }, get description() { return info[L()].desc; } });
}
