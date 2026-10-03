// Güvenlik kartı: üç tür cihazla çalışır, ana cihazın türüne göre davranır.
//  - binary_sensor (kapı, pencere, hareket, su kaçağı, duman...): bir ya da birden çok. Açık olanları sayar ve yazar.
//    Tehlike (su, duman, gaz...) kırmızı yanıp söner; açık kapı/pencere sarı; hareket mavi; hepsi kapalı yeşil.
//  - alarm_control_panel: evde / dışarıda kur, kapat. Kurulu mavi, kuruluyor sarı, çalıyor kırmızı yanıp söner.
//  - lock: kilitle / aç. Kilitli yeşil, açık sarı, sıkışmış kırmızı yanıp söner.
// Kilidi açmak ve alarmı kapatmak iki dokunuş ister ("Emin misin?").

addText({
  tn_clear: 'Hepsi kapalı / sorun yok', tn_open: 'Açık bir şey var', tn_motion: 'Hareket', tn_danger: 'Tehlike (su, duman, gaz)',
  tn_disarmed: 'Kurulu değil', tn_armed: 'Kurulu', tn_arming: 'Kuruluyor / bekliyor', tn_triggered: 'Çalıyor',
  tn_locked: 'Kilitli', tn_unlocked: 'Kilit açık', tn_moving: 'Kilitleniyor / açılıyor', tn_jammed: 'Sıkıştı',
  s_group: 'Güvenlik', s_all_closed: 'Hepsi kapalı', s_no_motion: 'Hareket yok', s_all_clear: 'Sorun yok', s_open: 'açık', s_motion: 'Hareket', s_alert: 'Uyarı',
  s_disarmed: 'Kapalı', s_armed_home: 'Evde kurulu', s_armed_away: 'Dışarıda kurulu', s_armed_night: 'Gece kurulu',
  s_armed_vacation: 'Tatil modunda', s_armed_custom_bypass: 'Özel kurulu', s_arming: 'Kuruluyor', s_disarming: 'Kapanıyor',
  s_pending: 'Bekliyor', s_triggered: 'ALARM!', s_code: 'Kod gerekli',
  s_arm_home: 'Evde', s_arm_away: 'Dışarıda', s_arm_night: 'Gece', s_disarm: 'Kapat',
  l_locked: 'Kilitli', l_unlocked: 'Kilit açık', l_locking: 'Kilitleniyor', l_unlocking: 'Açılıyor', l_jammed: 'Sıkıştı', l_open: 'Kapı açık',
  l_opening: 'Kapı açılıyor', l_lock: 'Kilitle', l_unlock: 'Kilidi aç', l_open_door: 'Kapıyı aç',
  ed_show_list: 'Altta cihazları tek tek göster'
}, {
  tn_clear: 'All closed / all clear', tn_open: 'Something open', tn_motion: 'Motion', tn_danger: 'Danger (water, smoke, gas)',
  tn_disarmed: 'Disarmed', tn_armed: 'Armed', tn_arming: 'Arming / pending', tn_triggered: 'Triggered',
  tn_locked: 'Locked', tn_unlocked: 'Unlocked', tn_moving: 'Locking / unlocking', tn_jammed: 'Jammed',
  s_group: 'Security', s_all_closed: 'All closed', s_no_motion: 'No motion', s_all_clear: 'All clear', s_open: 'open', s_motion: 'Motion', s_alert: 'Alert',
  s_disarmed: 'Disarmed', s_armed_home: 'Armed home', s_armed_away: 'Armed away', s_armed_night: 'Armed night',
  s_armed_vacation: 'Vacation', s_armed_custom_bypass: 'Armed custom', s_arming: 'Arming', s_disarming: 'Disarming',
  s_pending: 'Pending', s_triggered: 'ALARM!', s_code: 'Code required',
  s_arm_home: 'Home', s_arm_away: 'Away', s_arm_night: 'Night', s_disarm: 'Disarm',
  l_locked: 'Locked', l_unlocked: 'Unlocked', l_locking: 'Locking', l_unlocking: 'Unlocking', l_jammed: 'Jammed', l_open: 'Door open',
  l_opening: 'Opening', l_lock: 'Lock', l_unlock: 'Unlock', l_open_door: 'Open door',
  ed_show_list: 'Show each device below'
});

