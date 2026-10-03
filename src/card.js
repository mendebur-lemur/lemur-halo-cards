// Lemur Climate Card — ana kart. İLK TASLAK: henüz gerçek HA'da test edilmedi.
// HTMLElement + shadow DOM, Lit yok, başka eklenti yok. Eski Safari için ?. ve ?? kullanılmıyor.
const CARD_VERSION = '0.0.0';

const DEFAULTS = {
  name: '',
  kind: 'auto',               // auto | ac | radiator
  radiator_style: 'panel',    // panel | sectional
  entities: [],
  temperature_sensor: '',
  humidity_sensor: '',
  outdoor_sensor: '',
  hvac_modes: ['heat', 'cool', 'dry', 'fan_only'],
  show_fan_modes: true,
  show_hvac_modes: true,
  show_target: true,
  show_power: true,
  show_halo: true,
  stale_after: 7200,
  sensor_stale_after: 10800,
  language: 'auto'
};

const MODE_ICONS = { cool: 'mdi:snowflake', heat: 'mdi:fire', dry: 'mdi:water-percent', fan_only: 'mdi:fan',
  heat_cool: 'mdi:sun-snowflake-variant', auto: 'mdi:autorenew', off: 'mdi:power-standby' };

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const num = (v) => { const n = parseFloat(v); return isFinite(n) ? n : null; };

class LemurClimateCard extends HTMLElement {
  static getConfigElement() { return document.createElement('lemur-climate-card-editor'); }
  static getStubConfig(hass) {
    const ids = hass ? Object.keys(hass.states).filter((e) => e.indexOf('climate.') === 0) : [];
    return { entity: ids[0] || 'climate.example' };
  }

  setConfig(config) {
    if (!config || !config.entity || String(config.entity).indexOf('climate.') !== 0) {
      throw new Error('entity: climate.xxx gerekli / required');
    }
    this._config = Object.assign({}, DEFAULTS, config);
    this._sig = '';
    if (this._hass) this._render();
  }

  getCardSize() { return 3; }
  getGridOptions() { return { columns: 12, rows: 3, min_columns: 6, min_rows: 3 }; }

  set hass(h) {
    this._hass = h;
    if (!this._config) return;
    const sig = this._ids().map((id) => { const s = h.states[id]; return s ? id + s.last_updated : id; }).join('|');
    if (sig === this._sig) return;
    this._sig = sig;
    this._render();
  }

  _ids() {
    const c = this._config;
    return [c.entity].concat(c.entities || [], [c.temperature_sensor, c.humidity_sensor, c.outdoor_sensor].filter(Boolean));
  }

  _stale(st, limit) {
    if (!st) return true;
    if (st.state === 'unavailable' || st.state === 'unknown') return true;
    const ts = Date.parse(st.last_reported || st.last_updated);
    return isFinite(ts) && limit > 0 && (Date.now() - ts) / 1000 > limit;
  }

  _model() {
    const c = this._config, h = this._hass, S = h.states;
    const ents = [c.entity].concat(c.entities || []);
    const main = S[c.entity];
    const a = main ? main.attributes : {};
    const modes = a.hvac_modes || [];
    const kind = c.kind !== 'auto' ? c.kind : (modes.indexOf('cool') >= 0 ? 'ac' : 'radiator');
    const sensorVal = (id) => (id && S[id]) ? num(S[id].state) : null;
    let t = sensorVal(c.temperature_sensor); if (t === null) t = num(a.current_temperature);
    let rh = sensorVal(c.humidity_sensor); if (rh === null) rh = num(a.current_humidity);
    const outdoor = sensorVal(c.outdoor_sensor);
    const lost = ents.some((id) => this._stale(S[id], c.stale_after));
    const sensorLost = !!c.temperature_sensor && this._stale(S[c.temperature_sensor], c.sensor_stale_after);
    const onList = ents.filter((id) => S[id] && S[id].state !== 'off' && S[id].state !== 'unavailable' && S[id].state !== 'unknown');
    const isOn = onList.length > 0;
    const busy = onList.some((id) => {
      const x = S[id].attributes, act = x.hvac_action;
      if (act === 'heating' || act === 'cooling') return true;
      return !act && num(x.current_temperature) !== null && num(x.temperature) !== null && num(x.current_temperature) < num(x.temperature);
    });
    const m = { kind: kind, t: t, rh: rh, isOn: isOn, lost: lost, sensorLost: sensorLost, main: main, ents: ents };
    if (kind === 'ac') {
      m.band = acBand(t === null ? 22 : t, rh, c.comfort);
      m.icon = { mdi: MODE_ICONS[main ? main.state : ''] || 'mdi:air-conditioner' };
      m.label = lost ? 'st_lost' : (t === null ? '' : comfortKey(t, rh, c.comfort));
    } else {
      let st = !isOn ? 'st_off' : (busy ? 'st_heating' : 'st_idle');
      if (lost) st = 'st_lost'; else if (sensorLost) st = 'st_sensor';
      m.band = radiatorBand(t === null ? 20 : t, outdoor, c.radiator_bands, lost || sensorLost);
      const base = c.radiator_style === 'sectional' ? 'sectional' : 'panel';
      m.icon = st === 'st_heating' ? { mdi: 'mdi:fire' } : { svg: base + (st === 'st_off' ? '-off' : (st === 'st_lost' || st === 'st_sensor') ? '-lost' : '') };
      m.label = st;
    }
    return m;
  }

