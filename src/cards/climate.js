// İklim kartı: klima ve petek (radyatör vanası / termostat).
// Konfor hesabı core/comfort.js'te (projenin kendi formülü).

addText({
  very_cold: 'Çok soğuk', cool: 'Serin', comfortable: 'Konforlu', humid: 'Nemli', dry: 'Kuru', warm: 'Biraz sıcak', hot: 'Sıcak',
  st_heating: 'Isıtıyor', st_cooling: 'Soğutuyor', st_idle: 'Bekliyor',
  mode: 'Mod', fan: 'Fan', target: 'Hedef',
  m_off: 'Kapalı', m_heat: 'Isıtma', m_cool: 'Soğutma', m_heat_cool: 'Isıtma/Soğutma', m_auto: 'Otomatik',
  m_dry: 'Nem alma', m_fan_only: 'Fan', m_unavailable: 'Bağlantı yok', m_unknown: 'Bilinmiyor',
  k_auto: 'Otomatik', k_ac: 'Klima', k_radiator: 'Petek', rs_panel: 'Panel', rs_sectional: 'Dilimli',
  ed_kind: 'Kart tipi', ed_radiator_style: 'Petek simgesi',
  ed_temperature_sensor: 'Sıcaklık sensörü (boşsa cihazdan)', ed_humidity_sensor: 'Nem sensörü (boşsa cihazdan)',
  ed_outdoor_sensor: 'Dış sıcaklık sensörü (petek eşiklerini kaydırır)',
  ed_show_target: 'Hedef sıcaklık', ed_show_hvac_modes: 'Mod seçici', ed_show_fan_modes: 'Fan hızı seçici',
  ed_hvac_modes: 'Mod listesinde gösterilecek modlar', ed_sensor_stale_after: 'Sensörden bu kadar saniye haber gelmezse "Sensör yok"',
  ed_comfort: 'Konfor eşikleri (hissedilen, °C)', ed_radiator_bands: 'Petek renk eşikleri (°C)',
  ed_cold: 'Çok soğuk sınırı', ed_cool: 'Serin sınırı', ed_warm: 'Biraz sıcak başlangıcı', ed_hot: 'Sıcak başlangıcı',
  ed_humid_dewpoint: 'Nemli: çiy noktası en az', ed_dry_humidity: 'Kuru: nem en çok', ed_very_cold: 'Çok soğuk sınırı',
  rb_very_cold: 'Buz mavisi: bunun altı', rb_cold: 'Mavi: bunun altı', rb_comfort: 'Yeşil: bunun altı', rb_warm: 'Sarı: bunun altı (üstü kırmızı)'
}, {
  very_cold: 'Very cold', cool: 'Cool', comfortable: 'Comfortable', humid: 'Humid', dry: 'Dry', warm: 'A bit warm', hot: 'Hot',
  st_heating: 'Heating', st_cooling: 'Cooling', st_idle: 'Idle',
  mode: 'Mode', fan: 'Fan', target: 'Target',
  m_off: 'Off', m_heat: 'Heat', m_cool: 'Cool', m_heat_cool: 'Heat/Cool', m_auto: 'Auto',
  m_dry: 'Dry', m_fan_only: 'Fan', m_unavailable: 'No connection', m_unknown: 'Unknown',
  k_auto: 'Automatic', k_ac: 'Air conditioner', k_radiator: 'Radiator', rs_panel: 'Panel', rs_sectional: 'Sectional',
  ed_kind: 'Card type', ed_radiator_style: 'Radiator icon',
  ed_temperature_sensor: 'Temperature sensor (device if empty)', ed_humidity_sensor: 'Humidity sensor (device if empty)',
  ed_outdoor_sensor: 'Outdoor temperature sensor (shifts radiator thresholds)',
  ed_show_target: 'Target temperature', ed_show_hvac_modes: 'Mode selector', ed_show_fan_modes: 'Fan speed selector',
  ed_hvac_modes: 'Modes shown in the mode list', ed_sensor_stale_after: 'Show "No sensor" after this many seconds without news',
  ed_comfort: 'Comfort thresholds (feels-like, °C)', ed_radiator_bands: 'Radiator colour thresholds (°C)',
  ed_cold: 'Very cold below', ed_cool: 'Cool below', ed_warm: 'A bit warm from', ed_hot: 'Hot from',
  ed_humid_dewpoint: 'Humid: dew point at least', ed_dry_humidity: 'Dry: humidity at most', ed_very_cold: 'Very cold below',
  rb_very_cold: 'Ice blue below', rb_cold: 'Blue below', rb_comfort: 'Green below', rb_warm: 'Yellow below (red above)'
});

