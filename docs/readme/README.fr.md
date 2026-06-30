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
  <strong>Francais</strong> |
  <a href="README.it.md">Italiano</a>
</p>

---

# satellite-mcp

**Serveur MCP GEOINT a spectre complet** -- 171 outils repartis en 27 categories pour le renseignement geospatial, l'imagerie satellitaire, la surveillance environnementale et l'analyse de defense.

satellite-mcp est un serveur [Model Context Protocol](https://modelcontextprotocol.io/) (MCP) qui dote les assistants IA de capacites completes de renseignement geospatial (GEOINT). Des donnees multispectrales Sentinel-2 au trafic maritime en temps reel en passant par le suivi des conflits, le tout via une interface unifiee et standardisee.

## Demarrage rapide

### Installation via npm

```bash
npm install -g satellite-mcp
```

### Utilisation avec npx

```bash
npx satellite-mcp
```

### Configuration pour Claude Desktop

Ajoutez ce qui suit dans votre fichier `claude_desktop_config.json` :

```json
{
  "mcpServers": {
    "satellite": {
      "command": "npx",
      "args": ["-y", "satellite-mcp"],
      "env": {
        "SENTINEL_HUB_TOKEN": "votre-token",
        "NASA_FIRMS_API_KEY": "votre-cle",
        "NASA_EARTHDATA_TOKEN": "votre-token"
      }
    }
  }
}
```

### Commandes CLI

```bash
# Lister tous les outils disponibles
npx satellite-mcp --list

# Executer un outil individuel
npx satellite-mcp --tool <nom> '<json-parametres>'

# Afficher l'aide
npx satellite-mcp --help
```

## Categories d'outils

| Categorie | Outils | Description |
|-----------|--------|-------------|
| Sentinel-2 | 8 | Imagerie satellitaire multispectrale (ESA Copernicus) |
| Landsat | 7 | Donnees historiques d'observation terrestre (USGS/NASA) |
| NASA FIRMS | 6 | Detection d'incendies et de sources thermiques en temps reel |
| NASA Earth | 7 | Donnees des sciences de la Terre et evenements naturels |
| Lumieres nocturnes | 5 | Donnees d'eclairage nocturne (VIIRS/DMSP) |
| Planet Labs | 4 | Imagerie quotidienne a haute resolution |
| Renseignement aerien | 10 | Suivi de vols et surveillance de l'espace aerien |
| Renseignement maritime | 8 | Trafic maritime et suivi AIS |
| Militaire et defense | 8 | Infrastructure de defense et mouvements de troupes |
| Espace et orbital | 6 | Suivi de satellites et connaissance situationnelle spatiale |
| Conflits et evenements | 6 | Suivi des conflits et donnees evenementielles (ACLED) |
| Environnement | 6 | Surveillance environnementale et donnees climatiques |
| Infrastructure critique | 6 | Centrales electriques, pipelines et telecommunications |
| Sanctions | 5 | Listes de sanctions et verification de conformite |
| Terrain | 6 | Modeles d'elevation et analyse de terrain |
| Cyber-Geo | 6 | Geolocalisation des menaces cyber |
| Population | 5 | Densite de population et donnees demographiques |
| Agriculture | 5 | Sante des cultures et indices de vegetation |
| Humanitaire | 5 | Reponse aux catastrophes et donnees sur les refugies |
| Ocean | 5 | Surface marine et oceanographie |
| Commerce | 5 | Routes commerciales et activite portuaire |
| Sismique | 5 | Surveillance sismique et donnees sur les tremblements de terre |
| OSM | 8 | Requetes geospatiales OpenStreetMap |
| Geocodage | 8 | Geocodage direct et inverse |
| Analyse spectrale | 8 | Calculs de bandes et analyse d'indices |
| Detection de changements | 6 | Comparaisons temporelles et analyse de changements |
| Meteo | 6 | Donnees meteorologiques et previsions |

## Cles API

La plupart des outils fonctionnent avec des API publiques gratuites. Pour un acces etendu, vous pouvez configurer les cles API suivantes comme variables d'environnement :

| Variable | Fournisseur | Requise |
|----------|-------------|---------|
| `SENTINEL_HUB_TOKEN` | Copernicus Data Space | Optionnelle |
| `NASA_FIRMS_API_KEY` | NASA FIRMS | Optionnelle |
| `NASA_EARTHDATA_TOKEN` | NASA Earthdata | Optionnelle |
| `PLANET_API_KEY` | Planet Labs | Optionnelle |
| `AVIATIONSTACK_API_KEY` | AviationStack | Optionnelle |
| `MARINETRAFFIC_API_KEY` | MarineTraffic | Optionnelle |
| `ACLED_API_KEY` | ACLED | Optionnelle |
| `ORS_API_KEY` | OpenRouteService | Optionnelle |
| `OPENWEATHER_API_KEY` | OpenWeatherMap | Optionnelle |

Toutes les cles API sont optionnelles. En l'absence d'une cle, les outils renvoient un message d'erreur descriptif.

## Architecture

```
satellite-mcp/
  src/
    index.ts              # Point d'entree et CLI
    protocol/
      tools.ts            # Enregistrement des outils MCP
    providers/
      sentinel/           # Fournisseur Sentinel-2
      landsat/            # Fournisseur Landsat
      firms/              # Fournisseur NASA FIRMS
      ...                 # 27 repertoires de fournisseurs
    utils/
      cache.ts            # Cache avec TTL
      rate-limiter.ts     # Limiteur de debit
```

- **Runtime :** Bun (developpement), Node.js (publication npm)
- **Transport :** stdio
- **Dependances :** @modelcontextprotocol/sdk, zod
- **Schema :** Chaque fournisseur dans son propre repertoire sous `src/providers/`

## Contribuer

Les contributions sont les bienvenues. Veuillez d'abord ouvrir une issue pour discuter des changements envisages.

1. Forkez le depot
2. Creez une branche de fonctionnalite (`git checkout -b feature/ma-fonctionnalite`)
3. Committez vos changements (`git commit -m 'feat: nouvelle fonctionnalite'`)
4. Poussez la branche (`git push origin feature/ma-fonctionnalite`)
5. Ouvrez une Pull Request

## Licence

MIT
