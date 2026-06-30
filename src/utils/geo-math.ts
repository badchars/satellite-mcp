// ─── Geographic Math Utilities ───

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;
const EARTH_RADIUS_KM = 6371.0;

/** Haversine distance between two coordinates in kilometers */
export function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLat = (lat2 - lat1) * DEG2RAD;
  const dLng = (lng2 - lng1) * DEG2RAD;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * DEG2RAD) * Math.cos(lat2 * DEG2RAD) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Initial bearing from point 1 to point 2 in degrees */
export function bearing(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLng = (lng2 - lng1) * DEG2RAD;
  const y = Math.sin(dLng) * Math.cos(lat2 * DEG2RAD);
  const x =
    Math.cos(lat1 * DEG2RAD) * Math.sin(lat2 * DEG2RAD) -
    Math.sin(lat1 * DEG2RAD) * Math.cos(lat2 * DEG2RAD) * Math.cos(dLng);
  return ((Math.atan2(y, x) * RAD2DEG) + 360) % 360;
}

/** Bounding box from center + radius (km) */
export function bboxFromCenter(lat: number, lng: number, radiusKm: number): {
  south: number; west: number; north: number; east: number;
} {
  const dLat = (radiusKm / EARTH_RADIUS_KM) * RAD2DEG;
  const dLng = dLat / Math.cos(lat * DEG2RAD);
  return {
    south: lat - dLat,
    west: lng - dLng,
    north: lat + dLat,
    east: lng + dLng,
  };
}

/** Destination point given start, bearing (deg), and distance (km) */
export function destination(lat: number, lng: number, bearingDeg: number, distKm: number): {
  lat: number; lng: number;
} {
  const d = distKm / EARTH_RADIUS_KM;
  const brng = bearingDeg * DEG2RAD;
  const lat1 = lat * DEG2RAD;
  const lng1 = lng * DEG2RAD;

  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(d) + Math.cos(lat1) * Math.sin(d) * Math.cos(brng),
  );
  const lng2 =
    lng1 +
    Math.atan2(
      Math.sin(brng) * Math.sin(d) * Math.cos(lat1),
      Math.cos(d) - Math.sin(lat1) * Math.sin(lat2),
    );

  return { lat: lat2 * RAD2DEG, lng: ((lng2 * RAD2DEG) + 540) % 360 - 180 };
}

/** MGRS to lat/lng (simplified — covers standard UTM zones 1-60) */
export function mgrsToLatLng(mgrs: string): { lat: number; lng: number } {
  const cleaned = mgrs.replace(/\s/g, "").toUpperCase();

  // Parse zone number (1-60)
  const zoneMatch = cleaned.match(/^(\d{1,2})([C-X])([A-Z]{2})(\d+)$/);
  if (!zoneMatch) throw new Error("Invalid MGRS coordinate");

  const zoneNum = parseInt(zoneMatch[1], 10);
  const zoneLetter = zoneMatch[2];
  const gridLetters = zoneMatch[3];
  const digits = zoneMatch[4];

  if (zoneNum < 1 || zoneNum > 60) throw new Error("MGRS zone must be 1-60");
  if (digits.length % 2 !== 0) throw new Error("MGRS numeric part must have even digits");

  const precision = digits.length / 2;
  const easting100k = gridLetters.charCodeAt(0) - 65; // A=0
  const northing100k = gridLetters.charCodeAt(1) - 65;

  const eastingStr = digits.substring(0, precision);
  const northingStr = digits.substring(precision);

  // Scale to meters
  const scale = Math.pow(10, 5 - precision);
  const eastingM = parseInt(eastingStr, 10) * scale;
  const northingM = parseInt(northingStr, 10) * scale;

  // Column letter set (repeats every 3 zones)
  const set = ((zoneNum - 1) % 6);
  const colOrigin = set % 3 === 0 ? 0 : set % 3 === 1 ? 8 : 16; // A, J, S origins

  // Compute full UTM easting
  let e100k = easting100k - colOrigin;
  if (e100k < 0) e100k += 24;
  const fullEasting = (e100k + 1) * 100000 + eastingM;

  // Compute full UTM northing (simplified)
  const rowOrigin = set % 2 === 0 ? 0 : 5;
  let n100k = northing100k - rowOrigin;
  if (n100k < 0) n100k += 20;
  let fullNorthing = n100k * 100000 + northingM;

  // Adjust for latitude band
  const bandIndex = "CDEFGHJKLMNPQRSTUVWX".indexOf(zoneLetter);
  if (bandIndex >= 10) {
    // Northern hemisphere adjustments
    if (fullNorthing < 1000000) fullNorthing += 2000000;
  }

  // UTM to lat/lng (simplified conversion)
  const k0 = 0.9996;
  const e = 0.0818192;
  const e2 = e * e;
  const ep2 = e2 / (1 - e2);

  const centralMeridian = (zoneNum - 1) * 6 - 180 + 3;
  const isNorth = zoneLetter >= "N";

  const x = fullEasting - 500000;
  const y = isNorth ? fullNorthing : fullNorthing - 10000000;

  const M = y / k0;
  const mu = M / (6378137 * (1 - e2 / 4 - 3 * e2 * e2 / 64));

  const e1 = (1 - Math.sqrt(1 - e2)) / (1 + Math.sqrt(1 - e2));
  const phi1 =
    mu +
    (3 * e1 / 2 - 27 * e1 ** 3 / 32) * Math.sin(2 * mu) +
    (21 * e1 ** 2 / 16 - 55 * e1 ** 4 / 32) * Math.sin(4 * mu) +
    (151 * e1 ** 3 / 96) * Math.sin(6 * mu);

  const sinPhi = Math.sin(phi1);
  const cosPhi = Math.cos(phi1);
  const tanPhi = sinPhi / cosPhi;
  const N1 = 6378137 / Math.sqrt(1 - e2 * sinPhi ** 2);
  const T1 = tanPhi ** 2;
  const C1 = ep2 * cosPhi ** 2;
  const R1 = (6378137 * (1 - e2)) / (1 - e2 * sinPhi ** 2) ** 1.5;
  const D = x / (N1 * k0);

  const lat2 =
    phi1 -
    ((N1 * tanPhi) / R1) *
      (D ** 2 / 2 - ((5 + 3 * T1 + 10 * C1 - 4 * C1 ** 2 - 9 * ep2) * D ** 4) / 24 +
        ((61 + 90 * T1 + 298 * C1 + 45 * T1 ** 2 - 252 * ep2 - 3 * C1 ** 2) * D ** 6) / 720);

  const lng2 =
    centralMeridian * DEG2RAD +
    (D - ((1 + 2 * T1 + C1) * D ** 3) / 6 +
      ((5 - 2 * C1 + 28 * T1 - 3 * C1 ** 2 + 8 * ep2 + 24 * T1 ** 2) * D ** 5) / 120) /
      cosPhi;

  return { lat: lat2 * RAD2DEG, lng: lng2 * RAD2DEG };
}