const MODE_ICONS = { cool: 'mdi:snowflake', heat: 'mdi:fire', dry: 'mdi:water-percent', fan_only: 'mdi:fan',
  heat_cool: 'mdi:sun-snowflake-variant', auto: 'mdi:autorenew', off: 'mdi:power-standby' };
const modeIcon = (x) => MODE_ICONS[x] || 'mdi:air-conditioner';

// Aç / kapat: cihaz destekliyorsa climate.turn_on/turn_off, desteklemiyorsa set_hvac_mode
// (TURN_OFF = 128, TURN_ON = 256; bazı termostat vanaları bunları desteklemez)
function climateOff(card, ids) {
  ids.forEach((id) => {
    const st = card.st(id); if (!st) return;
    const f = num(st.attributes.supported_features) || 0;
    if (f & 128) card.call('climate', 'turn_off', { entity_id: id });
    else card.call('climate', 'set_hvac_mode', { entity_id: id, hvac_mode: 'off' });
  });
}
function climateOn(card, ids, mode) {
  ids.forEach((id) => {
    const st = card.st(id); if (!st) return;
    const f = num(st.attributes.supported_features) || 0, modes = (st.attributes.hvac_modes || []).filter((x) => x !== 'off');
    if (mode && modes.indexOf(mode) >= 0) card.call('climate', 'set_hvac_mode', { entity_id: id, hvac_mode: mode });
    else if (f & 256) card.call('climate', 'turn_on', { entity_id: id });
    // Klimada soğutma, petekte (tek mod) ısıtma; yoksa ilk mod
    else if (modes.length) card.call('climate', 'set_hvac_mode', { entity_id: id, hvac_mode: modes.indexOf('cool') >= 0 ? 'cool' : modes[0] });
  });
}

class LemurClimateCard extends LemurCard {
  static get TYPE() { return 'lemur-climate-card'; }
  static get DOMAINS() { return ['climate']; }
  static get DEFAULTS() {
    return {
      kind: 'auto',               // auto | ac | radiator (auto: hvac_modes içinde cool varsa klima)
      radiator_style: 'panel',    // panel | sectional
      entities: [],
      temperature_sensor: '',
      humidity_sensor: '',
      outdoor_sensor: '',
      hvac_modes: ['heat', 'cool', 'dry', 'fan_only'],
      show_target: true,
      show_hvac_modes: true,
      show_fan_modes: true,
      sensor_stale_after: 0
    };
  }
  static nested() { return { comfort: COMFORT_DEFAULTS, radiator_bands: { very_cold: 15, cold: 18, comfort: 24, warm: 26 } }; }
  static schema(lang) {
    const n = (name, min, max) => SCH.num(name, min, max, 0.5, '°C');
    return [
      Object.assign(SCH.entity('entity', ['climate']), { required: true }),
      SCH.entities('entities', ['climate']),
      SCH.text('name'),
      { type: 'grid', name: '', flatten: true, schema: [SCH.select('kind', lang, ['auto', 'ac', 'radiator'], 'k_'), SCH.select('radiator_style', lang, ['panel', 'sectional'], 'rs_')] },
      SCH.entity('temperature_sensor', ['sensor'], { device_class: 'temperature' }),
      SCH.entity('humidity_sensor', ['sensor'], { device_class: 'humidity' }),
      SCH.entity('outdoor_sensor', ['sensor'], { device_class: 'temperature' }),
      SCH.appearance(lang, ['show_target', 'show_hvac_modes', 'show_fan_modes']),
      { name: 'hvac_modes', selector: { select: { multiple: true, mode: 'list',
        options: ['heat', 'cool', 'dry', 'fan_only', 'heat_cool', 'auto', 'off'].map((x) => ({ value: x, label: t(lang, 'm_' + x) })) } } },
      { type: 'expandable', name: 'comfort', title: t(lang, 'ed_comfort'), schema: [
        n('cold', 0, 40), n('cool', 0, 40), n('warm', 0, 45), n('hot', 0, 45), n('humid_dewpoint', 0, 30), SCH.num('dry_humidity', 0, 100, 1, '%')] },
      // Petek alanları konfor alanlarıyla aynı adı taşıdığı için etiketleri ayrı verilir
      { type: 'expandable', name: 'radiator_bands', title: t(lang, 'ed_radiator_bands'), schema: [
        Object.assign(n('very_cold', 0, 40), { label: t(lang, 'rb_very_cold') }), Object.assign(n('cold', 0, 40), { label: t(lang, 'rb_cold') }),
        Object.assign(n('comfort', 0, 40), { label: t(lang, 'rb_comfort') }), Object.assign(n('warm', 0, 40), { label: t(lang, 'rb_warm') })] },
      SCH.advanced(lang, [SCH.num('sensor_stale_after', 0, 86400, 60, 's')])
    ];
  }

