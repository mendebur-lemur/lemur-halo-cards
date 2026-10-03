// Oda kartı: bir odanın özeti. Sıcaklık ve nemden konfor (iklim kartıyla aynı hesap), ışıklar, iklim cihazı ve bir ek cihaz.
// Sağ üstteki düğme odadaki her şeyi kapatır (bir şey açıksa) ya da ışıkları açar.
// Altta: ışıklar (açık / toplam, dokununca hepsini aç-kapat), iklim cihazı (mod simgesi + hedef), ek cihaz.

addText({
  r_name: 'Oda', r_pick: 'Ayarlardan cihaz seç', r_lights: 'Işıklar', r_lights_off: 'Işıklar kapalı', r_lights_n: 'ışık açık', r_all_off: 'Hepsini kapat', r_lights_on: 'Işıkları aç',
  ed_climate: 'Klima / petek (isteğe bağlı)', ed_lights: 'Işıklar', ed_extra_entity: 'Ek cihaz (TV, fan, priz...)',
  ed_show_lights: 'Işık kutusu', ed_show_climate: 'İklim kutusu', ed_show_extra: 'Ek cihaz kutusu'
}, {
  r_name: 'Room', r_pick: 'Pick devices in the settings', r_lights: 'Lights', r_lights_off: 'Lights off', r_lights_n: 'lights on', r_all_off: 'Turn everything off', r_lights_on: 'Turn lights on',
  ed_climate: 'Air conditioner / radiator (optional)', ed_lights: 'Lights', ed_extra_entity: 'Extra device (TV, fan, plug...)',
  ed_show_lights: 'Lights box', ed_show_climate: 'Climate box', ed_show_extra: 'Extra device box'
});

const DOMAIN_ICONS = { media_player: ['mdi:television-off', 'mdi:television'], fan: ['mdi:fan-off', 'mdi:fan'], switch: ['mdi:power-plug-off-outline', 'mdi:power-plug'],
  light: ['mdi:lightbulb-outline', 'mdi:lightbulb'], input_boolean: ['mdi:toggle-switch-off-outline', 'mdi:toggle-switch'],
  humidifier: ['mdi:air-humidifier-off', 'mdi:air-humidifier'], cover: ['mdi:window-shutter', 'mdi:window-shutter-open'] };

class LemurRoomCard extends LemurCard {
  static get TYPE() { return 'lemur-room-card'; }
  static get DOMAINS() { return null; }
  static get DEFAULTS() {
    return { icon: '', temperature_sensor: '', humidity_sensor: '', climate: '', lights: [], extra_entity: '',
      show_lights: true, show_climate: true, show_extra: true };
  }
  static nested() { return { comfort: COMFORT_DEFAULTS }; }
  static stub(hass) {
    const tmp = firstEntity(hass, ['sensor'], (s) => s.attributes.device_class === 'temperature');
    const light = firstEntity(hass, ['light']), cl = firstEntity(hass, ['climate']);
    const cfg = {};   // ad boşsa kart dile göre "Oda" / "Room" yazar
    if (tmp) cfg.temperature_sensor = tmp;
    if (light) cfg.lights = [light];
    if (!tmp && cl) cfg.climate = cl;
    return cfg;
  }
  // Hiçbir şey seçilmemişse hata yerine kartta "Ayarlardan cihaz seç" yazar
  validate() {}
  static schema(lang) {
    const n = (name, min, max) => SCH.num(name, min, max, 0.5, '°C');
    return [
      SCH.text('name'),
      SCH.entity('temperature_sensor', ['sensor'], { device_class: 'temperature' }),
      SCH.entity('humidity_sensor', ['sensor'], { device_class: 'humidity' }),
      SCH.entity('climate', ['climate']),
      SCH.entities('lights', ['light', 'switch']),
      { name: 'extra_entity', selector: { entity: { domain: ['media_player', 'fan', 'switch', 'input_boolean', 'humidifier', 'light', 'cover'] } } },
      SCH.appearance(lang, ['show_lights', 'show_climate', 'show_extra']),
      { type: 'expandable', name: 'comfort', title: t(lang, 'ed_comfort'), schema: [
        n('cold', 0, 40), n('cool', 0, 40), n('warm', 0, 45), n('hot', 0, 45), n('humid_dewpoint', 0, 30), SCH.num('dry_humidity', 0, 100, 1, '%')] },
      SCH.advanced(lang)
    ];
  }
  ids() { const c = this._config; return [c.temperature_sensor, c.humidity_sensor, c.climate, c.extra_entity].concat(c.lights || []); }

  // Ek cihaz açık mı: görünüm ve sağ üst düğme aynı kuralı kullanır (kapalı perde, bekleyen medya "kapalı" sayılır)
  _exOn() {
    const ex = this.st(this._config.extra_entity);
    return !!ex && !isOff(ex) && ['idle', 'standby', 'closed', 'paused'].indexOf(ex.state) < 0;
  }
  _lightsOn() { return (this._config.lights || []).filter((id) => !isOff(this.st(id))); }
  _anyOn() { const cl = this.st(this._config.climate); return this._lightsOn().length > 0 || (!!cl && !isOff(cl)) || this._exOn(); }

