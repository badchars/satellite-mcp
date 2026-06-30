<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset=".github/banner-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset=".github/banner-light.svg">
    <img alt="satellite-mcp" src=".github/banner-dark.svg" width="600">
  </picture>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/satellite-mcp"><img src="https://img.shields.io/npm/v/satellite-mcp?color=0969da&label=npm" alt="npm"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-green" alt="license"></a>
  <img src="https://img.shields.io/badge/tools-171-blueviolet" alt="tools">
  <img src="https://img.shields.io/badge/MCP-compatible-00A67E" alt="MCP">
  <a href="#api-keys"><img src="https://img.shields.io/badge/zero--config-most%20tools-orange" alt="zero-config"></a>
</p>

<p align="center">
  <a href="docs/readme/README.zh.md">中文</a> · <a href="docs/readme/README.zh-TW.md">繁體中文</a> · <a href="docs/readme/README.ko.md">한국어</a> · <a href="docs/readme/README.ja.md">日本語</a> · <a href="docs/readme/README.de.md">Deutsch</a> · <a href="docs/readme/README.es.md">Español</a> · <a href="docs/readme/README.fr.md">Français</a> · <a href="docs/readme/README.it.md">Italiano</a> · <a href="docs/readme/README.da.md">Dansk</a> · <a href="docs/readme/README.no.md">Norsk</a> · <a href="docs/readme/README.pl.md">Polski</a> · <a href="docs/readme/README.ru.md">Русский</a> · <a href="docs/readme/README.bs.md">Bosanski</a> · <a href="docs/readme/README.uk.md">Українська</a> · <a href="docs/readme/README.pt-BR.md">Português</a> · <a href="docs/readme/README.ar.md">العربية</a> · <a href="docs/readme/README.th.md">ไทย</a> · <a href="docs/readme/README.tr.md">Türkçe</a> · <a href="docs/readme/README.bn.md">বাংলা</a> · <a href="docs/readme/README.hi.md">हिन्दी</a> · <a href="docs/readme/README.el.md">Ελληνικά</a> · <a href="docs/readme/README.vi.md">Tiếng Việt</a>
</p>

<br>