/** Lat/lng to MGRS (simplified) */
export function latLngToMgrs(lat: number, lng: number, precision = 5): string {
  if (lat < -80 || lat > 84) throw new Error("MGRS latitude must be -80 to 84");

  const zoneNum = Math.floor((lng + 180) / 6) + 1;
  const bands = "CDEFGHJKLMNPQRSTUVWX";
  const bandIdx = Math.min(Math.floor((lat + 80) / 8), 19);
  const bandLetter = bands[bandIdx];

  // Lat/lng to UTM
  const k0 = 0.9996;
  const e = 0.0818192;
  const e2 = e * e;
  const ep2 = e2 / (1 - e2);

  const centralMeridian = (zoneNum - 1) * 6 - 180 + 3;
  const dLng = (lng - centralMeridian) * DEG2RAD;
  const phi = lat * DEG2RAD;

  const sinPhi = Math.sin(phi);
  const cosPhi = Math.cos(phi);
  const tanPhi = Math.tan(phi);
  const N = 6378137 / Math.sqrt(1 - e2 * sinPhi ** 2);
  const T = tanPhi ** 2;
  const C = ep2 * cosPhi ** 2;
  const A = dLng * cosPhi;

  const M =
    6378137 *
    ((1 - e2 / 4 - 3 * e2 ** 2 / 64) * phi -
      (3 * e2 / 8 + 3 * e2 ** 2 / 32) * Math.sin(2 * phi) +
      (15 * e2 ** 2 / 256) * Math.sin(4 * phi));

  const easting =
    k0 * N * (A + ((1 - T + C) * A ** 3) / 6 + ((5 - 18 * T + T ** 2) * A ** 5) / 120) + 500000;

  let northing =
    k0 *
    (M + N * tanPhi * (A ** 2 / 2 + ((5 - T + 9 * C + 4 * C ** 2) * A ** 4) / 24));

  if (lat < 0) northing += 10000000;

  // 100km grid letters
  const set = ((zoneNum - 1) % 6);
  const colOrigin = set % 3 === 0 ? 0 : set % 3 === 1 ? 8 : 16;
  const rowOrigin = set % 2 === 0 ? 0 : 5;

  const col = Math.floor(easting / 100000) - 1 + colOrigin;
  const row = (Math.floor(northing / 100000) % 20) + rowOrigin;

  const col1 = String.fromCharCode(65 + (col % 24));
  const row1 = String.fromCharCode(65 + (row % 20));

  const eRem = Math.floor(easting % 100000);
  const nRem = Math.floor(northing % 100000);

  const scale = Math.pow(10, 5 - precision);
  const eStr = Math.floor(eRem / scale).toString().padStart(precision, "0");
  const nStr = Math.floor(nRem / scale).toString().padStart(precision, "0");

  return `${zoneNum}${bandLetter}${col1}${row1}${eStr}${nStr}`;
}

