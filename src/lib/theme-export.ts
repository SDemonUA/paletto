import { UITheme, getThemeColor } from './theme-utils'

/**
 * Створює конфігурацію теми для shadcn/ui
 */
export function createShadcnConfig(theme: UITheme): string {
  // Значення за замовчуванням у пікселях
  const defaultRadius = 8
  const defaultSpacing = 8

  return `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        background: '${getThemeColor(
          theme.themeProps.background.default,
          theme.palette
        )}',
        foreground: '${getThemeColor(
          theme.themeProps.text.primary,
          theme.palette
        )}',
        primary: {
          DEFAULT: '${getThemeColor(
            theme.themeProps.buttons.primary.contained.background,
            theme.palette
          )}',
          foreground: '${getThemeColor(
            theme.themeProps.buttons.primary.contained.text,
            theme.palette
          )}',
        },
        secondary: {
          DEFAULT: '${getThemeColor(
            theme.themeProps.buttons.secondary.contained.background,
            theme.palette
          )}',
          foreground: '${getThemeColor(
            theme.themeProps.buttons.secondary.contained.text,
            theme.palette
          )}',
        },
        destructive: {
          DEFAULT: '${getThemeColor(
            theme.themeProps.buttons.error.contained.background,
            theme.palette
          )}',
          foreground: '${getThemeColor(
            theme.themeProps.buttons.error.contained.text,
            theme.palette
          )}',
        },
        muted: {
          DEFAULT: '${getThemeColor(
            theme.themeProps.background.component,
            theme.palette
          )}',
          foreground: '${getThemeColor(
            theme.themeProps.text.secondary,
            theme.palette
          )}',
        },
        accent: {
          DEFAULT: '${getThemeColor(
            theme.themeProps.background.component,
            theme.palette
          )}',
          foreground: '${getThemeColor(
            theme.themeProps.text.primary,
            theme.palette
          )}',
        },
        card: {
          DEFAULT: '${getThemeColor(
            theme.themeProps.background.paper,
            theme.palette
          )}',
          foreground: '${getThemeColor(
            theme.themeProps.text.primary,
            theme.palette
          )}',
        },
        popover: {
          DEFAULT: '${getThemeColor(
            theme.themeProps.background.paper,
            theme.palette
          )}',
          foreground: '${getThemeColor(
            theme.themeProps.text.primary,
            theme.palette
          )}',
        },
        border: '${getThemeColor(
          theme.themeProps.buttons.muted.outlined.border,
          theme.palette
        )}',
        input: '${getThemeColor(
          theme.themeProps.buttons.muted.outlined.border,
          theme.palette
        )}',
        ring: '${getThemeColor(
          theme.themeProps.buttons.primary.contained.background,
          theme.palette
        )}',
      },
      borderRadius: {
        DEFAULT: '${theme.rounding || defaultRadius}px',
      },
      spacing: {
        DEFAULT: '${theme.spacing || defaultSpacing}px',
      },
    },
  },
}`
}

// Ця функція створює конфігурацію теми для shadcn/ui global.css
export function createShadcnCssVarsConfig(theme: UITheme): string {
  return `:root {
  --background: ${getThemeColor(
    theme.themeProps.background.default,
    theme.palette
  )};
  --foreground: ${getThemeColor(theme.themeProps.text.primary, theme.palette)};
  --primary: ${getThemeColor(
    theme.themeProps.buttons.primary.contained.background,
    theme.palette
  )};
  --primary-foreground: ${getThemeColor(
    theme.themeProps.buttons.primary.contained.text,
    theme.palette
  )};
  --secondary: ${getThemeColor(
    theme.themeProps.buttons.secondary.contained.background,
    theme.palette
  )};
  --secondary-foreground: ${getThemeColor(
    theme.themeProps.buttons.secondary.contained.text,
    theme.palette
  )};
  --destructive: ${getThemeColor(
    theme.themeProps.buttons.error.contained.background,
    theme.palette
  )};
  --destructive-foreground: ${getThemeColor(
    theme.themeProps.buttons.error.contained.text,
    theme.palette
  )};
  --muted: ${getThemeColor(
    theme.themeProps.background.component,
    theme.palette
  )};
  --muted-foreground: ${getThemeColor(
    theme.themeProps.text.secondary,
    theme.palette
  )};
  --accent: ${getThemeColor(
    theme.themeProps.background.component,
    theme.palette
  )};
  --accent-foreground: ${getThemeColor(
    theme.themeProps.text.primary,
    theme.palette
  )};
  --card: ${getThemeColor(theme.themeProps.background.paper, theme.palette)};
  --card-foreground: ${getThemeColor(
    theme.themeProps.text.primary,
    theme.palette
  )};
  --popover: ${getThemeColor(theme.themeProps.background.paper, theme.palette)};
  --popover-foreground: ${getThemeColor(
    theme.themeProps.text.primary,
    theme.palette
  )};
  --border: ${getThemeColor(
    theme.themeProps.buttons.muted.outlined.border,
    theme.palette
  )};
  --input: ${getThemeColor(
    theme.themeProps.buttons.muted.outlined.border,
    theme.palette
  )};
  --ring: ${getThemeColor(
    theme.themeProps.buttons.primary.contained.background,
    theme.palette
  )};
  --radius: ${theme.rounding}px;
  --spacing: ${theme.spacing}px;

  font-size: ${theme.fontSize}px;
  }`
}

