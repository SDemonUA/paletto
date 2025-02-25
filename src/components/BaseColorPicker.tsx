'use client';

import { useState, useEffect } from 'react';
import Color from 'colorjs.io';

interface BaseColorPickerProps {
  color: Color;
  onChange: (color: Color) => void;
}

export default function BaseColorPicker({ color, onChange }: BaseColorPickerProps) {
  const [hexValue, setHexValue] = useState(color.toString({format: 'hex'}));
  
  useEffect(() => {
    setHexValue(color.toString({format: 'hex'}));
  }, [color]);
  
  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHex = e.target.value;
    setHexValue(newHex);
    
    try {
      // Перевіряємо, чи є введене значення валідним кольором
      const newColor = new Color(newHex);
      onChange(newColor);
    } catch (error) {
      // Ігноруємо невалідні кольори
    }
  };
  
  // Попередньо визначені кольори для швидкого вибору
  const presetColors = [
    '#FF5733', // Червоний
    '#33FF57', // Зелений
    '#3357FF', // Синій
    '#FF33F5', // Рожевий
    '#F5FF33', // Жовтий
    '#33FFF5', // Бірюзовий
    '#8033FF', // Фіолетовий
    '#FF8033', // Помаранчевий
  ];
  
  const handlePresetClick = (colorHex: string) => {
    setHexValue(colorHex);
    try {
      const newColor = new Color(colorHex);
      onChange(newColor);
    } catch (error) {
      // Ігноруємо невалідні кольори
    }
  };
  
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
      <div 
        className="w-full h-24 rounded-lg flex items-center justify-center mb-4"
        style={{ backgroundColor: color.toString({format: 'hex'}) }}
      >
        <span className="font-medium text-lg" style={{ 
          color: getContrastTextColor(color)
        }}>
          Базовий колір
        </span>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="w-full">
          <input
            type="text"
            value={hexValue}
            onChange={handleHexChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="#RRGGBB"
          />
        </div>
        <input
          type="color"
          value={hexValue}
          onChange={(e) => {
            const newColor = e.target.value;
            setHexValue(newColor);
            onChange(new Color(newColor));
          }}
          className="h-10 w-10 border-0 p-0 cursor-pointer"
        />
      </div>
      
      <div>
        <div className="mb-2 text-sm font-medium text-gray-700">Швидкий вибір</div>
        <div className="grid grid-cols-8 gap-2">
          {presetColors.map((colorHex, index) => (
            <button
              key={index}
              className="w-8 h-8 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              style={{ backgroundColor: colorHex }}
              onClick={() => handlePresetClick(colorHex)}
              aria-label={`Вибрати колір ${colorHex}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 