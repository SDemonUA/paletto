import Color from 'colorjs.io';
import { generateUUID } from './utils';

export type PaletteStrategy = 
  | 'monochromatic' 
  | 'analogous' 
  | 'complementary' 
  | 'triadic' 
  | 'tetradic' 
  | 'split-complementary';

export interface PalettoColor {
  id: string;
  name?: string;
  color: Color;
  isLocked: boolean;
}

export interface ColorPalette {
  id: string;
  name: string;
  baseColor: PalettoColor;
  colors: PalettoColor[];
  strategy: PaletteStrategy;
}

// Створення нового кольору
export const createColor = (value: string | Color, name?: string, isLocked: boolean = false): PalettoColor => {
  return {
    id: generateUUID(),
    name,
    color: value instanceof Color ? value : new Color(value),
    isLocked
  };
};

// Створення нової палітри
export const createPalette = (baseColor: string | Color, strategy: PaletteStrategy): ColorPalette => {
  const base = createColor(baseColor, 'Base');
  
  return {
    id: generateUUID(),
    name: `${strategy.charAt(0).toUpperCase() + strategy.slice(1)} Palette`,
    baseColor: base,
    colors: generatePaletteColors(base, strategy),
    strategy
  };
};

// Генерація кольорів палітри на основі стратегії
export const generatePaletteColors = (baseColor: PalettoColor, strategy: PaletteStrategy, count: number = 5): PalettoColor[] => {
  const result: PalettoColor[] = [baseColor];
  const lchColor = baseColor.color.to("lch");
  
  switch (strategy) {
    case 'monochromatic':
      // Варіації світлості та насиченості
      for (let i = 1; i < count; i++) {
        const lightness = Math.max(20, Math.min(90, lchColor.l + (i - count/2) * 15));
        const chroma = Math.max(0, Math.min(132, lchColor.c + (i - count/2) * 10));
        
        const newColor = new Color("lch", [lightness, chroma, lchColor.h]);
        if (!newColor.inGamut("srgb")) {
          newColor.toGamut("srgb");
        }
        
        result.push(createColor(newColor, `Mono ${i}`));
      }
      break;
      
    case 'analogous':
      // Кольори з близькими кутами відтінку
      for (let i = 1; i < count; i++) {
        const hue = (lchColor.h + (i - Math.floor(count/2)) * 30 + 360) % 360;
        
        const newColor = new Color("lch", [lchColor.l, lchColor.c, hue]);
        if (!newColor.inGamut("srgb")) {
          newColor.toGamut("srgb");
        }
        
        result.push(createColor(newColor, `Analog ${i}`));
      }
      break;
      
    case 'complementary':
      // Основний колір та його комплементарний (протилежний)
      const complementHue = (lchColor.h + 180) % 360;
      const complementColor = new Color("lch", [lchColor.l, lchColor.c, complementHue]);
      
      if (!complementColor.inGamut("srgb")) {
        complementColor.toGamut("srgb");
      }
      
      result.push(createColor(complementColor, 'Complement'));
      
      // Додаємо варіації основного та комплементарного кольорів
      for (let i = 1; i < Math.floor(count/2); i++) {
        const lightBase = new Color("lch", [Math.min(90, lchColor.l + 15 * i), lchColor.c, lchColor.h]);
        const lightComplement = new Color("lch", [Math.min(90, lchColor.l + 15 * i), lchColor.c, complementHue]);
        
        if (!lightBase.inGamut("srgb")) lightBase.toGamut("srgb");
        if (!lightComplement.inGamut("srgb")) lightComplement.toGamut("srgb");
        
        result.push(createColor(lightBase, `Base Light ${i}`));
        result.push(createColor(lightComplement, `Complement Light ${i}`));
      }
      break;
      
    case 'triadic':
      // Три кольори, рівномірно розподілені по колірному колу
      for (let i = 1; i < 3; i++) {
        const hue = (lchColor.h + i * 120) % 360;
        const newColor = new Color("lch", [lchColor.l, lchColor.c, hue]);
        
        if (!newColor.inGamut("srgb")) {
          newColor.toGamut("srgb");
        }
        
        result.push(createColor(newColor, `Triad ${i}`));
      }
      
      // Додаємо варіації світлості
      if (count > 3) {
        for (let i = 0; i < 3; i++) {
          const hue = (lchColor.h + i * 120) % 360;
          const lightColor = new Color("lch", [Math.min(90, lchColor.l + 15), lchColor.c, hue]);
          
          if (!lightColor.inGamut("srgb")) {
            lightColor.toGamut("srgb");
          }
          
          result.push(createColor(lightColor, `Triad ${i} Light`));
        }
      }
      break;
      
    case 'tetradic':
      // Чотири кольори, рівномірно розподілені по колірному колу
      for (let i = 1; i < 4; i++) {
        const hue = (lchColor.h + i * 90) % 360;
        const newColor = new Color("lch", [lchColor.l, lchColor.c, hue]);
        
        if (!newColor.inGamut("srgb")) {
          newColor.toGamut("srgb");
        }
        
        result.push(createColor(newColor, `Tetrad ${i}`));
      }
      break;
      
    case 'split-complementary':
      // Основний колір та два кольори по обидва боки від комплементарного
      const complement = (lchColor.h + 180) % 360;
      const split1 = (complement - 30 + 360) % 360;
      const split2 = (complement + 30) % 360;
      
      const splitColor1 = new Color("lch", [lchColor.l, lchColor.c, split1]);
      const splitColor2 = new Color("lch", [lchColor.l, lchColor.c, split2]);
      
      if (!splitColor1.inGamut("srgb")) splitColor1.toGamut("srgb");
      if (!splitColor2.inGamut("srgb")) splitColor2.toGamut("srgb");
      
      result.push(createColor(splitColor1, 'Split 1'));
      result.push(createColor(splitColor2, 'Split 2'));
      
      // Додаємо варіації світлості
      if (count > 3) {
        const lightBase = new Color("lch", [Math.min(90, lchColor.l + 15), lchColor.c, lchColor.h]);
        const lightSplit1 = new Color("lch", [Math.min(90, lchColor.l + 15), lchColor.c, split1]);
        const lightSplit2 = new Color("lch", [Math.min(90, lchColor.l + 15), lchColor.c, split2]);
        
        if (!lightBase.inGamut("srgb")) lightBase.toGamut("srgb");
        if (!lightSplit1.inGamut("srgb")) lightSplit1.toGamut("srgb");
        if (!lightSplit2.inGamut("srgb")) lightSplit2.toGamut("srgb");
        
        result.push(createColor(lightBase, 'Base Light'));
        result.push(createColor(lightSplit1, 'Split 1 Light'));
        result.push(createColor(lightSplit2, 'Split 2 Light'));
      }
      break;
  }
  
  // Обмежуємо кількість кольорів до заданої
  return result.slice(0, count);
};

