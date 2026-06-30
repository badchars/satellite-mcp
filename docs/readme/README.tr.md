<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="../../.github/banner-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="../../.github/banner-light.svg">
    <img alt="satellite-mcp" src="../../.github/banner-dark.svg" width="600">
  </picture>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/satellite-mcp"><img src="https://img.shields.io/npm/v/satellite-mcp.svg" alt="npm version"></a>
  <a href="https://github.com/AumLabs/satellite-mcp/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="license"></a>
  <img src="https://img.shields.io/badge/tools-171-ef4444" alt="171 arac">
  <img src="https://img.shields.io/badge/protocol-MCP-8b5cf6" alt="MCP uyumlu">
  <img src="https://img.shields.io/badge/config-zero-22c55e" alt="sifir yapilandirma">
</p>

<p align="center">
  <a href="../../README.md">English</a> |
  <a href="README.zh.md">简体中文</a> |
  <a href="README.zh-TW.md">繁體中文</a> |
  <a href="README.ko.md">한국어</a> |
  <a href="README.de.md">Deutsch</a> |
  <a href="README.es.md">Espanol</a> |
  <a href="README.fr.md">Francais</a> |
  <a href="README.it.md">Italiano</a> |
  <a href="README.da.md">Dansk</a> |
  <a href="README.ja.md">日本語</a> |
  <a href="README.pl.md">Polski</a> |
  <a href="README.ru.md">Русский</a> |
  <a href="README.bs.md">Bosanski</a> |
  <a href="README.ar.md">العربية</a> |
  <a href="README.no.md">Norsk</a> |
  <a href="README.pt-BR.md">Portugues (Brasil)</a> |
  <a href="README.th.md">ไทย</a> |
  <strong>Turkce</strong> |
  <a href="README.uk.md">Українська</a> |
  <a href="README.bn.md">বাংলা</a> |
  <a href="README.el.md">Ελληνικά</a> |
  <a href="README.vi.md">Tieng Viet</a>
</p>

---

# satellite-mcp

**Full-Spectrum GEOINT MCP Server** -- Jeo-uzamsal keşif, uydu goruntuleme, cevre izleme ve savunma analizi icin 27 kategoride 171 arac.

