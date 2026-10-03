// Sensör kartı: herhangi bir sayısal sensör. Değer dört sınırla beş bölgeye ayrılır, her bölgenin rengi ve adı var.
// Hazır ayarlar (preset) sensörün türüne (device_class) göre otomatik seçilir; hepsi editörden değiştirilebilir.
// Hava temizleyici kartı da bu hazır ayarları kullanır.

addText({
  // bölge adları
  z_temperature_0: 'Çok soğuk', z_temperature_1: 'Serin', z_temperature_2: 'Konforlu', z_temperature_3: 'Sıcak', z_temperature_4: 'Çok sıcak',
  z_humidity_0: 'Çok kuru', z_humidity_1: 'Kuru', z_humidity_2: 'İdeal', z_humidity_3: 'Nemli', z_humidity_4: 'Çok nemli',
  z_co2_0: 'Temiz', z_co2_1: 'İyi', z_co2_2: 'Havalandır', z_co2_3: 'Kötü', z_co2_4: 'Çok kötü',
  z_pm25_0: 'İyi', z_pm25_1: 'Orta', z_pm25_2: 'Hassas', z_pm25_3: 'Kötü', z_pm25_4: 'Çok kötü',
  z_pm10_0: 'İyi', z_pm10_1: 'Orta', z_pm10_2: 'Hassas', z_pm10_3: 'Kötü', z_pm10_4: 'Çok kötü',
  z_voc_0: 'İyi', z_voc_1: 'Orta', z_voc_2: 'Hassas', z_voc_3: 'Kötü', z_voc_4: 'Çok kötü',
  z_aqi_0: 'İyi', z_aqi_1: 'Orta', z_aqi_2: 'Hassas', z_aqi_3: 'Kötü', z_aqi_4: 'Çok kötü',
  z_battery_0: 'Kritik', z_battery_1: 'Zayıf', z_battery_2: 'Orta', z_battery_3: 'İyi', z_battery_4: 'Dolu',
  z_power_0: 'Boşta', z_power_1: 'Düşük', z_power_2: 'Orta', z_power_3: 'Yüksek', z_power_4: 'Çok yüksek',
  z_illuminance_0: 'Karanlık', z_illuminance_1: 'Loş', z_illuminance_2: 'Normal', z_illuminance_3: 'Aydınlık', z_illuminance_4: 'Güneşli',
  p_auto: 'Otomatik (sensör türüne göre)', p_temperature: 'Sıcaklık', p_humidity: 'Nem', p_co2: 'CO₂', p_pm25: 'PM2.5', p_pm10: 'PM10',
  p_voc: 'VOC (indeks)', p_aqi: 'Hava kalitesi indeksi', p_battery: 'Pil', p_power: 'Güç (W)', p_illuminance: 'Işık (lx)', p_custom: 'Özel (renk sabit)',
  ed_preset: 'Hazır ayar', ed_levels: 'Bölgeler: sınırlar ve renkler', ed_switch_entity: 'Sağ üstteki düğme bunu açıp kapatsın (isteğe bağlı)',
  ed_show_zone: 'Bölge adını yaz', ed_decimals: 'Ondalık basamak', ed_extra: 'Altta gösterilecek diğer değerler (en çok 3)',
  ed_t1: '1. sınır', ed_t2: '2. sınır', ed_t3: '3. sınır', ed_t4: '4. sınır',
  ed_c1: '1. sınırın altı', ed_c2: '1-2 arası', ed_c3: '2-3 arası', ed_c4: '3-4 arası', ed_c5: '4. sınırın üstü'
}, {
  z_temperature_0: 'Very cold', z_temperature_1: 'Cool', z_temperature_2: 'Comfortable', z_temperature_3: 'Warm', z_temperature_4: 'Hot',
  z_humidity_0: 'Very dry', z_humidity_1: 'Dry', z_humidity_2: 'Ideal', z_humidity_3: 'Humid', z_humidity_4: 'Very humid',
  z_co2_0: 'Fresh', z_co2_1: 'Good', z_co2_2: 'Ventilate', z_co2_3: 'Poor', z_co2_4: 'Very poor',
  z_pm25_0: 'Good', z_pm25_1: 'Moderate', z_pm25_2: 'Sensitive', z_pm25_3: 'Unhealthy', z_pm25_4: 'Very unhealthy',
  z_pm10_0: 'Good', z_pm10_1: 'Moderate', z_pm10_2: 'Sensitive', z_pm10_3: 'Unhealthy', z_pm10_4: 'Very unhealthy',
  z_voc_0: 'Good', z_voc_1: 'Moderate', z_voc_2: 'Sensitive', z_voc_3: 'Unhealthy', z_voc_4: 'Very unhealthy',
  z_aqi_0: 'Good', z_aqi_1: 'Moderate', z_aqi_2: 'Sensitive', z_aqi_3: 'Unhealthy', z_aqi_4: 'Very unhealthy',
  z_battery_0: 'Critical', z_battery_1: 'Low', z_battery_2: 'Medium', z_battery_3: 'Good', z_battery_4: 'Full',
  z_power_0: 'Idle', z_power_1: 'Low', z_power_2: 'Medium', z_power_3: 'High', z_power_4: 'Very high',
  z_illuminance_0: 'Dark', z_illuminance_1: 'Dim', z_illuminance_2: 'Normal', z_illuminance_3: 'Bright', z_illuminance_4: 'Sunny',
  p_auto: 'Automatic (by sensor type)', p_temperature: 'Temperature', p_humidity: 'Humidity', p_co2: 'CO₂', p_pm25: 'PM2.5', p_pm10: 'PM10',
  p_voc: 'VOC (index)', p_aqi: 'Air quality index', p_battery: 'Battery', p_power: 'Power (W)', p_illuminance: 'Light (lx)', p_custom: 'Custom (fixed colour)',
  ed_preset: 'Preset', ed_levels: 'Zones: limits and colours', ed_switch_entity: 'Top-right button switches this (optional)',
  ed_show_zone: 'Show zone name', ed_decimals: 'Decimal places', ed_extra: 'Other values shown below (up to 3)',
  ed_t1: 'Limit 1', ed_t2: 'Limit 2', ed_t3: 'Limit 3', ed_t4: 'Limit 4',
  ed_c1: 'Below limit 1', ed_c2: 'Between 1 and 2', ed_c3: 'Between 2 and 3', ed_c4: 'Between 3 and 4', ed_c5: 'Above limit 4'
});