// Регенерація палітри зі збереженням заблокованих кольорів
export const regeneratePalette = (palette: ColorPalette): ColorPalette => {
  const newColors = generatePaletteColors(palette.baseColor, palette.strategy, palette.colors.length);
  
  // Зберігаємо заблоковані кольори
  const finalColors = palette.colors.map((color, index) => {
    if (color.isLocked) {
      return color;
    } else if (index < newColors.length) {
      return newColors[index];
    } else {
      return color;
    }
  });
  
  return {
    ...palette,
    colors: finalColors
  };
};

// Перевірка контрастності для доступності
export const checkContrast = (foreground: PalettoColor, background: PalettoColor): {
  wcag2: number;
  isWCAG2AA: boolean;
  isWCAG2AAA: boolean;
} => {
  const wcag2 = foreground.color.contrast(background.color, "WCAG21");
  
  return {
    wcag2,
    isWCAG2AA: wcag2 >= 4.5,
    isWCAG2AAA: wcag2 >= 7
  };
};

// Отримання кольору в різних форматах
export const getColorAs = (palettoColor: PalettoColor, format: string = "hex"): string => {
  return palettoColor.color.toString({format});
};

// Стратегії палітр з описами
export const paletteStrategies: {id: PaletteStrategy, name: string, description: string}[] = [
  {
    id: 'monochromatic',
    name: 'Монохроматична',
    description: 'Варіації одного кольору з різною світлістю та насиченістю'
  },
  {
    id: 'analogous',
    name: 'Аналогічна',
    description: 'Кольори, що знаходяться поруч на колірному колі'
  },
  {
    id: 'complementary',
    name: 'Комплементарна',
    description: 'Основний колір та протилежний йому на колірному колі'
  },
  {
    id: 'triadic',
    name: 'Тріадна',
    description: 'Три кольори, рівномірно розподілені по колірному колу'
  },
  {
    id: 'tetradic',
    name: 'Тетрадна',
    description: 'Чотири кольори, рівномірно розподілені по колірному колу'
  },
  {
    id: 'split-complementary',
    name: 'Розділена комплементарна',
    description: 'Основний колір та два кольори по обидва боки від комплементарного'
  }
]; 