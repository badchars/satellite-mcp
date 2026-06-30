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
  <img src="https://img.shields.io/badge/tools-171-ef4444" alt="171 alata">
  <img src="https://img.shields.io/badge/protocol-MCP-8b5cf6" alt="MCP kompatibilan">
  <img src="https://img.shields.io/badge/config-zero-22c55e" alt="nula konfiguracije">
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
  <strong>Bosanski</strong> |
  <a href="README.ar.md">العربية</a> |
  <a href="README.no.md">Norsk</a> |
  <a href="README.pt-BR.md">Portugues (Brasil)</a> |
  <a href="README.th.md">ไทย</a> |
  <a href="README.tr.md">Turkce</a> |
  <a href="README.uk.md">Українська</a> |
  <a href="README.bn.md">বাংলা</a> |
  <a href="README.el.md">Ελληνικά</a> |
  <a href="README.vi.md">Tieng Viet</a>
</p>

---

# satellite-mcp

**Full-Spectrum GEOINT MCP Server** -- 171 alat u 27 kategorija za geoprostornu izvidnicu, satelitsko snimanje, monitoring okoline i analizu odbrane.

satellite-mcp je [Model Context Protocol](https://modelcontextprotocol.io/) (MCP) server koji opskrbljuje AI asistente sveobuhvatnim sposobnostima za geografsku obavjestajnu djelatnost (GEOINT). Od Sentinel-2 multispektralnih podataka, preko pracenja pomorskog saobracaja u realnom vremenu, do pracenja konflikata -- sve putem jednog, standardiziranog interfejsa.

## Brzi pocetak

### Instalacija putem npm

```bash
npm install -g satellite-mcp
```

### Koristenje sa npx

```bash
npx satellite-mcp
```

### Konfiguracija za Claude Desktop

Dodajte sljedece u vasu `claude_desktop_config.json` datoteku:

```json
{
  "mcpServers": {
    "satellite": {
      "command": "npx",
      "args": ["-y", "satellite-mcp"],
      "env": {
        "SENTINEL_HUB_TOKEN": "vas-token",
        "NASA_FIRMS_API_KEY": "vas-kljuc",
        "NASA_EARTHDATA_TOKEN": "vas-token"
      }
    }
  }
}
```

### CLI komande

```bash
# Izlistaj sve dostupne alate
npx satellite-mcp --list

# Pokreni pojedinacni alat
npx satellite-mcp --tool <ime-alata> '<json-parametri>'

# Prikazi pomoc
npx satellite-mcp --help
```

## Kategorije alata

| Kategorija | Alati | Opis |
|------------|-------|------|
| Sentinel-2 | 8 | Multispektralno satelitsko snimanje (ESA Copernicus) |
| Landsat | 7 | Dugorocni podaci posmatranja Zemlje (USGS/NASA) |
| NASA FIRMS | 6 | Detekcija pozara i termalnih izvora u realnom vremenu |
| NASA Earth | 7 | Podaci nauke o Zemlji i prirodni dogadjaji |
| Nocna svjetla | 5 | Podaci o nocnim svjetlima (VIIRS/DMSP) |
| Planet Labs | 4 | Visoko-rezolucijsko dnevno snimanje |
| Vazduhoplovna izvidnica | 10 | Pracenje letova i nadzor vazdusnog prostora |
| Pomorska izvidnica | 8 | Pomorski saobracaj i AIS pracenje |
| Vojska i odbrana | 8 | Odbrambena infrastruktura i kretanje trupa |
| Svemir i orbita | 6 | Pracenje satelita i svjest o situaciji u svemiru |
| Konflikti i dogadjaji | 6 | Pracenje konflikata i podaci o dogadjajima (ACLED) |
| Okolina | 6 | Monitoring okoline i klimatski podaci |
| Kriticna infrastruktura | 6 | Elektrane, cjevovodi i telekomunikacije |
| Sankcije | 5 | Liste sankcija i provjera uskladjenosti |
| Teren | 6 | Visinski modeli i analiza terena |
| Cyber-Geo | 6 | Geolokacija cyber prijetnji |
| Populacija | 5 | Gustina stanovnistva i demografija |
| Poljoprivreda | 5 | Zdravlje usjeva i indeksi vegetacije |
| Humanitarno | 5 | Pomoc u katastrofama i podaci o izbjeglicama |
| Okean | 5 | Povrsina mora i okeanografija |
| Trgovina | 5 | Trgovacke rute i aktivnosti luka |
| Seizmika | 5 | Pracenje zemljotresa i seizmicki podaci |
| OSM | 8 | OpenStreetMap geoprostorni upiti |
| Geokodiranje | 8 | Direktno/inverzno geokodiranje |
| Spektralna analiza | 8 | Proracuni pojaseva i analiza indeksa |
| Detekcija promjena | 6 | Vremenski usporedbe i analiza promjena |
| Vrijeme | 6 | Vremenski podaci i meteoroloske prognoze |

## API kljucevi

Vecina alata radi sa besplatnim javnim API-jima. Za prosireni pristup mozete postaviti sljedece API kljuceve kao varijable okruzenja:

| Varijabla | Provajder | Potreban |
|-----------|-----------|----------|
| `SENTINEL_HUB_TOKEN` | Copernicus Data Space | Opcionalno |
| `NASA_FIRMS_API_KEY` | NASA FIRMS | Opcionalno |
| `NASA_EARTHDATA_TOKEN` | NASA Earthdata | Opcionalno |
| `PLANET_API_KEY` | Planet Labs | Opcionalno |
| `AVIATIONSTACK_API_KEY` | AviationStack | Opcionalno |
| `MARINETRAFFIC_API_KEY` | MarineTraffic | Opcionalno |
| `ACLED_API_KEY` | ACLED | Opcionalno |
| `ORS_API_KEY` | OpenRouteService | Opcionalno |
| `OPENWEATHER_API_KEY` | OpenWeatherMap | Opcionalno |

Svi API kljucevi su opcionalni. Kada kljucevi nedostaju, alati vracaju opisne poruke greske.

## Arhitektura

```
satellite-mcp/
  src/
    index.ts              # Ulazna tacka i CLI
    protocol/
      tools.ts            # MCP registracija alata
    providers/
      sentinel/           # Sentinel-2 provajder
      landsat/            # Landsat provajder
      firms/              # NASA FIRMS provajder
      ...                 # 27 direktorija provajdera
    utils/
      cache.ts            # TTL kes
      rate-limiter.ts     # Ogranicavanje brzine
```

- **Runtime:** Bun (razvoj), Node.js (npm objavljivanje)
- **Transport:** stdio
- **Zavisnosti:** @modelcontextprotocol/sdk, zod
- **Obrazac:** Svaki provajder u svom direktoriju pod `src/providers/`

## Doprinos

Doprinosi su dobrodosli. Molimo prvo otvorite issue da biste razgovarali o planiranim izmjenama.

1. Forkujte repozitorij
2. Kreirajte feature branch (`git checkout -b feature/moj-feature`)
3. Commitujte svoje izmjene (`git commit -m 'feat: novi feature'`)
4. Pushajte branch (`git push origin feature/moj-feature`)
5. Otvorite Pull Request

## Licenca

MIT
