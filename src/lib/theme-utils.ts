'use client';

import Color from 'colorjs.io';
import { ColorPalette } from '@/lib/palette-utils';
import { generateUUID } from './uuid-utils';

// Інтерфейс для налаштувань плейсхолдера
export interface PlaceholderSettings {
  useDefault: boolean;
  colorId?: string;
  manualColor?: string;
  saturation?: number;
}

// Інтерфейс для налаштувань теми
export interface ThemeSettings {
  isDarkMode: boolean;
  contrastLevel: number;
  placeholders: {
    background: PlaceholderSettings;
    text: PlaceholderSettings;
  };
}

// Інтерфейс для UI теми
export interface UITheme {
  id: string;
  palette: ColorPalette;
  settings: ThemeSettings;
  rounding?: number;
  spacing?: number;
  fontSize?: number;
  themeProps: {
    background: {
      default: string;
      paper: string;
      component: string;
    };
    text: {
      primary: string;
      secondary: string;
      disabled: string;
    };
    alerts: {
      info: { background: string; text: string };
      success: { background: string; text: string };
      warning: { background: string; text: string };
      error: { background: string; text: string };
    };
    buttons: {
      primary: { 
        contained: { background: string; text: string };
        outlined: { border: string; text: string };
        text: { text: string };
      };
      secondary: { 
        contained: { background: string; text: string };
        outlined: { border: string; text: string };
        text: { text: string };
      };
      error: { 
        contained: { background: string; text: string };
        outlined: { border: string; text: string };
        text: { text: string };
      };
      muted: { 
        contained: { background: string; text: string };
        outlined: { border: string; text: string };
        text: { text: string };
      };
      disabled: { 
        contained: { background: string; text: string };
        outlined: { border: string; text: string };
        text: { text: string };
      };
    };
  };
}

/**
 * Отримує колір з налаштувань плейсхолдера
 */
export function getColorFromPlaceholderSettings(
  settings: PlaceholderSettings,
  palette: ColorPalette,
  defaultColor: string
): string {
  // Якщо використовуємо значення за замовчуванням
  if (settings.useDefault) {
    return defaultColor;
  }
  
  // Якщо вказано ручний колір
  if (settings.manualColor) {
    return settings.manualColor;
  }
  
  // Якщо вказано ID кольору з палітри
  if (settings.colorId) {
    const colorEntry = palette.colors.find(c => c.id === settings.colorId);
    if (colorEntry) {
      // Якщо вказано насиченість, змінюємо її
      if (settings.saturation !== undefined && settings.saturation !== 100) {
        const adjustedColor = colorEntry.color.clone();
        adjustedColor.set('lch.c', adjustedColor.get('lch.c') * (settings.saturation / 100));
        return adjustedColor.toString({format: 'hex'});
      }
      return colorEntry.color.toString({format: 'hex'});
    }
  }
  
  // Якщо нічого не знайдено, повертаємо значення за замовчуванням
  return defaultColor;
}

/**
 * Перевіряє контраст між двома кольорами
 */
export function checkContrast(color1: string, color2: string): number {
  try {
    const c1 = new Color(color1);
    const c2 = new Color(color2);
    return c1.contrast(c2, 'WCAG21');
  } catch {
    return 1; // Мінімальний контраст у разі помилки
  }
}

/**
 * Вибирає колір тексту (чорний або білий) в залежності від фону
 */
export function getTextColorForBackground(backgroundColor: string): string {
  try {
    const bgColor = new Color(backgroundColor);
    const white = new Color('white');
    const black = new Color('black');
    
    const whiteContrast = bgColor.contrast(white, 'WCAG21');
    const blackContrast = bgColor.contrast(black, 'WCAG21');
    
    return whiteContrast > blackContrast ? 'white' : 'black';
  } catch {
    return 'black'; // За замовчуванням
  }
}

/**
 * Створює тему на основі палітри кольорів
 */
