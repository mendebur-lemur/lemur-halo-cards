/*! Lemur Climate Card v0.0.0 | MIT */
(() => {
if (customElements.get('lemur-climate-card')) return;
const module = undefined;
const CSS = ":host { display: block; }\nha-card { padding: 14px 16px 12px; background: var(--ha-card-background, var(--card-background-color)); overflow: visible; }\n.top { display: flex; align-items: center; gap: 16px; }\n.ic { position: relative; flex: 0 0 64px; width: 64px; height: 64px; border-radius: 9999px;\ndisplay: flex; align-items: center; justify-content: center;\nbackground: rgba(77, 77, 77, 0.1); border: 1px solid rgba(255, 255, 255, 0.06);\ncolor: rgba(var(--temp-rgb, 140,140,140), 1); --mdc-icon-size: 40px; }\n.ic svg { width: 40px; height: 40px; }\n.ic::after { content: ''; position: absolute; inset: -22px; border-radius: inherit; pointer-events: none;\nmix-blend-mode: screen; animation: var(--halo-anim, none) var(--halo-dur, 4s) ease-in-out infinite; }\n.txt { flex: 1 1 auto; min-width: 0; }\n.name { font-size: 1.4rem; font-weight: 600; color: var(--primary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.sec { font-size: 0.9rem; color: var(--secondary-text-color); margin-top: 2px; }\n.pwr { flex: 0 0 56px; width: 56px; height: 56px; border-radius: var(--ha-card-border-radius, 14px); border: none; cursor: pointer;\ndisplay: flex; align-items: center; justify-content: center; --mdc-icon-size: 26px;\nbackground: rgba(127, 127, 127, 0.12); color: var(--secondary-text-color); }\n.pwr.on { background: rgba(40, 190, 100, 0.18); color: rgb(40, 190, 100); }\n.bottom { display: flex; gap: 8px; margin-top: 14px; }\n.box { flex: 1 1 0; min-width: 0; height: 42px; border-radius: 12px; background: rgba(127, 127, 127, 0.12);\ndisplay: flex; align-items: center; justify-content: space-between; padding: 0 6px; color: var(--primary-text-color); }\n.box button { border: none; background: transparent; color: inherit; font-size: 1.2rem; width: 32px; height: 32px; cursor: pointer; border-radius: 8px; }\n.box .val { font-weight: 600; font-variant-numeric: tabular-nums; }\n.box select { width: 100%; border: none; background: transparent; color: inherit; font: inherit; appearance: none; -webkit-appearance: none; padding: 0 8px; cursor: pointer; }\n.off .ic::after { animation: none; opacity: 0.35; }\n@media (prefers-reduced-motion: reduce) { .ic::after { animation: none; box-shadow: 0 0 90px 28px rgba(var(--temp-rgb), 0.35); } }\n@keyframes lc-blue { 0%, 100% { box-shadow: 0 0 84px 22px rgba(var(--temp-rgb), 0.33), 0 -18px 70px -14px rgba(190, 225, 255, 0.33); } 50% { box-shadow: 0 0 130px 36px rgba(var(--temp-rgb), 0.50), 0 -34px 100px -8px rgba(215, 240, 255, 0.50); } }\n@keyframes lc-green { 0%, 100% { box-shadow: 0 0 78px 24px rgba(var(--temp-rgb), 0.30), 0 18px 60px -12px rgba(180, 255, 200, 0.32); } 50% { box-shadow: 0 0 120px 40px rgba(var(--temp-rgb), 0.45), 0 26px 80px -10px rgba(180, 255, 200, 0.50); } }\n@keyframes lc-yellow { 0%, 100% { box-shadow: 0 0 92px 30px rgba(var(--temp-rgb), 0.33), 0 18px 72px -12px rgba(255, 240, 170, 0.33); } 50% { box-shadow: 0 0 140px 48px rgba(var(--temp-rgb), 0.50), 0 26px 100px -10px rgba(255, 240, 170, 0.50); } }\n@keyframes lc-red { 0%, 100% { box-shadow: 0 0 100px 36px rgba(var(--temp-rgb), 0.36), 0 22px 80px -12px rgba(255, 150, 100, 0.36); } 50% { box-shadow: 0 0 155px 56px rgba(var(--temp-rgb), 0.54), 0 30px 110px -10px rgba(255, 150, 100, 0.54); } }";
// Metinler. Her metin hem tr hem en. Arayüzde marka adı geçmez.
const TXT = {
  tr: {
    very_cold: 'Çok soğuk', cool: 'Serin', comfortable: 'Konforlu', humid: 'Nemli', dry: 'Kuru',
    warm: 'Biraz sıcak', hot: 'Sıcak',
    st_off: 'Kapalı', st_heating: 'Isıtıyor', st_cooling: 'Soğutuyor', st_idle: 'Bekliyor',
    st_lost: 'Bağlantı yok', st_sensor: 'Sensör yok',
    mode: 'Mod', fan: 'Fan', target: 'Hedef',
    m_off: 'Kapalı', m_heat: 'Isıtma', m_cool: 'Soğutma', m_heat_cool: 'Otomatik', m_auto: 'Otomatik',
    m_dry: 'Nem alma', m_fan_only: 'Fan',
    // editör
    ed_entity: 'Kontrol edilecek cihaz', ed_entities: 'Birlikte kontrol edilecek diğer cihazlar',
    ed_name: 'Ad', ed_kind: 'Kart tipi', ed_kind_auto: 'Otomatik', ed_kind_ac: 'Klima', ed_kind_radiator: 'Petek',
    ed_radiator_style: 'Petek simgesi', ed_panel: 'Panel', ed_sectional: 'Dilimli',
    ed_temp: 'Sıcaklık sensörü (boşsa cihazdan)', ed_hum: 'Nem sensörü (boşsa cihazdan)',
    ed_outdoor: 'Dış sıcaklık sensörü (isteğe bağlı)', ed_advanced: 'Gelişmiş: eşikler',
    ed_reset: 'Varsayılana dön'
  },
  en: {
    very_cold: 'Very cold', cool: 'Cool', comfortable: 'Comfortable', humid: 'Humid', dry: 'Dry',
    warm: 'A bit warm', hot: 'Hot',
    st_off: 'Off', st_heating: 'Heating', st_cooling: 'Cooling', st_idle: 'Idle',
    st_lost: 'No connection', st_sensor: 'No sensor',
    mode: 'Mode', fan: 'Fan', target: 'Target',
    m_off: 'Off', m_heat: 'Heat', m_cool: 'Cool', m_heat_cool: 'Auto', m_auto: 'Auto',
    m_dry: 'Dry', m_fan_only: 'Fan',
    ed_entity: 'Device to control', ed_entities: 'Other devices controlled together',
    ed_name: 'Name', ed_kind: 'Card type', ed_kind_auto: 'Automatic', ed_kind_ac: 'Air conditioner', ed_kind_radiator: 'Radiator',
    ed_radiator_style: 'Radiator icon', ed_panel: 'Panel', ed_sectional: 'Sectional',
    ed_temp: 'Temperature sensor (device if empty)', ed_hum: 'Humidity sensor (device if empty)',
    ed_outdoor: 'Outdoor temperature sensor (optional)', ed_advanced: 'Advanced: thresholds',
    ed_reset: 'Reset to defaults'
  }
};

function pickLang(hass, forced) {
  if (forced === 'tr' || forced === 'en') return forced;
  const l = (hass && ((hass.locale && hass.locale.language) || hass.language)) || 'en';
  return String(l).toLowerCase().indexOf('tr') === 0 ? 'tr' : 'en';
}
function t(lang, key) {
  const d = TXT[lang] || TXT.en;
  return d[key] !== undefined ? d[key] : (TXT.en[key] !== undefined ? TXT.en[key] : key);
}

// Saf hesaplar (DOM yok). Bugünkü Jinja şablonlarının birebir JS karşılığı.
// Kaynak: dev/eski-kartlar/klima-karti.md ve petek-karti.md

const COMFORT_DEFAULTS = { cold: 16, cool: 19, warm: 29, hot: 31.5, humid_dewpoint: 18, dry_humidity: 28 };
const RADIATOR_DEFAULTS = { very_cold: 15, cold: 18, comfort: 24, warm: 26, outdoor_base: 10, outdoor_factor: 0.33, outdoor_max_shift: 3 };

// Renk ve nefes süresi (sn). Süre CSS'te 1.15 ile çarpılır (bugünkü kartla aynı).
const BANDS = {
  ice:    { rgb: '120,215,255', anim: 'blue',   duration: 4.4 },
  blue:   { rgb: '0,140,255',   anim: 'blue',   duration: 4.2 },
  green:  { rgb: '40,190,100',  anim: 'green',  duration: 3.8 },
  yellow: { rgb: '255,205,40',  anim: 'yellow', duration: 3.6 },
  red:    { rgb: '255,55,55',   anim: 'red',    duration: 3.4 },
  alarm:  { rgb: '255,55,55',   anim: 'red',    duration: 1.2 }
};

// Çiy noktası (Magnus formülü). Nem yoksa null.
function dewPoint(t, rh) {
  if (!(rh > 0) || !isFinite(t)) return null;
  const g = Math.log(rh / 100) + (17.62 * t) / (243.12 + t);
  return (243.12 * g) / (17.62 - g);
}

// Hissedilen sıcaklık: 13.5 °C üstü çiy noktası sıcağı artırır, 12 °C altı kuru hava serinletir;
// etki 21 °C altında devreye girmez, 24 °C'de tam etkili olur.
function feelsLike(t, rh) {
  const td = dewPoint(t, rh);
  if (td === null) return { his: t, td: null };
  const nemli = Math.max(0, td - 13.5);
  const kuru = Math.max(0, 12 - td);
  const k = Math.min(1, Math.max(0, (t - 21) / 3));
  return { his: t + k * (0.55 * nemli - 0.3 * kuru), td: td };
}

// Konfor etiketi anahtarı (i18n.js'deki anahtarlar)
function comfortKey(t, rh, c) {
  c = Object.assign({}, COMFORT_DEFAULTS, c || {});
  const r = feelsLike(t, rh);
  const his = r.his, td = r.td;
  if (his < c.cold) return 'very_cold';
  if (his < c.cool) return 'cool';
  if (his < c.warm) {
    if (td !== null && td >= c.humid_dewpoint) return 'humid';
    if (rh > 0 && rh < c.dry_humidity) return 'dry';
    return 'comfortable';
  }
  if (his < c.hot) return 'warm';
  return 'hot';
}

// Klima hale bandı: hissedilen sıcaklığa göre
function acBand(t, rh, c) {
  c = Object.assign({}, COMFORT_DEFAULTS, c || {});
  const his = feelsLike(t, rh).his;
  if (his < c.cool) return BANDS.blue;
  if (his < c.warm) return BANDS.green;
  if (his < c.hot) return BANDS.yellow;
  return BANDS.red;
}

// Petek hale bandı: gerçek sıcaklığa göre, dış sıcaklıkla kayan eşikler
function radiatorBand(t, outdoor, b, lost) {
  if (lost) return BANDS.alarm;
  b = Object.assign({}, RADIATOR_DEFAULTS, b || {});
  let kay = 0;
  if (outdoor !== null && outdoor !== undefined && isFinite(outdoor)) {
    kay = Math.max(0, Math.min(b.outdoor_max_shift, (outdoor - b.outdoor_base) * b.outdoor_factor));
  }
  if (t < b.very_cold + kay) return BANDS.ice;
  if (t < b.cold + kay) return BANDS.blue;
  if (t < b.comfort + kay) return BANDS.green;
  if (t < b.warm + kay) return BANDS.yellow;
  return BANDS.red;
}

if (typeof module !== 'undefined') {
  module.exports = { COMFORT_DEFAULTS, RADIATOR_DEFAULTS, BANDS, dewPoint, feelsLike, comfortKey, acBand, radiatorBand };
}

// Kendi simgelerimiz. Petek simgeleri Hakan'ın petek-ikonlari.js çiziminden (dev/eski-kartlar/).
// MDI simgeleri için HA'nın ha-icon bileşeni kullanılır (ek bağımlılık değil).
const ICONS = (() => {
  const f = (n) => Math.round(n * 100) / 100;
  const rr = (x, y, w, h, r) => {
    r = Math.min(r, w / 2, h / 2);
    return 'M' + f(x + r) + ' ' + f(y) + 'H' + f(x + w - r) + 'A' + f(r) + ' ' + f(r) + ' 0 0 1 ' + f(x + w) + ' ' + f(y + r) +
      'V' + f(y + h - r) + 'A' + f(r) + ' ' + f(r) + ' 0 0 1 ' + f(x + w - r) + ' ' + f(y + h) +
      'H' + f(x + r) + 'A' + f(r) + ' ' + f(r) + ' 0 0 1 ' + f(x) + ' ' + f(y + h - r) +
      'V' + f(y + r) + 'A' + f(r) + ' ' + f(r) + ' 0 0 1 ' + f(x + r) + ' ' + f(y) + 'Z';
  };
  const rrHole = (x, y, w, h, r) => {
    r = Math.min(r, w / 2, h / 2);
    return 'M' + f(x + r) + ' ' + f(y) + 'A' + f(r) + ' ' + f(r) + ' 0 0 0 ' + f(x) + ' ' + f(y + r) +
      'V' + f(y + h - r) + 'A' + f(r) + ' ' + f(r) + ' 0 0 0 ' + f(x + r) + ' ' + f(y + h) +
      'H' + f(x + w - r) + 'A' + f(r) + ' ' + f(r) + ' 0 0 0 ' + f(x + w) + ' ' + f(y + h - r) +
      'V' + f(y + r) + 'A' + f(r) + ' ' + f(r) + ' 0 0 0 ' + f(x + w - r) + ' ' + f(y) + 'Z';
  };
  const circle = (cx, cy, r) =>
    'M' + f(cx - r) + ' ' + f(cy) + 'A' + f(r) + ' ' + f(r) + ' 0 1 1 ' + f(cx + r) + ' ' + f(cy) + 'A' + f(r) + ' ' + f(r) + ' 0 1 1 ' + f(cx - r) + ' ' + f(cy) + 'Z';
  const circleHole = (cx, cy, r) =>
    'M' + f(cx - r) + ' ' + f(cy) + 'A' + f(r) + ' ' + f(r) + ' 0 1 0 ' + f(cx + r) + ' ' + f(cy) + 'A' + f(r) + ' ' + f(r) + ' 0 1 0 ' + f(cx - r) + ' ' + f(cy) + 'Z';
  const sectional = (bx, by, s) => {
    const R = (x, y, w, h, r) => rr(bx + x * s, by + y * s, w * s, h * s, r * s);
    let p = R(0, 3, 20, 1.7, 0.85) + R(0, 11.3, 20, 1.7, 0.85);
    for (let i = 0; i < 4; i++) p += R(1.4 + i * 4.55, 0.5, 3.3, 14.5, 1.65);
    return p + R(2.05, 15, 2, 2, 0.6) + R(15.95, 15, 2, 2, 0.6);
  };
  const panel = (bx, by, s) => {
    const R = (x, y, w, h, r) => rr(bx + x * s, by + y * s, w * s, h * s, r * s);
    const H = (x, y, w, h, r) => rrHole(bx + x * s, by + y * s, w * s, h * s, r * s);
    let p = R(1, 0.5, 18, 14, 1.8);
    for (let i = 0; i < 6; i++) p += H(3.3 + i * 2.55, 2.6, 0.95, 9.8, 0.47);
    return p + R(0, 1.6, 1.4, 1.6, 0.4) + R(18.6, 11.8, 1.4, 1.6, 0.4) + R(3, 14.5, 1.8, 2.5, 0.5) + R(15.2, 14.5, 1.8, 2.5, 0.5);
  };
  const slash = (x1, y1, x2, y2, w) => {
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
    const nx = (-dy / L) * w / 2, ny = (dx / L) * w / 2;
    return 'M' + f(x1 - nx) + ' ' + f(y1 - ny) + 'L' + f(x2 - nx) + ' ' + f(y2 - ny) + 'L' + f(x2 + nx) + ' ' + f(y2 + ny) + 'L' + f(x1 + nx) + ' ' + f(y1 + ny) + 'Z';
  };
  const badge = (cx, cy, r) => circle(cx, cy, r) + rrHole(cx - r * 0.17, cy - r * 0.62, r * 0.34, r * 0.72, r * 0.17) + circleHole(cx, cy + r * 0.5, r * 0.19);
  const full = { bx: 2, by: 3.5, s: 1 };
  const small = { bx: 1.5, by: 8.6, s: 0.72 };
  return {
    'sectional': sectional(full.bx, full.by, full.s),
    'sectional-off': sectional(full.bx, full.by, full.s) + slash(3, 2.5, 21, 21.5, 2.2),
    'sectional-lost': sectional(small.bx, small.by, small.s) + badge(18.6, 5.6, 4.6),
    'panel': panel(full.bx, full.by, full.s),
    'panel-off': panel(full.bx, full.by, full.s) + slash(3, 2.5, 21, 21.5, 2.2),
    'panel-lost': panel(small.bx, small.by, small.s) + badge(18.6, 5.6, 4.6)
  };
})();

function svgIcon(name) {
  const p = ICONS[name] || ICONS.panel;
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" fill-rule="nonzero" d="' + p + '"/></svg>';
}

// Lemur Climate Card — ana kart. İLK TASLAK: henüz gerçek HA'da test edilmedi.
// HTMLElement + shadow DOM, Lit yok, başka eklenti yok. Eski Safari için ?. ve ?? kullanılmıyor.
const CARD_VERSION = '0.0.0';

const DEFAULTS = {
  name: '',
  kind: 'auto',               // auto | ac | radiator
  radiator_style: 'panel',    // panel | sectional
  entities: [],
  temperature_sensor: '',
  humidity_sensor: '',
  outdoor_sensor: '',
  hvac_modes: ['heat', 'cool', 'dry', 'fan_only'],
  show_fan_modes: true,
  show_hvac_modes: true,
  show_target: true,
  show_power: true,
  show_halo: true,
  stale_after: 7200,
  sensor_stale_after: 10800,
  language: 'auto'
};

const MODE_ICONS = { cool: 'mdi:snowflake', heat: 'mdi:fire', dry: 'mdi:water-percent', fan_only: 'mdi:fan',
  heat_cool: 'mdi:sun-snowflake-variant', auto: 'mdi:autorenew', off: 'mdi:power-standby' };

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const num = (v) => { const n = parseFloat(v); return isFinite(n) ? n : null; };

class LemurClimateCard extends HTMLElement {
  static getConfigElement() { return document.createElement('lemur-climate-card-editor'); }
  static getStubConfig(hass) {
    const ids = hass ? Object.keys(hass.states).filter((e) => e.indexOf('climate.') === 0) : [];
    return { entity: ids[0] || 'climate.example' };
  }

  setConfig(config) {
    if (!config || !config.entity || String(config.entity).indexOf('climate.') !== 0) {
      throw new Error('entity: climate.xxx gerekli / required');
    }
    this._config = Object.assign({}, DEFAULTS, config);
    this._sig = '';
    if (this._hass) this._render();
  }

  getCardSize() { return 3; }
  getGridOptions() { return { columns: 12, rows: 3, min_columns: 6, min_rows: 3 }; }

  set hass(h) {
    this._hass = h;
    if (!this._config) return;
    const sig = this._ids().map((id) => { const s = h.states[id]; return s ? id + s.last_updated : id; }).join('|');
    if (sig === this._sig) return;
    this._sig = sig;
    this._render();
  }

  _ids() {
    const c = this._config;
    return [c.entity].concat(c.entities || [], [c.temperature_sensor, c.humidity_sensor, c.outdoor_sensor].filter(Boolean));
  }

  _stale(st, limit) {
    if (!st) return true;
    if (st.state === 'unavailable' || st.state === 'unknown') return true;
    const ts = Date.parse(st.last_reported || st.last_updated);
    return isFinite(ts) && limit > 0 && (Date.now() - ts) / 1000 > limit;
  }

  _model() {
    const c = this._config, h = this._hass, S = h.states;
    const ents = [c.entity].concat(c.entities || []);
    const main = S[c.entity];
    const a = main ? main.attributes : {};
    const modes = a.hvac_modes || [];
    const kind = c.kind !== 'auto' ? c.kind : (modes.indexOf('cool') >= 0 ? 'ac' : 'radiator');
    const sensorVal = (id) => (id && S[id]) ? num(S[id].state) : null;
    let t = sensorVal(c.temperature_sensor); if (t === null) t = num(a.current_temperature);
    let rh = sensorVal(c.humidity_sensor); if (rh === null) rh = num(a.current_humidity);
    const outdoor = sensorVal(c.outdoor_sensor);
    const lost = ents.some((id) => this._stale(S[id], c.stale_after));
    const sensorLost = !!c.temperature_sensor && this._stale(S[c.temperature_sensor], c.sensor_stale_after);
    const onList = ents.filter((id) => S[id] && S[id].state !== 'off' && S[id].state !== 'unavailable' && S[id].state !== 'unknown');
    const isOn = onList.length > 0;
    const busy = onList.some((id) => {
      const x = S[id].attributes, act = x.hvac_action;
      if (act === 'heating' || act === 'cooling') return true;
      return !act && num(x.current_temperature) !== null && num(x.temperature) !== null && num(x.current_temperature) < num(x.temperature);
    });
    const m = { kind: kind, t: t, rh: rh, isOn: isOn, lost: lost, sensorLost: sensorLost, main: main, ents: ents };
    if (kind === 'ac') {
      m.band = acBand(t === null ? 22 : t, rh, c.comfort);
      m.icon = { mdi: MODE_ICONS[main ? main.state : ''] || 'mdi:air-conditioner' };
      m.label = lost ? 'st_lost' : (t === null ? '' : comfortKey(t, rh, c.comfort));
    } else {
      let st = !isOn ? 'st_off' : (busy ? 'st_heating' : 'st_idle');
      if (lost) st = 'st_lost'; else if (sensorLost) st = 'st_sensor';
      m.band = radiatorBand(t === null ? 20 : t, outdoor, c.radiator_bands, lost || sensorLost);
      const base = c.radiator_style === 'sectional' ? 'sectional' : 'panel';
      m.icon = st === 'st_heating' ? { mdi: 'mdi:fire' } : { svg: base + (st === 'st_off' ? '-off' : (st === 'st_lost' || st === 'st_sensor') ? '-lost' : '') };
      m.label = st;
    }
    return m;
  }

  _render() {
    if (!this._hass || !this._config) return;
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    const c = this._config, lang = pickLang(this._hass, c.language), m = this._model();
    const main = m.main, a = main ? main.attributes : {};
    const name = c.name || (a.friendly_name || c.entity);
    const parts = [];
    if (m.label) parts.push(t(lang, m.label));
    if (m.t !== null) parts.push((Math.round(m.t * 10) / 10) + ' °C');
    if (m.rh !== null && m.rh > 0) parts.push('%' + Math.round(m.rh));
    const iconHtml = m.icon.svg ? svgIcon(m.icon.svg) : '<ha-icon icon="' + m.icon.mdi + '"></ha-icon>';
    const halo = c.show_halo ? ('--halo-anim:lc-' + m.band.anim + ';--halo-dur:' + (Math.round(m.band.duration * 1.15 * 100) / 100) + 's;') : '--halo-anim:none;';
    const target = num(a.temperature);
    const step = num(a.target_temp_step) || 0.5;
    const modes = (a.hvac_modes || []).filter((x) => c.hvac_modes.indexOf(x) >= 0);
    const fans = a.fan_modes || [];
    let bottom = '';
    if (c.show_target && target !== null) {
      bottom += '<div class="box"><button id="minus" aria-label="-">−</button><span class="val">' + target + '°</span><button id="plus" aria-label="+">+</button></div>';
    }
    if (m.kind === 'ac' && c.show_hvac_modes && modes.length) {
      bottom += '<div class="box"><select id="mode" aria-label="' + esc(t(lang, 'mode')) + '">' +
        modes.map((x) => '<option value="' + esc(x) + '"' + (main && main.state === x ? ' selected' : '') + '>' + esc(t(lang, 'm_' + x)) + '</option>').join('') + '</select></div>';
    }
    if (m.kind === 'ac' && c.show_fan_modes && fans.length) {
      bottom += '<div class="box"><select id="fan" aria-label="' + esc(t(lang, 'fan')) + '">' +
        fans.map((x) => '<option value="' + esc(x) + '"' + (a.fan_mode === x ? ' selected' : '') + '>' + esc(x) + '</option>').join('') + '</select></div>';
    }
    this.shadowRoot.innerHTML = '<style>' + CSS + '</style>' +
      '<ha-card class="' + (m.isOn ? 'on' : 'off') + '" style="--temp-rgb:' + m.band.rgb + ';' + halo + '">' +
      '<div class="top"><div class="ic">' + iconHtml + '</div>' +
      '<div class="txt"><div class="name">' + esc(name) + '</div><div class="sec">' + esc(parts.join(' · ')) + '</div></div>' +
      (c.show_power ? '<button class="pwr' + (m.isOn ? ' on' : '') + '" id="pwr" aria-label="power"><ha-icon icon="mdi:power"></ha-icon></button>' : '') +
      '</div>' + (bottom ? '<div class="bottom">' + bottom + '</div>' : '') + '</ha-card>';
    const $ = (id) => this.shadowRoot.getElementById(id);
    if ($('pwr')) $('pwr').addEventListener('click', () => this._power(m));
    if ($('minus')) $('minus').addEventListener('click', () => this._nudge(-step));
    if ($('plus')) $('plus').addEventListener('click', () => this._nudge(step));
    if ($('mode')) $('mode').addEventListener('change', (e) => this._call('set_hvac_mode', { hvac_mode: e.target.value }, [this._config.entity]));
    if ($('fan')) $('fan').addEventListener('change', (e) => this._call('set_fan_mode', { fan_mode: e.target.value }, [this._config.entity]));
  }

  _call(service, data, ids) {
    return this._hass.callService('climate', service, Object.assign({ entity_id: ids }, data || {}));
  }

  _power(m) {
    if (m.isOn) return this._call('turn_off', {}, m.ents);
    if (m.kind === 'radiator') return this._call('set_hvac_mode', { hvac_mode: 'heat' }, m.ents);
    return this._call('turn_on', {}, m.ents);
  }

  // Art arda basışları toplar, 800 ms sonra tek komut gönderir
  _nudge(delta) {
    const a = this._hass.states[this._config.entity].attributes;
    const lo = num(a.min_temp) !== null ? num(a.min_temp) : 5, hi = num(a.max_temp) !== null ? num(a.max_temp) : 35;
    const cur = this._pending !== undefined ? this._pending : num(a.temperature);
    if (cur === null) return;
    this._pending = Math.max(lo, Math.min(hi, Math.round((cur + delta) * 10) / 10));
    const v = this.shadowRoot.querySelector('.val'); if (v) v.textContent = this._pending + '°';
    clearTimeout(this._tmr);
    this._tmr = setTimeout(() => {
      const val = this._pending; this._pending = undefined;
      this._call('set_temperature', { temperature: val }, [this._config.entity].concat(this._config.entities || []));
    }, 800);
  }
}

// Kart editörü. HA'nın kendi ha-form bileşeniyle (HA ile geliyor, ek bağımlılık değil).
// İLK TASLAK: gerçek HA'da test edilmedi.
class LemurClimateCardEditor extends HTMLElement {
  setConfig(config) { this._config = Object.assign({}, config); this._render(); }
  set hass(h) { this._hass = h; if (this._form) this._form.hass = h; else this._render(); }

  _schema(lang) {
    const L = (k) => t(lang, k);
    const n = (name, min, max) => ({ name: name, selector: { number: { min: min, max: max, step: 0.5, mode: 'box', unit_of_measurement: '°C' } } });
    return [
      { name: 'entity', required: true, selector: { entity: { domain: 'climate' } } },
      { name: 'entities', selector: { entity: { domain: 'climate', multiple: true } } },
      { name: 'name', selector: { text: {} } },
      { name: 'kind', selector: { select: { mode: 'dropdown', options: [
        { value: 'auto', label: L('ed_kind_auto') }, { value: 'ac', label: L('ed_kind_ac') }, { value: 'radiator', label: L('ed_kind_radiator') }] } } },
      { name: 'radiator_style', selector: { select: { mode: 'dropdown', options: [
        { value: 'panel', label: L('ed_panel') }, { value: 'sectional', label: L('ed_sectional') }] } } },
      { name: 'temperature_sensor', selector: { entity: { domain: 'sensor', device_class: 'temperature' } } },
      { name: 'humidity_sensor', selector: { entity: { domain: 'sensor', device_class: 'humidity' } } },
      { name: 'outdoor_sensor', selector: { entity: { domain: 'sensor', device_class: 'temperature' } } },
      { type: 'expandable', name: 'comfort', title: L('ed_advanced'), schema: [
        n('cold', 0, 40), n('cool', 0, 40), n('warm', 0, 45), n('hot', 0, 45), n('humid_dewpoint', 0, 30),
        { name: 'dry_humidity', selector: { number: { min: 0, max: 100, step: 1, mode: 'box', unit_of_measurement: '%' } } }] },
      { type: 'expandable', name: 'radiator_bands', title: L('ed_kind_radiator') + ' · ' + L('ed_advanced'), schema: [
        n('very_cold', 0, 40), n('cold', 0, 40), n('comfort', 0, 40), n('warm', 0, 40)] }
    ];
  }

  _render() {
    if (!this._hass || !this._config) return;
    const lang = pickLang(this._hass, this._config.language);
    if (!this._form) {
      this._form = document.createElement('ha-form');
      this._form.computeLabel = (s) => {
        const map = { entity: 'ed_entity', entities: 'ed_entities', name: 'ed_name', kind: 'ed_kind', radiator_style: 'ed_radiator_style',
          temperature_sensor: 'ed_temp', humidity_sensor: 'ed_hum', outdoor_sensor: 'ed_outdoor' };
        return map[s.name] ? t(lang, map[s.name]) : (s.title || s.name);
      };
      this._form.addEventListener('value-changed', (ev) => {
        const cfg = Object.assign({}, this._config, ev.detail.value);
        ['comfort', 'radiator_bands'].forEach((k) => {
          const v = Object.assign({}, cfg[k] || {}, ev.detail.value[k] || {});
          if (k === 'comfort') Object.keys(COMFORT_DEFAULTS).forEach((x) => { if (v[x] === COMFORT_DEFAULTS[x]) delete v[x]; });
          if (k === 'radiator_bands') Object.keys(RADIATOR_DEFAULTS).forEach((x) => { if (v[x] === RADIATOR_DEFAULTS[x]) delete v[x]; });
          if (Object.keys(v).length) cfg[k] = v; else delete cfg[k];
        });
        Object.keys(cfg).forEach((k) => { if (cfg[k] === '' || cfg[k] === undefined || (Array.isArray(cfg[k]) && !cfg[k].length)) delete cfg[k]; });
        this._config = cfg;
        this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: cfg }, bubbles: true, composed: true }));
      });
      this.appendChild(this._form);
    }
    this._form.hass = this._hass;
    this._form.schema = this._schema(lang);
    this._form.data = Object.assign({}, DEFAULTS, this._config, {
      comfort: Object.assign({}, COMFORT_DEFAULTS, this._config.comfort || {}),
      radiator_bands: Object.assign({}, RADIATOR_DEFAULTS, this._config.radiator_bands || {})
    });
  }
}

customElements.define('lemur-climate-card', LemurClimateCard);
customElements.define('lemur-climate-card-editor', LemurClimateCardEditor);
window.customCards = window.customCards || [];
if (!window.customCards.some(c => c.type === 'lemur-climate-card')) {
  window.customCards.push({ type: 'lemur-climate-card', preview: true,
    documentationURL: 'https://github.com/mendebur-lemur/lemur-climate-card',
    get name() { return pickLang(document.querySelector('home-assistant') && document.querySelector('home-assistant').hass) === 'tr' ? 'Lemur İklim Kartı' : 'Lemur Climate Card'; },
    get description() { return pickLang(document.querySelector('home-assistant') && document.querySelector('home-assistant').hass) === 'tr' ? 'Klima ve petek için konfor göstergeli kart' : 'Air conditioner and radiator card with comfort display'; } });
}
console.info('%c LEMUR CLIMATE CARD %c v' + CARD_VERSION + ' ', 'background:#F0A93B;color:#1A1105;font-weight:700', 'background:#1E2024;color:#ECEDEF');
})();
