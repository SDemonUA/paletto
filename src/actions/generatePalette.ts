"use server";

import { UiPaletteSchema, UiPaletteHarmonyScheme, UiPalettePersonalityScheme } from "@/schemas";
import { generateRootColors, createColorRef } from "@/lib/color-utils";
import { z } from "zod";

const GeneratePaletteSchema = z.object({
  baseColor: z.string(),
  personality: UiPalettePersonalityScheme,
  harmonyType: UiPaletteHarmonyScheme,
});

export async function generatePaletteAction(data: z.infer<typeof GeneratePaletteSchema>) {
  try {
    const validatedData = GeneratePaletteSchema.parse(data);

    const palette = generatePalette(
      validatedData.baseColor,
      validatedData.personality,
      validatedData.harmonyType
    );

    const validationResult = UiPaletteSchema.safeParse(palette);
    if (!validationResult.success) {
      console.error("Validation errors:", validationResult.error);
      return { error: "Generated palette validation failed" };
    }

    return { success: true, palette };
  } catch (error) {
    console.error("Error generating palette:", error);
    return { error: "Failed to generate palette" };
  }
}

function generatePalette(baseColor: string, personality: string, harmonyType: string) {
  try {
    const rootColors = generateRootColors(baseColor, harmonyType, personality);

    // Create the palette using color references
    return {
      baseColor,
      harmonyType: harmonyType as keyof typeof UiPaletteHarmonyScheme.enum,
      personality: personality as keyof typeof UiPalettePersonalityScheme.enum,

      // Root colors that user can modify
      rootColors,

      // Semantic colors using references to root colors with modifications
      semanticColors: {
        primary: createColorRef("primary"),
        secondary: createColorRef("secondary"),
        success: createColorRef("primary", { hueShift: 120, saturation: 0.6 }),
        warning: createColorRef("secondary", { hueShift: 45, saturation: 0.8 }),
        error: createColorRef("accent", { hueShift: 0, saturation: 0.7 }),
        info: createColorRef("primary", { hueShift: 200, saturation: 0.7 }),
      },

      // Text colors using neutral with modifications
      textColors: {
        primary: createColorRef("neutral", { lightness: 0.2 }),
        secondary: createColorRef("neutral", { lightness: 0.4 }),
        disabled: createColorRef("neutral", { lightness: 0.5, alpha: 0.5 }),
      },

      // Background colors using neutral with lightness modifications
      backgroundColors: {
        default: createColorRef("neutral", { lightness: 0.95 }),
        paper: createColorRef("neutral", { lightness: 0.98 }),
        card: createColorRef("neutral", { lightness: 1.0 }),
      },

      // Border colors using neutral with different lightness values
      borderColors: {
        default: createColorRef("neutral", { lightness: 0.7 }),
        light: createColorRef("neutral", { lightness: 0.85 }),
        dark: createColorRef("neutral", { lightness: 0.5 }),
      },

      // Shadow colors using neutral with lightness and alpha
      shadowColors: {
        light: createColorRef("neutral", { lightness: 0.2, alpha: 0.1 }),
        medium: createColorRef("neutral", { lightness: 0.2, alpha: 0.2 }),
        intense: createColorRef("neutral", { lightness: 0.2, alpha: 0.3 }),
      },
    };
  } catch (error) {
    throw new Error(`Failed to generate palette: ${error}`);
  }
}
