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

export const ColorModificationSchema = z.object({
  lightness: z.number().min(0).max(1).optional(), // 0 to 1 range (HSL lightness)
  saturation: z.number().min(0).max(1).optional(), // 0 to 1 range (HSL saturation)
  alpha: z.number().min(0).max(1).optional(), // 0 to 1 range
  hueShift: z.number().min(-360).max(360).optional(), // degrees
});

export const RootColorSchema = z.object({
  id: z.string(), // unique identifier
  color: colorSchema, // the actual color value
  label: z.string().optional(), // user-defined name
});

export const ColorRefSchema = z.object({
  rootColorId: z.string(), // references a root color
  modifications: ColorModificationSchema.optional(),
});

export const ColorValueSchema = z.union([
  colorSchema, // direct color value
  ColorRefSchema, // reference to root color with modifications
]);

export const UiPaletteSchema = z.object({
  baseColor: colorSchema, // kept for backward compatibility, will be first root color
  harmonyType: UiPaletteHarmonyScheme,
  personality: UiPalettePersonalityScheme,

  rootColors: z.array(RootColorSchema).min(1), // at least one root color (primary)

  semanticColors: z.object({
    primary: ColorValueSchema,
    secondary: ColorValueSchema,
    success: ColorValueSchema,
    warning: ColorValueSchema,
    error: ColorValueSchema,
    info: ColorValueSchema,
  }),
  textColors: z.object({
    primary: ColorValueSchema,
    secondary: ColorValueSchema,
    disabled: ColorValueSchema,
  }),
  backgroundColors: z.object({
    default: ColorValueSchema,
    paper: ColorValueSchema,
    card: ColorValueSchema,
  }),
  borderColors: z.object({
    default: ColorValueSchema,
    light: ColorValueSchema,
    dark: ColorValueSchema,
  }),
  shadowColors: z.object({
    light: ColorValueSchema,
    medium: ColorValueSchema,
    intense: ColorValueSchema,
  }),
});

export type UiPalette = z.infer<typeof UiPaletteSchema>;
export type RootColor = z.infer<typeof RootColorSchema>;
export type ColorRef = z.infer<typeof ColorRefSchema>;
export type ColorModification = z.infer<typeof ColorModificationSchema>;
export type ColorValue = z.infer<typeof ColorValueSchema>;