// Hazır ayarlar: 4 sınır, 5 renk, simge
const PRESETS = {
  temperature: { t: [16, 19, 26, 30], c: ['ice', 'blue', 'green', 'yellow', 'red'], icon: 'mdi:thermometer' },
  humidity:    { t: [25, 35, 60, 70], c: ['orange', 'yellow', 'green', 'blue', 'purple'], icon: 'mdi:water-percent' },
  co2:         { t: [600, 1000, 1500, 2000], c: ['green', 'green', 'yellow', 'orange', 'red'], icon: 'mdi:molecule-co2' },
  pm25:        { t: [9, 35, 55, 125], c: ['green', 'yellow', 'orange', 'red', 'purple'], icon: 'mdi:blur' },
  pm10:        { t: [54, 154, 254, 354], c: ['green', 'yellow', 'orange', 'red', 'purple'], icon: 'mdi:blur-linear' },
  voc:         { t: [150, 250, 350, 450], c: ['green', 'yellow', 'orange', 'red', 'purple'], icon: 'mdi:air-filter' },
  aqi:         { t: [51, 101, 151, 201], c: ['green', 'yellow', 'orange', 'red', 'purple'], icon: 'mdi:air-filter' },
  battery:     { t: [10, 25, 50, 80], c: ['alarm', 'red', 'yellow', 'green', 'green'], icon: 'mdi:battery' },
  power:       { t: [5, 300, 1500, 3000], c: ['grey', 'green', 'yellow', 'orange', 'red'], icon: 'mdi:flash' },
  illuminance: { t: [10, 100, 1000, 10000], c: ['blue', 'ice', 'green', 'yellow', 'orange'], icon: 'mdi:brightness-5' },
  custom:      { t: [null, null, null, null], c: ['green', 'green', 'green', 'green', 'green'], icon: 'mdi:gauge' }
};
const PRESET_NAMES = ['auto', 'temperature', 'humidity', 'co2', 'pm25', 'pm10', 'voc', 'aqi', 'battery', 'power', 'illuminance', 'custom'];
// VOC device_class'ları µg/m³ ya da ppm/ppb ölçer; VOC hazır ayarı ise indeks (1-500) içindir, bu yüzden otomatik seçilmez (elle seçilebilir)
const DC_PRESET = { temperature: 'temperature', humidity: 'humidity', carbon_dioxide: 'co2', pm25: 'pm25', pm10: 'pm10',
  aqi: 'aqi', battery: 'battery', power: 'power', illuminance: 'illuminance' };