Full-spectrum GEOINT (Geospatial Intelligence) server for the [Model Context Protocol](https://modelcontextprotocol.io). 171 tools covering satellite imagery, aircraft tracking, maritime surveillance, military intelligence, conflict monitoring, environmental analysis, critical infrastructure, sanctions compliance, cyber-geo intelligence, and 18 more domains &mdash; all from open-source data.

<p align="center">
  <img src=".github/demo.gif" alt="satellite-mcp demo" width="600">
</p>

---

## Highlights

- **171 tools across 27 categories** &mdash; the most comprehensive GEOINT MCP server available
- **Sentinel-2, Landsat 8/9, Planet Labs, NASA FIRMS** satellite imagery search, metadata, and spectral band reference
- **Real-time aircraft tracking** (ADS-B via OpenSky), **maritime AIS surveillance** (Global Fishing Watch), **space/orbital tracking** (CelesTrak, N2YO)
- **Military base detection**, conflict event monitoring (ACLED/GDELT), sanctions compliance (OFAC SDN)
- **Pure-computation spectral indices** (NDVI, NDWI, NBR, EVI, and more) and multi-index change detection &mdash; no external dependencies
- **Zero-config for most tools** &mdash; API keys are optional and unlock premium data sources; dozens of tools work immediately with no setup
- **Two runtime dependencies only** &mdash; `@modelcontextprotocol/sdk` and `zod`
- **Stdio transport** &mdash; works with Claude Desktop, Claude Code, Cursor, Windsurf, and any MCP-compatible client

---

## Quick Start

```bash
npx satellite-mcp              # run directly (no install)
# or install globally
npm i -g satellite-mcp
satellite-mcp --list           # see all 171 tools
satellite-mcp --help           # usage information
```

### Connect to Claude Desktop

Add to your MCP configuration file (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "satellite": {
      "command": "npx",
      "args": ["-y", "satellite-mcp"],
      "env": {
        "NASA_API_KEY": "your-key-or-use-DEMO_KEY",
        "OPENSKY_USERNAME": "optional"
      }
    }
  }
}
```

### Connect to Claude Code

```bash
claude mcp add satellite-mcp -- npx satellite-mcp
```

### CLI Usage

```bash
# Run any tool directly from the command line
satellite-mcp --tool spectral_ndvi '{"nir":0.8,"red":0.2}'
satellite-mcp --tool geo_distance '{"lat1":41.01,"lng1":28.98,"lat2":39.93,"lng2":32.86}'
satellite-mcp --tool quake_recent '{"min_magnitude":4.0,"limit":10}'
satellite-mcp --tool firms_active_country '{"country":"TUR","days":1}'
satellite-mcp --tool weather_current '{"lat":48.85,"lng":2.35}'
```

---

## Tool Categories

| # | Category | Tools | API / Data Source | Auth |
|---|----------|------:|-------------------|------|
| 1 | [Sentinel-2 (Copernicus)](#1-sentinel-2-copernicus--8-tools) | 8 | Copernicus Data Space OData | Optional OAuth2 |
| 2 | [Landsat (USGS)](#2-landsat-usgs--7-tools) | 7 | USGS M2M API | Optional |
| 3 | [NASA FIRMS (Active Fire)](#3-nasa-firms-active-fire--6-tools) | 6 | NASA FIRMS REST | Optional key |
| 4 | [NASA Earth Observation](#4-nasa-earth-observation--7-tools) | 7 | NASA Open APIs | Optional (DEMO_KEY) |
| 5 | [Night Lights (VIIRS)](#5-night-lights-viirs--5-tools) | 5 | EOG / NOAA | None |
| 6 | [Planet Labs](#6-planet-labs--4-tools) | 4 | Planet Data API | Required |
| 7 | [Aircraft Intelligence](#7-aircraft-intelligence--10-tools) | 10 | OpenSky Network | Optional |
| 8 | [Maritime Intelligence](#8-maritime-intelligence--8-tools) | 8 | Global Fishing Watch | Optional |
| 9 | [Military & Defense](#9-military--defense--8-tools) | 8 | OSM + OpenSky | None |
| 10 | [Space & Orbital Tracking](#10-space--orbital-tracking--6-tools) | 6 | CelesTrak + N2YO | Optional |
| 11 | [Conflict & Events](#11-conflict--events--6-tools) | 6 | ACLED + GDELT | Optional |
| 12 | [Environmental Intelligence](#12-environmental-intelligence--6-tools) | 6 | GFW + Open-Meteo | Optional |
| 13 | [Critical Infrastructure](#13-critical-infrastructure--6-tools) | 6 | OSM Overpass | None |
| 14 | [Sanctions & Compliance](#14-sanctions--compliance--5-tools) | 5 | OFAC SDN | None |
| 15 | [Terrain & Elevation](#15-terrain--elevation--6-tools) | 6 | Open Elevation | None |
| 16 | [Cyber-Geo Intelligence](#16-cyber-geo-intelligence--6-tools) | 6 | OONI + IODA + ip-api | None |
| 17 | [Population & Demographics](#17-population--demographics--5-tools) | 5 | WorldPop + UNHCR | None |
| 18 | [Agriculture & Food Security](#18-agriculture--food-security--5-tools) | 5 | FAO + FEWS NET | None |
| 19 | [Humanitarian & Refugee](#19-humanitarian--refugee--5-tools) | 5 | ReliefWeb + UNHCR | None |
| 20 | [Ocean Intelligence](#20-ocean-intelligence--5-tools) | 5 | NOAA Buoys + Open-Meteo | None |
| 21 | [Trade Intelligence](#21-trade-intelligence--5-tools) | 5 | UN Comtrade | Optional |
| 22 | [Seismic & Disaster](#22-seismic--disaster--5-tools) | 5 | USGS Earthquake | None |
| 23 | [OpenStreetMap / Overpass](#23-openstreetmap--overpass--8-tools) | 8 | Overpass API | None |
| 24 | [Geocoding & Coordinates](#24-geocoding--coordinates--8-tools) | 8 | Nominatim + math | None |
| 25 | [Spectral Analysis](#25-spectral-analysis--8-tools) | 8 | Pure computation | None |
| 26 | [Change Detection](#26-change-detection--6-tools) | 6 | Pure computation | None |
| 27 | [Weather & Atmosphere](#27-weather--atmosphere--6-tools) | 6 | Open-Meteo | None |
| | **Total** | **171** | | |

---

### 1. Sentinel-2 (Copernicus) &mdash; 8 tools

<details>
<summary>Expand tool list</summary>

| Tool | Description |
|------|-------------|
| `sentinel_search` | Search Sentinel-2 satellite imagery by location, date range, and cloud cover percentage |
| `sentinel_metadata` | Get detailed metadata for a Sentinel-2 product by ID |
| `sentinel_quicklook` | Get quicklook (thumbnail preview) URL for a Sentinel-2 product |
| `sentinel_bands` | Reference table of all 13 Sentinel-2 MSI spectral bands with wavelengths and resolutions |
| `sentinel_latest` | Find the most recent cloud-free Sentinel-2 image for a location |
| `sentinel_timeline` | Get available Sentinel-2 image dates for a location over the past year |
| `sentinel_coverage` | Sentinel-2 coverage and revisit information for a location |
| `sentinel_download_url` | Get download URL for a Sentinel-2 product (requires Copernicus authentication) |

</details>

### 2. Landsat (USGS) &mdash; 7 tools

<details>
<summary>Expand tool list</summary>

| Tool | Description |
|------|-------------|
| `landsat_search` | Search Landsat 8/9 satellite scenes by location, date range, and cloud cover |
| `landsat_metadata` | Get detailed metadata for a Landsat scene by entity ID |
| `landsat_browse` | Get browse/thumbnail URL for a Landsat scene |
| `landsat_bands` | Reference table of Landsat 8/9 OLI/TIRS spectral bands with wavelengths and resolutions |
| `landsat_latest` | Find the most recent Landsat scene for a location |
| `landsat_timeline` | Get Landsat scene availability for a location &mdash; historical coverage since 1972 |
| `landsat_download_url` | Get download URL for a Landsat scene (requires USGS authentication) |

</details>

### 3. NASA FIRMS (Active Fire) &mdash; 6 tools

<details>
<summary>Expand tool list</summary>

| Tool | Description |
|------|-------------|
| `firms_active_area` | Query NASA FIRMS for active fire detections within a geographic bounding box |
| `firms_active_country` | Query NASA FIRMS for active fire detections within a country (ISO 3166-1 alpha-3) |
| `firms_active_point` | Find active fires near a specific coordinate within a given radius |
| `firms_history` | Retrieve historical fire detection data for a specific date and bounding box |
| `firms_latest` | Retrieve the latest global fire detections sorted by most recent |
| `firms_summary` | Compute aggregate fire statistics for a geographic area &mdash; total count, brightness, FRP, confidence |

</details>

### 4. NASA Earth Observation &mdash; 7 tools

<details>
<summary>Expand tool list</summary>

| Tool | Description |
|------|-------------|
| `nasa_earth_image` | Get Landsat 8 natural color satellite imagery URL for a coordinate and date |
| `nasa_earth_assets` | List available Landsat 8 imagery dates for a geographic coordinate |
| `nasa_epic_latest` | Get the latest full-disk Earth photograph from DSCOVR's EPIC camera |
| `nasa_epic_date` | Get DSCOVR EPIC full-Earth photographs for a specific date |
| `nasa_epic_archive` | List all available dates in the DSCOVR EPIC image archive |
| `nasa_power_data` | Retrieve daily solar and meteorological parameters from NASA POWER |
| `nasa_gibs_tile` | Construct a NASA GIBS WMTS tile URL for a specific layer, date, and tile coordinate |

</details>

### 5. Night Lights (VIIRS) &mdash; 5 tools

<details>
<summary>Expand tool list</summary>

| Tool | Description |
|------|-------------|
| `nightlights_tile` | Get night lights map tile URL from NASA GIBS &mdash; VIIRS Black Marble layer |
| `nightlights_radiance` | Get night light radiance estimate for a location &mdash; light intensity indicator |
| `nightlights_compare` | Compare night light levels between two dates &mdash; detect power outages, urban growth, or conflict damage |
| `nightlights_timeseries` | Night light time series analysis &mdash; monthly radiance trends for monitoring urbanization or conflict |
| `nightlights_anomaly` | Night light anomaly detection &mdash; sudden changes indicating power outages, conflict, or rapid development |

</details>

### 6. Planet Labs &mdash; 4 tools

<details>
<summary>Expand tool list</summary>

| Tool | Description |
|------|-------------|
| `planet_search` | Search Planet Labs satellite imagery catalog &mdash; daily 3m resolution global coverage |
| `planet_metadata` | Get detailed metadata for a Planet Labs item |
| `planet_thumbnail` | Get thumbnail preview URL for a Planet Labs item |
| `planet_stats` | Get Planet imagery coverage statistics for an area |

</details>

### 7. Aircraft Intelligence &mdash; 10 tools

<details>
<summary>Expand tool list</summary>

| Tool | Description |
|------|-------------|
| `aircraft_live` | Get live aircraft positions within a bounding box &mdash; position, altitude, speed, heading, origin country |
| `aircraft_track` | Track a specific aircraft by ICAO24 hex address &mdash; returns flight path waypoints |
| `aircraft_flights` | Get flight history for an aircraft over a time period including departure and arrival airports |
| `aircraft_waypoints` | Get flight waypoints for an aircraft with cumulative distance calculation |
| `aircraft_arrivals` | Get recent arrivals at an airport by ICAO code |
| `aircraft_departures` | Get recent departures from an airport by ICAO code |
| `aircraft_search` | Search for currently airborne aircraft by callsign (partial match supported) |
| `aircraft_military` | Filter military aircraft in a bounding box by ICAO24 hex ranges assigned to military operators |
| `aircraft_stats` | Traffic statistics for a bounding box &mdash; total aircraft, altitude distribution, top countries |
| `aircraft_anomaly` | Detect anomalous aircraft behavior &mdash; low altitude, loitering, emergency squawks, no callsign |

</details>

### 8. Maritime Intelligence &mdash; 8 tools

<details>
<summary>Expand tool list</summary>

| Tool | Description |
|------|-------------|
| `ship_search` | Search for vessels by name, MMSI, or IMO number using Global Fishing Watch |
| `ship_position` | Get last known position for a vessel by GFW vessel ID |
| `ship_track` | Get vessel movement history (GPS track) over a date range |
| `ship_area` | Get all vessels in a bounding box area using AIS data |
| `ship_fishing` | Analyze fishing activity in an area &mdash; fishing hours, vessel count, top flag states |
| `ship_port_visits` | Get port visit history for a vessel |
| `ship_encounters` | Detect ship-to-ship encounters and transfers &mdash; potential at-sea transshipment |
| `ship_dark` | Detect AIS gap events (dark periods) for a vessel &mdash; potential sanctions evasion or illegal activity |

</details>

### 9. Military & Defense &mdash; 8 tools

<details>
<summary>Expand tool list</summary>

| Tool | Description |
|------|-------------|
| `mil_bases` | Find military bases, barracks, airfields, ranges, and bunkers in a bounding box (OSM data) |
| `mil_aircraft` | Track live military aircraft in a bounding box by filtering military ICAO24 hex ranges |
| `mil_airspace` | Find restricted, danger, prohibited, and military airspace zones in a bounding box |
| `mil_naval` | Find naval bases and military ports in a bounding box |
| `mil_nuclear` | Find nuclear facilities &mdash; power plants, research reactors, enrichment sites in a bounding box |
| `mil_missile` | Find known missile test sites, launch pads, and military testing ranges in a bounding box |
| `mil_radar` | Find radar stations and air defense installations in a bounding box |
| `mil_activity` | Composite military activity score for a bounding box &mdash; facility count, restricted airspace, overall assessment |

</details>

### 10. Space & Orbital Tracking &mdash; 6 tools

<details>
<summary>Expand tool list</summary>

| Tool | Description |
|------|-------------|
| `space_satellites` | List active satellites by category &mdash; communications, weather, military, science, navigation, starlink |
| `space_tle` | Get TLE (Two-Line Element) orbital data for a satellite by NORAD catalog number |
| `space_passes` | Predict visible satellite passes over a location (requires N2YO API key) |
| `space_overhead` | List satellites currently overhead at a location (requires N2YO API key) |
| `space_starlink` | Get Starlink constellation status &mdash; total satellites, orbital statistics, newest and oldest launches |
| `space_debris` | Track space debris objects from known fragmentation events |

</details>

### 11. Conflict & Events &mdash; 6 tools

<details>
<summary>Expand tool list</summary>

| Tool | Description |
|------|-------------|
| `conflict_events` | Get armed conflict events from ACLED &mdash; battles, violence against civilians, explosions, riots, protests |
| `conflict_fatalities` | Conflict fatality statistics by country &mdash; total fatalities, breakdown by event type |
| `conflict_actors` | List armed groups and actors active in a country with event counts |
| `conflict_hotspots` | Conflict intensity grid map &mdash; divides bounding box into cells and counts events per cell |
| `events_global` | Global event monitoring via GDELT &mdash; search news articles about specific topics or events |
| `events_media` | Media intensity analysis via GDELT &mdash; track news volume over time for a topic or region |

</details>

### 12. Environmental Intelligence &mdash; 6 tools

<details>
<summary>Expand tool list</summary>

| Tool | Description |
|------|-------------|
| `env_deforestation` | Get deforestation alerts (GLAD) near a coordinate &mdash; recent tree cover loss events |
| `env_fire_risk` | Assess fire risk at a location based on current weather conditions &mdash; temperature, humidity, wind |
| `env_methane` | Check for methane emission hotspots &mdash; uses Sentinel-5P TROPOMI data references |
| `env_air_pollution` | Get satellite-derived air pollution data &mdash; NO2, SO2, CO, PM2.5, ozone levels |
| `env_ocean_temp` | Get sea surface temperature (SST) at a coordinate using Open-Meteo marine data |
| `env_water_quality` | Water quality indicators &mdash; chlorophyll and turbidity reference data for a coordinate |

</details>

### 13. Critical Infrastructure &mdash; 6 tools

<details>
<summary>Expand tool list</summary>

| Tool | Description |
|------|-------------|
| `infra_power` | Find power plants, substations, and transmission lines in a bounding box |
| `infra_pipelines` | Find oil, gas, and water pipelines in a bounding box |
| `infra_telecom` | Find cell towers, communication masts, and data centers in a bounding box |
| `infra_cables` | Find submarine cable landing points in a bounding box |
| `infra_transport` | Find bridges, tunnels, ferry terminals, and train stations in a bounding box |
| `infra_energy` | Find renewable energy installations &mdash; wind turbines and solar farms in a bounding box |

</details>

### 14. Sanctions & Compliance &mdash; 5 tools

<details>
<summary>Expand tool list</summary>

| Tool | Description |
|------|-------------|
| `sanctions_search` | Search OFAC SDN sanctions list for a name, entity, or organization |
| `sanctions_vessel` | Check if a vessel is on sanctions lists by IMO number or vessel name |
| `sanctions_entity` | Check sanctions status for a specific entity or individual |
| `sanctions_country` | Get sanctions program summary for a country &mdash; sanction level, programs, and restrictions |
| `sanctions_changes` | Check for recent changes to the OFAC sanctions list |

</details>

### 15. Terrain & Elevation &mdash; 6 tools

<details>
<summary>Expand tool list</summary>

| Tool | Description |
|------|-------------|
| `terrain_elevation` | Get the elevation (altitude above sea level) at a given geographic coordinate |
| `terrain_profile` | Generate an elevation profile between two geographic points with distance and elevation statistics |
| `terrain_slope` | Calculate the slope (gradient) between two points &mdash; angle, percentage, and terrain classification |
| `terrain_viewshed` | Line of sight analysis between two points &mdash; can observer at A see target at B considering terrain |
| `terrain_prominence` | Find the highest and lowest points in a bounding box by querying an elevation grid |
| `terrain_flood_risk` | Assess flood risk at a location based on elevation relative to a reference water level |

</details>

### 16. Cyber-Geo Intelligence &mdash; 6 tools

<details>
<summary>Expand tool list</summary>

| Tool | Description |
|------|-------------|
| `cyber_ip_locate` | Geolocate an IP address &mdash; country, city, ISP, coordinates, timezone |
| `cyber_censorship` | Detect internet censorship in a country using OONI measurements &mdash; blocked sites and methods |
| `cyber_outage` | Detect internet outages in a country using IODA (Internet Outage Detection and Analysis) |
| `cyber_cable_landing` | Find submarine cable landing points near a coordinate using OpenStreetMap data |
| `cyber_ix_points` | Find Internet Exchange Points (IXPs) in a country using PeeringDB |
| `cyber_connectivity` | Country internet connectivity overview &mdash; IXP count, cable landings, and assessment |

</details>

### 17. Population & Demographics &mdash; 5 tools

<details>
<summary>Expand tool list</summary>

| Tool | Description |
|------|-------------|
| `pop_density` | Get population density estimate for a coordinate or country using WorldPop data |
| `pop_urban` | Get urbanization and city data for a coordinate &mdash; nearby urban areas and characteristics |
| `pop_growth` | Population growth data for a country from UN World Population Prospects |
| `pop_displacement` | Get displaced population data for a country from UNHCR |
| `pop_age_structure` | Population age structure reference for a country &mdash; age groups for demographic analysis |

</details>

### 18. Agriculture & Food Security &mdash; 5 tools

<details>
<summary>Expand tool list</summary>

| Tool | Description |
|------|-------------|
| `agri_crop_health` | Assess crop health at a location using NDVI time series &mdash; links to satellite vegetation indices |
| `agri_drought` | Drought assessment at a location using weather indicators &mdash; temperature, precipitation, humidity |
| `agri_food_price` | FAO Food Price Index &mdash; global food commodity price trends |
| `agri_famine_risk` | Famine risk assessment using FEWS NET IPC phase classification |
| `agri_locust` | Desert locust swarm tracking and alerts from FAO Locust Watch |

</details>

### 19. Humanitarian & Refugee &mdash; 5 tools

<details>
<summary>Expand tool list</summary>

| Tool | Description |
|------|-------------|
| `humanitarian_crises` | List active humanitarian crises worldwide from ReliefWeb |
| `humanitarian_reports` | Get latest humanitarian situation reports and updates from ReliefWeb |
| `humanitarian_camps` | Get refugee camp locations and population data from UNHCR |
| `humanitarian_funding` | Humanitarian funding status &mdash; requested vs. received for crises |
| `humanitarian_displacement` | Global displacement statistics &mdash; refugees, IDPs, asylum seekers from UNHCR |

</details>

### 20. Ocean Intelligence &mdash; 5 tools

<details>
<summary>Expand tool list</summary>

| Tool | Description |
|------|-------------|
| `ocean_buoy_data` | Get ocean buoy measurements &mdash; wave height, wind, temperature, pressure from NOAA NDBC |
| `ocean_currents` | Get ocean current information for a marine location using Open-Meteo marine data |
| `ocean_sea_ice` | Sea ice extent information &mdash; Arctic and Antarctic ice coverage reference |
| `ocean_chlorophyll` | Ocean chlorophyll concentration reference &mdash; fishing productivity and marine ecosystem indicator |
| `ocean_sst_anomaly` | Sea surface temperature anomaly &mdash; El Nino/La Nina indicator and climate monitoring |

</details>

### 21. Trade Intelligence &mdash; 5 tools

<details>
<summary>Expand tool list</summary>

| Tool | Description |
|------|-------------|
| `trade_flow` | Get bilateral trade data between two countries &mdash; import/export values by commodity |
| `trade_partners` | Get top trade partners for a country |
| `trade_commodity` | Get global trade data for a specific commodity (HS code) |
| `trade_timeseries` | Get trade volume time series for a country pair over multiple years |
| `trade_balance` | Calculate trade balance between two countries &mdash; exports minus imports |

</details>

### 22. Seismic & Disaster &mdash; 5 tools

<details>
<summary>Expand tool list</summary>

| Tool | Description |
|------|-------------|
| `quake_recent` | Get recent earthquakes worldwide filtered by minimum magnitude &mdash; location, depth, tsunami warning |
| `quake_search` | Search earthquakes by date range, magnitude, and geographic region |
| `quake_detail` | Get detailed information about a specific earthquake by USGS event ID |
| `quake_area` | Get earthquakes within a bounding box over a specified time period |
| `quake_stats` | Earthquake statistics for a time period &mdash; magnitude distribution, deepest, strongest, averages |

</details>

### 23. OpenStreetMap / Overpass &mdash; 8 tools

<details>
<summary>Expand tool list</summary>

| Tool | Description |
|------|-------------|
| `osm_query` | Run a custom Overpass QL query against OpenStreetMap data &mdash; returns GeoJSON-like elements |
| `osm_buildings` | Count and classify buildings in a bounding box &mdash; residential, commercial, industrial |
| `osm_infrastructure` | Find roads, bridges, and railways in a bounding box |
| `osm_military` | Find military facilities (bases, airfields, barracks, bunkers, checkpoints) in a bounding box |
| `osm_airports` | Find airports, airfields, and helipads in a bounding box |
| `osm_water` | Find water bodies, rivers, streams, and dams in a bounding box |
| `osm_industrial` | Find industrial sites, power plants, and refineries in a bounding box |
| `osm_identify` | Identify what is at a given coordinate &mdash; search within a radius for named features |

</details>

### 24. Geocoding & Coordinates &mdash; 8 tools

<details>
<summary>Expand tool list</summary>

| Tool | Description |
|------|-------------|
| `geo_forward` | Forward geocoding: convert an address or place name to geographic coordinates (Nominatim) |
| `geo_reverse` | Reverse geocoding: convert latitude/longitude to a human-readable address (Nominatim) |
| `geo_distance` | Calculate great-circle distance between two points using the Haversine formula |
| `geo_bbox` | Compute a bounding box from a center point and radius in kilometers |
| `geo_mgrs` | Convert between MGRS (Military Grid Reference System) and latitude/longitude coordinates |
| `geo_elevation` | Get the elevation at a geographic coordinate using the Open Elevation API |
| `geo_timezone` | Estimate the timezone at a geographic coordinate based on longitude |
| `geo_sun` | Calculate sun position data &mdash; sunrise, sunset, solar noon, civil dawn/dusk, day length |

</details>

### 25. Spectral Analysis &mdash; 8 tools

<details>
<summary>Expand tool list</summary>

| Tool | Description |
|------|-------------|
| `spectral_ndvi` | Calculate Normalized Difference Vegetation Index from NIR and Red band reflectance |
| `spectral_ndwi` | Calculate Normalized Difference Water Index from Green and NIR band reflectance |
| `spectral_nbr` | Calculate Normalized Burn Ratio from NIR and SWIR band reflectance |
| `spectral_evi` | Calculate Enhanced Vegetation Index from NIR, Red, and Blue band reflectance |
| `spectral_ndbi` | Calculate Normalized Difference Built-up Index from SWIR and NIR band reflectance |
| `spectral_bsi` | Calculate Bare Soil Index from SWIR, Red, NIR, and Blue band reflectance |
| `spectral_savi` | Calculate Soil Adjusted Vegetation Index from NIR and Red band reflectance |
| `spectral_custom` | Evaluate a custom band math expression using a safe expression parser |

</details>

### 26. Change Detection &mdash; 6 tools

<details>
<summary>Expand tool list</summary>

| Tool | Description |
|------|-------------|
| `change_detect` | General-purpose change detection: computes difference of any spectral index between two dates |
| `change_vegetation` | Vegetation change detection using NDVI between two dates |
| `change_urban` | Urban expansion detection using NDBI between two dates |
| `change_water` | Water body change detection using NDWI between two dates |
| `change_burn` | Fire scar / burn severity detection using dNBR between pre-fire and post-fire dates |
| `change_summary` | Multi-index change report: NDVI, NDWI, NDBI, NBR, BSI for an overall landscape change assessment |

</details>

### 27. Weather & Atmosphere &mdash; 6 tools

<details>
<summary>Expand tool list</summary>

| Tool | Description |
|------|-------------|
| `weather_current` | Get current weather conditions &mdash; temperature, humidity, wind, pressure, cloud cover, precipitation |
| `weather_forecast` | Get 7-day weather forecast with daily temperature, precipitation, wind, sunrise, and sunset |
| `weather_historical` | Get historical weather data for a specific date and location |
| `weather_satellite_window` | Find optimal satellite imaging windows (low cloud cover periods) for the next N days |
| `atmosphere_air_quality` | Get current air quality index and pollutant concentrations (PM2.5, PM10, NO2, SO2, CO, Ozone) |
| `atmosphere_uv` | Get current UV index at a coordinate with risk classification |

</details>

### Meta &mdash; 1 tool

| Tool | Description |
|------|-------------|
| `satellite_list_sources` | List all data sources, API key configuration status, and tool counts across all 27 categories |

---

## API Keys

All API keys are configured via environment variables. Most tools work without any keys at all.

| Environment Variable | Service | Required | Purpose |
|---------------------|---------|----------|---------|
| `COPERNICUS_CLIENT_ID` | Copernicus Data Space | Optional | Sentinel-2 imagery download and quicklook access |
| `COPERNICUS_CLIENT_SECRET` | Copernicus Data Space | Optional | Sentinel-2 OAuth2 authentication (pair with CLIENT_ID) |
| `USGS_USERNAME` | USGS EarthExplorer | Optional | Landsat scene search, metadata, and download |
| `USGS_PASSWORD` | USGS EarthExplorer | Optional | Landsat authentication (pair with USERNAME) |
| `NASA_API_KEY` | NASA Open APIs | Optional | Earth imagery, EPIC, POWER data (fallback: DEMO_KEY) |
| `NASA_FIRMS_KEY` | NASA FIRMS | Optional | Active fire detections (fallback: DEMO_KEY) |
| `NASA_EARTHDATA_TOKEN` | NASA Earthdata | Optional | Premium NASA data access |
| `PLANET_API_KEY` | Planet Labs | Required | Daily 3m satellite imagery (search, metadata, thumbnails) |
| `OPENSKY_USERNAME` | OpenSky Network | Optional | Higher rate limits for aircraft tracking |
| `OPENSKY_PASSWORD` | OpenSky Network | Optional | OpenSky authentication (pair with USERNAME) |
| `GFW_API_KEY` | Global Fishing Watch | Optional | Maritime vessel tracking, fishing activity, AIS gaps |
| `N2YO_API_KEY` | N2YO | Optional | Satellite pass predictions and overhead tracking |
| `ACLED_API_KEY` | ACLED | Optional | Armed conflict event data |
| `ACLED_EMAIL` | ACLED | Optional | ACLED registered email (pair with API_KEY) |
| `COMTRADE_API_KEY` | UN Comtrade | Optional | International trade flow data |
| `TIMEZONEDB_KEY` | TimezoneDB | Optional | Enhanced timezone lookups |

**Without any API keys**, the following categories work fully: Night Lights, Military & Defense, Critical Infrastructure, Sanctions & Compliance, Terrain & Elevation, Cyber-Geo Intelligence, Population & Demographics, Agriculture & Food Security, Humanitarian & Refugee, Ocean Intelligence, Seismic & Disaster, OpenStreetMap, Geocoding & Coordinates, Spectral Analysis, Change Detection, Weather & Atmosphere. NASA tools fall back to `DEMO_KEY` with lower rate limits.

---

## Architecture

```
src/
  index.ts                # CLI entrypoint (--help, --list, --tool, stdio server)
  protocol/
    mcp-server.ts         # MCP server setup (stdio transport)
    tools.ts              # Tool registry — all 171 tools assembled here
  types/
    index.ts              # Shared types (ToolDef, ToolContext, ToolResult)
  utils/
    rate-limiter.ts       # Per-provider rate limiter
    cache.ts              # TTL cache for API responses
    geo-math.ts           # Haversine distance, bounding box computation
    require-key.ts        # API key validation helper
  sentinel/               # Sentinel-2 (Copernicus) tools (8)
  landsat/                # Landsat (USGS) tools (7)
  firms/                  # NASA FIRMS active fire tools (6)
  nasa/                   # NASA Earth observation tools (7)
  nightlights/            # VIIRS night lights tools (5)
  planet/                 # Planet Labs tools (4)
  aircraft/               # Aircraft intelligence tools (10)
  maritime/               # Maritime intelligence tools (8)
  military/               # Military & defense tools (8)
  space/                  # Space & orbital tracking tools (6)
  conflict/               # Conflict & events tools (6)
  environment/            # Environmental intelligence tools (6)
  infrastructure/         # Critical infrastructure tools (6)
  sanctions/              # Sanctions & compliance tools (5)
  terrain/                # Terrain & elevation tools (6)
  cyber/                  # Cyber-geo intelligence tools (6)
  population/             # Population & demographics tools (5)
  agriculture/            # Agriculture & food security tools (5)
  humanitarian/           # Humanitarian & refugee tools (5)
  ocean/                  # Ocean intelligence tools (5)
  trade/                  # Trade intelligence tools (5)
  seismic/                # Seismic & disaster tools (5)
  osm/                    # OpenStreetMap / Overpass tools (8)
  geo/                    # Geocoding & coordinates tools (8)
  spectral/               # Spectral analysis tools (8)
  change/                 # Change detection tools (6)
  weather/                # Weather & atmosphere tools (6)
  meta/                   # Meta tools (1)
