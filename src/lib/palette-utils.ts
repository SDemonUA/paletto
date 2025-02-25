'use client';

import Color from 'colorjs.io';
import { generateUUID } from './uuid-utils';

// Типи стратегій створення палітри
export enum PaletteStrategy {
  MONOCHROMATIC = 'monochromatic',
  ANALOGOUS = 'analogous',
  COMPLEMENTARY = 'complementary',
  TRIADIC = 'triadic',
  TETRADIC = 'tetradic',
  SPLIT_COMPLEMENTARY = 'split-complementary'
}

// Інтерфейс для кольору в палітрі
export interface ColorEntry {
  id: string;
  name: string;
  color: Color;
}

// Інтерфейс для палітри кольорів
export interface ColorPalette {
  id: string;
  baseColor: Color;
  strategy: PaletteStrategy;
  colors: ColorEntry[];
}

/**
 * Створює палітру кольорів на основі базового кольору та стратегії
 */
export function createPalette(baseColor: Color, strategy: PaletteStrategy): ColorPalette {
  const colors: ColorEntry[] = [];
  
  // Додаємо базовий колір до палітри
  colors.push({
    id: generateUUID(),
    name: 'Базовий',
    color: baseColor.clone()
  });
  
  // Створюємо додаткові кольори в залежності від стратегії
  switch (strategy) {
    case PaletteStrategy.MONOCHROMATIC:
      // Додаємо відтінки того ж кольору з різною насиченістю та яскравістю
      for (let i = 1; i <= 4; i++) {
        const lightness = 30 + i * 15;
        const color = baseColor.clone();
        color.set('lch.l', lightness);
        
        colors.push({
          id: generateUUID(),
          name: `Відтінок ${i}`,
          color
        });
      }
      break;
      
    case PaletteStrategy.ANALOGOUS:
      // Додаємо кольори з сусідніх позицій на колірному колі
      for (let i = -2; i <= 2; i++) {
        if (i === 0) continue; // Пропускаємо базовий колір, він вже доданий
        
        const hue = (baseColor.get('lch.h') + i * 30) % 360;
        const color = baseColor.clone();
        color.set('lch.h', hue);
        
        colors.push({
          id: generateUUID(),
          name: `Аналогічний ${i < 0 ? Math.abs(i) : i}`,
          color
        });
      }
      break;
      
    case PaletteStrategy.COMPLEMENTARY:
      // Додаємо комплементарний колір (протилежний на колірному колі)
      const complementaryHue = (baseColor.get('lch.h') + 180) % 360;
      const complementaryColor = baseColor.clone();
      complementaryColor.set('lch.h', complementaryHue);
      
      colors.push({
        id: generateUUID(),
        name: 'Комплементарний',
        color: complementaryColor
      });
      
      // Додаємо відтінки базового та комплементарного кольорів
      for (let i = 1; i <= 2; i++) {
        const lightness = 40 + i * 20;
        
        const baseShade = baseColor.clone();
        baseShade.set('lch.l', lightness);
        
        const compShade = complementaryColor.clone();
        compShade.set('lch.l', lightness);
        
        colors.push({
          id: generateUUID(),
          name: `Базовий відтінок ${i}`,
          color: baseShade
        });
        
        colors.push({
          id: generateUUID(),
          name: `Комплементарний відтінок ${i}`,
          color: compShade
        });
      }
      break;
      
    case PaletteStrategy.TRIADIC:
      // Додаємо два кольори, рівномірно розподілені на колірному колі
      for (let i = 1; i <= 2; i++) {
        const hue = (baseColor.get('lch.h') + i * 120) % 360;
        const color = baseColor.clone();
        color.set('lch.h', hue);
        
        colors.push({
          id: generateUUID(),
          name: `Тріадний ${i}`,
          color
        });
      }
      break;
      
    case PaletteStrategy.TETRADIC:
      // Додаємо три кольори, рівномірно розподілені на колірному колі
      for (let i = 1; i <= 3; i++) {
        const hue = (baseColor.get('lch.h') + i * 90) % 360;
        const color = baseColor.clone();
        color.set('lch.h', hue);
        
        colors.push({
          id: generateUUID(),
          name: `Тетрадний ${i}`,
          color
        });
      }
      break;
      
    case PaletteStrategy.SPLIT_COMPLEMENTARY:
      // Додаємо два кольори, близькі до комплементарного
      const compHue = (baseColor.get('lch.h') + 180) % 360;
      
      for (let i = -1; i <= 1; i += 2) {
        const hue = (compHue + i * 30) % 360;
        const color = baseColor.clone();
        color.set('lch.h', hue);
        
        colors.push({
          id: generateUUID(),
          name: `Розділений комплементарний ${i === -1 ? 1 : 2}`,
          color
        });
      }
      break;
  }
  
  return {
    id: generateUUID(),
    baseColor: baseColor.clone(),
    strategy,
    colors
  };
} 