// Robot süpürge kartı. Sağ üstteki düğme başlat / duraklat; altta durdur, eve dön, emiş gücü (ya da bul).
// Hale: temizlerken yeşil, eve dönerken mavi, şarj olurken buz mavisi, istasyonda dolu gri, beklerken sarı, hata kırmızı yanıp söner.

addText({
  v_cleaning: 'Temizliyor', v_docked: 'İstasyonda', v_charging: 'Şarj oluyor', v_returning: 'Eve dönüyor', v_paused: 'Duraklatıldı',
  v_idle: 'Bekliyor', v_error: 'Hata', v_start: 'Başlat', v_pause: 'Duraklat', v_stop: 'Durdur', v_home: 'Eve dön', v_locate: 'Bul',
  v_suction: 'Emiş gücü',
  ed_battery_sensor: 'Pil sensörü (boşsa cihazdan)', ed_show_stop: 'Durdur', ed_show_return: 'Eve dön', ed_show_fan_speed: 'Emiş gücü', ed_show_locate: 'Bul'
}, {
  v_cleaning: 'Cleaning', v_docked: 'Docked', v_charging: 'Charging', v_returning: 'Returning', v_paused: 'Paused',
  v_idle: 'Idle', v_error: 'Error', v_start: 'Start', v_pause: 'Pause', v_stop: 'Stop', v_home: 'Go home', v_locate: 'Locate',
  v_suction: 'Suction',
  ed_battery_sensor: 'Battery sensor (device if empty)', ed_show_stop: 'Stop', ed_show_return: 'Go home', ed_show_fan_speed: 'Suction power', ed_show_locate: 'Locate'
});

// VacuumEntityFeature bitleri. Öznitelik hiç yoksa (eski ya da sahte cihaz) hepsi var sayılır.
const VF = { TURN_ON: 1, TURN_OFF: 2, PAUSE: 4, STOP: 8, RETURN: 16, FAN: 32, LOCATE: 512, START: 8192 };
const vacFeatures = (a) => (a.supported_features === undefined || a.supported_features === null) ? 0xFFFFFF : (num(a.supported_features) || 0);
// Sağ üst düğme: temizlerken duraklat > durdur > eve dön > kapat; değilse başlat > aç
function vacPower(f, cleaning) {
  if (cleaning) return f & VF.PAUSE ? 'pause' : f & VF.STOP ? 'stop' : f & VF.RETURN ? 'return_to_base' : f & VF.TURN_OFF ? 'turn_off' : null;
  return f & VF.START ? 'start' : f & VF.TURN_ON ? 'turn_on' : null;
}
const VAC_PWR = { pause: ['mdi:pause', 'v_pause'], stop: ['mdi:stop', 'v_stop'], return_to_base: ['mdi:home-import-outline', 'v_home'],
  turn_off: ['mdi:stop', 'v_stop'], start: ['mdi:play', 'v_start'], turn_on: ['mdi:play', 'v_start'] };

class LemurVacuumCard extends LemurCard {
  static get TYPE() { return 'lemur-vacuum-card'; }
  static get DOMAINS() { return ['vacuum']; }
  static get DEFAULTS() { return { battery_sensor: '', show_stop: true, show_return: true, show_fan_speed: true, show_locate: true }; }
  static toneList(lang) {
    const L = (k, b, e) => ({ key: k, label: k === 'lost' ? t(lang, 'st_lost') : t(lang, 'v_' + k), band: b, effect: e || 'auto' });
    return [L('cleaning', 'green'), L('returning', 'blue'), L('charging', 'ice'), L('docked', 'grey'), L('paused', 'yellow'), L('idle', 'yellow'),
      L('error', 'alarm', 'blink'), L('lost', 'alarm', 'blink')];
  }
  static schema(lang) {
    return [
      Object.assign(SCH.entity('entity', ['vacuum']), { required: true }),
      SCH.text('name'),
      SCH.entity('battery_sensor', ['sensor'], { device_class: 'battery' }),
      SCH.appearance(lang, ['show_stop', 'show_return', 'show_fan_speed', 'show_locate']),
      SCH.advanced(lang)
    ];
  }
  // Pil: önce seçilen sensör, sonra cihazın battery_level özniteliği (HA 2025.8'den beri kullanımdan kalkıyor),
  // sonra aynı adlı pil sensörü (sensor.<süpürge>_battery)
  _battery() {
    const c = this._config, h = this._hass, st = this.st(c.entity), obj = c.entity.split('.')[1];
    let v = stateNum(h, c.battery_sensor);
    if (v === null && st) v = num(st.attributes.battery_level);
    if (v === null) v = stateNum(h, 'sensor.' + obj + '_battery');
    if (v === null) v = stateNum(h, 'sensor.' + obj + '_battery_level');
    return v;
  }
  ids() { const obj = this._config.entity.split('.')[1]; return [this._config.entity, this._config.battery_sensor, 'sensor.' + obj + '_battery', 'sensor.' + obj + '_battery_level']; }