function presetOf(hass, id, chosen) {
  if (chosen && chosen !== 'auto' && PRESETS[chosen]) return chosen;
  const st = hass && id ? hass.states[id] : null;
  const dc = st ? st.attributes.device_class : '';
  return DC_PRESET[dc] || 'custom';
}
// Bölge ayarları: hazır ayar + kullanıcının değiştirdikleri
function levelsOf(preset, user) {
  const p = PRESETS[preset], u = user || {}, d = {};
  for (let i = 0; i < 4; i++) d['t' + (i + 1)] = p.t[i];
  for (let i = 0; i < 5; i++) d['c' + (i + 1)] = p.c[i];
  return Object.assign(d, u);
}
// Değeri bölgeye yerleştir: { band, zone (0-4), label }
function zoneOf(lang, preset, levels, v) {
  const L = [levels.t1, levels.t2, levels.t3, levels.t4], C = [levels.c1, levels.c2, levels.c3, levels.c4, levels.c5];
  const i = zoneIndex(v, L);
  return { band: band(zoneColor(v, L, C)), zone: i, label: preset === 'custom' ? '' : t(lang, 'z_' + preset + '_' + i) };
}
// Renk ve hale ayarları için beş bölge (bölge adı ve varsayılan rengi)
function zoneTones(lang, preset, levels) {
  const out = [];
  for (let i = 0; i < 5; i++) {
    const lbl = preset === 'custom' ? '' : tMaybe(lang, 'z_' + preset + '_' + i);
    out.push({ key: 'zone' + i, label: (lbl || t(lang, 'ed_c' + (i + 1))), band: levels['c' + (i + 1)] || 'grey', effect: levels['c' + (i + 1)] === 'alarm' ? 'blink' : 'auto' });
  }
  return out;
}
// Pil simgesi doluluğa göre
function batteryIcon(v) {
  if (v === null) return 'mdi:battery-unknown';
  const s = Math.round(v / 10) * 10;
  return s >= 100 ? 'mdi:battery' : s <= 0 ? 'mdi:battery-outline' : 'mdi:battery-' + s;
}
const DC_ICONS = { temperature: 'mdi:thermometer', humidity: 'mdi:water-percent', carbon_dioxide: 'mdi:molecule-co2', pm25: 'mdi:blur',
  pm10: 'mdi:blur-linear', power: 'mdi:flash', energy: 'mdi:lightning-bolt', illuminance: 'mdi:brightness-5', pressure: 'mdi:gauge',
  voltage: 'mdi:sine-wave', current: 'mdi:current-ac', volatile_organic_compounds: 'mdi:air-filter', volatile_organic_compounds_parts: 'mdi:air-filter',
  moisture: 'mdi:water', gas: 'mdi:meter-gas', water: 'mdi:water' };
function entityIcon(hass, id) {
  const st = hass.states[id];
  if (!st) return 'mdi:help-circle-outline';
  if (st.attributes.icon) return st.attributes.icon;
  const dc = st.attributes.device_class;
  if (dc === 'battery') return batteryIcon(num(st.state));
  return DC_ICONS[dc] || 'mdi:eye';
}
function levelsSchema(lang) {
  const row = (i) => ({ type: 'grid', name: '', flatten: true, schema: [SCH.num('t' + i, -100000, 100000, 0.1), SCH.color('c' + i, lang)] });
  return { type: 'expandable', name: 'levels', title: t(lang, 'ed_levels'), schema: [row(1), row(2), row(3), row(4), SCH.color('c5', lang)] };
}

