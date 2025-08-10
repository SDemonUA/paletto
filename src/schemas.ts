import { z } from "zod";

export const UiPaletteHarmonyScheme = z.enum([
  "analogous",
  "complementary",
  "triadic",
  "tetradic",
  "monochromatic",
]);

export const UiPalettePersonalityScheme = z.enum([
  "calm",
  "energetic",
  "professional",
  "playful",
  "elegant",
  "vibrant",
]);

const colorSchema = z.string().regex(/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i);

export const UiPaletteSchema = z.object({
  baseColor: colorSchema,
  harmonyType: UiPaletteHarmonyScheme,
  personality: UiPalettePersonalityScheme,

  semanticColors: z.object({
    primary: colorSchema,
    secondary: colorSchema,
    success: colorSchema,
    warning: colorSchema,
    error: colorSchema,
    info: colorSchema,
  }),
  textColors: z.object({
    primary: colorSchema,
    secondary: colorSchema,
    disabled: colorSchema,
  }),
  backgroundColors: z.object({
    default: colorSchema,
    paper: colorSchema,
    card: colorSchema,
  }),
  borderColors: z.object({
    default: colorSchema,
    light: colorSchema,
    dark: colorSchema,
  }),
  shadowColors: z.object({
    light: colorSchema,
    medium: colorSchema,
    intense: colorSchema,
  }),
});

export type UiPalette = z.infer<typeof UiPaletteSchema>;