const DANGER = ['moisture', 'smoke', 'gas', 'carbon_monoxide', 'safety', 'problem', 'tamper', 'heat'];
const ACTIVITY = ['motion', 'occupancy', 'presence', 'vibration', 'sound'];
// [kapalı/normal simge, açık/algılandı simge]
const BS_ICONS = {
  door: ['mdi:door-closed', 'mdi:door-open'], window: ['mdi:window-closed-variant', 'mdi:window-open-variant'],
  garage_door: ['mdi:garage', 'mdi:garage-open'], opening: ['mdi:square-outline', 'mdi:square-rounded-badge-outline'],
  lock: ['mdi:lock', 'mdi:lock-open-variant'], motion: ['mdi:motion-sensor-off', 'mdi:motion-sensor'],
  occupancy: ['mdi:home-outline', 'mdi:home-account'], presence: ['mdi:home-outline', 'mdi:home-account'],
  moisture: ['mdi:water-off', 'mdi:water-alert'], smoke: ['mdi:smoke-detector-variant', 'mdi:smoke-detector-variant-alert'],
  gas: ['mdi:meter-gas', 'mdi:meter-gas-outline'], carbon_monoxide: ['mdi:smoke-detector', 'mdi:smoke-detector-alert'],
  safety: ['mdi:shield-check', 'mdi:shield-alert'], problem: ['mdi:check-circle', 'mdi:alert-circle'], tamper: ['mdi:check-circle', 'mdi:alert-circle'],
  heat: ['mdi:thermometer', 'mdi:fire-alert'], vibration: ['mdi:crop-portrait', 'mdi:vibrate'], sound: ['mdi:music-note-off', 'mdi:music-note']
};
const bsIcon = (st) => { const dc = st ? st.attributes.device_class : '', p = BS_ICONS[dc] || ['mdi:checkbox-blank-circle-outline', 'mdi:checkbox-marked-circle']; return p[st && st.state === 'on' ? 1 : 0]; };
const ALARM_ICONS = { disarmed: 'mdi:shield-off-outline', armed_home: 'mdi:shield-home', armed_away: 'mdi:shield-lock', armed_night: 'mdi:shield-moon',
  armed_vacation: 'mdi:shield-airplane', armed_custom_bypass: 'mdi:security', arming: 'mdi:shield-sync', disarming: 'mdi:shield-sync',
  pending: 'mdi:shield-sync', triggered: 'mdi:bell-ring' };
const LOCK_ICONS = { locked: 'mdi:lock', unlocked: 'mdi:lock-open-variant', locking: 'mdi:lock-clock', unlocking: 'mdi:lock-clock',
  jammed: 'mdi:lock-alert', open: 'mdi:door-open', opening: 'mdi:door-open' };

class LemurSecurityCard extends LemurCard {
  static get TYPE() { return 'lemur-security-card'; }
  static get DOMAINS() { return ['binary_sensor', 'alarm_control_panel', 'lock']; }
  static get DEFAULTS() { return { entities: [], show_list: true, show_power: false }; }
  static toneList(lang, cfg) {
    const dom = String(cfg.entity || '').split('.')[0];
    const L = (k, b, e) => ({ key: k, label: k === 'lost' ? t(lang, 'st_lost') : t(lang, 'tn_' + k), band: b, effect: e || 'auto' });
    const list = dom === 'alarm_control_panel' ? [L('disarmed', 'green'), L('armed', 'blue'), L('arming', 'yellow'), L('triggered', 'alarm', 'blink')]
      : dom === 'lock' ? [L('locked', 'green'), L('unlocked', 'yellow'), L('moving', 'blue'), L('jammed', 'alarm', 'blink')]
      : [L('clear', 'green'), L('open', 'yellow'), L('motion', 'blue'), L('danger', 'alarm', 'blink')];
    return list.concat([L('lost', 'alarm', 'blink')]);
  }
  static stub(hass) { return { entity: firstEntity(hass, ['alarm_control_panel', 'lock']) || firstEntity(hass, ['binary_sensor'], (s) => !!BS_ICONS[s.attributes.device_class]) || 'binary_sensor.example' }; }
  static schema(lang) {
    return [
      Object.assign(SCH.entity('entity', ['binary_sensor', 'alarm_control_panel', 'lock']), { required: true }),
      SCH.entities('entities', ['binary_sensor', 'lock']),
      SCH.text('name'),
      SCH.appearance(lang, ['show_list']),
      SCH.advanced(lang)
    ];
  }

