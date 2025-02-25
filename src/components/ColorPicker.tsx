'use client';

import { useState, useEffect } from 'react';
import Color from 'colorjs.io';
import { PalettoColor, getColorAs } from '@/lib/color-utils';

interface ColorPickerProps {
  color: PalettoColor;
  onChange: (newColor: PalettoColor) => void;
  onLockToggle: (color: PalettoColor) => void;
}

export default function ColorPicker({ color, onChange, onLockToggle }: ColorPickerProps) {
  const [hexValue, setHexValue] = useState(getColorAs(color, 'hex'));
  
  useEffect(() => {
    setHexValue(getColorAs(color, 'hex'));
  }, [color]);
  
  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHex = e.target.value;
    setHexValue(newHex);
    
    try {
      // Перевіряємо, чи є введене значення валідним кольором
      const newColor = new Color(newHex);
      onChange({
        ...color,
        color: newColor
      });
    } catch (error) {
      // Ігноруємо невалідні кольори
    }
  };
  
  const handleLockToggle = () => {
    onLockToggle({
      ...color,
      isLocked: !color.isLocked
    });
  };
  
  const textColor = color.color.contrast('white', 'WCAG21') >= 4.5 ? 'white' : 'black';
  
  return (
    <div className="flex flex-col">
      <div 
        className="w-full h-24 rounded-t-lg flex items-center justify-center relative"
        style={{ backgroundColor: getColorAs(color, 'hex') }}
      >
        <button
          onClick={handleLockToggle}
          className="absolute top-2 right-2 p-1 rounded-full bg-white/30 hover:bg-white/50 transition-colors"
          aria-label={color.isLocked ? "Розблокувати колір" : "Заблокувати колір"}
        >
          {color.isLocked ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke={textColor}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke={textColor}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
          )}
        </button>
        <span 
          className="font-medium text-sm"
          style={{ color: textColor }}
        >
          {color.name}
        </span>
      </div>
      <div className="p-2 bg-white border border-gray-200 rounded-b-lg">
        <input
          type="text"
          value={hexValue}
          onChange={handleHexChange}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
          placeholder="#RRGGBB"
        />
      </div>
    </div>
  );
} 