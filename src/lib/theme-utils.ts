'use client'

import Color from 'colorjs.io'
import { get } from 'lodash'
import { ColorPalette } from '@/lib/palette-utils'
import { generateUUID } from './uuid-utils'

// Дозволяє використати в темі колір з палітри з/без змін
export interface ColorLink {
  paletteId: string
  adjustmets: {
    alpha?: number // 0-1
    lightness?: number // -100-100
    saturation?: number // -100-100
  }
}

export type ThemeColor = string | ColorLink

export interface UITheme {
  id: string
  rounding: number
  spacing: number
  fontSize: number
  isDarkMode: boolean
  contrastLevel: number

  palette: ColorPalette

  themeProps: {
    background: {
      default: ThemeColor
      paper: ThemeColor
      component: ThemeColor
    }
    text: {
      primary: ThemeColor
      secondary: ThemeColor
      disabled: ThemeColor
    }
    success: { text: ThemeColor; background: ThemeColor }
    info: { text: ThemeColor; background: ThemeColor }
    warning: { text: ThemeColor; background: ThemeColor }
    error: { text: ThemeColor; background: ThemeColor }

    buttons: {
      primary: {
        contained: { background: ThemeColor; text: ThemeColor }
        outlined: { border: ThemeColor; text: ThemeColor }
        text: { text: ThemeColor }
      }
      secondary: {
        contained: { background: ThemeColor; text: ThemeColor }
        outlined: { border: ThemeColor; text: ThemeColor }
        text: { text: ThemeColor }
      }
      error: {
        contained: { background: ThemeColor; text: ThemeColor }
        outlined: { border: ThemeColor; text: ThemeColor }
        text: { text: ThemeColor }
      }
      muted: {
        contained: { background: ThemeColor; text: ThemeColor }
        outlined: { border: ThemeColor; text: ThemeColor }
        text: { text: ThemeColor }
      }
      disabled: {
        contained: { background: ThemeColor; text: ThemeColor }
        outlined: { border: ThemeColor; text: ThemeColor }
        text: { text: ThemeColor }
      }
    }
  }
}

export function getThemeColor(
  color: ThemeColor,
  palette: ColorPalette
): string {
  if (typeof color === 'string') {
    return color
  }

  const colorEntry = palette.colors.find((c) => c.id === color.paletteId)
  if (!colorEntry) {
    return '#000000'
  }

  const colorObj = new Color(colorEntry.color)
  if (color.adjustmets.alpha !== undefined) {
    colorObj.set('alpha', color.adjustmets.alpha)
  }

  if (color.adjustmets.lightness !== undefined) {
    colorObj.set(
      'hsl.l',
      colorObj.get('hsl.l') + color.adjustmets.lightness / 100
    )
  }

  if (color.adjustmets.saturation !== undefined) {
    colorObj.set(
      'hsl.s',
      colorObj.get('hsl.s') + color.adjustmets.saturation / 100
    )
  }

  return colorObj.to('sRGB').toString({ format: 'hex' })
}

/**
 * Перевіряє контраст між двома кольорами
 */
export function checkContrast(color1: string, color2: string): number {
  try {
    const c1 = new Color(color1)
    const c2 = new Color(color2)
    return c1.contrast(c2, 'WCAG21')
  } catch {
    return 1 // Мінімальний контраст у разі помилки
  }
}

/**
 * Вибирає колір тексту (чорний або білий) в залежності від фону
 */
export function getTextColorForBackground(backgroundColor: string): string {
  try {
    const bgColor = new Color(backgroundColor)
    const white = new Color('white')
    const black = new Color('black')

    const whiteContrast = bgColor.contrast(white, 'WCAG21')
    const blackContrast = bgColor.contrast(black, 'WCAG21')

    return whiteContrast > blackContrast ? '#ffffff' : '#000000'
  } catch {
    return '#000000' // За замовчуванням
  }
}

