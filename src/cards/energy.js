// Enerji kartı: güneş üretimi, ev tüketimi, şebeke ve batarya. Ana varlığı yok, sensörler seçilir.
// Şebeke: pozitif = şebekeden çekiş, negatif = şebekeye veriş (ters bağlıysa grid_invert).
// Şebeke sensörü yoksa tüketim − üretim − batarya deşarjı olarak hesaplanır.
// Hale: şebekeye veriyor ya da kendine yetiyor yeşil; az çekiş sarı; orta turuncu; çok çekiş kırmızı.

addText({
  e_name: 'Enerji', e_pick: 'Ayarlardan sensör seç', e_producing: 'Üretiyor', e_export: 'Şebekeye veriyor', e_self: 'Kendine yetiyor', e_import: 'Şebekeden çekiyor', e_nodata: 'Veri yok',
  e_solar: 'Güneş', e_home: 'Ev', e_grid: 'Şebeke', e_battery: 'Batarya',
  ed_solar_power: 'Güneş üretimi (W/kW)', ed_home_power: 'Ev tüketimi (W/kW)', ed_grid_power: 'Şebeke gücü (W/kW; + çekiş, − veriş)',
  ed_grid_invert: 'Şebeke sensörü ters (+ veriş, − çekiş)', ed_battery_soc: 'Batarya doluluğu (%)', ed_battery_power: 'Batarya gücü (W/kW; + deşarj)',
  ed_battery_invert: 'Batarya gücü ters (+ şarj)', ed_limits: 'Renk sınırları (W)', ed_self_margin: 'Kendine yetiyor sayılan çekiş (en çok)',
  ed_import_mid: 'Turuncu başlangıcı', ed_import_high: 'Kırmızı başlangıcı',
  ed_show_solar: 'Güneş kutusu', ed_show_home: 'Ev kutusu', ed_show_grid: 'Şebeke kutusu', ed_show_battery: 'Batarya kutusu'
}, {
  e_name: 'Energy', e_pick: 'Pick sensors in the settings', e_producing: 'Producing', e_export: 'Exporting', e_self: 'Self-sufficient', e_import: 'Importing', e_nodata: 'No data',
  e_solar: 'Solar', e_home: 'Home', e_grid: 'Grid', e_battery: 'Battery',
  ed_solar_power: 'Solar production (W/kW)', ed_home_power: 'Home consumption (W/kW)', ed_grid_power: 'Grid power (W/kW; + import, − export)',
  ed_grid_invert: 'Grid sensor inverted (+ export, − import)', ed_battery_soc: 'Battery charge (%)', ed_battery_power: 'Battery power (W/kW; + discharge)',
  ed_battery_invert: 'Battery power inverted (+ charge)', ed_limits: 'Colour limits (W)', ed_self_margin: 'Import still counted as self-sufficient (max)',
  ed_import_mid: 'Orange from', ed_import_high: 'Red from',
  ed_show_solar: 'Solar box', ed_show_home: 'Home box', ed_show_grid: 'Grid box', ed_show_battery: 'Battery box'
});

const ENERGY_LIMITS = { self_margin: 100, import_mid: 1000, import_high: 3000 };

class LemurEnergyCard extends LemurCard {
  static get TYPE() { return 'lemur-energy-card'; }
  static get DOMAINS() { return null; }
  static get DEFAULTS() {
    return { solar_power: '', home_power: '', grid_power: '', grid_invert: false, battery_soc: '', battery_power: '', battery_invert: false,
      show_solar: true, show_home: true, show_grid: true, show_battery: true, show_power: false };
  }
  static nested() { return { limits: ENERGY_LIMITS }; }
  static stub(hass) {
    const p = (re) => firstEntity(hass, ['sensor'], (s) => s.attributes.device_class === 'power' && re.test(s.entity_id));
    const any = firstEntity(hass, ['sensor'], (s) => s.attributes.device_class === 'power');
    const cfg = { solar_power: p(/solar|pv|gunes/i), home_power: p(/home|house|load|ev_|tuketim/i), grid_power: p(/grid|sebeke/i) };
    if (!cfg.solar_power && !cfg.home_power && !cfg.grid_power) cfg.home_power = any;
    Object.keys(cfg).forEach((k) => { if (!cfg[k]) delete cfg[k]; });
    return cfg;
  }
  // Sensör seçilmemişse hata yerine kartta "Ayarlardan sensör seç" yazar
  validate() {}
  static schema(lang) {
    const pw = (n) => SCH.entity(n, ['sensor'], { device_class: 'power' });
    return [
      SCH.text('name'),
      pw('solar_power'), pw('home_power'), pw('grid_power'), SCH.bool('grid_invert'),
      SCH.entity('battery_soc', ['sensor'], { device_class: 'battery' }), pw('battery_power'), SCH.bool('battery_invert'),
      SCH.appearance(lang, ['show_solar', 'show_home', 'show_grid', 'show_battery']),
      { type: 'expandable', name: 'limits', title: t(lang, 'ed_limits'), schema: [
        SCH.num('self_margin', 0, 100000, 10, 'W'), SCH.num('import_mid', 0, 100000, 50, 'W'), SCH.num('import_high', 0, 100000, 50, 'W')] },
      SCH.advanced(lang)
    ];
  }
  ids() { const c = this._config; return [c.solar_power, c.home_power, c.grid_power, c.battery_soc, c.battery_power]; }

