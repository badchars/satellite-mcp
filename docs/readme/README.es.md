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
  <strong>Espanol</strong> |
  <a href="README.fr.md">Francais</a> |
  <a href="README.it.md">Italiano</a>
</p>

---

# satellite-mcp

**Servidor MCP GEOINT de Espectro Completo** -- 171 herramientas en 27 categorias para inteligencia geoespacial, imagenes satelitales, monitoreo ambiental y analisis de defensa.

satellite-mcp es un servidor [Model Context Protocol](https://modelcontextprotocol.io/) (MCP) que dota a los asistentes de IA con capacidades integrales de inteligencia geoespacial (GEOINT). Desde datos multiespectrales de Sentinel-2 hasta trafico maritimo en tiempo real y seguimiento de conflictos, todo a traves de una interfaz unificada y estandarizada.

## Inicio rapido

### Instalacion via npm

```bash
npm install -g satellite-mcp
```

### Uso con npx

```bash
npx satellite-mcp
```

### Configuracion para Claude Desktop

Agregue lo siguiente a su archivo `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "satellite": {
      "command": "npx",
      "args": ["-y", "satellite-mcp"],
      "env": {
        "SENTINEL_HUB_TOKEN": "su-token",
        "NASA_FIRMS_API_KEY": "su-clave",
        "NASA_EARTHDATA_TOKEN": "su-token"
      }
    }
  }
}
```

### Comandos CLI

```bash
# Listar todas las herramientas disponibles
npx satellite-mcp --list

# Ejecutar una herramienta individual
npx satellite-mcp --tool <nombre> '<json-parametros>'

# Mostrar ayuda
npx satellite-mcp --help
```

## Categorias de herramientas

| Categoria | Herramientas | Descripcion |
|-----------|-------------|-------------|
| Sentinel-2 | 8 | Imagenes satelitales multiespectrales (ESA Copernicus) |
| Landsat | 7 | Datos historicos de observacion terrestre (USGS/NASA) |
| NASA FIRMS | 6 | Deteccion de incendios y fuentes termicas en tiempo real |
| NASA Earth | 7 | Datos de ciencias terrestres y eventos naturales |
| Luces nocturnas | 5 | Datos de iluminacion nocturna (VIIRS/DMSP) |
| Planet Labs | 4 | Imagenes diarias de alta resolucion |
| Inteligencia aerea | 10 | Rastreo de vuelos y vigilancia del espacio aereo |
| Inteligencia maritima | 8 | Trafico maritimo y seguimiento AIS |
| Militar y defensa | 8 | Infraestructura de defensa y movimientos de tropas |
| Espacio y orbital | 6 | Seguimiento de satelites y conocimiento situacional espacial |
| Conflictos y eventos | 6 | Seguimiento de conflictos y datos de eventos (ACLED) |
| Medio ambiente | 6 | Monitoreo ambiental y datos climaticos |
| Infraestructura critica | 6 | Centrales electricas, oleoductos y telecomunicaciones |
| Sanciones | 5 | Listas de sanciones y verificacion de cumplimiento |
| Terreno | 6 | Modelos de elevacion y analisis de terreno |
| Ciber-Geo | 6 | Geolocalizacion de amenazas ciberneticas |
| Poblacion | 5 | Densidad poblacional y datos demograficos |
| Agricultura | 5 | Salud de cultivos e indices de vegetacion |
| Humanitario | 5 | Respuesta a desastres y datos de refugiados |
| Oceano | 5 | Superficie marina y oceanografia |
| Comercio | 5 | Rutas comerciales y actividad portuaria |
| Sismica | 5 | Monitoreo de terremotos y datos sismicos |
| OSM | 8 | Consultas geoespaciales de OpenStreetMap |
| Geocodificacion | 8 | Geocodificacion directa e inversa |
| Analisis espectral | 8 | Calculos de bandas y analisis de indices |
| Deteccion de cambios | 6 | Comparaciones temporales y analisis de cambios |
| Clima | 6 | Datos meteorologicos y pronosticos |

## Claves API

La mayoria de las herramientas funcionan con APIs publicas gratuitas. Para acceso extendido, puede configurar las siguientes claves API como variables de entorno:

| Variable | Proveedor | Requerida |
|----------|-----------|-----------|
| `SENTINEL_HUB_TOKEN` | Copernicus Data Space | Opcional |
| `NASA_FIRMS_API_KEY` | NASA FIRMS | Opcional |
| `NASA_EARTHDATA_TOKEN` | NASA Earthdata | Opcional |
| `PLANET_API_KEY` | Planet Labs | Opcional |
| `AVIATIONSTACK_API_KEY` | AviationStack | Opcional |
| `MARINETRAFFIC_API_KEY` | MarineTraffic | Opcional |
| `ACLED_API_KEY` | ACLED | Opcional |
| `ORS_API_KEY` | OpenRouteService | Opcional |
| `OPENWEATHER_API_KEY` | OpenWeatherMap | Opcional |

Todas las claves API son opcionales. Cuando falta una clave, las herramientas devuelven un mensaje de error descriptivo.

## Arquitectura

```
satellite-mcp/
  src/
    index.ts              # Punto de entrada y CLI
    protocol/
      tools.ts            # Registro de herramientas MCP
    providers/
      sentinel/           # Proveedor Sentinel-2
      landsat/            # Proveedor Landsat
      firms/              # Proveedor NASA FIRMS
      ...                 # 27 directorios de proveedores
    utils/
      cache.ts            # Cache con TTL
      rate-limiter.ts     # Limitador de tasa
```

- **Runtime:** Bun (desarrollo), Node.js (publicacion npm)
- **Transporte:** stdio
- **Dependencias:** @modelcontextprotocol/sdk, zod
- **Patron:** Cada proveedor en su propio directorio bajo `src/providers/`

## Contribuir

Las contribuciones son bienvenidas. Por favor, abra primero un issue para discutir los cambios propuestos.

1. Haga un fork del repositorio
2. Cree una rama de funcionalidad (`git checkout -b feature/mi-funcionalidad`)
3. Haga commit de sus cambios (`git commit -m 'feat: nueva funcionalidad'`)
4. Haga push de la rama (`git push origin feature/mi-funcionalidad`)
5. Abra un Pull Request

## Licencia

MIT