const THEME_DEFAULTS_LIGHT: UITheme['themeProps'] = {
  background: {
    default: 'hsl(0, 0%, 100%)',
    paper: 'hsl(0, 0%, 95%)',
    component: 'hsl(0, 0%, 90%)',
  },
  text: {
    primary: 'hsl(240, 10%, 3.9%)',
    secondary: 'hsl(240, 10%, 30%)',
    disabled: 'hsl(240, 10%, 60%)',
  },
  success: { text: 'hsl(120, 61%, 34%)', background: 'hsl(120, 61%, 90%)' },
  info: { text: 'hsl(210, 100%, 56%)', background: 'hsl(210, 100%, 90%)' },
  warning: { text: 'hsl(39, 100%, 50%)', background: 'hsl(39, 100%, 90%)' },
  error: { text: 'hsl(0, 100%, 50%)', background: 'hsl(0, 100%, 90%)' },
  buttons: {
    primary: {
      contained: { background: 'hsl(240, 100%, 50%)', text: '#ffffff' },
      outlined: { border: 'hsl(240, 100%, 50%)', text: 'hsl(240, 100%, 50%)' },
      text: { text: 'hsl(240, 100%, 50%)' },
    },
    secondary: {
      contained: { background: 'hsl(120, 61%, 34%)', text: '#ffffff' },
      outlined: { border: 'hsl(120, 61%, 34%)', text: 'hsl(120, 61%, 34%)' },
      text: { text: 'hsl(120, 61%, 34%)' },
    },
    error: {
      contained: { background: 'hsl(0, 100%, 50%)', text: '#ffffff' },
      outlined: { border: 'hsl(0, 100%, 50%)', text: 'hsl(0, 100%, 50%)' },
      text: { text: 'hsl(0, 100%, 50%)' },
    },
    muted: {
      contained: { background: 'hsl(0, 0%, 60%)', text: '#ffffff' },
      outlined: { border: 'hsl(0, 0%, 60%)', text: 'hsl(0, 0%, 60%)' },
      text: { text: 'hsl(0, 0%, 60%)' },
    },
    disabled: {
      contained: { background: 'hsl(0, 0%, 88%)', text: 'hsl(0, 0%, 60%)' },
      outlined: { border: 'hsl(0, 0%, 74%)', text: 'hsl(0, 0%, 60%)' },
      text: { text: 'hsl(0, 0%, 60%)' },
    },
  },
}

const THEME_DEFAULTS_DARK: UITheme['themeProps'] = {
  background: {
    default: 'hsl(240, 10%, 3.9%)',
    paper: 'hsl(240, 10%, 10%)',
    component: 'hsl(240, 10%, 15%)',
  },
  text: {
    primary: 'hsl(0, 0%, 98%)',
    secondary: 'hsl(0, 0%, 80%)',
    disabled: 'hsl(0, 0%, 60%)',
  },
  success: { text: 'hsl(120, 61%, 90%)', background: 'hsl(120, 61%, 34%)' },
  info: { text: 'hsl(210, 100%, 90%)', background: 'hsl(210, 100%, 56%)' },
  warning: { text: 'hsl(39, 100%, 90%)', background: 'hsl(39, 100%, 50%)' },
  error: { text: 'hsl(0, 100%, 90%)', background: 'hsl(0, 100%, 50%)' },
  buttons: {
    primary: {
      contained: { background: 'hsl(240, 100%, 50%)', text: '#ffffff' },
      outlined: { border: 'hsl(240, 100%, 50%)', text: 'hsl(240, 100%, 50%)' },
      text: { text: 'hsl(240, 100%, 50%)' },
    },
    secondary: {
      contained: { background: 'hsl(120, 61%, 34%)', text: '#ffffff' },
      outlined: { border: 'hsl(120, 61%, 34%)', text: 'hsl(120, 61%, 34%)' },
      text: { text: 'hsl(120, 61%, 34%)' },
    },
    error: {
      contained: { background: 'hsl(0, 100%, 50%)', text: '#ffffff' },
      outlined: { border: 'hsl(0, 100%, 50%)', text: 'hsl(0, 100%, 50%)' },
      text: { text: 'hsl(0, 100%, 50%)' },
    },
    muted: {
      contained: { background: 'hsl(0, 0%, 60%)', text: '#ffffff' },
      outlined: { border: 'hsl(0, 0%, 60%)', text: 'hsl(0, 0%, 60%)' },
      text: { text: 'hsl(0, 0%, 60%)' },
    },
    disabled: {
      contained: { background: 'hsl(0, 0%, 30%)', text: 'hsl(0, 0%, 60%)' },
      outlined: { border: 'hsl(0, 0%, 40%)', text: 'hsl(0, 0%, 60%)' },
      text: { text: 'hsl(0, 0%, 60%)' },
    },
  },
}

/**
 * Створює тему на основі палітри кольорів
 */