  ids() {
    const c = this._config;
    return [c.entity].concat(c.entities || [], [c.temperature_sensor, c.humidity_sensor, c.outdoor_sensor]);
  }

  // Renk ve hale ayarlarında gösterilen durumlar
  static toneList(lang, cfg, hass) {
    const st = hass && cfg.entity ? hass.states[cfg.entity] : null;
    const kind = cfg.kind && cfg.kind !== 'auto' ? cfg.kind : ((st && st.attributes.hvac_modes || []).indexOf('cool') >= 0 ? 'ac' : 'radiator');
    const L = (k, b, e) => ({ key: k, label: t(lang, k === 'off' ? 'st_off' : k === 'lost' ? 'st_lost' : 'tn_' + k), band: b, effect: e || 'auto' });
    const zones = kind === 'ac' ? [L('cold', 'blue'), L('comfort', 'green'), L('warm', 'yellow'), L('hot', 'red')]
      : [L('very_cold', 'ice'), L('cold', 'blue'), L('comfort', 'green'), L('warm', 'yellow'), L('hot', 'red'), L('heating', null)];
    return zones.concat([L('off', null), L('lost', 'alarm', 'blink')]);
  }

  _model() {
    const c = this._config, h = this._hass;
    const ents = [c.entity].concat(c.entities || []);
    const main = this.st(c.entity), a = main ? main.attributes : {};
    const kind = c.kind !== 'auto' ? c.kind : ((a.hvac_modes || []).indexOf('cool') >= 0 ? 'ac' : 'radiator');
    // Sıcaklık HA'nın biriminde okunur (°C ya da °F); konfor ve renk hesabı için °C'ye çevrilir
    let tmp = stateNum(h, c.temperature_sensor); if (tmp === null) tmp = num(a.current_temperature);
    const unit = tempUnit(h), tc = toC(tmp, unit);
    let rh = stateNum(h, c.humidity_sensor); if (rh === null) rh = num(a.current_humidity);
    const outdoor = stateNum(h, c.outdoor_sensor);
    const lost = ents.some((id) => this.isLost(id));
    const allDead = ents.every((id) => isDead(this.st(id)));
    const sensorLost = !!c.temperature_sensor && stale(this.st(c.temperature_sensor), c.sensor_stale_after);
    const onList = ents.filter((id) => !isOff(this.st(id)));
    const busy = onList.some((id) => {
      const x = this.st(id).attributes, act = x.hvac_action;
      if (act === 'heating' || act === 'cooling') return true;
      return !act && num(x.current_temperature) !== null && num(x.temperature) !== null && num(x.current_temperature) < num(x.temperature);
    });
    const m = { kind: kind, t: tmp, unit: unit, rh: rh, isOn: onList.length > 0, lost: lost, allDead: allDead, main: main, a: a, ents: ents };
    if (kind === 'ac') {
      m.band = lost ? BANDS.alarm : acBand(tc === null ? 22 : tc, rh, c.comfort);
      const zk = BAND_TONE[acBand(tc === null ? 22 : tc, rh, c.comfort).name];
      m.tone = lost ? ['lost'] : (m.isOn ? [zk] : ['off', zk]);
      m.icon = { mdi: lost ? 'mdi:air-conditioner' : modeIcon(main ? main.state : '') };
      m.label = lost ? 'st_lost' : (tc === null ? '' : comfortKey(tc, rh, c.comfort));
    } else {
      let st = !m.isOn ? 'st_off' : (busy ? 'st_heating' : 'st_idle');
      if (lost) st = 'st_lost'; else if (sensorLost) st = 'st_sensor';
      m.band = radiatorBand(tc === null ? 20 : tc, toC(outdoor, unit), c.radiator_bands, lost || sensorLost);
      const zk = BAND_TONE[radiatorBand(tc === null ? 20 : tc, toC(outdoor, unit), c.radiator_bands, false).name];
      m.tone = (lost || sensorLost) ? ['lost'] : (!m.isOn ? ['off', zk] : (busy ? ['heating', zk] : [zk]));
      const base = c.radiator_style === 'sectional' ? 'sectional' : 'panel';
      m.icon = st === 'st_heating' ? { mdi: 'mdi:fire' } : { svg: base + (st === 'st_off' ? '-off' : (st === 'st_lost' || st === 'st_sensor') ? '-lost' : '') };
      m.label = st;
    }
    return m;
  }

