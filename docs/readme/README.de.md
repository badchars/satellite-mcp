<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="../../.github/banner-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="../../.github/banner-light.svg">
    <img alt="satellite-mcp" src="../../.github/banner-dark.svg" width="600">
  </picture>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/satellite-mcp"><img src="https://img.shields.io/npm/v/satellite-mcp.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/satellite-mcp"><img src="https://img.shields.io/npm/dm/satellite-mcp.svg" alt="npm downloads"></a>
  <a href="https://github.com/AumLabs/satellite-mcp/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/satellite-mcp.svg" alt="license"></a>
</p>

<p align="center">
  <a href="../../README.md">English</a> |
  <strong>Deutsch</strong> |
  <a href="README.es.md">Espanol</a> |
  <a href="README.fr.md">Francais</a> |
  <a href="README.it.md">Italiano</a>
</p>

---

# satellite-mcp

**Full-Spectrum GEOINT MCP Server** -- 171 Tools in 27 Kategorien fuer geospatiale Aufklaerung, Satellitenbildgebung, Umweltueberwachung und Verteidigungsanalyse.

satellite-mcp ist ein [Model Context Protocol](https://modelcontextprotocol.io/) (MCP) Server, der KI-Assistenten mit umfassenden Faehigkeiten fuer geographische Aufklaerung (GEOINT) ausstattet. Von Sentinel-2-Multispektraldaten ueber Echtzeit-Schiffsverkehr bis hin zu Konflikt-Tracking -- alles ueber eine einheitliche, standardisierte Schnittstelle.

## Schnellstart

### Installation ueber npm

```bash
npm install -g satellite-mcp
```

### Verwendung mit npx

```bash
npx satellite-mcp
```

### Konfiguration fuer Claude Desktop

Fuegen Sie folgendes in Ihre `claude_desktop_config.json` ein:

```json
{
  "mcpServers": {
    "satellite": {
      "command": "npx",
      "args": ["-y", "satellite-mcp"],
      "env": {
        "SENTINEL_HUB_TOKEN": "ihr-token",
        "NASA_FIRMS_API_KEY": "ihr-schluessel",
        "NASA_EARTHDATA_TOKEN": "ihr-token"
      }
    }
  }
}
```

### CLI-Befehle

```bash
# Alle verfuegbaren Tools auflisten
npx satellite-mcp --list

# Einzelnes Tool ausfuehren
npx satellite-mcp --tool <toolname> '<json-parameter>'

# Hilfe anzeigen
npx satellite-mcp --help
```

## Tool-Kategorien

| Kategorie | Tools | Beschreibung |
|-----------|-------|--------------|
| Sentinel-2 | 8 | Multispektrale Satellitenbildgebung (ESA Copernicus) |
| Landsat | 7 | Langzeit-Erdbeobachtungsdaten (USGS/NASA) |
| NASA FIRMS | 6 | Echtzeit-Feuer- und Waermequellenerkennung |
| NASA Earth | 7 | Erdwissenschaftliche Daten und Naturereignisse |
| Nachtlicht | 5 | Nachtlichtdaten (VIIRS/DMSP) |
| Planet Labs | 4 | Hochaufloesende taegliche Bildgebung |
| Luftfahrt-Aufklaerung | 10 | Flugverfolgung und Luftraumueberwachung |
| Maritime Aufklaerung | 8 | Schiffsverkehr und AIS-Tracking |
| Militaer & Verteidigung | 8 | Verteidigungsinfrastruktur und Truppenbewegungen |
| Weltraum & Orbital | 6 | Satellitentracking und Weltraumlageerfassung |
| Konflikte & Ereignisse | 6 | Konfliktverfolgung und Ereignisdaten (ACLED) |
| Umwelt | 6 | Umweltueberwachung und Klimadaten |
| Kritische Infrastruktur | 6 | Kraftwerke, Pipelines und Telekommunikation |
| Sanktionen | 5 | Sanktionslisten und Compliance-Pruefung |
| Gelaende | 6 | Hoehenmodelle und Gelaendeanalyse |
| Cyber-Geo | 6 | Geolokalisierung von Cyberbedrohungen |
| Bevoelkerung | 5 | Bevoelkerungsdichte und Demografie |
| Landwirtschaft | 5 | Erntegesundheit und Vegetationsindizes |
| Humanitaer | 5 | Katastrophenhilfe und Fluechtlingsdaten |
| Ozean | 5 | Meeresoberflaechen und Ozeanografie |
| Handel | 5 | Handelsrouten und Hafenaktivitaeten |
| Seismik | 5 | Erdbebenueberwachung und seismische Daten |
| OSM | 8 | OpenStreetMap-Geospatialabfragen |
| Geokodierung | 8 | Vorwaerts-/Rueckwaerts-Geokodierung |
| Spektralanalyse | 8 | Bandberechnungen und Indexanalyse |
| Aenderungserkennung | 6 | Zeitliche Vergleiche und Aenderungsanalyse |
| Wetter | 6 | Wetterdaten und meteorologische Vorhersagen |

## API-Schluessel

Die meisten Tools funktionieren mit kostenlosen oeffentlichen APIs. Fuer erweiterten Zugriff koennen Sie folgende API-Schluessel als Umgebungsvariablen setzen:

| Variable | Anbieter | Erforderlich |
|----------|----------|-------------|
| `SENTINEL_HUB_TOKEN` | Copernicus Data Space | Optional |
| `NASA_FIRMS_API_KEY` | NASA FIRMS | Optional |
| `NASA_EARTHDATA_TOKEN` | NASA Earthdata | Optional |
| `PLANET_API_KEY` | Planet Labs | Optional |
| `AVIATIONSTACK_API_KEY` | AviationStack | Optional |
| `MARINETRAFFIC_API_KEY` | MarineTraffic | Optional |
| `ACLED_API_KEY` | ACLED | Optional |
| `ORS_API_KEY` | OpenRouteService | Optional |
| `OPENWEATHER_API_KEY` | OpenWeatherMap | Optional |

Alle API-Schluessel sind optional. Bei fehlenden Schluesseln geben die Tools eine aussagekraeftige Fehlermeldung zurueck.

## Architektur

```
satellite-mcp/
  src/
    index.ts              # Einstiegspunkt und CLI
    protocol/
      tools.ts            # MCP-Tool-Registrierung
    providers/
      sentinel/           # Sentinel-2-Anbieter
      landsat/            # Landsat-Anbieter
      firms/              # NASA FIRMS-Anbieter
      ...                 # 27 Anbieter-Verzeichnisse
    utils/
      cache.ts            # TTL-Cache
      rate-limiter.ts     # Rate-Limiting
```

- **Runtime:** Bun (Entwicklung), Node.js (npm-Veroeffentlichung)
- **Transport:** stdio
- **Abhaengigkeiten:** @modelcontextprotocol/sdk, zod
- **Muster:** Jeder Anbieter in eigenem Verzeichnis unter `src/providers/`

## Mitwirken

Beitraege sind willkommen. Bitte oeffnen Sie zuerst ein Issue, um geplante Aenderungen zu besprechen.

1. Forken Sie das Repository
2. Erstellen Sie einen Feature-Branch (`git checkout -b feature/mein-feature`)
3. Committen Sie Ihre Aenderungen (`git commit -m 'feat: neues Feature'`)
4. Pushen Sie den Branch (`git push origin feature/mein-feature`)
5. Oeffnen Sie einen Pull Request

## Lizenz

MIT
