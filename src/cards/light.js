// Işık kartı: hale lambanın kendi rengini alır (renkli lamba: rengi; beyaz lamba: renk sıcaklığı), parlaklığı halenin şiddeti olur.
// Bir ya da birden çok lamba. Altta parlaklık (− %80 +), renk sıcaklığı (− 2700K +) ve efekt seçici.
// Efekt kartları için ayrıca Lemur Light Effect Card var; bu kart günlük kullanım içindir.

addText({
  li_on: 'Açık', li_some_on: 'açık', li_effect: 'Efekt', li_none: 'Yok',
  ed_show_brightness: 'Parlaklık (− %80 +)', ed_show_color_temp: 'Renk sıcaklığı (− 2700K +)', ed_show_effect: 'Efekt seçici',
  ed_brightness_step: 'Parlaklık adımı (%)', ed_kelvin_step: 'Renk sıcaklığı adımı (K)'
}, {
  li_on: 'On', li_some_on: 'on', li_effect: 'Effect', li_none: 'None',
  ed_show_brightness: 'Brightness (− 80% +)', ed_show_color_temp: 'Colour temperature (− 2700K +)', ed_show_effect: 'Effect selector',
  ed_brightness_step: 'Brightness step (%)', ed_kelvin_step: 'Colour temperature step (K)'
});

// Renk sıcaklığından (K) yaklaşık RGB
function kelvinRgb(k) {
  const x = Math.max(1000, Math.min(40000, k)) / 100;
  let r, g, b;
  if (x <= 66) { r = 255; g = 99.47 * Math.log(x) - 161.12; b = x <= 19 ? 0 : 138.52 * Math.log(x - 10) - 305.04; }
  else { r = 329.7 * Math.pow(x - 60, -0.1332); g = 288.12 * Math.pow(x - 60, -0.0755); b = 255; }
  const c = (v) => Math.max(0, Math.min(255, Math.round(v)));
  return c(r) + ',' + c(g) + ',' + c(b);
}

class LemurLightCard extends LemurCard {
  static get TYPE() { return 'lemur-light-card'; }
  static get DOMAINS() { return ['light']; }
  static get DEFAULTS() { return { entities: [], show_brightness: true, show_color_temp: true, show_effect: true, brightness_step: 10, kelvin_step: 250 }; }
  static schema(lang) {
    return [
      Object.assign(SCH.entity('entity', ['light']), { required: true }),
      SCH.entities('entities', ['light']),
      SCH.text('name'),
      SCH.appearance(lang, ['show_brightness', 'show_color_temp', 'show_effect']),
      { type: 'expandable', name: 'adv', flatten: true, title: t(lang, 'ed_advanced'), schema: [
        SCH.num('brightness_step', 1, 50, 1, '%'), SCH.num('kelvin_step', 50, 1000, 50, 'K')] },
      SCH.advanced(lang)
    ];
  }

  _ents() { return [this._config.entity].concat(this._config.entities || []); }

