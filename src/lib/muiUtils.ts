import { UiPalette } from "@/schemas";
import type { ThemeOptions } from "@mui/material";

export function createMuiThemeOptions(palette: UiPalette): ThemeOptions {
  return {
    palette: {
      primary: {
        main: palette.semanticColors.primary,
      },
      secondary: {
        main: palette.semanticColors.secondary,
      },
      error: {
        main: palette.semanticColors.error,
      },
      background: {
        default: palette.backgroundColors.default,
        paper: palette.backgroundColors.paper,
      },
      divider: palette.borderColors.light,
      info: { main: palette.semanticColors.info },
      success: { main: palette.semanticColors.success },
      text: {
        primary: palette.textColors.primary,
        secondary: palette.textColors.secondary,
        disabled: palette.textColors.disabled,
      },
      warning: { main: palette.semanticColors.warning },
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
