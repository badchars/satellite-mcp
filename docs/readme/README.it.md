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
  <a href="README.de.md">Deutsch</a> |
  <a href="README.es.md">Espanol</a> |
  <a href="README.fr.md">Francais</a> |
  <strong>Italiano</strong>
</p>

---

# satellite-mcp

**Server MCP GEOINT a spettro completo** -- 171 strumenti in 27 categorie per intelligence geospaziale, immagini satellitari, monitoraggio ambientale e analisi della difesa.

satellite-mcp e un server [Model Context Protocol](https://modelcontextprotocol.io/) (MCP) che fornisce agli assistenti IA capacita complete di intelligence geospaziale (GEOINT). Dai dati multispettrali Sentinel-2 al traffico marittimo in tempo reale fino al monitoraggio dei conflitti, il tutto attraverso un'interfaccia unificata e standardizzata.

## Avvio rapido

### Installazione via npm

```bash
npm install -g satellite-mcp
```

### Utilizzo con npx

```bash
npx satellite-mcp
```

### Configurazione per Claude Desktop

Aggiungere quanto segue al file `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "satellite": {
      "command": "npx",
      "args": ["-y", "satellite-mcp"],
      "env": {
        "SENTINEL_HUB_TOKEN": "il-vostro-token",
        "NASA_FIRMS_API_KEY": "la-vostra-chiave",
        "NASA_EARTHDATA_TOKEN": "il-vostro-token"
      }
    }
  }
}
```

### Comandi CLI

```bash
# Elencare tutti gli strumenti disponibili
npx satellite-mcp --list

# Eseguire un singolo strumento
npx satellite-mcp --tool <nome> '<json-parametri>'

# Mostrare la guida
npx satellite-mcp --help
```

## Categorie di strumenti

| Categoria | Strumenti | Descrizione |
|-----------|-----------|-------------|
| Sentinel-2 | 8 | Immagini satellitari multispettrali (ESA Copernicus) |
| Landsat | 7 | Dati storici di osservazione terrestre (USGS/NASA) |
| NASA FIRMS | 6 | Rilevamento incendi e fonti termiche in tempo reale |
| NASA Earth | 7 | Dati di scienze della Terra ed eventi naturali |
| Luci notturne | 5 | Dati di illuminazione notturna (VIIRS/DMSP) |
| Planet Labs | 4 | Immagini giornaliere ad alta risoluzione |
| Intelligence aerea | 10 | Tracciamento voli e sorveglianza dello spazio aereo |
| Intelligence marittima | 8 | Traffico marittimo e tracciamento AIS |
| Militare e difesa | 8 | Infrastruttura di difesa e movimenti di truppe |
| Spazio e orbitale | 6 | Tracciamento satelliti e consapevolezza situazionale spaziale |
| Conflitti ed eventi | 6 | Monitoraggio conflitti e dati sugli eventi (ACLED) |
| Ambiente | 6 | Monitoraggio ambientale e dati climatici |
| Infrastruttura critica | 6 | Centrali elettriche, oleodotti e telecomunicazioni |
| Sanzioni | 5 | Liste di sanzioni e verifica di conformita |
| Terreno | 6 | Modelli di elevazione e analisi del terreno |
| Cyber-Geo | 6 | Geolocalizzazione delle minacce informatiche |
| Popolazione | 5 | Densita di popolazione e dati demografici |
| Agricoltura | 5 | Salute delle colture e indici di vegetazione |
| Umanitario | 5 | Risposta alle catastrofi e dati sui rifugiati |
| Oceano | 5 | Superficie marina e oceanografia |
| Commercio | 5 | Rotte commerciali e attivita portuale |
| Sismica | 5 | Monitoraggio sismico e dati sui terremoti |
| OSM | 8 | Query geospaziali OpenStreetMap |
| Geocodifica | 8 | Geocodifica diretta e inversa |
| Analisi spettrale | 8 | Calcoli di bande e analisi degli indici |
| Rilevamento cambiamenti | 6 | Confronti temporali e analisi dei cambiamenti |
| Meteo | 6 | Dati meteorologici e previsioni |

## Chiavi API

La maggior parte degli strumenti funziona con API pubbliche gratuite. Per un accesso esteso, e possibile configurare le seguenti chiavi API come variabili di ambiente:

| Variabile | Fornitore | Richiesta |
|-----------|-----------|-----------|
| `SENTINEL_HUB_TOKEN` | Copernicus Data Space | Opzionale |
| `NASA_FIRMS_API_KEY` | NASA FIRMS | Opzionale |
| `NASA_EARTHDATA_TOKEN` | NASA Earthdata | Opzionale |
| `PLANET_API_KEY` | Planet Labs | Opzionale |
| `AVIATIONSTACK_API_KEY` | AviationStack | Opzionale |
| `MARINETRAFFIC_API_KEY` | MarineTraffic | Opzionale |
| `ACLED_API_KEY` | ACLED | Opzionale |
| `ORS_API_KEY` | OpenRouteService | Opzionale |
| `OPENWEATHER_API_KEY` | OpenWeatherMap | Opzionale |

Tutte le chiavi API sono opzionali. In assenza di una chiave, gli strumenti restituiscono un messaggio di errore descrittivo.

## Architettura

```
satellite-mcp/
  src/
    index.ts              # Punto di ingresso e CLI
    protocol/
      tools.ts            # Registrazione strumenti MCP
    providers/
      sentinel/           # Provider Sentinel-2
      landsat/            # Provider Landsat
      firms/              # Provider NASA FIRMS
      ...                 # 27 directory di provider
    utils/
      cache.ts            # Cache con TTL
      rate-limiter.ts     # Limitatore di frequenza
```

- **Runtime:** Bun (sviluppo), Node.js (pubblicazione npm)
- **Trasporto:** stdio
- **Dipendenze:** @modelcontextprotocol/sdk, zod
- **Schema:** Ogni provider nella propria directory sotto `src/providers/`

## Contribuire

I contributi sono benvenuti. Si prega di aprire prima una issue per discutere le modifiche proposte.

1. Effettuare il fork del repository
2. Creare un branch di funzionalita (`git checkout -b feature/mia-funzionalita`)
3. Committare le modifiche (`git commit -m 'feat: nuova funzionalita'`)
4. Fare push del branch (`git push origin feature/mia-funzionalita`)
5. Aprire una Pull Request

## Licenza

MIT
