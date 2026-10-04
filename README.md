# Lemur Halo Cards

Türkçe · **[English](README.en.md)**

Home Assistant için hareketli, renkli haleli sekiz kartlık bir aile. Her kartta ikon köşede durur, arkasındaki hale cihazın durumunu renkle anlatır: oda serin mi sıcak mı, hava temiz mi, robot temizliyor mu, kapı açık mı. Panona bakınca neyin yolunda olmadığını okumadan görürsün.

![Lemur Halo Cards kullanımda](https://raw.githubusercontent.com/mendebur-lemur/lemur-halo-cards/main/docs/images/tr/demo.webp)

**Hızlı kurulum:** [HACS'ta aç](https://my.home-assistant.io/redirect/hacs_repository/?owner=mendebur-lemur&repository=lemur-halo-cards&category=plugin) → İndir → tarayıcıyı yenile → panoda **Kart ekle** → "Lemur" ara. Adım adım anlatım ve videolar [aşağıda](#kurulum).

- **Renk her şeyi anlatır.** Klimada hissedilen sıcaklık, sensörde hava kalitesi, enerjide şebekeden ne kadar çektiğin, güvenlikte açık kapı ya da su sızıntısı. Yeşil her şey yolunda, sarı dikkat, kırmızı sorun demek.
- **Başka eklenti gerekmez.** HACS'tan tek seferde kurulur; mushroom, card-mod ya da başka bir kart istemez. Sekiz kartın hepsi tek dosyada gelir.
- **Her şey kart ayarlarından.** Cihazları ve sensörleri görsel düzenleyicide seçersin, YAML yazman gerekmez. Eşikler ve renkler hazır gelir.
- **Renkler ve simgeler senin.** Her durumun rengini ve halenin nasıl hareket edeceğini (yavaş nefes, hızlı nabız, yanıp sönme, sabit) sen seçebilirsin; istersen kartı tek renge sabitlersin. Simgeler de duruma göre değiştirilebilir.
- **Türkçe ve İngilizce.** Kart, Home Assistant'ın diline göre konuşur.
- **Eski tabletlerde de akıcı.** Animasyon hafiftir, eski iPad'lerde (iOS 12) de çalışır. Cihazda hareket azaltma açıksa hale durur.
- **Bağlantı kopunca haber verir.** Cihaz erişilemez olduğunda kart "Bağlantı yok" yazar, hale kırmızı yanıp söner.

## İçindekiler

- [Kurulum](#kurulum)
  - [1. HACS ile indir](#1-hacs-ile-indir)
  - [2. Kartı panona ekle](#2-kartı-panona-ekle)
  - [3. Kartı ayarla](#3-kartı-ayarla)
- [Kartlar](#kartlar)
  - [İklim](#i̇klim)
  - [Sensör](#sensör)
  - [Hava](#hava)
  - [Robot süpürge ve oda](#robot-süpürge-ve-oda)
  - [Enerji ve güvenlik](#enerji-ve-güvenlik)
  - [Işık ve kilit](#işık-ve-kilit)
- [Renkler ve hale](#renkler-ve-hale)
- [Bütün kartlarda ortak](#bütün-kartlarda-ortak)
- [Simgeler](#simgeler)
- [Güncelleme](#güncelleme)
- [Sorun giderme](#sorun-giderme)
- [Lemur ailesi](#lemur-ailesi)

## Kurulum

Gerekenler: Home Assistant 2024.8 ya da daha yeni bir sürüm ve [HACS](https://hacs.xyz/docs/use/). Başka kart, tema ya da eklenti gerekmez.

### 1. HACS ile indir

En kolay yol bu düğme. Home Assistant adresini bir kez sorar, sonra depoyu doğrudan HACS'ta açar:

[![HACS'ta aç](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=mendebur-lemur&repository=lemur-halo-cards&category=plugin)

1. Açılan pencerede **Ekle**'ye bas (depo HACS'a eklenir).
2. Sağ alttaki **İndir** düğmesine bas, sürüm penceresinde tekrar **İndir**.
3. Tarayıcıyı **Ctrl+F5** ile yenile (telefonda uygulamayı kapatıp aç).

Home Assistant'ı yeniden başlatman gerekmez. HACS kartı panolarına kaynak olarak kendisi ekler.

<details>
<summary>Düğme çalışmazsa: elle ekleme</summary>

1. Sol menüden **HACS**'ı aç.
2. Sağ üstteki **⋮** menüsü → **Özel depolar** (*Custom repositories*).
3. **Depo** alanına şu adresi yapıştır:
   `https://github.com/mendebur-lemur/lemur-halo-cards`
4. **Tür** olarak **Dashboard** seç ve **Ekle**'ye bas. Pencereyi kapat.
5. HACS'ın arama kutusuna **Lemur Halo Cards** yaz, sonuca tıkla.
6. **İndir** → **İndir**, ardından tarayıcıyı Ctrl+F5 ile yenile.

</details>

### 2. Kartı panona ekle

1. Panonu aç, sağ üstteki **✏️ (Düzenle)** düğmesine bas.
2. Bir bölümdeki **+** düğmesine bas, arama kutusuna **Lemur** yaz. Sekiz kart önizlemeleriyle görünür.
3. İstediğin kartı seç. Kart evindeki uygun bir cihazla açılır; **Cihaz** alanından kendi cihazını seç.
4. **Kaydet** → sağ üstte **Bitti**.

Videoda iklim kartı ekleniyor ve cihaz olarak salon kliması seçiliyor:

![Kartı panoya ekleme](https://raw.githubusercontent.com/mendebur-lemur/lemur-halo-cards/main/docs/images/tr/step-add-card.webp)

### 3. Kartı ayarla

Kartın her ayarı görsel düzenleyicide. Düzenleme modunda karta tıklayınca açılır:

- Üstte cihaz ve sensörler (örneğin iklim kartında oda sıcaklığı ve nem sensörü).
- **Görünüm** bölümünde sağ üstteki düğme, hale, kutulardaki adlar, hangi kutuların görüneceği ve simgeler.
- Karta göre eşik bölümleri (konfor eşikleri, sensör sınırları ve renkleri) ve **Gelişmiş** bölümünde bağlantı kontrolü.

Videoda kutulara adlar yazdırılıyor ve büyük simge değiştiriliyor:

![Kartı ayarlama](https://raw.githubusercontent.com/mendebur-lemur/lemur-halo-cards/main/docs/images/tr/step-settings.webp)

YAML ile eklemek istersen en kısa hali:

```yaml
type: custom:lemur-climate-card
entity: climate.salon_klima
```

Varsayılanla aynı olan ayarlar YAML'a yazılmaz, kart sade kalır.

## Kartlar

Kart seçicide hepsi **Lemur** ile başlar. Aşağıdaki videolar gerçek bir Home Assistant'ta çekildi.

| Kart | Tür | Hale neyi anlatır |
|---|---|---|
| İklim | `custom:lemur-climate-card` | Klima: hissedilen sıcaklık (nemle birlikte). Petek: oda sıcaklığı |
| Sensör | `custom:lemur-sensor-card` | Herhangi bir sayısal sensör; sınırlar ve renkler sensörün türüne göre hazır |
| Hava | `custom:lemur-air-card` | Hava temizleyici ve yanındaki PM2.5 / CO₂ / VOC sensörü |
| Robot süpürge | `custom:lemur-vacuum-card` | Temizliyor, eve dönüyor, şarj oluyor, hata |
| Enerji | `custom:lemur-energy-card` | Güneş, ev, şebeke, batarya; şebekeye veriyor mu, çekiyor mu |
| Güvenlik | `custom:lemur-security-card` | Kapı, pencere, hareket, su ve duman sensörleri; alarm paneli; kilit |
| Oda | `custom:lemur-room-card` | Odanın konforu; ışıklar, iklim cihazı ve bir ek cihaz tek kartta |
| Işık | `custom:lemur-light-card` | Lambanın kendi rengi ve parlaklığı |

### İklim

Klima için hale, odanın hissedilen sıcaklığını gösterir: nem yüksekse aynı derece daha sıcak sayılır. Mavi serin, yeşil konforlu, turuncu sıcak, kırmızı çok sıcak. Petekte renk oda sıcaklığından gelir ve dış sıcaklık arttıkça eşikler kayar. Altta hedef sıcaklık, mod ve fan hızı.

![İklim kartı](https://raw.githubusercontent.com/mendebur-lemur/lemur-halo-cards/main/docs/images/tr/climate.webp)

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

### Sensör

Herhangi bir sayısal sensör. Sensörün türüne göre (CO₂, PM2.5, PM10, VOC, hava kalitesi indeksi, sıcaklık, nem, pil, güç, ışık) sınırlar ve renkler hazır gelir; istersen kendi sınırlarını yazarsın. Altta en çok üç ek değer gösterilir; sağ üstteki düğmeye bir anahtar bağlanabilir.

![Sensör kartı](https://raw.githubusercontent.com/mendebur-lemur/lemur-halo-cards/main/docs/images/tr/sensor.webp)

```yaml
type: custom:lemur-sensor-card
entity: sensor.calisma_co2                  # sensör türünden hazır ayar seçilir (CO₂)
extra: [sensor.calisma_sicaklik, sensor.calisma_nem]
```

### Hava

Hava temizleyici (ya da fan) ve hava kalitesi sensörü bir arada. Hale sensörün değerine göre renk alır; temizleyici çalıştıkça kırmızıdan yeşile döner. Altta hız ve program.

![Hava kartı](https://raw.githubusercontent.com/mendebur-lemur/lemur-halo-cards/main/docs/images/tr/air.webp)

```yaml
type: custom:lemur-air-card
entity: fan.salon_hava_temizleyici
sensor: sensor.salon_pm25
```

### Robot süpürge ve oda

**Robot süpürge:** temizlerken yeşil, eve dönerken mavi, şarj olurken buz mavisi, hata olunca kırmızı yanıp söner. Sağ üstte başlat / duraklat, altta durdur, eve dön, emiş gücü ya da bul. Cihazın desteklemediği düğmeler gösterilmez.

**Oda:** bir odanın ışıkları, iklim cihazı ve bir ek cihazı (TV gibi) tek kartta. Hale odanın konforunu gösterir. Sağ üstteki düğme bir şey açıksa hepsini kapatır, değilse ışıkları açar.

![Robot süpürge ve oda kartı](https://raw.githubusercontent.com/mendebur-lemur/lemur-halo-cards/main/docs/images/tr/vacuum-room.webp)

```yaml
type: custom:lemur-vacuum-card
entity: vacuum.alt_kat
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

### Enerji ve güvenlik

**Enerji:** güneş, ev, şebeke ve batarya. Şebekeye verirken ya da kendine yeterken yeşil; şebekeden çektikçe sarı, turuncu, kırmızı. Şebeke sensörün yoksa çekiş tüketimden hesaplanır.

**Güvenlik:** kapı, pencere, hareket, su ve duman sensörlerini bir grup olarak izler. Hepsi kapalıyken yeşil, açık bir şey varsa sarı, su ya da duman varsa kırmızı yanıp söner. Alarm paneli ve kilit de olur. Kilidi açmak ve alarmı kapatmak iki dokunuş ister.

![Enerji ve güvenlik kartı](https://raw.githubusercontent.com/mendebur-lemur/lemur-halo-cards/main/docs/images/tr/energy-security.webp)

```yaml
type: custom:lemur-energy-card
solar_power: sensor.gunes_uretim
home_power: sensor.ev_tuketim
grid_power: sensor.sebeke                   # + şebekeden çekiş, − şebekeye veriş
battery_soc: sensor.batarya
```

```yaml
type: custom:lemur-security-card
entity: binary_sensor.mutfak_su
entities: [binary_sensor.balkon_kapi, binary_sensor.yatak_pencere]
name: Mutfak ve balkon
```

### Işık ve kilit

**Işık:** hale, lambanın kendi rengini alır; parlaklık arttıkça hale de parlar. Altta parlaklık, renk sıcaklığı ve efekt. Birden fazla lamba birlikte yönetilebilir.

**Kilit:** kilitliyken yeşil, açıkken sarı. Destekleyen kilitlerde **Kapıyı aç** düğmesi de çıkar.

![Işık ve kilit kartı](https://raw.githubusercontent.com/mendebur-lemur/lemur-halo-cards/main/docs/images/tr/light-lock.webp)

```yaml
type: custom:lemur-light-card
entity: light.salon_lamba
entities: [light.salon_serit]               # isteğe bağlı, birlikte yönetilir
```

```yaml
type: custom:lemur-security-card
entity: lock.on_kapi
```

## Renkler ve hale

Her kartın rengi ve halenin hareketi değiştirilebilir. Kart düzenleyicisinde **Renkler ve hale** bölümü:

- **Kartın rengi:** kartı tek renge sabitler (boşsa renk duruma göre değişir).
- **Hale hareketi:** *Yavaş nefes* (varsayılan), *Hızlı nabız*, *Yanıp söner*, *Sabit* ya da *Hale yok*.
- **Durumlara göre renk ve hale:** kartın her durumu için ayrı renk ve hareket. Örneğin klima konforluyken mor ve hızlı, çok sıcakken pembe yanıp sönsün.

Renk seçicide Home Assistant'ın renkleri hazır; aramaya `#ff8800` gibi bir renk yazarsan o da olur. Boş bıraktığın her şey kartın kendi seçiminde kalır.

![Özel renkler](https://raw.githubusercontent.com/mendebur-lemur/lemur-halo-cards/main/docs/images/tr/custom.webp)

Ayarlamak bir dakika sürer:

![Renkleri ayarlama](https://raw.githubusercontent.com/mendebur-lemur/lemur-halo-cards/main/docs/images/tr/step-colors.webp)

YAML ile:

```yaml
type: custom:lemur-climate-card
entity: climate.salon_klima
color: teal                  # isteğe bağlı: kartın tek rengi
effect: still                # isteğe bağlı: auto, breathe, pulse, blink, still, none
tones:
  comfort: { color: deep-purple, effect: pulse }
  hot: { color: '#ff3b6b', effect: blink }
  off: { color: grey }
```

Öncelik: durumun kendi ayarı → kartın rengi / hareketi → kartın varsayılanı. "Bağlantı yok" uyarısı kartın tek renginden etkilenmez (görünür kalsın diye); istersen `tones.lost` ile değiştirebilirsin.

Renk olarak Home Assistant renk adları (`red`, `pink`, `purple`, `deep-purple`, `indigo`, `blue`, `light-blue`, `cyan`, `teal`, `green`, `light-green`, `lime`, `yellow`, `amber`, `orange`, `deep-orange`, `brown`, `grey`, `blue-grey`, `black`, `white`, `primary`, `accent`), `#rrggbb` ya da `[r, g, b]` yazılabilir.

| Kart | `tones` anahtarları |
|---|---|
| İklim (klima) | `cold`, `comfort`, `warm`, `hot`, `off`, `lost` |
| İklim (petek) | `very_cold`, `cold`, `comfort`, `warm`, `hot`, `heating`, `off`, `lost` |
| Sensör | `zone0` … `zone4` (sensörün bölgeleri), `lost` |
| Hava | `zone0` … `zone4` (sensör varsa), `on`, `off`, `lost` |
| Robot süpürge | `cleaning`, `returning`, `charging`, `docked`, `paused`, `idle`, `error`, `lost` |
| Enerji | `export`, `self`, `import_low`, `import_mid`, `import_high`, `producing`, `nodata`, `lost` |
| Güvenlik | sensörler: `clear`, `open`, `motion`, `danger`; alarm: `disarmed`, `armed`, `arming`, `triggered`; kilit: `locked`, `unlocked`, `moving`, `jammed`; hepsinde `lost` |
| Oda | `cold`, `comfort`, `warm`, `hot` (sıcaklık varsa), `on`, `off`, `lost` |
| Işık | `on` (boşsa lambanın kendi rengi), `off`, `lost` |

## Bütün kartlarda ortak

İkona ya da isme dokununca Home Assistant'ın ayrıntı penceresi açılır. Sıcaklıklar Home Assistant'ın birimiyle (°C / °F) gösterilir.

| Ayar | Varsayılan | Açıklama |
|---|---|---|
| `name` | cihaz adı | Kartta görünen ad |
| `icon` | duruma göre | Büyük simgeyi sabitler |
| `show_power` | `true` | Sağ üstteki düğme |
| `show_halo` | `true` | Hale (parıltı) |
| `show_labels` | `false` | Alttaki kutularda simgenin yanında adı da yaz |
| `color` | — | Kartın tek rengi ([Renkler ve hale](#renkler-ve-hale)) |
| `effect` | `auto` | Hale hareketi: `auto`, `breathe`, `pulse`, `blink`, `still`, `none` |
| `tones` | — | Durum başına renk ve hareket |
| `last_seen_sensor` | — | Son görülme zamanını tutan sensör (örneğin Zigbee2MQTT'nin `sensor.xxx_last_seen`); 2 saatten eskiyse "Bağlantı yok" |
| `stale_after` | `0` | Son görülme sınırı (saniye). Son görülme sensörü yoksa: cihazın durumu bu kadar süre hiç değişmezse "Bağlantı yok" (sadece sürekli değişen cihazlarda kullan) |
| `language` | `auto` | `auto`, `tr`, `en` |

Her kartın kendine özgü ayarları kart düzenleyicisinde görünür.

## Simgeler

Bütün simgeler değiştirilebilir (kart düzenleyicisinde **Görünüm** bölümü):

| Ayar | Ne yapar |
|---|---|
| `icon` | Büyük simge her zaman bu olur |
| `icon_on` / `icon_off` | Cihaz açıkken / kapalıyken büyük simge |
| `power_icon` | Sağ üstteki düğmenin simgesi |
| `icons` | Eşleme: duruma, moda, seçeneğe ya da düğmeye göre simge. Hem büyük simgeye hem alttaki kutulara uygulanır |

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

## Güncelleme

Yeni sürüm çıkınca HACS'ta ve **Ayarlar** sayfasında güncelleme bildirimi görünür.

1. **HACS → Lemur Halo Cards → ⋮ → Yeniden indir** (ya da bildirimdeki **Güncelle**).
2. Tarayıcıyı **Ctrl+F5** ile (telefonda uygulamayı kapatıp açarak) yenile; yoksa eski kart önbellekten gelebilir.

Kart ayarların güncellemede değişmez.

## Sorun giderme

- **Kart seçicide "Lemur" aratınca kart çıkmıyor ya da "Özel öğe yok" hatası var.** Tarayıcıyı Ctrl+F5 ile yenile. Hâlâ yoksa **Ayarlar → Panolar → ⋮ → Kaynaklar**'da `/hacsfiles/lemur-halo-cards/lemur-halo-cards.js` satırı olmalı (tür: JavaScript modülü). Panoların YAML modundaysa bu satırı `resources` altına kendin ekle.
- **Kart "Bağlantı yok" diyor.** Cihaz Home Assistant'ta erişilemez görünüyor. `last_seen_sensor` ya da `stale_after` ayarladıysan sınırı kontrol et.
- **Hale hareket etmiyor.** Cihazında hareket azaltma (Reduce Motion) açıksa hale bilerek durur. `show_halo: false` ise hale hiç görünmez.
- **Telefonda eski sürüm görünüyor.** Uygulamayı tamamen kapatıp aç; olmazsa uygulamanın ayarlarından ön yüz önbelleğini temizle.
- **Hâlâ çözülmedi mi?** [Sorun bildir](https://github.com/mendebur-lemur/lemur-halo-cards/issues); Home Assistant sürümünü, tarayıcıyı ve kartın YAML'ını yazarsan hızlı bakarız.

## Lemur ailesi

Üçü de birbirinden bağımsız kurulur; birlikte kurulunca birbirini tamamlar.

| | Ne yapar | Kurulum |
|---|---|---|
| **[Lemur Home Dashboard](https://github.com/mendebur-lemur/lemur-home-dashboard)** | Tek satırla kurulan, kendi yönetim paneli olan hazır tablet panosu. Odalar, ışıklar, senaryolar, iklim ve medya evdeki alanlardan kendiliğinden gelir. Panodaki iklim ve süpürge kartları Halo Cards'tandır ve pakete gömülü gelir. | [![HACS'ta aç](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=mendebur-lemur&repository=lemur-home-dashboard&category=integration) |
| **[Lemur Light Effect Card](https://github.com/mendebur-lemur/lemur-light-effect-card)** | Efekt destekleyen bütün ışıkları oda oda yöneten efekt ekranı. | [![HACS'ta aç](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=mendebur-lemur&repository=lemur-light-effect-card&category=integration) |
| **Lemur Halo Cards** (bu depo) | Durumu renkli haleyle anlatan sekiz kart: iklim, sensör, hava, süpürge, enerji, güvenlik, ışık ve kilit. | [![HACS'ta aç](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=mendebur-lemur&repository=lemur-halo-cards&category=plugin) |

## Teşekkür

Kartın görsel fikri, Anashost'un [HA-Animated-cards](https://github.com/Anashost/HA-Animated-cards) çalışmasından ilham aldı. Teşekkürler! Bu karttaki kod ve tasarım ayrıntıları bu projeye özgüdür; o projeden kod alınmamıştır.

## Lisans

MIT
