// Hava kartı: hava temizleyici (fan) + hava kalitesi sensörü. Hale sensörün bölgesine göre renk alır
// (sensör kartının hazır ayarları: PM2.5, PM10, CO₂, VOC, AQI). Sensör yoksa: açık yeşil, kapalı gri.

addText({
  speed: 'Hız', preset: 'Program',
  ed_sensor: 'Hava kalitesi sensörü (PM2.5, CO₂...)', ed_show_speed: 'Hız (− %40 +)', ed_show_presets: 'Program seçici'
}, {
  speed: 'Speed', preset: 'Preset',
  ed_sensor: 'Air quality sensor (PM2.5, CO₂...)', ed_show_speed: 'Speed (− 40% +)', ed_show_presets: 'Preset selector'
});

class LemurAirCard extends LemurCard {
  static get TYPE() { return 'lemur-air-card'; }
  static get DOMAINS() { return ['fan']; }
  static get DEFAULTS() { return { sensor: '', preset: 'auto', extra: [], show_speed: true, show_presets: true, show_zone: true }; }
  static nested(cfg, hass) { return { levels: levelsOf(presetOf(hass, cfg.sensor, cfg.preset)) }; }
  static get RESETS() { return { levels: ['sensor', 'preset'] }; }
  static stub(hass) {
    return { entity: firstEntity(hass, ['fan']) || 'fan.example',
      sensor: firstEntity(hass, ['sensor'], (s) => ['pm25', 'carbon_dioxide', 'aqi'].indexOf(s.attributes.device_class) >= 0) };
  }
  static schema(lang) {
    return [
      Object.assign(SCH.entity('entity', ['fan']), { required: true }),
      SCH.entity('sensor', ['sensor']),
      SCH.text('name'),
      SCH.select('preset', lang, ['auto', 'pm25', 'pm10', 'co2', 'voc', 'aqi', 'humidity', 'custom'], 'p_'),
      { name: 'extra', selector: { entity: { multiple: true } } },
      SCH.appearance(lang, ['show_speed', 'show_presets', 'show_zone']),
      levelsSchema(lang),
      SCH.advanced(lang)
    ];
  }
  ids() { const c = this._config; return [c.entity, c.sensor].concat(c.extra || []); }
  static toneList(lang, cfg, hass) {
    const zones = cfg.sensor ? zoneTones(lang, presetOf(hass, cfg.sensor, cfg.preset), levelsOf(presetOf(hass, cfg.sensor, cfg.preset), cfg.levels)) : [];
    return zones.concat([{ key: 'on', label: t(lang, 'st_on'), band: 'green' }, { key: 'off', label: t(lang, 'st_off'), band: null },
      { key: 'lost', label: t(lang, 'st_lost'), band: 'alarm', effect: 'blink' }]);
  }

  view(lang) {
    const c = this._config, h = this._hass, st = this.st(c.entity), a = st ? st.attributes : {};
    const on = !isOff(st), lost = this.isLost(c.entity);
    const sec = [];
    let bnd = on ? BANDS.green : BANDS.grey, zk = '';
    if (c.sensor) {
      const preset = presetOf(h, c.sensor, c.preset), v = stateNum(h, c.sensor);
      if (v !== null) {
        const z = zoneOf(lang, preset, levelsOf(preset, c.levels), v);
        bnd = z.band; zk = 'zone' + z.zone;
        if (c.show_zone) sec.push(z.label);
      }
      sec.push(fmtState(h, c.sensor, null, lang));
    }
    if (lost) { bnd = BANDS.alarm; sec.unshift(t(lang, 'st_lost')); }
    else if (!on) sec.push(t(lang, 'st_off'));
    else if (a.preset_mode) sec.push(fanLabel(lang, a.preset_mode));
    else if (num(a.percentage) !== null) sec.push(pct(Math.round(num(a.percentage)), lang));
    const boxes = [];
    if (c.show_speed && a.percentage !== undefined) {
      boxes.push({ type: 'step', id: 'spd', value: on && num(a.percentage) !== null ? pct(Math.round(num(a.percentage)), lang) : '—' });
    }
    if (c.show_presets && (a.preset_modes || []).length) {
      boxes.push({ type: 'select', id: 'pre', title: t(lang, 'preset'), icon: a.preset_mode ? fanIcon(a.preset_mode) : 'mdi:tune-variant',
        label: a.preset_mode ? fanLabel(lang, a.preset_mode) : t(lang, 'preset'), value: a.preset_mode,
        options: a.preset_modes.map((x) => ({ value: x, label: fanLabel(lang, x), icon: fanIcon(x) })) });
    }
    (c.extra || []).forEach((id) => { if (boxes.length < 3) boxes.push({ type: 'info', icon: entityIcon(h, id), text: fmtState(h, id, null, lang), entity: id, title: friendly(h, id) }); });
    const tone = lost ? ['lost'] : (zk ? (on ? [zk] : ['off', zk]) : [on ? 'on' : 'off']);
    return { name: a.friendly_name || c.entity, sec: sec, icon: { mdi: on ? 'mdi:air-purifier' : 'mdi:air-purifier-off' }, state: lost ? 'lost' : (on ? 'on' : 'off'), tone: tone, band: bnd, on: on, disabled: lost, boxes: boxes };
  }

  power() { this.call('fan', isOff(this.st(this._config.entity)) ? 'turn_on' : 'turn_off', { entity_id: this._config.entity }); }
  onStep(id, dir) {
    const a = this.st(this._config.entity).attributes, step = num(a.percentage_step) || 10;
    const cur = isOff(this.st(this._config.entity)) ? 0 : (num(a.percentage) || 0);
    const lang = pickLang(this._hass, this._config.language);
    this.stepValue('spd', cur, dir * step, 0, 100, (v) => pct(Math.round(v), lang),
      (v) => this.call('fan', 'set_percentage', { entity_id: this._config.entity, percentage: Math.round(v) }));
  }
  onSelect(id, value) { this.call('fan', 'set_preset_mode', { entity_id: this._config.entity, preset_mode: value }); }
}

registerCard(LemurAirCard, {
  tr: { name: 'Lemur Hava Kartı', desc: 'Hava temizleyici ve hava kalitesi; kaliteye göre renk değiştiren hale' },
  en: { name: 'Lemur Air Card', desc: 'Air purifier and air quality, with a halo that follows the air quality' }
});