/** Sun position (simplified) — returns sunrise, sunset, solar noon in UTC */
export function sunTimes(lat: number, lng: number, date: Date = new Date()): {
  sunrise: string; sunset: string; solarNoon: string;
  civilDawn: string; civilDusk: string;
  dayLengthHours: number;
} {
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000,
  );
  const B = ((360 / 365) * (dayOfYear - 81)) * DEG2RAD;
  const EoT = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B); // minutes
  const decl = 23.45 * Math.sin(((360 / 365) * (dayOfYear - 81)) * DEG2RAD) * DEG2RAD;

  const cosH = (sinDeg: number) =>
    (Math.sin(sinDeg * DEG2RAD) - Math.sin(lat * DEG2RAD) * Math.sin(decl)) /
    (Math.cos(lat * DEG2RAD) * Math.cos(decl));

  const solarNoonMin = 720 - 4 * lng - EoT;

  const cosH0 = cosH(-0.833); // geometric sunrise/sunset
  const cosHCivil = cosH(-6); // civil twilight

  const format = (totalMin: number): string => {
    const h = Math.floor(totalMin / 60);
    const m = Math.floor(totalMin % 60);
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")} UTC`;
  };

  if (cosH0 > 1) {
    // Polar night
    return {
      sunrise: "none (polar night)",
      sunset: "none (polar night)",
      solarNoon: format(solarNoonMin),
      civilDawn: "none",
      civilDusk: "none",
      dayLengthHours: 0,
    };
  }
  if (cosH0 < -1) {
    // Midnight sun
    return {
      sunrise: "none (midnight sun)",
      sunset: "none (midnight sun)",
      solarNoon: format(solarNoonMin),
      civilDawn: "none",
      civilDusk: "none",
      dayLengthHours: 24,
    };
  }

  const H0 = Math.acos(cosH0) * RAD2DEG;
  const sunriseMin = solarNoonMin - 4 * H0;
  const sunsetMin = solarNoonMin + 4 * H0;

  let civilDawn = "none";
  let civilDusk = "none";
  if (cosHCivil >= -1 && cosHCivil <= 1) {
    const Hc = Math.acos(cosHCivil) * RAD2DEG;
    civilDawn = format(solarNoonMin - 4 * Hc);
    civilDusk = format(solarNoonMin + 4 * Hc);
  }

  return {
    sunrise: format(sunriseMin),
    sunset: format(sunsetMin),
    solarNoon: format(solarNoonMin),
    civilDawn,
    civilDusk,
    dayLengthHours: Math.round(((sunsetMin - sunriseMin) / 60) * 100) / 100,
  };
}

/** Slope angle between two points given their elevations and distance */
export function slopeAngle(elev1: number, elev2: number, distKm: number): number {
  const rise = elev2 - elev1;
  const run = distKm * 1000; // meters
  return Math.atan2(rise, run) * RAD2DEG;
}

/** Line of sight check (Bresenham-style profile check) */
export function lineOfSight(
  profile: { dist: number; elev: number }[],
  observerHeight: number,
  targetHeight: number,
): { visible: boolean; obstructionIndex: number | null } {
  if (profile.length < 2) return { visible: true, obstructionIndex: null };

  const startElev = profile[0].elev + observerHeight;
  const endElev = profile[profile.length - 1].elev + targetHeight;
  const totalDist = profile[profile.length - 1].dist - profile[0].dist;

  for (let i = 1; i < profile.length - 1; i++) {
    const frac = (profile[i].dist - profile[0].dist) / totalDist;
    const losElev = startElev + frac * (endElev - startElev);
    if (profile[i].elev > losElev) {
      return { visible: false, obstructionIndex: i };
    }
  }

  return { visible: true, obstructionIndex: null };
}

/** Interpolate N points along a great circle between two coordinates */
export function interpolateGreatCircle(
  lat1: number, lng1: number, lat2: number, lng2: number, n: number,
): { lat: number; lng: number }[] {
  const points: { lat: number; lng: number }[] = [];
  const totalDist = haversine(lat1, lng1, lat2, lng2);
  const brng = bearing(lat1, lng1, lat2, lng2);

  for (let i = 0; i <= n; i++) {
    const frac = i / n;
    const d = frac * totalDist;
    points.push(destination(lat1, lng1, brng, d));
  }

  return points;
}