  view(lang) {
    const c = this._config, ents = this._ents(), st = this.st(c.entity), a = st ? st.attributes : {};
    const onIds = ents.filter((id) => !isOff(this.st(id)));
    const on = onIds.length > 0;
    const lost = ents.some((id) => this.isLost(id));
    // Renk ve parlaklık açık olan ilk lambadan
    const lead = on ? this.st(onIds[0]).attributes : a;
    const bri = on && num(lead.brightness) !== null ? Math.round(num(lead.brightness) / 2.55) : (on ? 100 : 0);
    const kelvin = num(lead.color_temp_kelvin);
    let rgb = '255,180,90';
    if (lead.color_mode === 'color_temp' && kelvin) rgb = kelvinRgb(kelvin);
    else if (Array.isArray(lead.rgb_color)) rgb = lead.rgb_color.join(',');
    else if (kelvin) rgb = kelvinRgb(kelvin);
    const bnd = lost ? BANDS.alarm : on ? { name: 'light', rgb: rgb, duration: 5.0 } : BANDS.grey;
    const modes = a.supported_color_modes || [];
    const dimmable = modes.some((m) => m !== 'onoff');
    const sec = [];
    if (lost) sec.push(t(lang, 'st_lost'));
    else if (ents.length > 1) sec.push(onIds.length + '/' + ents.length + ' ' + t(lang, 'li_some_on'));
    else sec.push(t(lang, on ? 'li_on' : 'st_off'));
    if (on && dimmable) sec.push(pct(bri, lang));
    if (on && lead.color_mode === 'color_temp' && kelvin) sec.push(Math.round(kelvin) + 'K');
    // "none" / "off" efekt yok demektir, alt yazıya yazılmaz
    if (on && lead.effect && ['none', 'off'].indexOf(String(lead.effect).toLowerCase()) < 0) sec.push(String(lead.effect));
    const boxes = [];
    if (c.show_brightness && dimmable) boxes.push({ type: 'step', id: 'bri', value: on ? pct(bri, lang) : '—' });
    if (c.show_color_temp && modes.indexOf('color_temp') >= 0) boxes.push({ type: 'step', id: 'ct', value: kelvin && on ? Math.round(kelvin) + 'K' : '—' });
    if (c.show_effect && (a.effect_list || []).length) {
      boxes.push({ type: 'select', id: 'fx', title: t(lang, 'li_effect'), icon: 'mdi:creation', label: a.effect || t(lang, 'li_effect'), value: a.effect,
        options: a.effect_list.map((x) => ({ value: x, label: String(x) })) });
    }
    return { name: a.friendly_name || c.entity, sec: sec, icon: { mdi: on ? 'mdi:lightbulb' : 'mdi:lightbulb-outline' }, state: lost ? 'lost' : (on ? 'on' : 'off'), band: bnd, on: on,
      haloK: on ? 0.35 + 0.65 * bri / 100 : 0.3, disabled: lost && !on, boxes: boxes };
  }

  power() {
    const ents = this._ents(), on = ents.some((id) => !isOff(this.st(id)));
    this.call('light', on ? 'turn_off' : 'turn_on', { entity_id: ents });
  }
  // Adım düğmeleri, ekranda gösterilen lambadan (açık olan ilk lamba) başlar; komut gruptaki bütün lambalara gider
  onStep(id, dir) {
    const c = this._config, ents = this._ents(), lang = pickLang(this._hass, c.language);
    const onIds = ents.filter((x) => !isOff(this.st(x))), st = this.st(onIds.length ? onIds[0] : c.entity);
    if (!st) return;
    const a = st.attributes, on = onIds.length > 0;
    if (id === 'bri') {
      const cur = on && num(a.brightness) !== null ? Math.round(num(a.brightness) / 2.55) : 0;
      this.stepValue('bri', cur, dir * Number(c.brightness_step), dir > 0 ? 1 : 0, 100, (v) => pct(Math.round(v), lang),
        (v) => v <= 0 ? this.call('light', 'turn_off', { entity_id: ents }) : this.call('light', 'turn_on', { entity_id: ents, brightness_pct: Math.round(v) }));
    }
    if (id === 'ct') {
      const lo = num(a.min_color_temp_kelvin) || 2000, hi = num(a.max_color_temp_kelvin) || 6500;
      const cur = num(a.color_temp_kelvin) || Math.round((lo + hi) / 2);
      this.stepValue('ct', cur, dir * Number(c.kelvin_step), lo, hi, (v) => Math.round(v) + 'K',
        (v) => this.call('light', 'turn_on', { entity_id: ents, color_temp_kelvin: Math.round(v) }));
    }
  }
  onSelect(id, value) { this.call('light', 'turn_on', { entity_id: this._ents(), effect: value }); }
}

registerCard(LemurLightCard, {
  tr: { name: 'Lemur Işık Kartı', desc: 'Hale lambanın rengini ve parlaklığını alır; parlaklık ve renk sıcaklığı ayarı' },
  en: { name: 'Lemur Light Card', desc: 'The halo takes the lamp\'s colour and brightness; brightness and colour temperature control' }
});
