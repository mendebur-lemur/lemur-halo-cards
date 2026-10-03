# Lemur Climate Card

Türkçe · **[English](README.en.md)**

Klima ve petek için Home Assistant kartı. Odanın sıcaklığını, nemini ve hissedilen konforu tek bakışta gösterir; ikonun arkasındaki renkli hale odanın serin mi, konforlu mu, sıcak mı olduğunu söyler.

> Geliştirme aşamasında. İlk sürüm henüz yayınlanmadı.

- **Başka eklenti gerekmez.** HACS'tan tek seferde kurulur; mushroom, card-mod ya da başka bir kart gerektirmez.
- **Her şey kart ayarlarından.** Kontrol edilecek cihazı ve sıcaklık/nem bilgisinin nereden alınacağını editörden seçersin. YAML yazman gerekmez.
- **Harici sensör zorunlu değil.** Sensör seçmezsen sıcaklık ve nem cihazın kendisinden gelir.
- **Hazır ayarlarla gelir, istersen değiştirirsin.** Konfor aralığı ve renk eşiklerinin varsayılan değerleri var; "Gelişmiş" bölümünden kendine göre ayarlayabilirsin.
- **Klima ve petek.** Klimada mod ve fan hızı seçimi; petekte birden fazla vanayı birlikte açıp kapatma ve hedef sıcaklık.

## Kurulum

1. HACS → sağ üstteki menü → Özel depolar → `https://github.com/mendebur-lemur/lemur-climate-card`, kategori **Dashboard**.
2. Listede **Lemur Climate Card**'ı bul, İndir.
3. Tarayıcıyı yenile (Ctrl+F5). Panoda "Kart ekle" → **Lemur İklim Kartı**.

## Ayarlar

| Ayar | Varsayılan | Açıklama |
|---|---|---|
| `entity` | — | Kontrol edilecek cihaz (zorunlu) |
| `entities` | — | Birlikte kontrol edilecek diğer cihazlar (örneğin aynı odadaki ikinci petek) |
| `name` | cihaz adı | Kartta görünen ad |
| `kind` | `auto` | `auto`, `ac` (klima) ya da `radiator` (petek) |
| `temperature_sensor` | — | Boşsa sıcaklık cihazdan gelir |
| `humidity_sensor` | — | Boşsa nem cihazdan gelir; o da yoksa nem gösterilmez |
| `outdoor_sensor` | — | Petek renk eşiklerini dış sıcaklığa göre kaydırır |
| `comfort` | 16 / 19 / 29 / 31.5 | Hissedilen sıcaklık eşikleri (çok soğuk / serin / biraz sıcak / sıcak) |
| `language` | `auto` | `auto`, `tr`, `en` |

Tam liste ve örnekler ilk sürümle eklenecek.

## Lisans

MIT