```

**Design decisions:**

- **27 providers, 1 server** &mdash; Every data source is an independent module under `src/`. The AI agent picks which tools to use based on the query.
- **Per-provider rate limiters** &mdash; Each data source has its own `RateLimiter` instance calibrated to that API's limits. No shared bottleneck.
- **TTL caching** &mdash; API responses are cached with source-appropriate TTLs: 2 minutes for live aircraft data, 5 minutes for fire data, 15 minutes for satellite catalogs, 30 minutes for NASA archives.
- **Graceful degradation** &mdash; Missing API keys never crash the server. Tools return descriptive error messages with instructions: "Set PLANET_API_KEY to enable Planet Labs tools."
- **Pure computation** &mdash; Spectral analysis and change detection tools are pure math functions with zero external API calls. NDVI, NDWI, NBR, EVI, and custom band expressions run instantly.
- **2 dependencies** &mdash; `@modelcontextprotocol/sdk` and `zod`. All HTTP via native `fetch()`. All geo math is hand-written.

---

## Use Cases

- **Monitor deforestation and illegal logging** &mdash; Combine Sentinel-2 imagery search, NDVI spectral analysis, and GLAD deforestation alerts to track forest loss over time
- **Track aircraft and vessel movements** &mdash; Use aircraft and maritime tools for real-time ADS-B and AIS surveillance, detect military flights, dark vessel activity, and sanctions evasion
- **Detect conflict hotspots and humanitarian crises** &mdash; Query ACLED for armed conflict events, correlate with GDELT news data, and check UNHCR displacement statistics
- **Analyze urban growth and infrastructure changes** &mdash; Compare night light imagery across dates, compute NDBI for built-up area detection, and query OSM for new construction
- **Monitor sanctions compliance** &mdash; Cross-reference vessel movements with OFAC SDN lists, detect AIS dark periods, and verify port visits against sanctioned countries
- **Assess natural disaster impact** &mdash; Combine earthquake data with terrain elevation, fire detection with burn severity indices, and satellite imagery for before/after analysis
- **Agricultural drought and food security monitoring** &mdash; Track vegetation health via NDVI, correlate with NASA POWER weather data, and check FEWS NET famine risk assessments
- **Cyber-geographic intelligence** &mdash; Geolocate IP addresses, detect internet censorship and outages, map submarine cable infrastructure, and correlate with conflict data

---

## Contributing

Contributions are welcome. Please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/new-provider`)
3. Install dependencies: `bun install`
4. Run in dev mode: `bun run dev`
5. Add your provider under `src/<provider>/index.ts`
6. Register tools in `src/protocol/tools.ts`
7. Commit your changes (Conventional Commits format)
8. Open a Pull Request

---

## License

[MIT](LICENSE)

<p align="center">
  Built with TypeScript + Bun
</p>
