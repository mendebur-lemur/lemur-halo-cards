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
