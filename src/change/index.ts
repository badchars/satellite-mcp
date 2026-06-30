import { z } from "zod";
import type { ToolDef } from "../types/index.js";
import { json } from "../types/index.js";

// ─── Helpers ────────────────────────────────────────────────────────

function ndvi(nir: number, red: number): number {
  return (nir - red) / (nir + red);
}

function ndbi(swir: number, nir: number): number {
  return (swir - nir) / (swir + nir);
}

function ndwi(green: number, nir: number): number {
  return (green - nir) / (green + nir);
}

function nbr(nir: number, swir: number): number {
  return (nir - swir) / (nir + swir);
}

/** Bare-soil index: (SWIR - NIR) / (SWIR + NIR + 1e-10) — avoids div/0 */
function bsi(swir: number, red: number, nir: number, blue: number): number {
  return ((swir + red) - (nir + blue)) / ((swir + red) + (nir + blue) + 1e-10);
}

function round4(n: number): number {
  return Math.round(n * 10_000) / 10_000;
}

function magnitude(diff: number): "negligible" | "minor" | "moderate" | "major" | "extreme" {
  const abs = Math.abs(diff);
  if (abs < 0.05) return "negligible";
  if (abs < 0.1) return "minor";
  if (abs < 0.2) return "moderate";
  if (abs < 0.4) return "major";
  return "extreme";
}

function direction(diff: number): "increase" | "decrease" | "stable" {
  if (diff > 0.005) return "increase";
  if (diff < -0.005) return "decrease";
  return "stable";
}

function burnSeverity(
  dnbr: number,
): "Enhanced regrowth" | "Unburned" | "Low" | "Moderate-Low" | "Moderate-High" | "High" {
  if (dnbr < -0.25) return "Enhanced regrowth";
  if (dnbr <= 0.1) return "Unburned";
  if (dnbr <= 0.27) return "Low";
  if (dnbr <= 0.44) return "Moderate-Low";
  if (dnbr <= 0.66) return "Moderate-High";
  return "High";
}

function vegetationInterpretation(diff: number): string {
  if (diff <= -0.2) return "Deforestation/crop failure";
  if (diff < -0.05) return "Vegetation stress";
  if (diff <= 0.05) return "Stable";
  return "Vegetation growth/recovery";
}

function urbanInterpretation(diff: number): string {
  if (diff > 0.05) return "Urban expansion";
  if (diff < -0.05) return "Urban decline/revegetation";
  return "Stable";
}

function waterInterpretation(diff: number): string {
  if (diff > 0.05) return "Water body expansion/flooding";
  if (diff < -0.05) return "Water recession/drought";
  return "Stable";
}

// ─── Tools ──────────────────────────────────────────────────────────

