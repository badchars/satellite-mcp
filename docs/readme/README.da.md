<p align="center">
  <a href="../../README.md">English</a> |
  <a href="README.zh.md">简体中文</a> |
  <a href="README.zh-TW.md">繁體中文</a> |
  <a href="README.ko.md">한국어</a> |
  <a href="README.de.md">Deutsch</a> |
  <a href="README.es.md">Español</a> |
  <a href="README.fr.md">Français</a> |
  <a href="README.it.md">Italiano</a> |
  <strong>Dansk</strong> |
  <a href="README.ja.md">日本語</a> |
  <a href="README.pl.md">Polski</a> |
  <a href="README.ru.md">Русский</a> |
  <a href="README.bs.md">Bosanski</a> |
  <a href="README.ar.md">العربية</a> |
  <a href="README.no.md">Norsk</a> |
  <a href="README.pt-BR.md">Português (Brasil)</a> |
  <a href="README.th.md">ไทย</a> |
  <a href="README.tr.md">Türkçe</a> |
  <a href="README.uk.md">Українська</a> |
  <a href="README.bn.md">বাংলা</a> |
  <a href="README.el.md">Ελληνικά</a> |
  <a href="README.hi.md">हिन्दी</a>
</p>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="../../.github/banner-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="../../.github/banner-light.svg">
    <img alt="satellite-mcp" src="../../.github/banner-dark.svg" width="600">
  </picture>
</p>

<h3 align="center">Full-Spectrum GEOINT MCP-server til AI-agenter.</h3>

<p align="center">
  Sentinel-2, Landsat, NASA FIRMS, natlys, fly- og skibsspooring, militaer- og forsvarsintelligens, konflikhaendelser, sanktioner, blockchain-geo, vejrdata &mdash; samlet i en enkelt MCP-server med 171 vaerktojer paa tvaers af 27 kategorier.<br>
  Din AI-agent faar <b>fuld-spektrum geospatial intelligens paa foresporgsel</b>, ikke snesevis af API'er og manuel datasammenligning.
</p>

<br>

<p align="center">
  <a href="#hurtig-start">Hurtig Start</a> &bull;
  <a href="#vaerktoejskategorier-27-kategorier--171-vaerktojer">Vaerktoejskategorier</a> &bull;
  <a href="#api-noegler">API-noegler</a> &bull;
  <a href="#arkitektur">Arkitektur</a> &bull;
  <a href="#bidrag">Bidrag</a> &bull;
  <a href="#licens">Licens</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/satellite-mcp"><img src="https://img.shields.io/npm/v/satellite-mcp.svg" alt="npm"></a>
  <a href="../../LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="Licens"></a>
  <img src="https://img.shields.io/badge/tools-171-ef4444" alt="171 Vaerktojer">
  <img src="https://img.shields.io/badge/MCP-compatible-8b5cf6" alt="MCP-kompatibel">
  <img src="https://img.shields.io/badge/config-zero-10b981" alt="Nul konfiguration">
</p>

---

## Oversigt

