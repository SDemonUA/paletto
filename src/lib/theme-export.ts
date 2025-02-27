import { UITheme } from './theme-utils';

/**
 * Створює конфігурацію теми для shadcn/ui
 */
export function createShadcnConfig(theme: UITheme): string {
  // Значення за замовчуванням у пікселях
  const defaultRadius = 8;
  const defaultSpacing = 8;

  return `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        background: '${theme.themeProps.background.default}',
        foreground: '${theme.themeProps.text.primary}',
        primary: {
          DEFAULT: '${theme.themeProps.buttons.primary.contained.background}',
          foreground: '${theme.themeProps.buttons.primary.contained.text}',
        },
        secondary: {
          DEFAULT: '${theme.themeProps.buttons.secondary.contained.background}',
          foreground: '${theme.themeProps.buttons.secondary.contained.text}',
        },
        destructive: {
          DEFAULT: '${theme.themeProps.buttons.error.contained.background}',
          foreground: '${theme.themeProps.buttons.error.contained.text}',
        },
        muted: {
          DEFAULT: '${theme.themeProps.background.component}',
          foreground: '${theme.themeProps.text.secondary}',
        },
        accent: {
          DEFAULT: '${theme.themeProps.background.component}',
          foreground: '${theme.themeProps.text.primary}',
        },
        card: {
          DEFAULT: '${theme.themeProps.background.paper}',
          foreground: '${theme.themeProps.text.primary}',
        },
        popover: {
          DEFAULT: '${theme.themeProps.background.paper}',
          foreground: '${theme.themeProps.text.primary}',
        },
        border: '${theme.themeProps.buttons.muted.outlined.border}',
        input: '${theme.themeProps.buttons.muted.outlined.border}',
        ring: '${theme.themeProps.buttons.primary.contained.background}',
      },
      borderRadius: {
        DEFAULT: '${theme.rounding || defaultRadius}px',
      },
      spacing: {
        DEFAULT: '${theme.spacing || defaultSpacing}px',
      },
    },
  },
}`;
}

/**
 * Створює конфігурацію теми для Material UI
 */
export function createMuiConfig(theme: UITheme): string {
  // Значення за замовчуванням у пікселях
  const defaultRadius = 4;
  const defaultSpacing = 8;

  return `// theme.js
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: '${theme.settings.isDarkMode ? 'dark' : 'light'}',
    background: {
      default: '${theme.themeProps.background.default}',
      paper: '${theme.themeProps.background.paper}',
    },
    text: {
      primary: '${theme.themeProps.text.primary}',
      secondary: '${theme.themeProps.text.secondary}',
      disabled: '${theme.themeProps.text.disabled}',
    },
    primary: {
      main: '${theme.themeProps.buttons.primary.contained.background}',
      contrastText: '${theme.themeProps.buttons.primary.contained.text}',
    },
    secondary: {
      main: '${theme.themeProps.buttons.secondary.contained.background}',
      contrastText: '${theme.themeProps.buttons.secondary.contained.text}',
    },
    error: {
      main: '${theme.themeProps.buttons.error.contained.background}',
      contrastText: '${theme.themeProps.buttons.error.contained.text}',
    },
    action: {
      active: '${theme.themeProps.buttons.primary.contained.background}',
      hover: '${theme.themeProps.buttons.primary.contained.background}20',
      disabled: '${theme.themeProps.buttons.disabled.contained.background}',
      disabledBackground: '${theme.themeProps.buttons.disabled.contained.background}',
    },
    divider: '${theme.themeProps.buttons.muted.outlined.border}',
  },
  shape: {
    borderRadius: ${theme.rounding || defaultRadius},
  },
  spacing: ${theme.spacing || defaultSpacing},
});`;
}

/**
 * Створює конфігурацію теми для Hero UI
 */
export function createHeroConfig(theme: UITheme): string {
  // Значення за замовчуванням у пікселях
  const defaultRadius = 8;
  const defaultSpacing = 8;

  return `// tailwind.config.js
const colors = require('tailwindcss/colors')

module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '${theme.themeProps.buttons.primary.contained.background}',
        secondary: '${theme.themeProps.buttons.secondary.contained.background}',
        background: '${theme.themeProps.background.default}',
        error: '${theme.themeProps.buttons.error.contained.background}',
        surface: '${theme.themeProps.background.paper}',
        'on-surface': '${theme.themeProps.text.primary}',
        'on-primary': '${theme.themeProps.buttons.primary.contained.text}',
        'on-secondary': '${theme.themeProps.buttons.secondary.contained.text}',
        'on-error': '${theme.themeProps.buttons.error.contained.text}',
      },
      borderRadius: {
        DEFAULT: '${theme.rounding || defaultRadius}px',
      },
      spacing: {
        DEFAULT: '${theme.spacing || defaultSpacing}px',
      },
    },
  },
}`;
} 