satellite-mcp, yapay zeka asistanlarini kapsamli cografi istihbarat (GEOINT) yetenekleriyle donatan bir [Model Context Protocol](https://modelcontextprotocol.io/) (MCP) sunucusudur. Sentinel-2 multispektral verilerinden gercek zamanli deniz trafigi takibine, catisma izlemesine kadar -- hepsi tek bir standartlastirilmis arayuz uzerinden.

## Hizli baslangic

### npm ile kurulum

```bash
npm install -g satellite-mcp
```

### npx ile kullanim

```bash
npx satellite-mcp
```

### Claude Desktop icin yapilandirma

Asagidakini `claude_desktop_config.json` dosyaniza ekleyin:

```json
{
  "mcpServers": {
    "satellite": {
      "command": "npx",
      "args": ["-y", "satellite-mcp"],
      "env": {
        "SENTINEL_HUB_TOKEN": "tokeniniz",
        "NASA_FIRMS_API_KEY": "anahtariniz",
        "NASA_EARTHDATA_TOKEN": "tokeniniz"
      }
    }
  }
}
```

### CLI komutlari

```bash
# Tum mevcut araclari listele
npx satellite-mcp --list

# Tek bir araci calistir
npx satellite-mcp --tool <arac-adi> '<json-parametreler>'

# Yardimi goruntule
npx satellite-mcp --help
```

## Arac kategorileri

| Kategori | Araclar | Aciklama |
|----------|---------|----------|
| Sentinel-2 | 8 | Multispektral uydu goruntuleme (ESA Copernicus) |
| Landsat | 7 | Uzun vadeli Dunya gozlem verileri (USGS/NASA) |
| NASA FIRMS | 6 | Gercek zamanli yangin ve isi kaynagi tespiti |
| NASA Earth | 7 | Yer bilimleri verileri ve dogal olaylar |
| Gece isiklari | 5 | Gece aydinlatma verileri (VIIRS/DMSP) |
| Planet Labs | 4 | Yuksek cozunurluklu gunluk goruntuleme |
| Havacilik istihbarati | 10 | Ucus takibi ve hava sahasi izleme |
| Denizcilik istihbarati | 8 | Deniz trafigi ve AIS takibi |
| Askeri ve savunma | 8 | Savunma altyapisi ve birlik hareketleri |
| Uzay ve yororunge | 6 | Uydu takibi ve uzay durumsal farkindaliği |
| Catismalar ve olaylar | 6 | Catisma izleme ve olay verileri (ACLED) |
| Cevre | 6 | Cevre izleme ve iklim verileri |
| Kritik altyapi | 6 | Enerji santralleri, boru hatlari ve telekomünikasyon |
| Yaptirimlar | 5 | Yaptirim listeleri ve uyumluluk kontrolu |
| Arazi | 6 | Yukseklik modelleri ve arazi analizi |
| Siber-Geo | 6 | Siber tehditlerin cografi konumlandirmasi |
| Nufus | 5 | Nufus yogunlugu ve demografi |
| Tarim | 5 | Urun sagligi ve bitki ortüsu indeksleri |
| Insani yardim | 5 | Afet mudahalesi ve multeci verileri |
| Okyanus | 5 | Deniz yuzeyi ve osinografi |
| Ticaret | 5 | Ticaret rotalari ve liman faaliyetleri |
| Sismik | 5 | Deprem izleme ve sismik veriler |
| OSM | 8 | OpenStreetMap jeo-uzamsal sorgulari |
| Jeokodlama | 8 | Ileri/geri jeokodlama |
| Spektral analiz | 8 | Bant hesaplamalari ve indeks analizi |
| Degisim tespiti | 6 | Zamansal karsilastirmalar ve degisim analizi |
| Hava durumu | 6 | Meteorolojik veriler ve hava tahminleri |

## API anahtarlari

Araclarin buyuk cogunlugu ucretsiz genel API'ler ile calisir. Genisletilmis erisim icin asagidaki API anahtarlarini ortam degiskenleri olarak ayarlayabilirsiniz:

| Degisken | Saglayici | Gerekli |
|----------|-----------|---------|
| `SENTINEL_HUB_TOKEN` | Copernicus Data Space | Istege bagli |
| `NASA_FIRMS_API_KEY` | NASA FIRMS | Istege bagli |
| `NASA_EARTHDATA_TOKEN` | NASA Earthdata | Istege bagli |
| `PLANET_API_KEY` | Planet Labs | Istege bagli |
| `AVIATIONSTACK_API_KEY` | AviationStack | Istege bagli |
| `MARINETRAFFIC_API_KEY` | MarineTraffic | Istege bagli |
| `ACLED_API_KEY` | ACLED | Istege bagli |
| `ORS_API_KEY` | OpenRouteService | Istege bagli |
| `OPENWEATHER_API_KEY` | OpenWeatherMap | Istege bagli |

Tum API anahtarlari istege baglidir. Anahtarlar eksik oldugunda, araclar aciklayici hata mesajlari dondurur.

## Mimari

```
satellite-mcp/
  src/
    index.ts              # Giris noktasi ve CLI
    protocol/
      tools.ts            # MCP arac kaydi
    providers/
      sentinel/           # Sentinel-2 saglayicisi
      landsat/            # Landsat saglayicisi
      firms/              # NASA FIRMS saglayicisi
      ...                 # 27 saglayici dizini
    utils/
      cache.ts            # TTL onbellek
      rate-limiter.ts     # Hiz sinirlandirma
```

- **Runtime:** Bun (gelistirme), Node.js (npm yayinlama)
- **Transport:** stdio
- **Bagimliliklar:** @modelcontextprotocol/sdk, zod
- **Desen:** Her saglayici `src/providers/` altinda kendi dizininde

## Katkida bulunma

Katkilar memnuniyetle karsilanir. Lutfen planladiginiz degisiklikleri tartismak icin once bir issue acin.

1. Repoyu forklayın (`Fork`)
2. Feature branch olusturun (`git checkout -b feature/benim-featureim`)
3. Degisikliklerinizi commitleyın (`git commit -m 'feat: yeni feature'`)
4. Branch'i pushlayın (`git push origin feature/benim-featureim`)
5. Pull Request acın

## Lisans

MIT