**satellite-mcp** er en Full-Spectrum GEOINT (Geospatial Intelligence) MCP-server der giver din AI-agent 171 vaerktojer paa tvaers af 27 kategorier via [Model Context Protocol](https://modelcontextprotocol.io). Fra satellitbilleder og branddetektion til flyspooring, skibstrafikanalyse, militaerintelligens og konfliktovervagning &mdash; agenten faar adgang til alt i en enkelt samtale.

---

## Hurtig Start

### Mulighed 1: npx (ingen installation)

```bash
npx satellite-mcp
```

### Mulighed 2: Global installation

```bash
npm install -g satellite-mcp
satellite-mcp
```

### Forbind til din AI-agent

<details open>
<summary><b>Claude Code</b></summary>

```bash
claude mcp add satellite-mcp -- npx satellite-mcp
```

</details>

<details>
<summary><b>Claude Desktop</b></summary>

Tilfoej til `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "satellite": {
      "command": "npx",
      "args": ["-y", "satellite-mcp"]
    }
  }
}
```

</details>

<details>
<summary><b>Cursor / Windsurf / andre MCP-klienter</b></summary>

Samme JSON-konfigurationsformat. Peg kommandoen til `npx satellite-mcp` eller din lokale installationssti.

</details>

---

## Vaerktoejskategorier (27 kategorier / 171 vaerktojer)

| Kategori | Vaerktojer | Beskrivelse |
|----------|------------|-------------|
| Sentinel-2 | 8 | Optiske satellitbilleder fra ESA Sentinel-2 |
| Landsat | 7 | Multispektrale billeder fra USGS Landsat-programmet |
| NASA FIRMS | 6 | Aktive brande og termiske anomalier i naer-realtid |
| NASA Earth | 7 | NASA jordobservationsdata og naturlige haendelser |
| Natlys | 5 | VIIRS-natlysdata for urbanisering og oekonomisk aktivitet |
| Planet Labs | 4 | Hoejoplosningsbilleder fra Planet Labs-konstellationen |
| Flyintelligens | 10 | Flyspooring, identifikation og rute-intelligens |
| Maritimintelligens | 8 | Skibsspooring, havneaktivitet og maritimt domaenesituationsbillede |
| Militaer og Forsvar | 8 | Forsvarsfaciliteter, deployeringer og militaer aktivitetsovervagning |
| Rum og Orbital | 6 | Satellitspooring, rumvejr og orbitalintelligens |
| Konflikt og Haendelser | 6 | Konfliktzoner, ACLED-haendelsesdata og voldsspooring |
| Miljo | 6 | Klima, luftkvalitet, skovtab og miljoovervagning |
| Kritisk Infrastruktur | 6 | Energi, transport og beskyttelse af kritisk infrastruktur |
| Sanktioner | 5 | Globale sanktionslister, handelsoverensstemmelse og kontroltjek |
| Terraen | 6 | Hojdedata, terrainanalyse og topografisk intelligens |
| Cyber-Geo | 6 | Geografisk lokalisering af cybertrusler og IP-geolokation |
| Befolkning | 5 | Demografiske data, befolkningstaethedsanalyse |
| Landbrug | 5 | Afgrodesundhed, vegetationsindeks og landbrugsovervagning |
| Humanitaer | 5 | Krisekortlaegning, flygtningestromme og humanitaer respons |
| Hav | 5 | Havoverfladetemperatur, straomme og havovervagning |
| Handel | 5 | Global handel, handelsruter og forsyningskaedeintelligens |
| Seismik | 5 | Jordskaelov, seismisk aktivitet og tektonisk overvagning |
| OSM | 8 | OpenStreetMap-data, infrastrukturopslag og geospatiale foresporgsler |
| Geokodning | 8 | Adresseopslag, omvendt geokodning og stedssoegning |
| Spektralanalyse | 8 | Multispektral og hyperspektral billedanalyse |
| Aendringsdetektion | 6 | Tidstemporal sammenligning og aendringsdetektion i satellitbilleder |
| Vejr | 6 | Aktuelle vejrforhold, prognoser og meteorologiske data |

---

## API-noegler

Mange vaerktojer fungerer uden API-noegler ved hjaelp af gratis tilgaengelige datakilder. Premium-datakilder kraever separate API-noegler der kan konfigureres som miljovariabler.

```bash
# Eksempler paa valgfrie API-noegler
export SENTINEL_API_KEY=your-key
export NASA_API_KEY=your-key
export PLANET_API_KEY=your-key
export OPENWEATHER_API_KEY=your-key
```

Alle noegler er valgfrie. Serveren degraderer graciost og returnerer beskrivende fejlmeddelelser naar en noegle mangler for et givent vaerktoej.

---

## Arkitektur

```
src/
  index.ts                # CLI-indgangspunkt og MCP-serveropsaetning
  protocol/
    tools.ts              # Vaerktoejsregister — alle 171 vaerktojer samlet her
  providers/
    sentinel/             # Sentinel-2 billedvaerktojer (8)
    landsat/              # Landsat billedvaerktojer (7)
    firms/                # NASA FIRMS brandvaerktojer (6)
    nasa-earth/           # NASA jordobservation (7)
    nightlights/          # VIIRS natlysvaerktojer (5)
    planet/               # Planet Labs vaerktojer (4)
    aircraft/             # Flyintelligensvaerktojer (10)
    maritime/             # Maritimintelligensvaerktojer (8)
    military/             # Militaer- og forsvarsvaerktojer (8)
    space/                # Rum- og orbitalvaerktojer (6)
    conflict/             # Konflikt- og haendelsesvaerktojer (6)
    environmental/        # Miljovaerktojer (6)
    infrastructure/       # Kritisk infrastrukturvaerktojer (6)
    sanctions/            # Sanktionsvaerktojer (5)
    terrain/              # Terraenvaerktojer (6)
    cyber-geo/            # Cyber-geo-vaerktojer (6)
    population/           # Befolkningsvaerktojer (5)
    agriculture/          # Landbrugsvaerktojer (5)
    humanitarian/         # Humanitaere vaerktojer (5)
    ocean/                # Havvaerktojer (5)
    trade/                # Handelsvaerktojer (5)
    seismic/              # Seismikvaerktojer (5)
    osm/                  # OpenStreetMap-vaerktojer (8)
    geocoding/            # Geokodningsvaerktojer (8)
    spectral/             # Spektralanalysevaerktojer (8)
    change-detection/     # Aendringsdetektionsvaerktojer (6)
    weather/              # Vejrvaerktojer (6)
```

**Designprincipper:**

- **27 udbydere, 1 server** &mdash; Hver datakilde er et uafhaengigt modul. Agenten vaelger hvilke vaerktojer der skal bruges baseret paa foresporgslen.
- **Hastighedsbegraensere pr. udbyder** &mdash; Hver datakilde har sin egen `RateLimiter`-instans kalibreret til den API's graenser.
- **TTL-caching** &mdash; Satellitdata, vejr og geopolitiske feeds caches for at undgaa overflodige API-kald.
- **Graceful degradering** &mdash; Manglende API-noegler crasher ikke serveren. Vaerktojer returnerer beskrivende fejlmeddelelser.
- **Nul konfiguration** &mdash; `npx satellite-mcp` &mdash; en kommando, ingen opsaetning kraevet.

---

## Bidrag

Bidrag er velkomne. Aaben en issue eller indsend en pull request.

---

## Licens

[MIT](../../LICENSE)

<p align="center">
  Bygget med TypeScript &bull; Drevet af Model Context Protocol
</p>
