# Lemur Halo Cards

**[Türkçe](README.md)** · English

A family of Home Assistant cards with a breathing, coloured halo. The icon sits in the corner and the halo behind it tells the device's state through colour and rhythm: is the room cool or hot, is the air clean, is the robot cleaning, is a door open.

![Cards in a dark theme](https://raw.githubusercontent.com/mendebur-lemur/lemur-halo-cards/main/docs/images/cards-dark.png)

![Cards in a light theme](https://raw.githubusercontent.com/mendebur-lemur/lemur-halo-cards/main/docs/images/cards-light.png)

- **No other add-ons needed.** One install from HACS; no mushroom, card-mod or other cards. All cards come in one file.
- **Everything from the card editor.** Pick devices and sensors in the editor, no YAML needed.
- **Sensible defaults.** Thresholds and colours are ready; change them under "Advanced" if you like.
- **Turkish and English.** The interface follows Home Assistant's language.
- **Runs on old tablets too.** The animation is light and stays smooth on old iPads. With reduced motion turned on, the halo stays still.

## Cards

| Card | Type | What the halo shows |
|---|---|---|
| Climate | `custom:lemur-climate-card` | AC: feels-like temperature (with humidity). Radiator: room temperature, with thresholds shifted by outdoor temperature |
| Sensor | `custom:lemur-sensor-card` | Any numeric sensor; limits and colours preset by sensor type |
| Air | `custom:lemur-air-card` | Air purifier + PM2.5 / CO₂ / VOC sensor; air quality |
| Vacuum | `custom:lemur-vacuum-card` | Cleaning, returning, charging, error |
| Energy | `custom:lemur-energy-card` | Solar, home, grid, battery; exporting or importing |
| Security | `custom:lemur-security-card` | Door/window/leak/smoke sensors, alarm panel or lock |
| Room | `custom:lemur-room-card` | Room comfort; lights, climate device and one extra device in one card |
| Light | `custom:lemur-light-card` | The lamp's own colour and brightness |

On every card, tapping the icon or name opens Home Assistant's more-info dialog. When a device is unavailable the card says "No connection" and the halo blinks red; a last-seen sensor can be used too. Unlocking and disarming need two taps. Temperatures follow Home Assistant's unit (°C / °F).

## Installation

1. HACS → top-right menu → Custom repositories → `https://github.com/mendebur-lemur/lemur-halo-cards`, category **Dashboard**.
2. Find the card and download it.
3. Refresh the browser (Ctrl+F5). On a dashboard: Add card → pick one of the cards starting with **Lemur**.

## Examples

```yaml
type: custom:lemur-climate-card
entity: climate.living_room_ac
temperature_sensor: sensor.living_room_temperature   # optional; the AC's own value if empty
humidity_sensor: sensor.living_room_humidity         # optional
```

```yaml
type: custom:lemur-sensor-card
entity: sensor.living_room_co2                       # preset picked from the sensor type (CO₂)
extra: [sensor.living_room_temperature, sensor.living_room_humidity]
```

```yaml
type: custom:lemur-energy-card
solar_power: sensor.solar_power
home_power: sensor.home_power
grid_power: sensor.grid_power                        # + import, − export
battery_soc: sensor.battery
```

```yaml
type: custom:lemur-room-card
name: Living room
temperature_sensor: sensor.living_room_temperature
climate: climate.living_room_ac
lights: [light.ceiling, light.strip]
extra_entity: media_player.tv
```

More examples (air, vacuum, security, light) are in the [Turkish README](README.md#örnekler); the keys are the same.

## Common options

| Option | Default | Description |
|---|---|---|
| `name` | device name | Name shown on the card |
| `icon` | by state | Fixes the icon |
| `show_power` | `true` | Top-right button |
| `show_halo` | `true` | Halo (glow) |
| `show_labels` | `false` | Show names next to the icons in the boxes below |
| `last_seen_sensor` | — | Sensor holding the last-seen time (e.g. Zigbee2MQTT's `sensor.xxx_last_seen`); older than 2 hours shows "No connection" |
| `stale_after` | `0` | Last-seen limit (s). Without a last-seen sensor: "No connection" when the device's state has not changed for this long (only for devices that change often) |
| `language` | `auto` | `auto`, `tr`, `en` |

Each card's own options appear in the card editor.

## Icons

Every icon can be changed (card editor, "Appearance" section):

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

The full list of `icons` keys for each card is in the [Turkish README](README.md#simgeler).

## Thanks

The visual idea for this card was inspired by Anashost's [HA-Animated-cards](https://github.com/Anashost/HA-Animated-cards). Thank you! The code and design details of this card are its own; no code was taken from that project.

## License

MIT