  view(lang) {
    const c = this._config, m = this._model(), a = m.a, main = m.main;
    this._m = m;
    const sec = [m.label ? t(lang, m.label) : ''];
    if (m.t !== null) sec.push(round(m.t, 1) + ' ' + m.unit);
    if (m.rh !== null && m.rh > 0) sec.push(pct(Math.round(m.rh), lang));
    const boxes = [];
    const target = num(a.temperature);
    if (c.show_target && target !== null) boxes.push({ type: 'step', id: 'tgt', value: target + '°' });
    if (m.kind === 'ac' && c.show_hvac_modes) {
      const modes = (a.hvac_modes || []).filter((x) => c.hvac_modes.indexOf(x) >= 0);
      const cur = main ? main.state : '';
      if (modes.length) boxes.push({ type: 'select', id: 'mode', title: t(lang, 'mode'), icon: modeIcon(cur), label: t(lang, 'm_' + cur), value: cur,
        options: modes.map((x) => ({ value: x, label: t(lang, 'm_' + x), icon: modeIcon(x) })) });
    }
    if (m.kind === 'ac' && c.show_fan_modes && (a.fan_modes || []).length) {
      boxes.push({ type: 'select', id: 'fan', title: t(lang, 'fan'), icon: fanIcon(a.fan_mode || ''),
        label: a.fan_mode ? fanLabel(lang, a.fan_mode) : t(lang, 'fan'), value: a.fan_mode,
        options: a.fan_modes.map((x) => ({ value: x, label: fanLabel(lang, x), icon: fanIcon(x) })) });
    }
    // Simge eşlemesi anahtarı: klimada mod (cool, heat...), petekte durum (heating, idle, off, lost, sensor)
    const state = m.kind === 'ac' ? (m.lost ? 'lost' : (main ? main.state : '')) : m.label.replace('st_', '');
    return { name: a.friendly_name || c.entity, sec: sec, icon: m.icon, state: state, tone: m.tone, band: m.band, on: m.isOn,
      disabled: m.kind === 'ac' ? m.lost : m.allDead, boxes: boxes };
  }

  power() {
    const m = this._m;
    if (m.isOn) return climateOff(this, m.ents);
    return climateOn(this, m.ents, m.kind === 'radiator' ? 'heat' : null);
  }

  onStep(id, dir) {
    const a = this._m.a, step = num(a.target_temp_step) || 0.5;
    this.stepValue('tgt', num(a.temperature), dir * step, num(a.min_temp) !== null ? num(a.min_temp) : 5, num(a.max_temp) !== null ? num(a.max_temp) : 35,
      (v) => v + '°', (v) => this.call('climate', 'set_temperature', { entity_id: this._m.ents, temperature: v }));
  }

  onSelect(id, value) {
    if (id === 'mode') this.call('climate', 'set_hvac_mode', { entity_id: this._config.entity, hvac_mode: value });
    if (id === 'fan') this.call('climate', 'set_fan_mode', { entity_id: this._config.entity, fan_mode: value });
  }
}

registerCard(LemurClimateCard, {
  tr: { name: 'Lemur İklim Kartı', desc: 'Klima ve petek için konfor göstergeli kart' },
  en: { name: 'Lemur Climate Card', desc: 'Air conditioner and radiator card with comfort display' }
});
