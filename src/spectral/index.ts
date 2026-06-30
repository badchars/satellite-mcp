// Spectral Analysis — Pure computation tools for satellite band reflectance indices
// Tools: spectral_ndvi, spectral_ndwi, spectral_nbr, spectral_evi, spectral_ndbi,
//        spectral_bsi, spectral_savi, spectral_custom

import { z } from "zod";
import type { ToolDef } from "../types/index.js";
import { json } from "../types/index.js";

// ─── Shared Schema Helpers ───

/** Reflectance value in 0–1 range */
const reflectance = (band: string, description: string) =>
  z
    .number()
    .min(0)
    .max(1)
    .describe(`${band} band reflectance value (0–1). ${description}`);

// ─── Clamp helper ───

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// ─── 1. NDVI — Normalized Difference Vegetation Index ───

function classifyNdvi(index: number): string {
  if (index < 0) return "Water/Non-vegetated";
  if (index <= 0.2) return "Bare soil/rock";
  if (index <= 0.4) return "Sparse vegetation";
  if (index <= 0.6) return "Moderate vegetation";
  if (index <= 0.8) return "Dense vegetation";
  return "Very dense vegetation";
}

// ─── 2. NDWI — Normalized Difference Water Index ───

function classifyNdwi(index: number): string {
  if (index > 0.3) return "Open water";
  if (index >= 0) return "Flooding/wet";
  if (index >= -0.3) return "Moderate drought";
  return "Drought/dry";
}

// ─── 3. NBR — Normalized Burn Ratio ───

function classifyNbr(index: number): string {
  if (index > 0.66) return "Unburned";
  if (index >= 0.27) return "Low";
  if (index >= 0.1) return "Moderate-Low";
  if (index >= -0.1) return "Moderate-High";
  if (index >= -0.255) return "High";
  return "Very High";
}

// ─── 4. EVI — Enhanced Vegetation Index ───

function classifyEvi(index: number): string {
  if (index < 0) return "Water/Non-vegetated";
  if (index <= 0.1) return "Bare soil/rock";
  if (index <= 0.25) return "Sparse vegetation";
  if (index <= 0.4) return "Moderate vegetation";
  if (index <= 0.6) return "Dense vegetation";
  return "Very dense vegetation";
}

// ─── 5. NDBI — Normalized Difference Built-up Index ───

function classifyNdbi(index: number): string {
  if (index > 0.2) return "Dense urban";
  if (index >= 0) return "Suburban/sparse built-up";
  return "Non-built-up";
}

// ─── 6. BSI — Bare Soil Index ───

function classifyBsi(index: number): string {
  if (index > 0.3) return "Bare soil dominant";
  if (index > 0.1) return "Mixed soil/sparse cover";
  if (index > -0.1) return "Moderate cover";
  return "Dense vegetation cover";
}

// ─── 7. SAVI — Soil Adjusted Vegetation Index ───

function classifySavi(index: number): string {
  if (index < 0) return "Water/Non-vegetated";
  if (index <= 0.15) return "Bare soil/rock";
  if (index <= 0.35) return "Sparse vegetation";
  if (index <= 0.5) return "Moderate vegetation";
  if (index <= 0.7) return "Dense vegetation";
  return "Very dense vegetation";
}

// ─── 8. Safe Expression Parser for spectral_custom ───

/**
 * Tokenizer and recursive-descent parser for safe band math expressions.
 * Supports: numbers, band variable names, +, -, *, /, parentheses.
 * No eval(), no Function constructor, no arbitrary code execution.
 */

type Token =
  | { type: "number"; value: number }
  | { type: "ident"; value: string }
  | { type: "op"; value: "+" | "-" | "*" | "/" }
  | { type: "lparen" }
  | { type: "rparen" };

