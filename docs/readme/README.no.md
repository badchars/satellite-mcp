<p align="center">
  <a href="../../README.md">English</a> |
  <a href="README.zh.md">简体中文</a> |
  <a href="README.zh-TW.md">繁體中文</a> |
  <a href="README.ko.md">한국어</a> |
  <a href="README.de.md">Deutsch</a> |
  <a href="README.es.md">Español</a> |
  <a href="README.fr.md">Français</a> |
  <a href="README.it.md">Italiano</a> |
  <a href="README.da.md">Dansk</a> |
  <a href="README.ja.md">日本語</a> |
  <a href="README.pl.md">Polski</a> |
  <a href="README.ru.md">Русский</a> |
  <a href="README.bs.md">Bosanski</a> |
  <a href="README.ar.md">العربية</a> |
  <strong>Norsk</strong> |
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

<h3 align="center">Full-Spectrum GEOINT MCP-server for AI-agenter.</h3>

<p align="center">
  Sentinel-2, Landsat, NASA FIRMS, nattlys, fly- og skipssporing, militaer- og forsvarsetterretning, konflikthendelser, sanksjoner, blockchain-geo, vaerdata &mdash; samlet i en enkelt MCP-server med 171 verktoy paa tvers av 27 kategorier.<br>
  Din AI-agent faar <b>fullspektret geospatial etterretning paa forespoorsel</b>, ikke dusinvis av API-er og manuell datakorrelasjon.
</p>

<br>

<p align="center">
  <a href="#hurtigstart">Hurtigstart</a> &bull;
  <a href="#verktoykategorier-27-kategorier--171-verktoy">Verktoykategorier</a> &bull;
  <a href="#api-nokler">API-nokler</a> &bull;
  <a href="#arkitektur">Arkitektur</a> &bull;
  <a href="#bidra">Bidra</a> &bull;
  <a href="#lisens">Lisens</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/satellite-mcp"><img src="https://img.shields.io/npm/v/satellite-mcp.svg" alt="npm"></a>
  <a href="../../LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="Lisens"></a>
  <img src="https://img.shields.io/badge/tools-171-ef4444" alt="171 Verktoy">
  <img src="https://img.shields.io/badge/MCP-compatible-8b5cf6" alt="MCP-kompatibel">
  <img src="https://img.shields.io/badge/config-zero-10b981" alt="Null konfigurasjon">
</p>

---

## Oversikt

