import chroma from "chroma-js";
import nearestColor from "nearest-color";
import { colornames } from "color-name-list";
import { ColorValue, ColorRef, ColorModification, RootColor } from "@/schemas";

let _getColorName: ReturnType<typeof nearestColor.from>;
export function getColorName(colorString: string) {
  const color = chroma(colorString);
  const alpha = color.alpha();
  const hex = color.alpha(1).hex();

  if (!_getColorName) {
    _getColorName = nearestColor.from(
      colornames.reduce((o, { name, hex }) => Object.assign(o, { [name]: hex }), {})
    );
  }

  const name = _getColorName(hex)?.name || "";
  return `${name}${alpha < 1 ? ` (${Math.ceil(alpha * 100)}%)` : ""}`;
}

export function applyColorModifications(
  baseColor: string,
  modifications?: ColorModification
): string {
  if (!modifications) return baseColor;

  let color = chroma(baseColor);

  if (modifications) {
    if (modifications.hueShift !== undefined) {
      const sign = modifications.hueShift > 0 ? "+" : "-";
      color = color.set("hsl.h", `${sign}${Math.abs(modifications.hueShift)}`);
    }

    if (modifications.saturation !== undefined) {
      color = color.set("hsl.s", modifications.saturation);
    }

    if (modifications.lightness !== undefined) {
      color = color.set("hsl.l", modifications.lightness);
    }

    if (modifications.alpha !== undefined) {
      color = color.alpha(modifications.alpha);
    }
  }

  return color.hex();
}

export function resolveColorValue(colorValue: ColorValue, rootColors: RootColor[]): string {
  // If it's a string, it's a direct color value
  if (typeof colorValue === "string") {
    return colorValue;
  }

  // If it's a color reference, resolve it
  const rootColor = rootColors.find((rc) => rc.id === colorValue.rootColorId);
  if (!rootColor) {
    console.error(`Root color with id ${colorValue.rootColorId} not found`);
    return "#000000"; // fallback color
  }

  return applyColorModifications(rootColor.color, colorValue.modifications);
}

// Create a color reference
export function createColorRef(rootColorId: string, modifications?: ColorModification): ColorRef {
  return {
    rootColorId,
    modifications,
  };
}

// Generate root colors from base color and harmony/personality settings
export function generateRootColors(
  baseColor: string,
  harmonyType: string,
  personality: string
): RootColor[] {
  const harmonyColors = generateHarmonyColors(baseColor, harmonyType);
  const adjustedColors = adjustColorsForPersonality(harmonyColors, personality);

  return [
    {
      id: "primary",
      color: adjustedColors[0].hex(),
      label: "Primary",
    },
    {
      id: "secondary",
      color: adjustedColors[1].hex(),
      label: "Secondary",
    },
    {
      id: "accent",
      color: adjustedColors[2].hex(),
      label: "Accent",
    },
    {
      id: "neutral",
      color: adjustedColors[3].hex(),
      label: "Neutral",
    },
  ];
}

function generateHarmonyColors(sBase: string, harmonyType: string): chroma.Color[] {
  const base = chroma(sBase);
  const hue = base.hsl()[0] || 0;

  switch (harmonyType) {
    default:
    case "complementary":
      return [
        base,
        chroma(base).set("hsl.h", (hue + 180) % 360),
        chroma(base).set("hsl.h", (hue + 90) % 360),
        chroma(base).desaturate(2),
      ];
    case "analogous":
      return [
        base,
        chroma(base).set("hsl.h", (hue + 30) % 360),
        chroma(base).set("hsl.h", (hue - 30) % 360),
        chroma(base).desaturate(2),
      ];
    case "triadic":
      return [
        base,
        chroma(base).set("hsl.h", (hue + 120) % 360),
        chroma(base).set("hsl.h", (hue + 240) % 360),
        chroma(base).desaturate(2),
      ];
    case "tetradic":
      return [
        base,
        chroma(base).set("hsl.h", (hue + 90) % 360),
        chroma(base).set("hsl.h", (hue + 180) % 360),
        chroma(base).set("hsl.h", (hue + 270) % 360),
      ];
    case "monochromatic":
      return [base, chroma(base).brighten(1), chroma(base).darken(1), chroma(base).desaturate(2)];
  }
}

function adjustColorsForPersonality(colors: chroma.Color[], personality: string): chroma.Color[] {
  const adjustedColors = [...colors];

  switch (personality.toLowerCase()) {
    case "playful":
      adjustedColors.forEach((color, i) => {
        adjustedColors[i] = color.saturate(0.5).brighten(0.2);
      });
      break;
    case "professional":
      adjustedColors.forEach((color, i) => {
        adjustedColors[i] = color.desaturate(0.3);
      });
      break;
    case "elegant":
      adjustedColors.forEach((color, i) => {
        adjustedColors[i] = color.darken(0.1).saturate(0.1);
      });
      break;
    case "vibrant":
      adjustedColors.forEach((color, i) => {
        adjustedColors[i] = color.saturate(0.8).brighten(0.1);
      });
      break;
    case "calm":
      adjustedColors.forEach((color, i) => {
        adjustedColors[i] = color.desaturate(0.5).darken(0.1);
      });
      break;
    case "energetic":
      adjustedColors.forEach((color, i) => {
        adjustedColors[i] = color.saturate(0.7).brighten(0.3);
      });
      break;
  }

  return adjustedColors;
}