/**
 * Створює конфігурацію теми для Material UI
 */
export function createMuiConfig(theme: UITheme): string {
  return `// theme.js
import { createTheme } from '@mui/material/styles';

export const theme = createTheme(${JSON.stringify(
    createMuiThemeConfig(theme),
    null,
    2
  )});`
}

export function createMuiThemeConfig(theme: UITheme): unknown {
  const defaultRadius = 4
  const defaultSpacing = 8
  return {
    palette: {
      mode: theme.isDarkMode ? 'dark' : 'light',
      background: {
        default: getThemeColor(
          theme.themeProps.background.default,
          theme.palette
        ),
        paper: getThemeColor(theme.themeProps.background.paper, theme.palette),
      },
      text: {
        primary: getThemeColor(theme.themeProps.text.primary, theme.palette),
        secondary: getThemeColor(
          theme.themeProps.text.secondary,
          theme.palette
        ),
        disabled: getThemeColor(theme.themeProps.text.disabled, theme.palette),
      },
      primary: {
        main: getThemeColor(
          theme.themeProps.buttons.primary.contained.background,
          theme.palette
        ),
        contrastText: getThemeColor(
          theme.themeProps.buttons.primary.contained.text,
          theme.palette
        ),
      },
      secondary: {
        main: getThemeColor(
          theme.themeProps.buttons.secondary.contained.background,
          theme.palette
        ),
        contrastText: getThemeColor(
          theme.themeProps.buttons.secondary.contained.text,
          theme.palette
        ),
      },
      error: {
        main: getThemeColor(
          theme.themeProps.buttons.error.contained.background,
          theme.palette
        ),
        contrastText: getThemeColor(
          theme.themeProps.buttons.error.contained.text,
          theme.palette
        ),
      },
      action: {
        active: getThemeColor(
          theme.themeProps.buttons.primary.contained.background,
          theme.palette
        ),
        hover: getThemeColor(
          theme.themeProps.buttons.primary.contained.background,
          theme.palette
        ),
        disabled: getThemeColor(
          theme.themeProps.buttons.disabled.contained.background,
          theme.palette
        ),
        disabledBackground:
          theme.themeProps.buttons.disabled.contained.background,
      },
      divider: getThemeColor(
        theme.themeProps.buttons.muted.outlined.border,
        theme.palette
      ),
    },
    shape: {
      borderRadius: theme.rounding || defaultRadius,
    },
    spacing: theme.spacing || defaultSpacing,
  }
}

/**
 * Створює конфігурацію теми для Hero UI
 */
export function createHeroConfig(theme: UITheme): string {
  // Значення за замовчуванням у пікселях
  const defaultRadius = 8
  const defaultSpacing = 8

  return `// tailwind.config.js
const colors = require('tailwindcss/colors')

module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '${getThemeColor(
          theme.themeProps.buttons.primary.contained.background,
          theme.palette
        )}',
        secondary: '${getThemeColor(
          theme.themeProps.buttons.secondary.contained.background,
          theme.palette
        )}',
        background: '${getThemeColor(
          theme.themeProps.background.default,
          theme.palette
        )}',
        error: '${getThemeColor(
          theme.themeProps.buttons.error.contained.background,
          theme.palette
        )}',
        surface: '${getThemeColor(
          theme.themeProps.background.paper,
          theme.palette
        )}',
        'on-surface': '${getThemeColor(
          theme.themeProps.text.primary,
          theme.palette
        )}',
        'on-primary': '${getThemeColor(
          theme.themeProps.buttons.primary.contained.text,
          theme.palette
        )}',
        'on-secondary': '${getThemeColor(
          theme.themeProps.buttons.secondary.contained.text,
          theme.palette
        )}',
        'on-error': '${getThemeColor(
          theme.themeProps.buttons.error.contained.text,
          theme.palette
        )}',
      },
      borderRadius: {
        DEFAULT: '${theme.rounding || defaultRadius}px',
      },
      spacing: {
        DEFAULT: '${theme.spacing || defaultSpacing}px',
      },
    },
  },
}`
}
