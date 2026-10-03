# Lemur Halo Cards

Türkçe · **[English](README.en.md)**

Home Assistant için nefes alan, renkli haleli kart ailesi. Her kartta ikon köşede durur, arkasındaki hale cihazın durumunu renk ve ritimle anlatır: oda serin mi sıcak mı, hava temiz mi, robot temizliyor mu, kapı açık mı.

![Koyu temada kartlar](https://raw.githubusercontent.com/mendebur-lemur/lemur-halo-cards/main/docs/images/cards-dark.png)

![Açık temada kartlar](https://raw.githubusercontent.com/mendebur-lemur/lemur-halo-cards/main/docs/images/cards-light.png)

- **Başka eklenti gerekmez.** HACS'tan tek seferde kurulur; mushroom, card-mod ya da başka bir kart gerektirmez. Bütün kartlar tek dosyada gelir.
- **Her şey kart ayarlarından.** Cihazları ve sensörleri editörden seçersin, YAML yazman gerekmez.
- **Hazır ayarlarla gelir.** Eşikler ve renkler hazır; istersen "Gelişmiş" bölümünden değiştirirsin.
- **Türkçe ve İngilizce.** Arayüz Home Assistant'ın diline göre seçilir.
- **Eski tabletlerde de çalışır.** Animasyon hafiftir, eski iPad'lerde de akıcıdır. Hareket azaltma ayarı açıksa hale durur.

## Kartlar

| Kart | Tür | Hale neyi anlatır |
|---|---|---|
| İklim | `custom:lemur-climate-card` | Klima: hissedilen sıcaklık (nemle birlikte). Petek: oda sıcaklığı, dış sıcaklığa göre kayan eşikler |
| Sensör | `custom:lemur-sensor-card` | Herhangi bir sayısal sensör; sınırlar ve renkler sensörün türüne göre hazır gelir |
| Hava | `custom:lemur-air-card` | Hava temizleyici + PM2.5 / CO₂ / VOC sensörü; hava kalitesi |
| Robot süpürge | `custom:lemur-vacuum-card` | Temizliyor, eve dönüyor, şarj oluyor, hata |
| Enerji | `custom:lemur-energy-card` | Güneş, ev, şebeke, batarya; şebekeye veriyor mu, çekiyor mu |
| Güvenlik | `custom:lemur-security-card` | Kapı/pencere/sızıntı/duman sensörleri, alarm paneli ya da kilit |
| Oda | `custom:lemur-room-card` | Odanın konforu; ışıklar, iklim cihazı ve bir ek cihaz tek kartta |
| Işık | `custom:lemur-light-card` | Lambanın kendi rengi ve parlaklığı |

Bütün kartlarda: ikona ya da isme dokununca Home Assistant'ın ayrıntı penceresi açılır. Cihaz erişilemez olduğunda (unavailable) kart "Bağlantı yok" yazar ve hale kırmızı yanıp söner; istersen son görülme sensörüyle de kontrol edebilirsin. Kilidi açmak ve alarmı kapatmak iki dokunuş ister. Sıcaklıklar Home Assistant'ın birimiyle (°C / °F) gösterilir.

## Kurulum

1. HACS → sağ üstteki menü → Özel depolar → `https://github.com/mendebur-lemur/lemur-halo-cards`, kategori **Dashboard**.
2. Listede kartı bul, İndir.
3. Tarayıcıyı yenile (Ctrl+F5). Panoda "Kart ekle" → **Lemur** ile başlayan kartlardan birini seç.

## Örnekler

```yaml
type: custom:lemur-climate-card
entity: climate.salon_klima
temperature_sensor: sensor.salon_sicaklik   # isteğe bağlı; boşsa klimanın kendi değeri
humidity_sensor: sensor.salon_nem           # isteğe bağlı
```

```yaml
type: custom:lemur-climate-card
entity: climate.salon_petek_1
entities: [climate.salon_petek_2]           # aynı odadaki ikinci vana, birlikte yönetilir
outdoor_sensor: sensor.dis_sicaklik         # dış sıcaklık arttıkça renk eşikleri kayar
```

```yaml
type: custom:lemur-sensor-card
entity: sensor.salon_co2                    # sensör türünden hazır ayar seçilir (CO₂)
extra: [sensor.salon_sicaklik, sensor.salon_nem]
```

```yaml
type: custom:lemur-air-card
entity: fan.salon_hava_temizleyici
sensor: sensor.salon_pm25
```

```yaml
type: custom:lemur-vacuum-card
entity: vacuum.alt_kat
```

```yaml
type: custom:lemur-energy-card
solar_power: sensor.gunes_uretim
home_power: sensor.ev_tuketim
grid_power: sensor.sebeke                   # + şebekeden çekiş, − şebekeye veriş
battery_soc: sensor.batarya
```

```yaml
type: custom:lemur-security-card
entity: binary_sensor.balkon_kapi
entities: [binary_sensor.mutfak_pencere, binary_sensor.yatak_pencere]
name: Kapı ve pencereler
```

```yaml
type: custom:lemur-room-card
name: Salon
temperature_sensor: sensor.salon_sicaklik
humidity_sensor: sensor.salon_nem
climate: climate.salon_klima
lights: [light.salon_tavan, light.salon_serit]
extra_entity: media_player.salon_tv
```

```yaml
type: custom:lemur-light-card
entity: light.salon_serit
```

## Ortak ayarlar

| Ayar | Varsayılan | Açıklama |
|---|---|---|
| `name` | cihaz adı | Kartta görünen ad |
| `icon` | duruma göre | Simgeyi sabitler |
| `show_power` | `true` | Sağ üstteki düğme |
| `show_halo` | `true` | Hale (parıltı) |
| `show_labels` | `false` | Alttaki kutularda simgenin yanında adı da yaz |
| `last_seen_sensor` | — | Son görülme zamanını tutan sensör (ör. Zigbee2MQTT'nin `sensor.xxx_last_seen`); 2 saatten eskiyse "Bağlantı yok" |
| `stale_after` | `0` | Son görülme sınırı (sn). Son görülme sensörü yoksa: cihazın durumu bu kadar süre hiç değişmezse "Bağlantı yok" (sadece sürekli değişen cihazlarda kullan) |
| `language` | `auto` | `auto`, `tr`, `en` |

Her kartın kendine özgü ayarları kart editöründe görünür.

## Simgeler

Bütün simgeler değiştirilebilir (kart editöründe "Görünüm" bölümü):

| Ayar | Ne yapar |
|---|---|
| `icon` | Büyük ikon her zaman bu olur |
| `icon_on` / `icon_off` | Cihaz açıkken / kapalıyken büyük ikon |
| `power_icon` | Sağ üstteki düğmenin simgesi |
| `icons` | Eşleme: duruma, moda, seçeneğe ya da düğmeye göre simge. Hem büyük ikona hem alttaki kutulara uygulanır |

```yaml
type: custom:lemur-climate-card
entity: climate.salon_klima
icons:
  cool: mdi:snowflake-variant      # mod
  heat: mdi:radiator
  low: mdi:speedometer-slow        # fan hızı
power_icon: mdi:power-standby
```

`icons` anahtarları: klimada mod (`cool`, `heat`, `dry`...) ve fan hızı (`low`, `high`...); petekte durum (`heating`, `idle`, `off`, `lost`, `sensor`);
sensörde bölge (`zone0` … `zone4`, `lost`); süpürgede durum (`cleaning`, `docked`, `charging`, `returning`, `error`...) ve düğmeler (`stop`, `home`, `locate`);
enerjide `export`, `self`, `import`; güvenlikte `open`, `danger`, `motion`, `clear`, alarm ve kilit durumları, düğmeler (`arm_home`, `arm_away`, `disarm`, `lock`, `unlock`, `open`);
odada düğmeler (`lights`, `climate`, `extra`); bilgi kutularında varlık kimliği (`sensor.salon_nem: mdi:water`).

## Teşekkür

Kartın görsel fikri, Anashost'un [HA-Animated-cards](https://github.com/Anashost/HA-Animated-cards) çalışmasından ilham aldı. Teşekkürler! Bu karttaki kod ve tasarım ayrıntıları bu projeye özgüdür; o projeden kod alınmamıştır.

## Lisans

MIT
