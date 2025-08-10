import chroma from "chroma-js";
import { UiPaletteSchema, UiPaletteHarmonyScheme, UiPalettePersonalityScheme } from "@/schemas";
import { NextResponse } from "next/server";

// Server action to generate a palette
export async function POST(request: Request) {
  const { baseColor, personality, harmonyType } = await request.json();

  if (!baseColor || !personality || !harmonyType) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  try {
    // Validate input against the schema enums
    UiPaletteHarmonyScheme.parse(harmonyType);
    UiPalettePersonalityScheme.parse(personality);
  } catch (error) {
    return NextResponse.json({ error: "Invalid harmony type or personality" }, { status: 400 });
  }

  // Generate harmonious colors using chroma-js
  const palette = generatePalette(baseColor, personality, harmonyType);

  // Validate the palette
  const validationResult = UiPaletteSchema.safeParse(palette);
  if (!validationResult.success) {
    console.log(palette);
    return NextResponse.json({ error: "Generated palette validation failed" }, { status: 500 });
  }

  return NextResponse.json(palette);
}

function generatePalette(baseColor: string, personality: string, harmonyType: string) {
  try {
    const base = chroma(baseColor);
    const baseHsl = base.hsl();
    const hue = baseHsl[0] || 0; // Handle undefined hue (for grayscale colors)

    // Generate colors based on harmony type
    const colors = generateHarmonyColors(base, hue, harmonyType);

    // Adjust colors based on personality
    const adjustedColors = adjustColorsForPersonality(colors, personality);

    const primary = adjustedColors[0].hex();
    const secondary = adjustedColors[1].hex();
    const accent = adjustedColors[2].hex();
    const neutral = adjustedColors[3].hex();

    // Format palette according to expected schema
    return {
      baseColor,
      harmonyType: harmonyType as keyof typeof UiPaletteHarmonyScheme.enum,
      personality: personality as keyof typeof UiPalettePersonalityScheme.enum,

      semanticColors: {
        primary,
        secondary,
        success: chroma(adjustedColors[0]).set("hsl.h", 120).set("hsl.s", 0.6).hex(),
        warning: chroma(adjustedColors[1]).set("hsl.h", 45).set("hsl.s", 0.8).hex(),
        error: chroma(adjustedColors[2]).set("hsl.h", 0).set("hsl.s", 0.7).hex(),
        info: chroma(adjustedColors[0]).set("hsl.h", 200).set("hsl.s", 0.7).hex(),
      },

      textColors: {
        primary: chroma(neutral).darken(3).hex(),
        secondary: chroma(neutral).darken(1.5).hex(),
        disabled: chroma(neutral).luminance(0.5).alpha(0.5).hex(),
      },

      backgroundColors: {
        default: chroma(neutral).luminance(0.95).hex(),
        paper: chroma(neutral).luminance(0.98).hex(),
        card: chroma(neutral).luminance(1).hex(),
      },

      borderColors: {
        default: chroma(neutral).luminance(0.7).hex(),
        light: chroma(neutral).luminance(0.85).hex(),
        dark: chroma(neutral).luminance(0.5).hex(),
      },

      shadowColors: {
        light: chroma(neutral).luminance(0.2).alpha(0.1).hex(),
        medium: chroma(neutral).luminance(0.2).alpha(0.2).hex(),
        intense: chroma(neutral).luminance(0.2).alpha(0.3).hex(),
      },
    };
  } catch (error) {
    console.error("Error generating palette:", error);
    // Return fallback palette
    return {
      baseColor,
      harmonyType: harmonyType as keyof typeof UiPaletteHarmonyScheme.enum,
      personality: personality as keyof typeof UiPalettePersonalityScheme.enum,

      semanticColors: {
        primary: baseColor,
        secondary: chroma(baseColor).brighten(0.5).hex(),
        success: "#4CAF50",
        warning: "#FF9800",
        error: "#F44336",
        info: "#2196F3",
      },

      textColors: {
        primary: "#212121",
        secondary: "#757575",
        disabled: "#9E9E9E",
      },

      backgroundColors: {
        default: "#FAFAFA",
        paper: "#FFFFFF",
        card: "#FFFFFF",
      },

      borderColors: {
        default: "#E0E0E0",
        light: "#F0F0F0",
        dark: "#BDBDBD",
      },

      shadowColors: {
        light: "#00000010",
        medium: "#00000020",
        intense: "#00000030",
      },
    };
  }
}

function generateHarmonyColors(
  base: chroma.Color,
  baseHue: number,
  harmonyType: string
): chroma.Color[] {
  switch (harmonyType) {
    case "complementary":
      return [
        base,
        chroma(base).set("hsl.h", (baseHue + 180) % 360),
        chroma(base).set("hsl.h", (baseHue + 90) % 360),
        chroma(base).desaturate(2),
      ];

    case "analogous":
      return [
        base,
        chroma(base).set("hsl.h", (baseHue + 30) % 360),
        chroma(base).set("hsl.h", (baseHue - 30) % 360),
        chroma(base).desaturate(2),
      ];

    case "triadic":
      return [
        base,
        chroma(base).set("hsl.h", (baseHue + 120) % 360),
        chroma(base).set("hsl.h", (baseHue + 240) % 360),
        chroma(base).desaturate(2),
      ];

    case "tetradic":
      return [
        base,
        chroma(base).set("hsl.h", (baseHue + 90) % 360),
        chroma(base).set("hsl.h", (baseHue + 180) % 360),
        chroma(base).set("hsl.h", (baseHue + 270) % 360),
      ];

    case "monochromatic":
      return [base, chroma(base).brighten(1), chroma(base).darken(1), chroma(base).desaturate(2)];

    default: // Default to complementary
      return [
        base,
        chroma(base).set("hsl.h", (baseHue + 180) % 360),
        chroma(base).set("hsl.h", (baseHue + 90) % 360),
        chroma(base).desaturate(2),
      ];
  }
}

function adjustColorsForPersonality(colors: chroma.Color[], personality: string): chroma.Color[] {
  const adjustedColors = [...colors];

  switch (personality.toLowerCase()) {
    case "playful":
      // Increase saturation and brightness
      adjustedColors.forEach((color, i) => {
        adjustedColors[i] = color.saturate(0.5).brighten(0.2);
      });
      break;

    case "professional":
      // Slightly desaturate and make more consistent
      adjustedColors.forEach((color, i) => {
        adjustedColors[i] = color.desaturate(0.3);
      });
      break;

    case "elegant":
      // Subtle adjustments with slightly darker shades
      adjustedColors.forEach((color, i) => {
        adjustedColors[i] = color.darken(0.1).saturate(0.1);
      });
      break;

    case "vibrant":
      // Increase contrast and saturation
      adjustedColors.forEach((color, i) => {
        adjustedColors[i] = color.saturate(0.8).brighten(0.1);
      });
      break;

    case "calm":
      // Desaturate and make more neutral
      adjustedColors.forEach((color, i) => {
        adjustedColors[i] = color.desaturate(0.5).darken(0.1);
      });
      break;

    case "energetic":
      // Increase saturation and contrast
      adjustedColors.forEach((color, i) => {
        adjustedColors[i] = color.saturate(0.7).brighten(0.3);
      });
      break;
  }

  return adjustedColors;
}
