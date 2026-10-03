// Kart editörü. HA'nın kendi ha-form bileşeniyle (HA ile geliyor, ek bağımlılık değil).
// İLK TASLAK: gerçek HA'da test edilmedi.
class LemurClimateCardEditor extends HTMLElement {
  setConfig(config) { this._config = Object.assign({}, config); this._render(); }
  set hass(h) { this._hass = h; if (this._form) this._form.hass = h; else this._render(); }

  _schema(lang) {
    const L = (k) => t(lang, k);
    const n = (name, min, max) => ({ name: name, selector: { number: { min: min, max: max, step: 0.5, mode: 'box', unit_of_measurement: '°C' } } });
    return [
      { name: 'entity', required: true, selector: { entity: { domain: 'climate' } } },
      { name: 'entities', selector: { entity: { domain: 'climate', multiple: true } } },
      { name: 'name', selector: { text: {} } },
      { name: 'kind', selector: { select: { mode: 'dropdown', options: [
        { value: 'auto', label: L('ed_kind_auto') }, { value: 'ac', label: L('ed_kind_ac') }, { value: 'radiator', label: L('ed_kind_radiator') }] } } },
      { name: 'radiator_style', selector: { select: { mode: 'dropdown', options: [
        { value: 'panel', label: L('ed_panel') }, { value: 'sectional', label: L('ed_sectional') }] } } },
      { name: 'temperature_sensor', selector: { entity: { domain: 'sensor', device_class: 'temperature' } } },
      { name: 'humidity_sensor', selector: { entity: { domain: 'sensor', device_class: 'humidity' } } },
      { name: 'outdoor_sensor', selector: { entity: { domain: 'sensor', device_class: 'temperature' } } },
      { type: 'expandable', name: 'comfort', title: L('ed_advanced'), schema: [
        n('cold', 0, 40), n('cool', 0, 40), n('warm', 0, 45), n('hot', 0, 45), n('humid_dewpoint', 0, 30),
        { name: 'dry_humidity', selector: { number: { min: 0, max: 100, step: 1, mode: 'box', unit_of_measurement: '%' } } }] },
      { type: 'expandable', name: 'radiator_bands', title: L('ed_kind_radiator') + ' · ' + L('ed_advanced'), schema: [
        n('very_cold', 0, 40), n('cold', 0, 40), n('comfort', 0, 40), n('warm', 0, 40)] }
    ];
  }

  _render() {
    if (!this._hass || !this._config) return;
    const lang = pickLang(this._hass, this._config.language);
    if (!this._form) {
      this._form = document.createElement('ha-form');
      this._form.computeLabel = (s) => {
        const map = { entity: 'ed_entity', entities: 'ed_entities', name: 'ed_name', kind: 'ed_kind', radiator_style: 'ed_radiator_style',
          temperature_sensor: 'ed_temp', humidity_sensor: 'ed_hum', outdoor_sensor: 'ed_outdoor' };
        return map[s.name] ? t(lang, map[s.name]) : (s.title || s.name);
      };
      this._form.addEventListener('value-changed', (ev) => {
        const cfg = Object.assign({}, this._config, ev.detail.value);
        ['comfort', 'radiator_bands'].forEach((k) => {
          const v = Object.assign({}, cfg[k] || {}, ev.detail.value[k] || {});
          if (k === 'comfort') Object.keys(COMFORT_DEFAULTS).forEach((x) => { if (v[x] === COMFORT_DEFAULTS[x]) delete v[x]; });
          if (k === 'radiator_bands') Object.keys(RADIATOR_DEFAULTS).forEach((x) => { if (v[x] === RADIATOR_DEFAULTS[x]) delete v[x]; });
          if (Object.keys(v).length) cfg[k] = v; else delete cfg[k];
        });
        Object.keys(cfg).forEach((k) => { if (cfg[k] === '' || cfg[k] === undefined || (Array.isArray(cfg[k]) && !cfg[k].length)) delete cfg[k]; });
        this._config = cfg;
        this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: cfg }, bubbles: true, composed: true }));
      });
      this.appendChild(this._form);
    }
    this._form.hass = this._hass;
    this._form.schema = this._schema(lang);
    this._form.data = Object.assign({}, DEFAULTS, this._config, {
      comfort: Object.assign({}, COMFORT_DEFAULTS, this._config.comfort || {}),
      radiator_bands: Object.assign({}, RADIATOR_DEFAULTS, this._config.radiator_bands || {})
    });
  }
}