class LemurSensorCard extends LemurCard {
  static get TYPE() { return 'lemur-sensor-card'; }
  static get DOMAINS() { return ['sensor', 'number', 'input_number']; }
  static get DEFAULTS() { return { preset: 'auto', extra: [], switch_entity: '', show_zone: true, decimals: '' }; }
  static stub(hass) {
    // Önce bilinen türden sayısal bir sensör (sıcaklık, nem, CO2...), yoksa herhangi bir sayısal sensör
    const isNum = (s) => num(s.state) !== null;
    const known = ['temperature', 'humidity', 'carbon_dioxide', 'pm25', 'battery', 'power'];
    for (let i = 0; i < known.length; i++) {
      const id = firstEntity(hass, ['sensor'], (s) => isNum(s) && s.attributes.device_class === known[i]);
      if (id) return { entity: id };
    }
    return { entity: firstEntity(hass, ['sensor'], isNum) || 'sensor.example' };
  }
  static nested(cfg, hass) { return { levels: levelsOf(presetOf(hass, cfg.entity, cfg.preset)) }; }
  static get RESETS() { return { levels: ['entity', 'preset'] }; }
  static schema(lang) {
    return [
      Object.assign(SCH.entity('entity', ['sensor', 'number', 'input_number']), { required: true }),
      SCH.text('name'),
      SCH.select('preset', lang, PRESET_NAMES, 'p_'),
      { name: 'extra', selector: { entity: { multiple: true } } },
      { name: 'switch_entity', selector: { entity: { domain: ['switch', 'light', 'fan', 'input_boolean', 'humidifier', 'climate'] } } },
      SCH.appearance(lang, ['show_zone']),
      levelsSchema(lang),
      SCH.advanced(lang, [SCH.num('decimals', 0, 4, 1)])
    ];
  }
  ids() { const c = this._config; return [c.entity, c.switch_entity].concat(c.extra || []); }
  static toneList(lang, cfg, hass) {
    const preset = presetOf(hass, cfg.entity, cfg.preset);
    return zoneTones(lang, preset, levelsOf(preset, cfg.levels)).concat([{ key: 'lost', label: t(lang, 'st_lost'), band: 'alarm', effect: 'blink' }]);
  }

  view(lang) {
    const c = this._config, h = this._hass, st = this.st(c.entity);
    const preset = presetOf(h, c.entity, c.preset), lv = levelsOf(preset, c.levels);
    const lost = this.isLost(c.entity);
    let v = preset === 'power' ? watts(h, c.entity) : stateNum(h, c.entity);
    // Sıcaklık hazır ayarı °C'dir; °F sensörün değeri bölgelemede °C'ye çevrilir
    const vz = preset === 'temperature' && st ? toC(v, st.attributes.unit_of_measurement || '') : v;
    const z = v === null ? { band: BANDS.grey, label: '' } : zoneOf(lang, preset, lv, vz);
    const valTxt = st ? (preset === 'power' && v !== null ? fmtPower(v) : fmtState(h, c.entity, c.decimals, lang)) : '';
    const sw = this.st(c.switch_entity);
    const icon = st && st.attributes.icon ? st.attributes.icon : (preset === 'battery' ? batteryIcon(v) : (DC_ICONS[st && st.attributes.device_class] || PRESETS[preset].icon));
    return {
      name: st ? st.attributes.friendly_name : c.entity,
      sec: lost ? [t(lang, 'st_lost')] : [c.show_zone ? z.label : '', valTxt],
      icon: { mdi: icon }, band: lost ? BANDS.alarm : z.band,
      state: lost ? 'lost' : (v === null ? 'unknown' : 'zone' + z.zone),   // simge eşlemesi: zone0..zone4, lost
      tone: lost ? 'lost' : (v === null ? '' : 'zone' + z.zone),
      on: sw ? !isOff(sw) : true,
      powerIcon: c.switch_entity ? 'mdi:power' : null,
      boxes: (c.extra || []).slice(0, 3).map((id) => ({ type: 'info', icon: entityIcon(h, id), text: fmtState(h, id, null, lang), entity: id, title: friendly(h, id) }))
    };
  }
  power() { if (this._config.switch_entity) this.call('homeassistant', 'toggle', { entity_id: this._config.switch_entity }); }
}

registerCard(LemurSensorCard, {
  tr: { name: 'Lemur Sensör Kartı', desc: 'Herhangi bir sensör; değere göre renk değiştiren hale' },
  en: { name: 'Lemur Sensor Card', desc: 'Any sensor, with a halo that changes colour with the value' }
});