  _render() {
    if (!this._hass || !this._config) return;
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    const c = this._config, lang = pickLang(this._hass, c.language), m = this._model();
    const main = m.main, a = main ? main.attributes : {};
    const name = c.name || (a.friendly_name || c.entity);
    const parts = [];
    if (m.label) parts.push(t(lang, m.label));
    if (m.t !== null) parts.push((Math.round(m.t * 10) / 10) + ' °C');
    if (m.rh !== null && m.rh > 0) parts.push('%' + Math.round(m.rh));
    const iconHtml = m.icon.svg ? svgIcon(m.icon.svg) : '<ha-icon icon="' + m.icon.mdi + '"></ha-icon>';
    const halo = c.show_halo ? ('--halo-anim:lc-' + m.band.anim + ';--halo-dur:' + (Math.round(m.band.duration * 1.15 * 100) / 100) + 's;') : '--halo-anim:none;';
    const target = num(a.temperature);
    const step = num(a.target_temp_step) || 0.5;
    const modes = (a.hvac_modes || []).filter((x) => c.hvac_modes.indexOf(x) >= 0);
    const fans = a.fan_modes || [];
    let bottom = '';
    if (c.show_target && target !== null) {
      bottom += '<div class="box"><button id="minus" aria-label="-">−</button><span class="val">' + target + '°</span><button id="plus" aria-label="+">+</button></div>';
    }
    if (m.kind === 'ac' && c.show_hvac_modes && modes.length) {
      bottom += '<div class="box"><select id="mode" aria-label="' + esc(t(lang, 'mode')) + '">' +
        modes.map((x) => '<option value="' + esc(x) + '"' + (main && main.state === x ? ' selected' : '') + '>' + esc(t(lang, 'm_' + x)) + '</option>').join('') + '</select></div>';
    }
    if (m.kind === 'ac' && c.show_fan_modes && fans.length) {
      bottom += '<div class="box"><select id="fan" aria-label="' + esc(t(lang, 'fan')) + '">' +
        fans.map((x) => '<option value="' + esc(x) + '"' + (a.fan_mode === x ? ' selected' : '') + '>' + esc(x) + '</option>').join('') + '</select></div>';
    }
    this.shadowRoot.innerHTML = '<style>' + CSS + '</style>' +
      '<ha-card class="' + (m.isOn ? 'on' : 'off') + '" style="--temp-rgb:' + m.band.rgb + ';' + halo + '">' +
      '<div class="top"><div class="ic">' + iconHtml + '</div>' +
      '<div class="txt"><div class="name">' + esc(name) + '</div><div class="sec">' + esc(parts.join(' · ')) + '</div></div>' +
      (c.show_power ? '<button class="pwr' + (m.isOn ? ' on' : '') + '" id="pwr" aria-label="power"><ha-icon icon="mdi:power"></ha-icon></button>' : '') +
      '</div>' + (bottom ? '<div class="bottom">' + bottom + '</div>' : '') + '</ha-card>';
    const $ = (id) => this.shadowRoot.getElementById(id);
    if ($('pwr')) $('pwr').addEventListener('click', () => this._power(m));
    if ($('minus')) $('minus').addEventListener('click', () => this._nudge(-step));
    if ($('plus')) $('plus').addEventListener('click', () => this._nudge(step));
    if ($('mode')) $('mode').addEventListener('change', (e) => this._call('set_hvac_mode', { hvac_mode: e.target.value }, [this._config.entity]));
    if ($('fan')) $('fan').addEventListener('change', (e) => this._call('set_fan_mode', { fan_mode: e.target.value }, [this._config.entity]));
  }

  _call(service, data, ids) {
    return this._hass.callService('climate', service, Object.assign({ entity_id: ids }, data || {}));
  }

  _power(m) {
    if (m.isOn) return this._call('turn_off', {}, m.ents);
    if (m.kind === 'radiator') return this._call('set_hvac_mode', { hvac_mode: 'heat' }, m.ents);
    return this._call('turn_on', {}, m.ents);
  }

  // Art arda basışları toplar, 800 ms sonra tek komut gönderir
  _nudge(delta) {
    const a = this._hass.states[this._config.entity].attributes;
    const lo = num(a.min_temp) !== null ? num(a.min_temp) : 5, hi = num(a.max_temp) !== null ? num(a.max_temp) : 35;
    const cur = this._pending !== undefined ? this._pending : num(a.temperature);
    if (cur === null) return;
    this._pending = Math.max(lo, Math.min(hi, Math.round((cur + delta) * 10) / 10));
    const v = this.shadowRoot.querySelector('.val'); if (v) v.textContent = this._pending + '°';
    clearTimeout(this._tmr);
    this._tmr = setTimeout(() => {
      const val = this._pending; this._pending = undefined;
      this._call('set_temperature', { temperature: val }, [this._config.entity].concat(this._config.entities || []));
    }, 800);
  }
}
