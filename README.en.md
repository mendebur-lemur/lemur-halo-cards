# Lemur Halo Cards

**[Türkçe](README.md)** · English

A family of eight Home Assistant cards, each with an animated, coloured halo. The icon sits in the corner and the halo behind it tells you the device's state in colour: is the room cool or hot, is the air clean, is the robot cleaning, is a door open. One look at the dashboard shows what needs attention, without reading.

![Lemur Halo Cards in use](https://raw.githubusercontent.com/mendebur-lemur/lemur-halo-cards/main/docs/images/en/demo.gif)

**Quick install:** [Open in HACS](https://my.home-assistant.io/redirect/hacs_repository/?owner=mendebur-lemur&repository=lemur-halo-cards&category=plugin) → Download → refresh the browser → **Add card** on a dashboard → search "Lemur". Step-by-step guide with videos [below](#installation).

- **Colour says it all.** Feels-like temperature on the AC, air quality on a sensor, how much you pull from the grid, an open door or a water leak. Green means fine, yellow means look, red means trouble.
- **No other add-ons needed.** One install from HACS; no mushroom, card-mod or other cards. All eight cards come in one file.
- **Everything from the card editor.** Pick devices and sensors in the visual editor, no YAML needed. Thresholds and colours come ready.
- **Your icons.** The big icon, the top-right button and the icons in the boxes below can all be changed, per state if you like.
- **Turkish and English.** The card follows Home Assistant's language.
- **Smooth on old tablets.** The animation is light and runs on old iPads (iOS 12) too. With reduced motion turned on, the halo stays still.
- **Tells you when a device drops off.** When a device is unavailable the card says "No connection" and the halo blinks red.

## Contents

- [Installation](#installation)
  - [1. Download with HACS](#1-download-with-hacs)
  - [2. Add a card to your dashboard](#2-add-a-card-to-your-dashboard)
  - [3. Set up the card](#3-set-up-the-card)
- [Cards](#cards)
  - [Climate](#climate)
  - [Sensor](#sensor)
  - [Air](#air)
  - [Vacuum and room](#vacuum-and-room)
  - [Energy and security](#energy-and-security)
  - [Light and lock](#light-and-lock)
- [Common to all cards](#common-to-all-cards)
- [Icons](#icons)
- [Updating](#updating)
- [Troubleshooting](#troubleshooting)

## Installation

You need Home Assistant 2024.8 or newer and [HACS](https://hacs.xyz/docs/use/). No other cards, themes or add-ons.

### 1. Download with HACS

This button is the easiest way. It asks for your Home Assistant address once, then opens the repository straight in HACS:

[![Open in HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=mendebur-lemur&repository=lemur-halo-cards&category=plugin)

1. Press **Add** in the dialog (the repository is added to HACS).
2. Press **Download** at the bottom right, then **Download** again in the version dialog.
3. Refresh the browser with **Ctrl+F5** (on a phone, close and reopen the app).

No Home Assistant restart is needed. HACS adds the card to your dashboards' resources by itself.

<details>
<summary>If the button doesn't work: add it by hand</summary>

1. Open **HACS** from the sidebar.
2. Top-right **⋮** menu → **Custom repositories**.
3. Paste this address into **Repository**:
   `https://github.com/mendebur-lemur/lemur-halo-cards`
4. Pick **Dashboard** as the **Type** and press **Add**. Close the dialog.
5. Type **Lemur Halo Cards** into HACS's search box and open the result.
6. **Download** → **Download**, then refresh the browser with Ctrl+F5.

</details>

### 2. Add a card to your dashboard

1. Open your dashboard and press the **✏️ (Edit)** button at the top right.
2. Press **+** in a section and type **Lemur** into the search box. All eight cards appear with previews.
3. Pick a card. It opens with a suitable device from your home; choose your own device in the **Device** field.
4. **Save** → **Done** at the top right.

In the video a climate card is added and the living room AC is chosen as its device:

![Adding a card to the dashboard](https://raw.githubusercontent.com/mendebur-lemur/lemur-halo-cards/main/docs/images/en/step-add-card.gif)

### 3. Set up the card

Every option is in the visual editor. In edit mode, click the card to open it:

- At the top, the device and sensors (for example the room temperature and humidity sensors on the climate card).
- Under **Appearance**: the top-right button, the halo, names in the boxes, which boxes are shown, and the icons.
- Per card threshold sections (comfort thresholds, sensor limits and colours), and connection checks under **Advanced**.

In the video the boxes get names and the big icon is changed:

![Setting up the card](https://raw.githubusercontent.com/mendebur-lemur/lemur-halo-cards/main/docs/images/en/step-settings.gif)

The shortest YAML, if you prefer it:

```yaml
type: custom:lemur-climate-card
entity: climate.living_room_ac
```

Options equal to their default are left out of the YAML, so the card stays tidy.

## Cards

In the card picker they all start with **Lemur**. The videos below were recorded on a real Home Assistant.

| Card | Type | What the halo shows |
|---|---|---|
| Climate | `custom:lemur-climate-card` | AC: feels-like temperature (with humidity). Radiator: room temperature |
| Sensor | `custom:lemur-sensor-card` | Any numeric sensor; limits and colours preset by sensor type |
| Air | `custom:lemur-air-card` | An air purifier and its PM2.5 / CO₂ / VOC sensor |
| Vacuum | `custom:lemur-vacuum-card` | Cleaning, returning, charging, error |
| Energy | `custom:lemur-energy-card` | Solar, home, grid, battery; exporting or importing |
| Security | `custom:lemur-security-card` | Door, window, motion, water and smoke sensors; alarm panel; lock |
| Room | `custom:lemur-room-card` | Room comfort; lights, climate device and one extra device on one card |
| Light | `custom:lemur-light-card` | The lamp's own colour and brightness |

### Climate

For an AC the halo shows the room's feels-like temperature: with high humidity the same degree counts as warmer. Blue is cool, green comfortable, orange warm, red hot. For a radiator the colour comes from the room temperature, and the thresholds shift as it gets warmer outside. Below: target temperature, mode and fan speed.

![Climate card](https://raw.githubusercontent.com/mendebur-lemur/lemur-halo-cards/main/docs/images/en/climate.gif)

```yaml
type: custom:lemur-climate-card
entity: climate.living_room_ac
temperature_sensor: sensor.living_room_temperature   # optional; the AC's own value if empty
humidity_sensor: sensor.living_room_humidity         # optional
```

```yaml
type: custom:lemur-climate-card
entity: climate.living_room_radiator_1
entities: [climate.living_room_radiator_2]           # second valve in the same room, controlled together
outdoor_sensor: sensor.outdoor_temperature           # thresholds shift as it gets warmer outside
```

### Sensor

Any numeric sensor. Limits and colours come ready for the sensor's type (CO₂, PM2.5, PM10, VOC, air quality index, temperature, humidity, battery, power, illuminance), or you set your own. Up to three extra values appear below; a switch can be tied to the top-right button.

![Sensor card](https://raw.githubusercontent.com/mendebur-lemur/lemur-halo-cards/main/docs/images/en/sensor.gif)

```yaml
type: custom:lemur-sensor-card
entity: sensor.office_co2                            # preset picked from the sensor type (CO₂)
extra: [sensor.office_temperature, sensor.office_humidity]
```

### Air

An air purifier (or fan) together with an air-quality sensor. The halo follows the sensor; as the purifier works it turns from red to green. Below: speed and preset.

![Air card](https://raw.githubusercontent.com/mendebur-lemur/lemur-halo-cards/main/docs/images/en/air.gif)

```yaml
type: custom:lemur-air-card
entity: fan.living_room_purifier
sensor: sensor.living_room_pm25
```

### Vacuum and room

**Vacuum:** green while cleaning, blue while returning, ice blue while charging, blinking red on an error. Top right: start / pause; below: stop, go home, suction or locate. Buttons the device doesn't support are hidden.

**Room:** a room's lights, climate device and one extra device (a TV, say) on one card. The halo shows the room's comfort. The top-right button turns everything off if something is on, otherwise it turns the lights on.

![Vacuum and room cards](https://raw.githubusercontent.com/mendebur-lemur/lemur-halo-cards/main/docs/images/en/vacuum-room.gif)

```yaml
type: custom:lemur-vacuum-card
entity: vacuum.downstairs
```

```yaml
type: custom:lemur-room-card
name: Living room
temperature_sensor: sensor.living_room_temperature
humidity_sensor: sensor.living_room_humidity
climate: climate.living_room_ac
lights: [light.ceiling, light.strip]
extra_entity: media_player.tv
```

### Energy and security

**Energy:** solar, home, grid and battery. Green while exporting or self-sufficient; yellow, orange and red as you import more. Without a grid sensor, import is worked out from consumption.

**Security:** watches door, window, motion, water and smoke sensors as a group. Green when all are closed, yellow when something is open, blinking red on water or smoke. Alarm panels and locks work too. Unlocking and disarming need two taps.

![Energy and security cards](https://raw.githubusercontent.com/mendebur-lemur/lemur-halo-cards/main/docs/images/en/energy-security.gif)

```yaml
type: custom:lemur-energy-card
solar_power: sensor.solar_power
home_power: sensor.home_power
grid_power: sensor.grid_power                        # + import, − export
battery_soc: sensor.battery
```

```yaml
type: custom:lemur-security-card
entity: binary_sensor.kitchen_leak
entities: [binary_sensor.balcony_door, binary_sensor.bedroom_window]
name: Kitchen and balcony
```

### Light and lock

**Light:** the halo takes the lamp's own colour and glows brighter as the lamp does. Below: brightness, colour temperature and effect. Several lamps can be controlled together.

**Lock:** green when locked, yellow when unlocked. Locks that support it also get an **Open door** button.

![Light and lock cards](https://raw.githubusercontent.com/mendebur-lemur/lemur-halo-cards/main/docs/images/en/light-lock.gif)

```yaml
type: custom:lemur-light-card
entity: light.living_room_lamp
entities: [light.living_room_strip]                  # optional, controlled together
```

```yaml
type: custom:lemur-security-card
entity: lock.front_door
```

## Common to all cards

Tapping the icon or the name opens Home Assistant's more-info dialog. Temperatures follow Home Assistant's unit (°C / °F).

| Option | Default | Description |
|---|---|---|
| `name` | device name | Name shown on the card |
| `icon` | by state | Fixes the big icon |
| `show_power` | `true` | Top-right button |
| `show_halo` | `true` | Halo (glow) |
| `show_labels` | `false` | Show names next to the icons in the boxes below |
| `last_seen_sensor` | — | Sensor holding the last-seen time (e.g. Zigbee2MQTT's `sensor.xxx_last_seen`); older than 2 hours shows "No connection" |
| `stale_after` | `0` | Last-seen limit (seconds). Without a last-seen sensor: "No connection" when the device's state hasn't changed for this long (only for devices that change often) |
| `language` | `auto` | `auto`, `tr`, `en` |

Each card's own options appear in the card editor.

## Icons

Every icon can be changed (card editor, **Appearance** section):

| Option | What it does |
|---|---|
| `icon` | The big icon is always this |
| `icon_on` / `icon_off` | Big icon when the device is on / off |
| `power_icon` | Icon of the top-right button |
| `icons` | Map by state, mode, option or button. Applies to the big icon and to the boxes below |

```yaml
type: custom:lemur-climate-card
entity: climate.living_room_ac
icons:
  cool: mdi:snowflake-variant      # mode
  heat: mdi:radiator
  low: mdi:speedometer-slow        # fan speed
power_icon: mdi:power-standby
```

`icons` keys: on an AC the mode (`cool`, `heat`, `dry`...) and fan speed (`low`, `high`...); on a radiator the state (`heating`, `idle`, `off`, `lost`, `sensor`);
on a sensor the zone (`zone0` … `zone4`, `lost`); on a vacuum the state (`cleaning`, `docked`, `charging`, `returning`, `error`...) and buttons (`stop`, `home`, `locate`);
on energy `export`, `self`, `import`; on security `open`, `danger`, `motion`, `clear`, alarm and lock states, buttons (`arm_home`, `arm_away`, `disarm`, `lock`, `unlock`, `open`);
on a room the buttons (`lights`, `climate`, `extra`); in info boxes the entity id (`sensor.living_room_humidity: mdi:water`).

## Updating

When a new version is out, an update notice appears in HACS and on the **Settings** page.

1. **HACS → Lemur Halo Cards → ⋮ → Redownload** (or **Update** in the notice).
2. Refresh the browser with **Ctrl+F5** (on a phone, close and reopen the app); otherwise the old card may come from the cache.

Your card settings are kept.

## Troubleshooting

- **Searching "Lemur" in the card picker shows nothing, or there's a "Custom element doesn't exist" error.** Refresh the browser with Ctrl+F5. If it's still missing, **Settings → Dashboards → ⋮ → Resources** should list `/hacsfiles/lemur-halo-cards/lemur-halo-cards.js` (type: JavaScript module). If your dashboards are in YAML mode, add that line under `resources` yourself.
- **The card says "No connection".** Home Assistant shows the device as unavailable. If you set `last_seen_sensor` or `stale_after`, check the limit.
- **The halo doesn't move.** With reduced motion turned on in your device's settings, the halo stays still on purpose. With `show_halo: false` there's no halo at all.
- **The phone shows an old version.** Close the app completely and reopen it; if that doesn't help, clear the frontend cache in the app's settings.
- **Still stuck?** [Open an issue](https://github.com/mendebur-lemur/lemur-halo-cards/issues); include your Home Assistant version, browser and the card's YAML and we'll take a look.

## Thanks

The visual idea for these cards was inspired by Anashost's [HA-Animated-cards](https://github.com/Anashost/HA-Animated-cards). Thank you! The code and design details here are this project's own; no code was taken from that project.

## License

MIT