  view(lang) {
    const c = this._config, h = this._hass, st = this.st(c.entity), a = st ? st.attributes : {};
    const lost = this.isLost(c.entity);
    const bat = this._battery();
    let s = st ? st.state : 'unavailable';
    if (s === 'docked' && bat !== null && bat < 100) s = 'charging';
    const BAND = { cleaning: 'green', returning: 'blue', charging: 'ice', docked: 'grey', paused: 'yellow', idle: 'yellow', error: 'alarm' };
    const bnd = lost ? BANDS.alarm : band(BAND[s] || 'grey');
    const cleaning = s === 'cleaning';
    const sec = [lost ? t(lang, 'st_lost') : (tMaybe(lang, 'v_' + s) || prettify(s))];
    if (bat !== null) sec.push(pct(Math.round(bat), lang));
    if (s === 'error' && a.error) sec.push(String(a.error));
    const f = vacFeatures(a), pw = vacPower(f, cleaning);
    const boxes = [];
    if (c.show_stop && (f & VF.STOP) && pw !== 'stop') boxes.push({ type: 'button', id: 'stop', icon: 'mdi:stop', label: t(lang, 'v_stop') });
    if (c.show_return && (f & VF.RETURN)) boxes.push({ type: 'button', id: 'home', icon: 'mdi:home-import-outline', label: t(lang, 'v_home'), active: s === 'returning' });
    if (c.show_fan_speed && (f & VF.FAN) && (a.fan_speed_list || []).length) {
      boxes.push({ type: 'select', id: 'suction', title: t(lang, 'v_suction'), icon: fanIcon(a.fan_speed || ''), label: a.fan_speed ? fanLabel(lang, a.fan_speed) : t(lang, 'v_suction'),
        value: a.fan_speed, options: a.fan_speed_list.map((x) => ({ value: x, label: fanLabel(lang, x), icon: fanIcon(x) })) });
    } else if (c.show_locate && (f & VF.LOCATE)) {
      boxes.push({ type: 'button', id: 'locate', icon: 'mdi:map-marker-radius', label: t(lang, 'v_locate') });
    }
    return { name: a.friendly_name || c.entity, sec: sec, icon: { mdi: s === 'error' ? 'mdi:robot-vacuum-alert' : 'mdi:robot-vacuum' }, state: lost ? 'lost' : s, tone: lost ? 'lost' : s,
      band: bnd, on: cleaning, disabled: lost, powerIcon: pw ? VAC_PWR[pw][0] : null, powerTitle: pw ? t(lang, VAC_PWR[pw][1]) : '', boxes: boxes };
  }

  power() {
    const st = this.st(this._config.entity); if (!st) return;
    const svc = vacPower(vacFeatures(st.attributes), st.state === 'cleaning');
    if (svc) this.call('vacuum', svc, { entity_id: this._config.entity });
  }
  onButton(id) {
    const svc = { stop: 'stop', home: 'return_to_base', locate: 'locate' }[id];
    if (svc) this.call('vacuum', svc, { entity_id: this._config.entity });
  }
  onSelect(id, value) { this.call('vacuum', 'set_fan_speed', { entity_id: this._config.entity, fan_speed: value }); }
}

registerCard(LemurVacuumCard, {
  tr: { name: 'Lemur Robot Süpürge Kartı', desc: 'Robot süpürge: durum, pil, başlat / eve dön' },
  en: { name: 'Lemur Vacuum Card', desc: 'Robot vacuum: status, battery, start / go home' }
});
