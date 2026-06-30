# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-06-30

### Added

- Initial release with 171 tools across 27 categories and 27+ API integrations
- MCP server with stdio transport for AI agent integration
- **Sentinel-2 Imagery** -- multispectral search, band retrieval, NDVI computation, cloud-filtered acquisition
- **Landsat Imagery** -- scene search, metadata retrieval, band selection, temporal composites
- **NASA FIRMS** -- active fire detection, hotspot monitoring, fire radiative power, historical fire data
- **NASA APIs** -- Earth imagery, EPIC, DONKI space weather, NEO asteroid tracking, Mars rover photos
- **Nighttime Lights** -- VIIRS radiance data, light pollution mapping, economic activity proxy
- **Planet Labs** -- daily imagery search, scene activation, asset download, mosaic access
- **Aircraft Tracking** -- ADS-B live positions, flight history, airport activity, aircraft registration, military transponder detection
- **Maritime Tracking** -- AIS vessel positions, port activity, vessel search, route history, fleet monitoring
- **Space Tracking** -- satellite TLE lookup, pass prediction, conjunction analysis, debris monitoring
- **Military Intelligence** -- base detection, equipment classification, activity monitoring, order of battle
- **Conflict Data** -- ACLED event search, fatality analysis, actor tracking, trend mapping
- **Environmental Monitoring** -- deforestation alerts, air quality, water body changes, glacier tracking
- **Ocean & Marine** -- sea surface temperature, ocean color, wave height, marine protected areas
- **Seismic Data** -- earthquake search, magnitude filtering, tectonic plate boundaries, historical seismicity
- **Weather Intelligence** -- current conditions, forecasts, severe weather alerts, historical data
- **Terrain & Elevation** -- DEM queries, slope analysis, viewshed computation, elevation profiles
- **Infrastructure Monitoring** -- road network analysis, building footprints, power grid mapping, dam monitoring
- **Sanctions Screening** -- entity search, vessel sanctions, trade restrictions, compliance checks
- **Cyber-Geospatial Intel** -- IP geolocation, hosting infrastructure mapping, cable landing points, data center locations
- **Population & Demographics** -- population density, urbanization trends, displacement tracking, census data
- **Agriculture & Crops** -- crop health monitoring, harvest estimation, soil moisture, drought indices
- **Humanitarian Crisis** -- refugee camp detection, displacement flows, aid distribution, crisis mapping
- **Global Trade** -- shipping lane analysis, port throughput, commodity flows, trade route monitoring
- **OpenStreetMap** -- Overpass queries, POI search, boundary lookup, feature extraction
- **Geospatial Computation** -- coordinate transforms, distance calculations, polygon operations, buffer analysis
- **Spectral Analysis** -- band math, vegetation indices, water indices, custom band combinations
- **Change Detection** -- temporal differencing, anomaly detection, land use classification, urban sprawl analysis
- **Meta** -- server info and tool listing
- CLI with `--list`, `--help` flags
- Per-provider rate limiting and TTL caching