**satellite-mcp** er en Full-Spectrum GEOINT (Geospatial Intelligence) MCP-server som gir din AI-agent 171 verktoy paa tvers av 27 kategorier via [Model Context Protocol](https://modelcontextprotocol.io). Fra satellittbilder og branndeteksjon til flysporing, skipstrafikk-analyse, militaeretterretning og konfliktovervaaking &mdash; agenten faar tilgang til alt i en enkelt samtale.

---

## Hurtigstart

### Alternativ 1: npx (ingen installasjon)

```bash
npx satellite-mcp
```

### Alternativ 2: Global installasjon

```bash
npm install -g satellite-mcp
satellite-mcp
```

### Koble til din AI-agent

<details open>
<summary><b>Claude Code</b></summary>

```bash
claude mcp add satellite-mcp -- npx satellite-mcp
```

</details>

<details>
<summary><b>Claude Desktop</b></summary>

Legg til i `~/Library/Application Support/Claude/claude_desktop_config.json`:

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

Samme JSON-konfigurasjonsformat. Pek kommandoen til `npx satellite-mcp` eller din lokale installasjonssti.

</details>

---

## Verktoykategorier (27 kategorier / 171 verktoy)

| Kategori | Verktoy | Beskrivelse |
|----------|---------|-------------|
| Sentinel-2 | 8 | Optiske satellittbilder fra ESA Sentinel-2 |
| Landsat | 7 | Multispektrale bilder fra USGS Landsat-programmet |
| NASA FIRMS | 6 | Aktive branner og termiske anomalier i naer sanntid |
| NASA Earth | 7 | NASA jordobservasjonsdata og naturlige hendelser |
| Nattlys | 5 | VIIRS-nattlysdata for urbanisering og okonomisk aktivitet |
| Planet Labs | 4 | Hoyopplosningsbilder fra Planet Labs-konstellasjonen |
| Flyetterretning | 10 | Flysporing, identifikasjon og ruteetterretning |
| Maritim etterretning | 8 | Skipssporing, havneaktivitet og maritimt situasjonsbilde |
| Militaer og Forsvar | 8 | Forsvarsanlegg, deployeringer og militaer aktivitetsovervaaking |
| Rom og Orbital | 6 | Satellittsporing, romvaer og orbital etterretning |
| Konflikt og Hendelser | 6 | Konfliktsoner, ACLED-hendelsesdata og voldssporing |
| Miljo | 6 | Klima, luftkvalitet, skogtap og miljoovervaaking |
| Kritisk Infrastruktur | 6 | Energi, transport og beskyttelse av kritisk infrastruktur |
| Sanksjoner | 5 | Globale sanksjonslister, handelssamsvar og kontrolltsjekker |
| Terreng | 6 | Hoydedata, terrenganalyse og topografisk etterretning |
| Cyber-Geo | 6 | Geografisk lokalisering av cybertrusler og IP-geolokasjon |
| Befolkning | 5 | Demografiske data, befolkningstetthet-analyse |
| Landbruk | 5 | Avlingshelse, vegetasjonsindeks og landbruksovervaaking |
| Humanitaer | 5 | Krisekartlegging, flyktningestromme og humanitaer respons |
| Hav | 5 | Havoverflatetemperatur, stromme og havovervaaking |
| Handel | 5 | Global handel, handelsruter og forsyningskjedeetterretning |
| Seismikk | 5 | Jordskjelv, seismisk aktivitet og tektonisk overvaaking |
| OSM | 8 | OpenStreetMap-data, infrastrukturoppslag og geospatiale sporreringer |
| Geokoding | 8 | Adresseoppslag, omvendt geokoding og stedssok |
| Spektralanalyse | 8 | Multispektral og hyperspektral bildeanalyse |
| Endringsdeteksjon | 6 | Temporal sammenligning og endringsdeteksjon i satellittbilder |
| Vaer | 6 | Gjeldende vaerforhold, prognoser og meteorologiske data |

---

## API-nokler

Mange verktoy fungerer uten API-nokler ved bruk av fritt tilgjengelige datakilder. Premium-datakilder krever separate API-nokler som kan konfigureres som miljovariable.

```bash
# Eksempler paa valgfrie API-nokler
export SENTINEL_API_KEY=your-key
export NASA_API_KEY=your-key
export PLANET_API_KEY=your-key
export OPENWEATHER_API_KEY=your-key
```

Alle nokler er valgfrie. Serveren degraderer grasiost og returnerer beskrivende feilmeldinger naar en nokkel mangler for et gitt verktoy.

---

## Arkitektur

```
src/
  index.ts                # CLI-inngangspunkt og MCP-serveroppsett
  protocol/
    tools.ts              # Verktoyregister — alle 171 verktoy samlet her
  providers/
    sentinel/             # Sentinel-2 bildeverktoy (8)
    landsat/              # Landsat bildeverktoy (7)
    firms/                # NASA FIRMS brannverktoy (6)
    nasa-earth/           # NASA jordobservasjon (7)
    nightlights/          # VIIRS nattlysverktoy (5)
    planet/               # Planet Labs verktoy (4)
    aircraft/             # Flyetterretningsverktoy (10)
    maritime/             # Maritim etterretningsverktoy (8)
    military/             # Militaer- og forsvarsverktoy (8)
    space/                # Rom- og orbitalverktoy (6)
    conflict/             # Konflikt- og hendelsesverktoy (6)
    environmental/        # Miljoverktoy (6)
    infrastructure/       # Kritisk infrastrukturverktoy (6)
    sanctions/            # Sanksjonsverktoy (5)
    terrain/              # Terrengverktoy (6)
    cyber-geo/            # Cyber-geo-verktoy (6)
    population/           # Befolkningsverktoy (5)
    agriculture/          # Landbruksverktoy (5)
    humanitarian/         # Humanitaere verktoy (5)
    ocean/                # Havverktoy (5)
    trade/                # Handelsverktoy (5)
    seismic/              # Seismikkverktoy (5)
    osm/                  # OpenStreetMap-verktoy (8)
    geocoding/            # Geokodingsverktoy (8)
    spectral/             # Spektralanalyseverktoy (8)
    change-detection/     # Endringsdeteksjonsverktoy (6)
    weather/              # Vaerverktoy (6)
```

**Designprinsipper:**

- **27 leverandorer, 1 server** &mdash; Hver datakilde er en uavhengig modul. Agenten velger hvilke verktoy som skal brukes basert paa foresporselen.
- **Hastighetsbegrensere per leverandor** &mdash; Hver datakilde har sin egen `RateLimiter`-instans kalibrert til det API-ets grenser.
- **TTL-caching** &mdash; Satellittdata, vaer og geopolitiske feeds caches for aa unngaa overflodige API-kall.
- **Grasioos degradering** &mdash; Manglende API-nokler krasjer ikke serveren. Verktoy returnerer beskrivende feilmeldinger.
- **Null konfigurasjon** &mdash; `npx satellite-mcp` &mdash; en kommando, ingen oppsett krevet.

---

## Bidra

Bidrag er velkomne. Aapne en issue eller send inn en pull request.

---

## Lisens

[MIT](../../LICENSE)

<p align="center">
  Bygget med TypeScript &bull; Drevet av Model Context Protocol
</p>