  view(lang) {
    const dom = this._config.entity.split('.')[0];
    if (dom === 'alarm_control_panel') return this._alarm(lang);
    if (dom === 'lock') return this._lock(lang);
    return this._sensors(lang);
  }

  _sensors(lang) {
    const c = this._config, h = this._hass, ids = [c.entity].concat(c.entities || []), sts = ids.map((id) => this.st(id));
    const lost = ids.some((id) => this.isLost(id));
    const onIds = ids.filter((id) => { const s = this.st(id); return s && s.state === 'on'; });
    const dcOf = (id) => { const s = this.st(id); return s ? s.attributes.device_class : ''; };
    const danger = onIds.filter((id) => DANGER.indexOf(dcOf(id)) >= 0);
    const active = onIds.filter((id) => ACTIVITY.indexOf(dcOf(id)) >= 0);
    const open = onIds.filter((id) => danger.indexOf(id) < 0 && active.indexOf(id) < 0);
    const short = (id) => String(friendly(h, id)).replace(/\s*(sensörü|sensor|kontak|contact)\s*$/i, '');
    let bnd = BANDS.green, sec = [], icon = bsIcon(this.st(c.entity)), state = 'clear';
    const mainDc = dcOf(c.entity);
    if (danger.length) { state = 'danger'; bnd = BANDS.alarm; icon = bsIcon(this.st(danger[0])); sec = [t(lang, 's_alert'), danger.map(short).join(', ')]; }
    else if (open.length) { state = 'open'; bnd = BANDS.yellow; icon = bsIcon(this.st(open[0])); sec = [ids.length > 1 ? open.length + ' ' + t(lang, 's_open') : t(lang, 'st_on'), ids.length > 1 ? open.map(short).join(', ') : '']; }
    else if (active.length) { state = 'motion'; bnd = BANDS.blue; icon = bsIcon(this.st(active[0])); sec = [t(lang, 's_motion'), active.map(short).join(', ')]; }
    else sec = [t(lang, ACTIVITY.indexOf(mainDc) >= 0 ? 's_no_motion' : DANGER.indexOf(mainDc) >= 0 ? 's_all_clear' : 's_all_closed')];
    if (lost) { state = 'lost'; bnd = BANDS.alarm; sec.unshift(t(lang, 'st_lost')); }
    // Altta: önce açık / algılayanlar, en çok 3
    const order = onIds.concat(ids.filter((id) => onIds.indexOf(id) < 0));
    const boxes = c.show_list && ids.length > 1 ? order.slice(0, 3).map((id) => ({ type: 'info', icon: bsIcon(this.st(id)), text: short(id), entity: id, title: friendly(h, id) })) : [];
    return { name: ids.length > 1 ? t(lang, 's_group') : friendly(h, c.entity), sec: sec, icon: { mdi: icon }, state: state, tone: state, band: bnd, on: onIds.length > 0, powerIcon: null, boxes: boxes };
  }