export function createThemeFromPalette(
  palette: ColorPalette,
  settings: ThemeSettings = {
    isDarkMode: false,
    contrastLevel: 3,
    placeholders: {
      background: { useDefault: true },
      text: { useDefault: true }
    }
  }
): UITheme {
  // Значення за замовчуванням
  const defaultBackground = settings.isDarkMode ? 'hsl(240, 10%, 3.9%)' : 'hsl(0, 0%, 100%)';
  const defaultText = settings.isDarkMode ? 'hsl(0, 0%, 98%)' : 'hsl(240, 10%, 3.9%)';
  
  // Отримуємо кольори для фону та тексту
  const backgroundColor = getColorFromPlaceholderSettings(
    settings.placeholders.background,
    palette,
    defaultBackground
  );
  
  const textColor = getColorFromPlaceholderSettings(
    settings.placeholders.text,
    palette,
    defaultText
  );
  
  // Перевіряємо контраст між фоном та текстом
  let finalTextColor = textColor;
  const finalBackgroundColor = backgroundColor;
  
  // Перевіряємо, чи достатній контраст
  const contrast = checkContrast(backgroundColor, textColor);
  
  // Якщо контраст недостатній, коригуємо текстовий колір
  if (contrast < settings.contrastLevel) {
    // Визначаємо, який колір тексту буде мати кращий контраст
    finalTextColor = getTextColorForBackground(backgroundColor);
  }
  
  // Створюємо кольори для компонентів
  const bgColor = new Color(finalBackgroundColor);
  const txtColor = new Color(finalTextColor);
  
  // Створюємо відтінки для фону
  const paperBg = settings.isDarkMode
    ? bgColor.clone().set('lch.l', bgColor.get('lch.l') + 5)
    : bgColor.clone().set('lch.l', bgColor.get('lch.l') - 5);
    
  const componentBg = settings.isDarkMode
    ? bgColor.clone().set('lch.l', bgColor.get('lch.l') + 10)
    : bgColor.clone().set('lch.l', bgColor.get('lch.l') - 10);
  
  // Створюємо відтінки для тексту
  const secondaryText = txtColor.clone().set('lch.l', 
    settings.isDarkMode 
      ? txtColor.get('lch.l') - 20 
      : txtColor.get('lch.l') + 20
  );
  
  const disabledText = txtColor.clone().set('lch.l', 
    settings.isDarkMode 
      ? txtColor.get('lch.l') - 40 
      : txtColor.get('lch.l') + 40
  );
  
  // Створюємо кольори для кнопок та сповіщень
  const primaryColor = palette.colors[0].color.clone();
  const secondaryColor = palette.colors.length > 1 
    ? palette.colors[1].color.clone() 
    : primaryColor.clone().set('lch.h', (primaryColor.get('lch.h') + 180) % 360);
  
  // Створюємо кольори для сповіщень
  const infoColor = new Color('hsl(210, 100%, 56%)');
  const successColor = new Color('hsl(120, 61%, 34%)');
  const warningColor = new Color('hsl(39, 100%, 50%)');
  const errorColor = new Color('hsl(0, 100%, 50%)');
  
  // Функція для створення кольорів кнопок
  const createButtonColors = (baseColor: Color) => {
    const bgColor = baseColor.toString({format: 'hsl'});
    const textColor = getTextColorForBackground(bgColor);
    
    return {
      contained: { 
        background: bgColor, 
        text: textColor 
      },
      outlined: { 
        border: bgColor, 
        text: bgColor 
      },
      text: { 
        text: bgColor 
      }
    };
  };
  
  // Функція для створення кольорів сповіщень
  const createAlertColors = (baseColor: Color) => {
    // Створюємо світліший відтінок для фону
    const bgColor = baseColor.clone();
    bgColor.set('lch.l', settings.isDarkMode ? 30 : 90);
    bgColor.set('lch.c', bgColor.get('lch.c') * 0.5);
    
    const bgColorHex = bgColor.toString({format: 'hsl'});
    const textColorHex = baseColor.toString({format: 'hsl'});
    
    // Перевіряємо контраст
    const alertContrast = checkContrast(bgColorHex, textColorHex);
    const finalTextColor = alertContrast >= settings.contrastLevel 
      ? textColorHex 
      : getTextColorForBackground(bgColorHex);
    
    return {
      background: bgColorHex,
      text: finalTextColor
    };
  };
  
  // Створюємо тему
  return {
    id: generateUUID(),
    palette,
    settings,
    rounding: 8,
    spacing: 8,
    fontSize: 16,
    themeProps: {
      background: {
        default: finalBackgroundColor,
        paper: paperBg.toString({format: 'hsl'}),
        component: componentBg.toString({format: 'hsl'})
      },
      text: {
        primary: finalTextColor,
        secondary: secondaryText.toString({format: 'hsl'}),
        disabled: disabledText.toString({format: 'hsl'})
      },
      alerts: {
        info: createAlertColors(infoColor),
        success: createAlertColors(successColor),
        warning: createAlertColors(warningColor),
        error: createAlertColors(errorColor)
      },
      buttons: {
        primary: createButtonColors(primaryColor),
        secondary: createButtonColors(secondaryColor),
        error: createButtonColors(errorColor),
        muted: createButtonColors(new Color('hsl(0, 0%, 60%)')),
        disabled: {
          contained: { 
            background: 'hsl(0, 0%, 88%)', 
            text: 'hsl(0, 0%, 60%)' 
          },
          outlined: { 
            border: 'hsl(0, 0%, 74%)', 
            text: 'hsl(0, 0%, 60%)' 
          },
          text: { 
            text: 'hsl(0, 0%, 60%)' 
          }
        }
      }
    }
  };
}