  _flows() {
    const c = this._config, h = this._hass;
    const solar = watts(h, c.solar_power), home = watts(h, c.home_power);
    let grid = watts(h, c.grid_power); if (grid !== null && c.grid_invert) grid = -grid;
    let batt = watts(h, c.battery_power); if (batt !== null && c.battery_invert) batt = -batt;
    if (grid === null && home !== null) grid = home - (solar || 0) - (batt || 0);
    return { solar: solar, home: home, grid: grid, batt: batt, soc: stateNum(h, c.battery_soc) };
  }

  view(lang) {
    const c = this._config, f = this._flows(), L = Object.assign({}, ENERGY_LIMITS, c.limits || {});
    const main = c.grid_power || c.solar_power || c.home_power;
    if (!main) return { name: t(lang, 'e_name'), sec: [t(lang, 'e_pick')], icon: { mdi: 'mdi:home-lightning-bolt-outline' }, band: BANDS.grey, on: false, powerIcon: null, boxes: [] };
    const lost = this.isLost(main);
    let key = 'e_nodata', bnd = BANDS.grey, amount = null;
    // Yalnız ev sensörü varsa üretim kaynağı yoktur: her şey şebekeden gelir, "kendine yetiyor" denmez
    const homeOnly = !c.solar_power && !c.battery_power && !c.grid_power;
    if (f.grid !== null) {
      if (!homeOnly && f.grid < -L.self_margin) { key = 'e_export'; bnd = BANDS.green; amount = -f.grid; }
      else if (!homeOnly && f.grid <= L.self_margin) { key = 'e_self'; bnd = BANDS.green; }
      else { key = 'e_import'; amount = Math.max(f.grid, 0); bnd = f.grid <= L.self_margin ? BANDS.green : f.grid < L.import_mid ? BANDS.yellow : f.grid < L.import_high ? BANDS.orange : BANDS.red; }
    } else if (f.solar !== null) {
      // Sadece güneş sensörü var: üretimi göster
      key = f.solar > 20 ? 'e_producing' : 'e_nodata'; amount = f.solar > 20 ? f.solar : null; bnd = f.solar > 20 ? BANDS.green : BANDS.grey;
    }
    const boxes = [];
    if (c.show_solar && f.solar !== null) boxes.push({ type: 'info', icon: 'mdi:solar-power', text: fmtPower(f.solar), entity: c.solar_power, title: t(lang, 'e_solar') });
    if (c.show_home && f.home !== null) boxes.push({ type: 'info', icon: 'mdi:home-lightning-bolt-outline', text: fmtPower(f.home), entity: c.home_power, title: t(lang, 'e_home') });
    if (c.show_grid && f.grid !== null) boxes.push({ type: 'info', icon: f.grid < 0 ? 'mdi:transmission-tower-export' : 'mdi:transmission-tower-import',
      text: fmtPower(Math.abs(f.grid)), entity: c.grid_power || c.home_power, title: t(lang, 'e_grid') });
    if (c.show_battery && f.soc !== null) boxes.push({ type: 'info', icon: batteryIcon(f.soc), text: pct(Math.round(f.soc), lang), entity: c.battery_soc, title: t(lang, 'e_battery') });
    // Dört kutu dar gelir: dördü de varsa ev kutusu çıkar (ev tüketimi alt yazıda zaten okunur)
    if (boxes.length > 3) boxes.splice(1, 1);
    return {
      name: t(lang, 'e_name'),
      sec: lost ? [t(lang, 'st_lost')] : [t(lang, key), amount !== null ? fmtPower(amount) : ''],
      icon: { mdi: f.solar !== null && f.solar > 20 ? 'mdi:solar-power-variant' : 'mdi:home-lightning-bolt-outline' },
      state: lost ? 'lost' : key.replace('e_', ''),   // simge eşlemesi: export, self, import, nodata, lost
      band: lost ? BANDS.alarm : bnd, on: true, powerIcon: null, moreInfo: main, boxes: boxes
    };
  }
}

registerCard(LemurEnergyCard, {
  tr: { name: 'Lemur Enerji Kartı', desc: 'Güneş, ev, şebeke ve batarya; şebekeden çekişe göre renk' },
  en: { name: 'Lemur Energy Card', desc: 'Solar, home, grid and battery, coloured by grid import' }
});