function tokenize(expression: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < expression.length) {
    const ch = expression[i]!;

    // Whitespace — skip
    if (/\s/.test(ch)) {
      i++;
      continue;
    }

    // Number (integer or decimal)
    if (/[0-9.]/.test(ch)) {
      let num = "";
      while (i < expression.length && /[0-9.]/.test(expression[i]!)) {
        num += expression[i]!;
        i++;
      }
      const parsed = parseFloat(num);
      if (isNaN(parsed)) {
        throw new Error(`Invalid number literal: "${num}"`);
      }
      tokens.push({ type: "number", value: parsed });
      continue;
    }

    // Identifier (band variable name, e.g. b1, nir, red)
    if (/[a-zA-Z_]/.test(ch)) {
      let ident = "";
      while (i < expression.length && /[a-zA-Z0-9_]/.test(expression[i]!)) {
        ident += expression[i]!;
        i++;
      }
      tokens.push({ type: "ident", value: ident });
      continue;
    }

    // Operators
    if (ch === "+" || ch === "-" || ch === "*" || ch === "/") {
      tokens.push({ type: "op", value: ch });
      i++;
      continue;
    }

    // Parentheses
    if (ch === "(") {
      tokens.push({ type: "lparen" });
      i++;
      continue;
    }
    if (ch === ")") {
      tokens.push({ type: "rparen" });
      i++;
      continue;
    }

    throw new Error(
      `Unexpected character "${ch}" at position ${i} in expression. Only numbers, band variables, +, -, *, /, and parentheses are allowed.`,
    );
  }

  return tokens;
}

/**
 * Recursive-descent parser implementing standard operator precedence:
 *   expr     -> term (('+' | '-') term)*
 *   term     -> unary (('*' | '/') unary)*
 *   unary    -> ('-')? primary
 *   primary  -> NUMBER | IDENT | '(' expr ')'
 */
function evaluateExpression(
  expression: string,
  bands: Record<string, number>,
): number {
  const tokens = tokenize(expression);
  let pos = 0;

  function peek(): Token | undefined {
    return tokens[pos];
  }

  function consume(): Token {
    const token = tokens[pos];
    if (!token) {
      throw new Error("Unexpected end of expression");
    }
    pos++;
    return token;
  }

  function parseExpr(): number {
    let left = parseTerm();

    while (pos < tokens.length) {
      const t = peek();
      if (t && t.type === "op" && (t.value === "+" || t.value === "-")) {
        consume();
        const right = parseTerm();
        left = t.value === "+" ? left + right : left - right;
      } else {
        break;
      }
    }

    return left;
  }

  function parseTerm(): number {
    let left = parseUnary();

    while (pos < tokens.length) {
      const t = peek();
      if (t && t.type === "op" && (t.value === "*" || t.value === "/")) {
        consume();
        const right = parseUnary();
        if (t.value === "/") {
          if (right === 0) {
            throw new Error("Division by zero in expression");
          }
          left = left / right;
        } else {
          left = left * right;
        }
      } else {
        break;
      }
    }

    return left;
  }

  function parseUnary(): number {
    const t = peek();
    if (t && t.type === "op" && t.value === "-") {
      consume();
      return -parsePrimary();
    }
    return parsePrimary();
  }

  function parsePrimary(): number {
    const t = consume();

    if (t.type === "number") {
      return t.value;
    }

    if (t.type === "ident") {
      if (!(t.value in bands)) {
        throw new Error(
          `Unknown band variable "${t.value}". Available bands: ${Object.keys(bands).join(", ")}`,
        );
      }
      return bands[t.value]!;
    }

    if (t.type === "lparen") {
      const result = parseExpr();
      const closing = consume();
      if (!closing || closing.type !== "rparen") {
        throw new Error("Expected closing parenthesis");
      }
      return result;
    }

    throw new Error(`Unexpected token: ${JSON.stringify(t)}`);
  }

  const result = parseExpr();

  if (pos < tokens.length) {
    throw new Error(
      `Unexpected token after end of expression: ${JSON.stringify(tokens[pos])}`,
    );
  }

  return result;
}

// ─── Tool Definitions ───