export function createThemeFromPalette(
  palette: ColorPalette,
  themeOptions: Partial<UITheme>
): UITheme {
  const settings = {
    isDarkMode: themeOptions.isDarkMode ?? false,
    contrastLevel: themeOptions.contrastLevel ?? 4.5,
    spacing: themeOptions.spacing ?? 8,
    rounding: themeOptions.rounding ?? 8,
    fontSize: themeOptions.fontSize ?? 16,
  }

  const defaultThemeProps = settings.isDarkMode
    ? THEME_DEFAULTS_DARK
    : THEME_DEFAULTS_LIGHT

  let backgroundColor =
    themeOptions.themeProps?.background.default ??
    defaultThemeProps.background.default
  let textColor =
    themeOptions.themeProps?.text.primary ?? defaultThemeProps.text.primary

  // Перевіряємо контраст між фоном та текстом
  if (
    backgroundColor === defaultThemeProps.background.default &&
    textColor !== defaultThemeProps.text.primary
  ) {
    const contrast = checkContrast(
      getThemeColor(backgroundColor, palette),
      getThemeColor(textColor, palette)
    )
    if (contrast < settings.contrastLevel) {
      backgroundColor = getTextColorForBackground(
        getThemeColor(textColor, palette)
      )
    }
  } else if (
    backgroundColor !== defaultThemeProps.background.default &&
    textColor === defaultThemeProps.text.primary
  ) {
    const contrast = checkContrast(
      getThemeColor(backgroundColor, palette),
      getThemeColor(textColor, palette)
    )
    if (contrast < settings.contrastLevel) {
      textColor = getTextColorForBackground(
        getThemeColor(backgroundColor, palette)
      )
    }
  }

  function getColorFor(path: string): ThemeColor {
    return get(themeOptions.themeProps, path, get(defaultThemeProps, path))
  }

  // Створюємо кольори для кнопок та сповіщень
  const primaryColor = new Color(palette.colors[0].color)
  const secondaryColor =
    palette.colors.length > 1
      ? new Color(palette.colors[1].color)
      : primaryColor
          .clone()
          .set('lch.h', (primaryColor.get('lch.h') + 180) % 360)

  // Створюємо кольори для сповіщень
  const infoColor = new Color('hsl(210, 100%, 56%)')
  const successColor = new Color('hsl(120, 61%, 34%)')
  const warningColor = new Color('hsl(39, 100%, 50%)')
  const errorColor = new Color('hsl(0, 100%, 50%)')

  // Функція для створення кольорів кнопок
  const createButtonColors = (baseColor: Color) => {
    const bgColor = baseColor.toString({ format: 'hsl' })
    const textColor = getTextColorForBackground(bgColor)

    return {
      contained: {
        background: bgColor,
        text: textColor,
      },
      outlined: {
        border: bgColor,
        text: bgColor,
      },
      text: {
        text: bgColor,
      },
    }
  }

  // Функція для створення кольорів сповіщень
  const createAlertColors = (baseColor: Color) => {
    // Створюємо світліший відтінок для фону
    const bgColor = baseColor.clone()
    bgColor.set('lch.l', settings.isDarkMode ? 30 : 90)
    bgColor.set('lch.c', bgColor.get('lch.c') * 0.5)

    const bgColorHex = bgColor.toString({ format: 'hsl' })
    const textColorHex = baseColor.toString({ format: 'hsl' })

    // Перевіряємо контраст
    const alertContrast = checkContrast(bgColorHex, textColorHex)
    const finalTextColor =
      alertContrast >= settings.contrastLevel
        ? textColorHex
        : getTextColorForBackground(bgColorHex)

    return {
      background: bgColorHex,
      text: finalTextColor,
    }
  }

  const getBGcolors = () => {
    const defaultBg = getColorFor('background.default')
    const paperBg =
      themeOptions.themeProps?.background.paper ??
      new Color(Color.lighten(getThemeColor(defaultBg, palette), 0.05))
        .to('sRGB')
        .toString({ format: 'hsl' })
    const componentBg =
      themeOptions.themeProps?.background.component ??
      new Color(Color.lighten(getThemeColor(defaultBg, palette), 0.1))
        .to('sRGB')
        .toString({ format: 'hsl' })

    return {
      default: defaultBg,
      paper: paperBg,
      component: componentBg,
    }
  }

  const getTextColors = () => {
    const primaryText = getColorFor('text.primary')
    const secondaryText =
      themeOptions.themeProps?.text.secondary ??
      new Color(
        Color.lighten(
          getThemeColor(primaryText, palette),
          settings.isDarkMode ? -20 : 20
        )
      )
        .to('sRGB')
        .toString({ format: 'hsl' })
    const disabledText =
      themeOptions.themeProps?.text.secondary ??
      new Color(
        Color.lighten(
          getThemeColor(primaryText, palette),
          settings.isDarkMode ? -40 : 40
        )
      )
        .to('sRGB')
        .toString({ format: 'hsl' })

    return {
      primary: primaryText,
      secondary: secondaryText,
      disabled: disabledText,
    }
  }

  // Створюємо тему
  return {
    id: generateUUID(),
    palette,
    ...settings,
    themeProps: {
      background: getBGcolors(),
      text: getTextColors(),
      success: createAlertColors(successColor),
      info: createAlertColors(infoColor),
      warning: createAlertColors(warningColor),
      error: createAlertColors(errorColor),

      buttons: {
        primary: createButtonColors(primaryColor),
        secondary: createButtonColors(secondaryColor),
        error: createButtonColors(errorColor),
        muted: createButtonColors(new Color('hsl(0, 0%, 60%)')),
        disabled: {
          contained: {
            background: 'hsl(0, 0%, 88%)',
            text: 'hsl(0, 0%, 60%)',
          },
          outlined: {
            border: 'hsl(0, 0%, 74%)',
            text: 'hsl(0, 0%, 60%)',
          },
          text: {
            text: 'hsl(0, 0%, 60%)',
          },
        },
      },
    },
  }
}
