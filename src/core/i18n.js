// Metinler. Her metin hem tr hem en. Arayüzde marka adı geçmez.
// Ortak metinler burada; her kart kendi metinlerini addText() ile ekler.
const TXT = {
  tr: {
    // ortak durumlar
    st_off: 'Kapalı', st_on: 'Açık', st_lost: 'Bağlantı yok', st_sensor: 'Sensör yok', st_unknown: 'Bilinmiyor',
    confirm: 'Emin misin?', power: 'Aç / kapat',
    // renkler (editör)
    c_ice: 'Buz mavisi', c_blue: 'Mavi', c_green: 'Yeşil', c_yellow: 'Sarı', c_orange: 'Turuncu', c_red: 'Kırmızı',
    c_alarm: 'Kırmızı, yanıp söner', c_grey: 'Gri', c_purple: 'Mor',
    // editör: ortak alanlar
    ed_entity: 'Cihaz', ed_entities: 'Birlikte kontrol edilecek diğer cihazlar', ed_name: 'Ad', ed_icon: 'Simge (her zaman)',
    ed_icon_on: 'Simge (açıkken)', ed_icon_off: 'Simge (kapalıyken)', ed_power_icon: 'Sağ üst düğmenin simgesi',
    ed_icons: 'Simge eşlemesi: durum, mod, seçenek ya da düğme → simge (ör. cool: mdi:snowflake-variant)',
    ed_appearance: 'Görünüm', ed_advanced: 'Gelişmiş', ed_show_power: 'Sağ üstteki düğme', ed_show_halo: 'Hale (parıltı)',
    ed_show_labels: 'Kutularda adları da yaz', ed_language: 'Dil', ed_stale_after: 'Bu kadar saniye haber gelmezse "Bağlantı yok" (0: kapalı; son görülme sensörüyle varsayılan 7200)',
    ed_last_seen_sensor: 'Son görülme sensörü (isteğe bağlı; ör. Zigbee2MQTT last_seen)',
    ed_lang_auto: 'Otomatik', ed_reset: 'Varsayılana dön'
  },
  en: {
    st_off: 'Off', st_on: 'On', st_lost: 'No connection', st_sensor: 'No sensor', st_unknown: 'Unknown',
    confirm: 'Sure?', power: 'Turn on / off',
    c_ice: 'Ice blue', c_blue: 'Blue', c_green: 'Green', c_yellow: 'Yellow', c_orange: 'Orange', c_red: 'Red',
    c_alarm: 'Red, blinking', c_grey: 'Grey', c_purple: 'Purple',
    ed_entity: 'Device', ed_entities: 'Other devices controlled together', ed_name: 'Name', ed_icon: 'Icon (always)',
    ed_icon_on: 'Icon (when on)', ed_icon_off: 'Icon (when off)', ed_power_icon: 'Top-right button icon',
    ed_icons: 'Icon map: state, mode, option or button → icon (e.g. cool: mdi:snowflake-variant)',
    ed_appearance: 'Appearance', ed_advanced: 'Advanced', ed_show_power: 'Top-right button', ed_show_halo: 'Halo (glow)',
    ed_show_labels: 'Show names in the boxes', ed_language: 'Language', ed_stale_after: 'Show "No connection" after this many seconds without news (0: off; 7200 by default with a last seen sensor)',
    ed_last_seen_sensor: 'Last seen sensor (optional; e.g. Zigbee2MQTT last_seen)',
    ed_lang_auto: 'Automatic', ed_reset: 'Reset to defaults'
  }
};

function addText(tr, en) {
  Object.assign(TXT.tr, tr);
  Object.assign(TXT.en, en);
}

function pickLang(hass, forced) {
  if (forced === 'tr' || forced === 'en') return forced;
  const l = (hass && ((hass.locale && hass.locale.language) || hass.language)) || 'en';
  return String(l).toLowerCase().indexOf('tr') === 0 ? 'tr' : 'en';
}

function t(lang, key) {
  const d = TXT[lang] || TXT.en;
  return d[key] !== undefined ? d[key] : (TXT.en[key] !== undefined ? TXT.en[key] : key);
}

// Anahtar yoksa null döner (bilinmeyen cihaz değerleri için)
function tMaybe(lang, key) {
  const d = TXT[lang] || TXT.en;
  if (d[key] !== undefined) return d[key];
  return TXT.en[key] !== undefined ? TXT.en[key] : null;
}

// Bilinmeyen bir cihaz değerini okunur yaz: "medium_high" → "Medium high"
function prettify(x) {
  const r = String(x).replace(/_/g, ' ');
  return r.charAt(0).toUpperCase() + r.slice(1);
}
