// ─── All Tools Aggregator — 28 providers, 161 tools ───

import { sentinelTools } from "../sentinel/index.js";
import { landsatTools } from "../landsat/index.js";
import { firmsTools } from "../firms/index.js";
import { nasaTools } from "../nasa/index.js";
import { nightlightsTools } from "../nightlights/index.js";
import { planetTools } from "../planet/index.js";
import { aircraftTools } from "../aircraft/index.js";
import { maritimeTools } from "../maritime/index.js";
import { militaryTools } from "../military/index.js";
import { spaceTools } from "../space/index.js";
import { conflictTools } from "../conflict/index.js";
import { environmentTools } from "../environment/index.js";
import { infrastructureTools } from "../infrastructure/index.js";
import { sanctionsTools } from "../sanctions/index.js";
import { terrainTools } from "../terrain/index.js";
import { cyberTools } from "../cyber/index.js";
import { populationTools } from "../population/index.js";
import { agricultureTools } from "../agriculture/index.js";
import { humanitarianTools } from "../humanitarian/index.js";
import { oceanTools } from "../ocean/index.js";
import { tradeTools } from "../trade/index.js";
import { seismicTools } from "../seismic/index.js";
import { osmTools } from "../osm/index.js";
import { geoTools } from "../geo/index.js";
import { spectralTools } from "../spectral/index.js";
import { changeTools } from "../change/index.js";
import { weatherTools } from "../weather/index.js";
import { metaTools } from "../meta/index.js";
import type { ToolDef } from "../types/index.js";

export const allTools: ToolDef[] = [
  // Satellite Imagery (37)
  ...sentinelTools,       // 8
  ...landsatTools,        // 7
  ...firmsTools,          // 6
  ...nasaTools,           // 7
  ...nightlightsTools,    // 5
  ...planetTools,         // 4

  // Tracking & Surveillance (24)
  ...aircraftTools,       // 10
  ...maritimeTools,       // 8
  ...spaceTools,          // 6

  // Security & Defense (14)
  ...militaryTools,       // 8
  ...conflictTools,       // 6

  // Earth Science & Environment (23)
  ...environmentTools,    // 6
  ...oceanTools,          // 5
  ...seismicTools,        // 5
  ...weatherTools,        // 6
  ...terrainTools,        // 6 (counted in Geospatial below)

  // Infrastructure & Compliance (11)
  ...infrastructureTools, // 6
  ...sanctionsTools,      // 5

  // Intelligence & Analytics (22)
  ...cyberTools,          // 6
  ...populationTools,     // 5
  ...agricultureTools,    // 5
  ...humanitarianTools,   // 5
  ...tradeTools,          // 5

  // Geospatial Computation (22)
  ...osmTools,            // 8
  ...geoTools,            // 8
  ...spectralTools,       // 8 (counted in computation)
  ...changeTools,         // 6

  // Meta (1)
  ...metaTools,           // 1
];