export const spectralTools: ToolDef[] = [
  // ── 1. NDVI ──
  {
    name: "spectral_ndvi",
    description:
      "Calculate Normalized Difference Vegetation Index (NDVI) from NIR and Red band reflectance values. " +
      "NDVI = (NIR - Red) / (NIR + Red). Values range from -1 to 1. " +
      "Widely used for assessing vegetation health, density, and agricultural monitoring.",
    schema: {
      nir: reflectance("NIR", "Near-Infrared band, typically Sentinel-2 Band 8 or Landsat Band 5."),
      red: reflectance("Red", "Red visible band, typically Sentinel-2 Band 4 or Landsat Band 4."),
    },
    execute: async (args) => {
      const nir = args.nir as number;
      const red = args.red as number;
      const denominator = nir + red;

      if (denominator === 0) {
        return json({
          index: 0,
          classification: "Undefined (NIR + Red = 0)",
          warning: "Both NIR and Red reflectance are zero; index is undefined, returned as 0.",
        });
      }

      const index = clamp((nir - red) / denominator, -1, 1);
      const classification = classifyNdvi(index);

      return json({
        index: Math.round(index * 10000) / 10000,
        classification,
        formula: "(NIR - Red) / (NIR + Red)",
        inputs: { nir, red },
      });
    },
  },

  // ── 2. NDWI ──
  {
    name: "spectral_ndwi",
    description:
      "Calculate Normalized Difference Water Index (NDWI) from Green and NIR band reflectance values. " +
      "NDWI = (Green - NIR) / (Green + NIR). Values range from -1 to 1. " +
      "Used for detecting water bodies, assessing flood extent, and monitoring drought conditions.",
    schema: {
      green: reflectance("Green", "Green visible band, typically Sentinel-2 Band 3 or Landsat Band 3."),
      nir: reflectance("NIR", "Near-Infrared band, typically Sentinel-2 Band 8 or Landsat Band 5."),
    },
    execute: async (args) => {
      const green = args.green as number;
      const nir = args.nir as number;
      const denominator = green + nir;

      if (denominator === 0) {
        return json({
          index: 0,
          classification: "Undefined (Green + NIR = 0)",
          warning: "Both Green and NIR reflectance are zero; index is undefined, returned as 0.",
        });
      }

      const index = clamp((green - nir) / denominator, -1, 1);
      const classification = classifyNdwi(index);

      return json({
        index: Math.round(index * 10000) / 10000,
        classification,
        formula: "(Green - NIR) / (Green + NIR)",
        inputs: { green, nir },
      });
    },
  },

  // ── 3. NBR ──
  {
    name: "spectral_nbr",
    description:
      "Calculate Normalized Burn Ratio (NBR) from NIR and SWIR band reflectance values. " +
      "NBR = (NIR - SWIR) / (NIR + SWIR). Values range from -1 to 1. " +
      "Used for mapping wildfire burn severity and monitoring post-fire recovery. " +
      "Can also be differenced between pre- and post-fire imagery (dNBR) for severity assessment.",
    schema: {
      nir: reflectance("NIR", "Near-Infrared band, typically Sentinel-2 Band 8 or Landsat Band 5."),
      swir: reflectance("SWIR", "Shortwave Infrared band, typically Sentinel-2 Band 12 or Landsat Band 7."),
    },
    execute: async (args) => {
      const nir = args.nir as number;
      const swir = args.swir as number;
      const denominator = nir + swir;

      if (denominator === 0) {
        return json({
          index: 0,
          severity: "Undefined (NIR + SWIR = 0)",
          warning: "Both NIR and SWIR reflectance are zero; index is undefined, returned as 0.",
        });
      }

      const index = clamp((nir - swir) / denominator, -1, 1);
      const severity = classifyNbr(index);

      return json({
        index: Math.round(index * 10000) / 10000,
        severity,
        formula: "(NIR - SWIR) / (NIR + SWIR)",
        inputs: { nir, swir },
      });
    },
  },

  // ── 4. EVI ──
  {
    name: "spectral_evi",
    description:
      "Calculate Enhanced Vegetation Index (EVI) from NIR, Red, and Blue band reflectance values. " +
      "EVI = 2.5 * (NIR - Red) / (NIR + 6*Red - 7.5*Blue + 1). " +
      "EVI improves on NDVI by correcting for atmospheric and soil background influences. " +
      "Particularly useful in high-biomass regions where NDVI saturates.",
    schema: {
      nir: reflectance("NIR", "Near-Infrared band, typically Sentinel-2 Band 8 or Landsat Band 5."),
      red: reflectance("Red", "Red visible band, typically Sentinel-2 Band 4 or Landsat Band 4."),
      blue: reflectance("Blue", "Blue visible band, typically Sentinel-2 Band 2 or Landsat Band 2."),
    },
    execute: async (args) => {
      const nir = args.nir as number;
      const red = args.red as number;
      const blue = args.blue as number;
      const denominator = nir + 6 * red - 7.5 * blue + 1;

      if (denominator === 0) {
        return json({
          index: 0,
          classification: "Undefined (denominator = 0)",
          warning: "EVI denominator (NIR + 6*Red - 7.5*Blue + 1) is zero; index is undefined, returned as 0.",
        });
      }

      const index = 2.5 * (nir - red) / denominator;
      const classification = classifyEvi(index);

      return json({
        index: Math.round(index * 10000) / 10000,
        classification,
        formula: "2.5 * (NIR - Red) / (NIR + 6*Red - 7.5*Blue + 1)",
        inputs: { nir, red, blue },
      });
    },
  },

  // ── 5. NDBI ──
  {
    name: "spectral_ndbi",
    description:
      "Calculate Normalized Difference Built-up Index (NDBI) from SWIR and NIR band reflectance values. " +
      "NDBI = (SWIR - NIR) / (SWIR + NIR). Values range from -1 to 1. " +
      "Used for mapping urban areas and built-up land. Higher values indicate denser built-up areas.",
    schema: {
      swir: reflectance("SWIR", "Shortwave Infrared band, typically Sentinel-2 Band 11 or Landsat Band 6."),
      nir: reflectance("NIR", "Near-Infrared band, typically Sentinel-2 Band 8 or Landsat Band 5."),
    },
    execute: async (args) => {
      const swir = args.swir as number;
      const nir = args.nir as number;
      const denominator = swir + nir;

      if (denominator === 0) {
        return json({
          index: 0,
          classification: "Undefined (SWIR + NIR = 0)",
          warning: "Both SWIR and NIR reflectance are zero; index is undefined, returned as 0.",
        });
      }

      const index = clamp((swir - nir) / denominator, -1, 1);
      const classification = classifyNdbi(index);

      return json({
        index: Math.round(index * 10000) / 10000,
        classification,
        formula: "(SWIR - NIR) / (SWIR + NIR)",
        inputs: { swir, nir },
      });
    },
  },

  // ── 6. BSI ──
  {
    name: "spectral_bsi",
    description:
      "Calculate Bare Soil Index (BSI) from SWIR, Red, NIR, and Blue band reflectance values. " +
      "BSI = ((SWIR + Red) - (NIR + Blue)) / ((SWIR + Red) + (NIR + Blue)). " +
      "Values range from -1 to 1. Used for mapping exposed soil, desertification monitoring, " +
      "and distinguishing bare soil from vegetated and built-up areas.",
    schema: {
      swir: reflectance("SWIR", "Shortwave Infrared band, typically Sentinel-2 Band 11 or Landsat Band 6."),
      red: reflectance("Red", "Red visible band, typically Sentinel-2 Band 4 or Landsat Band 4."),
      nir: reflectance("NIR", "Near-Infrared band, typically Sentinel-2 Band 8 or Landsat Band 5."),
      blue: reflectance("Blue", "Blue visible band, typically Sentinel-2 Band 2 or Landsat Band 2."),
    },
    execute: async (args) => {
      const swir = args.swir as number;
      const red = args.red as number;
      const nir = args.nir as number;
      const blue = args.blue as number;

      const numerator = (swir + red) - (nir + blue);
      const denominator = (swir + red) + (nir + blue);

      if (denominator === 0) {
        return json({
          index: 0,
          classification: "Undefined (all bands = 0)",
          warning: "All band reflectance values sum to zero; index is undefined, returned as 0.",
        });
      }

      const index = clamp(numerator / denominator, -1, 1);
      const classification = classifyBsi(index);

      return json({
        index: Math.round(index * 10000) / 10000,
        classification,
        formula: "((SWIR + Red) - (NIR + Blue)) / ((SWIR + Red) + (NIR + Blue))",
        inputs: { swir, red, nir, blue },
      });
    },
  },

  // ── 7. SAVI ──
  {
    name: "spectral_savi",
    description:
      "Calculate Soil Adjusted Vegetation Index (SAVI) from NIR and Red band reflectance values. " +
      "SAVI = ((NIR - Red) / (NIR + Red + L)) * (1 + L), where L is the soil brightness correction factor. " +
      "Default L = 0.5 is suitable for intermediate vegetation cover. " +
      "L = 0 reduces SAVI to NDVI; L = 1 is for very low vegetation cover. " +
      "Used in arid/semi-arid regions where soil background significantly affects NDVI.",
    schema: {
      nir: reflectance("NIR", "Near-Infrared band, typically Sentinel-2 Band 8 or Landsat Band 5."),
      red: reflectance("Red", "Red visible band, typically Sentinel-2 Band 4 or Landsat Band 4."),
      l: z
        .number()
        .min(0)
        .max(1)
        .optional()
        .default(0.5)
        .describe(
          "Soil brightness correction factor L (0–1). Default 0.5 for intermediate vegetation. " +
          "Use 0 for dense vegetation (equivalent to NDVI), 1 for very sparse vegetation.",
        ),
    },
    execute: async (args) => {
      const nir = args.nir as number;
      const red = args.red as number;
      const l = (args.l as number | undefined) ?? 0.5;
      const denominator = nir + red + l;

      if (denominator === 0) {
        return json({
          index: 0,
          classification: "Undefined (NIR + Red + L = 0)",
          warning: "Denominator (NIR + Red + L) is zero; index is undefined, returned as 0.",
        });
      }

      const index = ((nir - red) / denominator) * (1 + l);
      const classification = classifySavi(index);

      return json({
        index: Math.round(index * 10000) / 10000,
        classification,
        formula: "((NIR - Red) / (NIR + Red + L)) * (1 + L)",
        inputs: { nir, red, l },
      });
    },
  },

  // ── 8. Custom Band Math ──
  {
    name: "spectral_custom",
    description:
      "Evaluate a custom band math expression using a safe expression parser. " +
      "Supports basic arithmetic (+, -, *, /), parentheses, numeric literals, and band variable names. " +
      'Example: expression "(b4 - b3) / (b4 + b3)" with bands {"b3": 0.2, "b4": 0.8} computes NDVI. ' +
      "No eval() is used — the expression is parsed with a secure recursive-descent parser that only " +
      "permits numbers, named band variables, arithmetic operators, and parentheses.",
    schema: {
      expression: z
        .string()
        .min(1)
        .describe(
          "Band math expression to evaluate. Supports: numbers, band variable names (matching keys in the bands object), " +
          "operators (+, -, *, /), and parentheses. Examples: '(b4 - b3) / (b4 + b3)', 'nir * 2 - red', " +
          "'(swir1 + red) / (nir + blue)'. No function calls or arbitrary code allowed.",
        ),
      bands: z
        .record(
          z.string().describe("Band variable name (e.g. 'b3', 'nir', 'red', 'swir1')"),
          z.number().describe("Reflectance value for this band"),
        )
        .describe(
          "Object mapping band variable names to their reflectance values. " +
          'Keys must match the variable names used in the expression. Example: {"b3": 0.2, "b4": 0.8, "b5": 0.6}.',
        ),
    },
    execute: async (args) => {
      const expression = args.expression as string;
      const bands = args.bands as Record<string, number>;

      // Validate that bands object is not empty
      if (Object.keys(bands).length === 0) {
        return json({
          error: "No band values provided. The 'bands' object must contain at least one band variable and its value.",
        });
      }

      try {
        const result = evaluateExpression(expression, bands);

        return json({
          expression,
          bands,
          result: Number.isFinite(result) ? Math.round(result * 10000) / 10000 : result,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return json({
          error: `Expression evaluation failed: ${message}`,
          expression,
          bands,
        });
      }
    },
  },
];