  _alarm(lang) {
    const c = this._config, st = this.st(c.entity), a = st ? st.attributes : {}, s = st ? st.state : 'unavailable';
    const lost = this.isLost(c.entity);
    const B = { disarmed: 'green', triggered: 'alarm', arming: 'yellow', pending: 'yellow', disarming: 'yellow' };
    const bnd = lost ? BANDS.alarm : band(B[s] || (s.indexOf('armed') === 0 ? 'blue' : 'grey'));
    const f = num(a.supported_features) || 0, codeArm = a.code_arm_required !== false && !!a.code_format, codeDisarm = !!a.code_format;
    const boxes = [];
    if (!codeArm) {
      if (f & 1) boxes.push({ type: 'button', id: 'arm_home', icon: 'mdi:shield-home', label: t(lang, 's_arm_home'), active: s === 'armed_home', showLabel: true });
      if (f & 2) boxes.push({ type: 'button', id: 'arm_away', icon: 'mdi:shield-lock', label: t(lang, 's_arm_away'), active: s === 'armed_away', showLabel: true });
      if ((f & 4) && boxes.length < 2) boxes.push({ type: 'button', id: 'arm_night', icon: 'mdi:shield-moon', label: t(lang, 's_arm_night'), active: s === 'armed_night', showLabel: true });
    }
    if (!codeDisarm) boxes.push({ type: 'button', id: 'disarm', icon: 'mdi:shield-off-outline', label: t(lang, 's_disarm'), active: s === 'disarmed', confirm: true, showLabel: true });
    if (codeArm || codeDisarm) boxes.push({ type: 'info', icon: 'mdi:dialpad', text: t(lang, 's_code'), entity: c.entity });
    return { name: a.friendly_name || c.entity, sec: [lost ? t(lang, 'st_lost') : (tMaybe(lang, 's_' + s) || prettify(s))],
      icon: { mdi: ALARM_ICONS[s] || 'mdi:shield-outline' }, state: lost ? 'lost' : s,
      tone: lost ? 'lost' : (s === 'disarmed' ? 'disarmed' : s === 'triggered' ? 'triggered' : s.indexOf('armed') === 0 ? 'armed' : 'arming'), band: bnd, on: s.indexOf('armed') === 0, powerIcon: null, disabled: lost, boxes: boxes };
  }

  _lock(lang) {
    const c = this._config, ids = [c.entity].concat(c.entities || []), st = this.st(c.entity), a = st ? st.attributes : {}, s = st ? st.state : 'unavailable';
    const lost = ids.some((id) => this.isLost(id));
    const anyOpen = ids.some((id) => { const x = this.st(id); return x && (x.state === 'unlocked' || x.state === 'open'); });
    const B = { locked: 'green', unlocked: 'yellow', open: 'yellow', opening: 'yellow', locking: 'blue', unlocking: 'blue', jammed: 'alarm' };
    const bnd = lost ? BANDS.alarm : band(anyOpen && s === 'locked' ? 'yellow' : (B[s] || 'grey'));
    const boxes = [
      { type: 'button', id: 'lock', icon: 'mdi:lock', label: t(lang, 'l_lock'), active: s === 'locked', showLabel: true },
      { type: 'button', id: 'unlock', icon: 'mdi:lock-open-variant', label: t(lang, 'l_unlock'), active: s === 'unlocked', confirm: true, showLabel: true }
    ];
    if ((num(a.supported_features) || 0) & 1) boxes.push({ type: 'button', id: 'open', icon: 'mdi:door-open', label: t(lang, 'l_open_door'), confirm: true, showLabel: true });
    return { name: a.friendly_name || c.entity, sec: [lost ? t(lang, 'st_lost') : (tMaybe(lang, 'l_' + s) || prettify(s))],
      icon: { mdi: LOCK_ICONS[s] || 'mdi:lock-question' }, state: lost ? 'lost' : s,
      tone: lost ? 'lost' : (s === 'jammed' ? 'jammed' : (s === 'locking' || s === 'unlocking') ? 'moving' : (s === 'locked' && !anyOpen) ? 'locked' : 'unlocked'), band: bnd, on: s === 'locked', powerIcon: null, disabled: lost, boxes: boxes };
  }

  onButton(id) {
    const c = this._config, dom = c.entity.split('.')[0];
    if (dom === 'alarm_control_panel') this.call('alarm_control_panel', 'alarm_' + id, { entity_id: c.entity });
    if (dom === 'lock') this.call('lock', id, { entity_id: [c.entity].concat(c.entities || []).filter((x) => x.indexOf('lock.') === 0) });
  }
}

registerCard(LemurSecurityCard, {
  tr: { name: 'Lemur Güvenlik Kartı', desc: 'Kapı, pencere, sızıntı ve duman sensörleri, alarm paneli ya da kilit' },
  en: { name: 'Lemur Security Card', desc: 'Door, window, leak and smoke sensors, alarm panel or lock' }
});
