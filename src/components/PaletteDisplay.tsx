'use client';

import { ColorPalette, ColorEntry } from '@/lib/palette-utils';
import Color from 'colorjs.io';

interface PaletteDisplayProps {
  palette: ColorPalette;
  onColorChange: (index: number, newColor: ColorEntry) => void;
  onColorLockToggle: (index: number, color: ColorEntry) => void;
}

export default function PaletteDisplay({ palette, onColorChange, onColorLockToggle }: PaletteDisplayProps) {
  // Функція для визначення контрастного кольору тексту
  const getContrastTextColor = (backgroundColor: Color): string => {
    try {
      const white = new Color('white');
      const black = new Color('black');
      
      const whiteContrast = backgroundColor.contrast(white, 'WCAG21');
      const blackContrast = backgroundColor.contrast(black, 'WCAG21');
      
      return whiteContrast > blackContrast ? 'white' : 'black';
    } catch (e) {
      return 'black'; // За замовчуванням
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {palette.colors.map((colorEntry, index) => {
          const colorHex = colorEntry.color.toString({format: 'hex'});
          const textColor = getContrastTextColor(colorEntry.color);
          
          return (
            <div 
              key={colorEntry.id}
              className="p-4 rounded-lg h-24 flex flex-col justify-between"
              style={{ backgroundColor: colorHex }}
            >
              <div className="text-sm font-medium" style={{ color: textColor }}>
                {colorEntry.name}
              </div>
              <div className="text-xs" style={{ color: textColor }}>
                {colorHex}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 