export const changeTools: ToolDef[] = [
  // ── 1. change_detect ──────────────────────────────────────────────
  {
    name: "change_detect",
    description:
      "General-purpose change detection: computes the difference of any spectral index between two dates and classifies the magnitude of change.",
    schema: {
      index_before: z.number().describe("Index value for the earlier date"),
      index_after: z.number().describe("Index value for the later date"),
      index_name: z
        .string()
        .describe('Name of the spectral index being compared (e.g. "NDVI", "NDWI")'),
    },
    async execute(args) {
      const before = args.index_before as number;
      const after = args.index_after as number;
      const name = args.index_name as string;

      const diff = round4(after - before);
      const pct = before !== 0 ? round4((diff / Math.abs(before)) * 100) : null;

      return json({
        index_name: name,
        before: round4(before),
        after: round4(after),
        difference: diff,
        percentChange: pct,
        direction: direction(diff),
        magnitude: magnitude(diff),
      });
    },
  },

  // ── 2. change_vegetation ──────────────────────────────────────────
  {
    name: "change_vegetation",
    description:
      "Vegetation change detection using NDVI (Normalized Difference Vegetation Index). Computes NDVI for two dates from NIR and Red band reflectance values and interprets the difference.",
    schema: {
      nir_before: z.number().describe("Near-infrared reflectance for the earlier date"),
      red_before: z.number().describe("Red band reflectance for the earlier date"),
      nir_after: z.number().describe("Near-infrared reflectance for the later date"),
      red_after: z.number().describe("Red band reflectance for the later date"),
    },
    async execute(args) {
      const ndviBefore = round4(
        ndvi(args.nir_before as number, args.red_before as number),
      );
      const ndviAfter = round4(
        ndvi(args.nir_after as number, args.red_after as number),
      );
      const diff = round4(ndviAfter - ndviBefore);

      return json({
        ndvi_before: ndviBefore,
        ndvi_after: ndviAfter,
        difference: diff,
        interpretation: vegetationInterpretation(diff),
      });
    },
  },

  // ── 3. change_urban ───────────────────────────────────────────────
  {
    name: "change_urban",
    description:
      "Urban expansion detection using NDBI (Normalized Difference Built-up Index). Computes NDBI for two dates from SWIR and NIR band reflectance values and interprets the difference.",
    schema: {
      swir_before: z.number().describe("Short-wave infrared reflectance for the earlier date"),
      nir_before: z.number().describe("Near-infrared reflectance for the earlier date"),
      swir_after: z.number().describe("Short-wave infrared reflectance for the later date"),
      nir_after: z.number().describe("Near-infrared reflectance for the later date"),
    },
    async execute(args) {
      const ndbiBefore = round4(
        ndbi(args.swir_before as number, args.nir_before as number),
      );
      const ndbiAfter = round4(
        ndbi(args.swir_after as number, args.nir_after as number),
      );
      const diff = round4(ndbiAfter - ndbiBefore);

      return json({
        ndbi_before: ndbiBefore,
        ndbi_after: ndbiAfter,
        difference: diff,
        interpretation: urbanInterpretation(diff),
      });
    },
  },

  // ── 4. change_water ───────────────────────────────────────────────
  {
    name: "change_water",
    description:
      "Water body change detection using NDWI (Normalized Difference Water Index). Computes NDWI for two dates from Green and NIR band reflectance values and interprets the difference.",
    schema: {
      green_before: z.number().describe("Green band reflectance for the earlier date"),
      nir_before: z.number().describe("Near-infrared reflectance for the earlier date"),
      green_after: z.number().describe("Green band reflectance for the later date"),
      nir_after: z.number().describe("Near-infrared reflectance for the later date"),
    },
    async execute(args) {
      const ndwiBefore = round4(
        ndwi(args.green_before as number, args.nir_before as number),
      );
      const ndwiAfter = round4(
        ndwi(args.green_after as number, args.nir_after as number),
      );
      const diff = round4(ndwiAfter - ndwiBefore);

      return json({
        ndwi_before: ndwiBefore,
        ndwi_after: ndwiAfter,
        difference: diff,
        interpretation: waterInterpretation(diff),
      });
    },
  },

  // ── 5. change_burn ────────────────────────────────────────────────
  {
    name: "change_burn",
    description:
      "Fire scar / burn severity detection using dNBR (differenced Normalized Burn Ratio). Computes NBR for pre-fire and post-fire dates from NIR and SWIR bands, then classifies burn severity.",
    schema: {
      nir_before: z.number().describe("Near-infrared reflectance for the pre-fire date"),
      swir_before: z.number().describe("Short-wave infrared reflectance for the pre-fire date"),
      nir_after: z.number().describe("Near-infrared reflectance for the post-fire date"),
      swir_after: z.number().describe("Short-wave infrared reflectance for the post-fire date"),
    },
    async execute(args) {
      const nbrBefore = round4(
        nbr(args.nir_before as number, args.swir_before as number),
      );
      const nbrAfter = round4(
        nbr(args.nir_after as number, args.swir_after as number),
      );
      const dnbr = round4(nbrBefore - nbrAfter);

      return json({
        nbr_before: nbrBefore,
        nbr_after: nbrAfter,
        dnbr,
        severity: burnSeverity(dnbr),
      });
    },
  },

  // ── 6. change_summary ─────────────────────────────────────────────
  {
    name: "change_summary",
    description:
      "Multi-index change report: computes NDVI (vegetation), NDWI (water), NDBI (urban), NBR (burn), and BSI (soil) for two dates and produces an overall landscape change assessment.",
    schema: {
      nir_before: z.number().describe("Near-infrared reflectance for the earlier date"),
      red_before: z.number().describe("Red band reflectance for the earlier date"),
      green_before: z.number().describe("Green band reflectance for the earlier date"),
      blue_before: z.number().describe("Blue band reflectance for the earlier date"),
      swir_before: z.number().describe("Short-wave infrared reflectance for the earlier date"),
      nir_after: z.number().describe("Near-infrared reflectance for the later date"),
      red_after: z.number().describe("Red band reflectance for the later date"),
      green_after: z.number().describe("Green band reflectance for the later date"),
      blue_after: z.number().describe("Blue band reflectance for the later date"),
      swir_after: z.number().describe("Short-wave infrared reflectance for the later date"),
    },
    async execute(args) {
      const nirB = args.nir_before as number;
      const redB = args.red_before as number;
      const greenB = args.green_before as number;
      const blueB = args.blue_before as number;
      const swirB = args.swir_before as number;
      const nirA = args.nir_after as number;
      const redA = args.red_after as number;
      const greenA = args.green_after as number;
      const blueA = args.blue_after as number;
      const swirA = args.swir_after as number;

      // Vegetation (NDVI)
      const vegBefore = round4(ndvi(nirB, redB));
      const vegAfter = round4(ndvi(nirA, redA));
      const vegChange = round4(vegAfter - vegBefore);

      // Water (NDWI)
      const watBefore = round4(ndwi(greenB, nirB));
      const watAfter = round4(ndwi(greenA, nirA));
      const watChange = round4(watAfter - watBefore);

      // Urban (NDBI)
      const urbBefore = round4(ndbi(swirB, nirB));
      const urbAfter = round4(ndbi(swirA, nirA));
      const urbChange = round4(urbAfter - urbBefore);

      // Burn (NBR / dNBR)
      const nbrBefore = round4(nbr(nirB, swirB));
      const nbrAfter = round4(nbr(nirA, swirA));
      const dnbr = round4(nbrBefore - nbrAfter);

      // Soil (BSI)
      const soilBefore = round4(bsi(swirB, redB, nirB, blueB));
      const soilAfter = round4(bsi(swirA, redA, nirA, blueA));
      const soilChange = round4(soilAfter - soilBefore);

      // Overall assessment
      const findings: string[] = [];

      if (Math.abs(vegChange) > 0.1)
        findings.push(vegetationInterpretation(vegChange));
      if (Math.abs(watChange) > 0.1)
        findings.push(waterInterpretation(watChange));
      if (Math.abs(urbChange) > 0.1)
        findings.push(urbanInterpretation(urbChange));
      if (dnbr > 0.1)
        findings.push(`Burn detected (${burnSeverity(dnbr)} severity)`);
      if (Math.abs(soilChange) > 0.1)
        findings.push(
          soilChange > 0 ? "Increased bare soil exposure" : "Decreased bare soil exposure",
        );

      const overallAssessment =
        findings.length > 0
          ? findings.join("; ")
          : "No significant landscape change detected";

      return json({
        vegetation: { before: vegBefore, after: vegAfter, change: vegChange },
        water: { before: watBefore, after: watAfter, change: watChange },
        urban: { before: urbBefore, after: urbAfter, change: urbChange },
        burn: { nbr_before: nbrBefore, nbr_after: nbrAfter, dnbr },
        soil: { before: soilBefore, after: soilAfter, change: soilChange },
        overallAssessment,
      });
    },
  },
];