  view(lang) {
    const c = this._config, h = this._hass, cl = this.st(c.climate), ca = cl ? cl.attributes : {};
    if (!c.temperature_sensor && !c.climate && !(c.lights || []).length && !c.extra_entity) {
      return { name: t(lang, 'r_name'), sec: [t(lang, 'r_pick')], icon: { mdi: 'mdi:sofa-outline' }, band: BANDS.grey, on: false, powerIcon: null, boxes: [] };
    }
    // Sıcaklık HA'nın biriminde gösterilir, konfor hesabı °C ile yapılır
    let tmp = stateNum(h, c.temperature_sensor); if (tmp === null) tmp = num(ca.current_temperature);
    let rh = stateNum(h, c.humidity_sensor); if (rh === null) rh = num(ca.current_humidity);
    const unit = tempUnit(h), tc = toC(tmp, unit);
    const lights = c.lights || [], lightsOn = this._lightsOn();
    const ex = this.st(c.extra_entity), exOn = this._exOn();
    const anyOn = this._anyOn();
    const sensorLost = c.temperature_sensor ? this.isLost(c.temperature_sensor) : false;
    let bnd = tc !== null ? acBand(tc, rh, c.comfort) : (lightsOn.length ? BANDS.yellow : BANDS.grey);
    const sec = [];
    if (sensorLost) { bnd = BANDS.alarm; sec.push(t(lang, 'st_sensor')); }
    else if (tc !== null) sec.push(t(lang, comfortKey(tc, rh, c.comfort)));
    if (tmp !== null) sec.push(round(tmp, 1) + ' ' + unit);
    if (rh !== null && rh > 0) sec.push(pct(Math.round(rh), lang));
    // Sıcaklık yoksa alt yazıda ışık durumu
    if (tmp === null && lights.length) sec.push(lightsOn.length ? lightsOn.length + '/' + lights.length + ' ' + t(lang, 'r_lights_n') : t(lang, 'r_lights_off'));
    const boxes = [];
    if (c.show_lights && lights.length) boxes.push({ type: 'button', id: 'lights', icon: lightsOn.length ? 'mdi:lightbulb-group' : 'mdi:lightbulb-group-off-outline',
      label: lightsOn.length + '/' + lights.length, active: lightsOn.length > 0, showLabel: true });
    if (c.show_climate && cl) {
      const tg = num(ca.temperature);
      boxes.push({ type: 'button', id: 'climate', icon: isDead(cl) ? 'mdi:air-conditioner' : modeIcon(cl.state),
        label: isOff(cl) ? t(lang, 'st_off') : (tg !== null ? tg + '°' : t(lang, 'm_' + cl.state)), active: !isOff(cl), showLabel: true });
    }
    if (c.show_extra && ex) {
      const d = DOMAIN_ICONS[c.extra_entity.split('.')[0]] || ['mdi:toggle-switch-off-outline', 'mdi:toggle-switch'];
      boxes.push({ type: 'button', id: 'extra', icon: ex.attributes.icon || d[exOn ? 1 : 0], label: exOn ? t(lang, 'st_on') : t(lang, 'st_off'), active: exOn, showLabel: true });
    }
    return { name: t(lang, 'r_name'), sec: sec, icon: { mdi: 'mdi:sofa-outline' }, state: anyOn ? 'on' : 'off', band: bnd, on: anyOn,
      powerIcon: lights.length || cl || ex ? undefined : null,
      powerTitle: t(lang, anyOn ? 'r_all_off' : 'r_lights_on'), moreInfo: c.temperature_sensor || c.climate || lights[0] || c.extra_entity, boxes: boxes };
  }

  _lights(on) {
    const ls = this._config.lights || [];
    if (ls.length) this.call('homeassistant', on ? 'turn_on' : 'turn_off', { entity_id: ls });
  }
  power() {
    const c = this._config, cl = this.st(c.climate);
    if (!this._anyOn()) return this._lights(true);
    // Odadan çıkarken: her şeyi kapat
    this._lights(false);
    if (cl && !isOff(cl)) climateOff(this, [c.climate]);
    if (this._exOn()) this.call('homeassistant', 'turn_off', { entity_id: c.extra_entity });
  }
  onButton(id) {
    const c = this._config;
    if (id === 'lights') this._lights(!this._lightsOn().length);
    if (id === 'climate') { if (isOff(this.st(c.climate))) climateOn(this, [c.climate]); else climateOff(this, [c.climate]); }
    // Ek cihaz: aç / kapat (medya oynatıcı dahil; kapalı TV'yi de açar)
    if (id === 'extra') this.call('homeassistant', this._exOn() ? 'turn_off' : 'turn_on', { entity_id: c.extra_entity });
  }
}

registerCard(LemurRoomCard, {
  tr: { name: 'Lemur Oda Kartı', desc: 'Odanın konforu, ışıkları ve iklim cihazı tek kartta' },
  en: { name: 'Lemur Room Card', desc: 'A room at a glance: comfort, lights and climate in one card' }
});
