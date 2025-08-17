import { UiPalette } from "@/schemas";
import { resolveColorValue } from "./color-utils";
import type { ThemeOptions } from "@mui/material";

export function createMuiThemeOptions(palette: UiPalette): ThemeOptions {
  const rootColors = palette.rootColors || [];

  return {
    palette: {
      primary: {
        main: resolveColorValue(palette.semanticColors.primary, rootColors),
      },
      secondary: {
        main: resolveColorValue(palette.semanticColors.secondary, rootColors),
      },
      error: {
        main: resolveColorValue(palette.semanticColors.error, rootColors),
      },
      background: {
        default: resolveColorValue(palette.backgroundColors.default, rootColors),
        paper: resolveColorValue(palette.backgroundColors.paper, rootColors),
      },
      divider: resolveColorValue(palette.borderColors.light, rootColors),
      info: { main: resolveColorValue(palette.semanticColors.info, rootColors) },
      success: { main: resolveColorValue(palette.semanticColors.success, rootColors) },
      text: {
        primary: resolveColorValue(palette.textColors.primary, rootColors),
        secondary: resolveColorValue(palette.textColors.secondary, rootColors),
        disabled: resolveColorValue(palette.textColors.disabled, rootColors),
      },
      warning: { main: resolveColorValue(palette.semanticColors.warning, rootColors) },
    },
  };
}

export function exportMuiTheme(palette: UiPalette) {
  return `
import { createTheme } from "@mui/material"

const theme = createTheme(${JSON.stringify(createMuiThemeOptions(palette), null, 2)})

export default theme
`;
}
