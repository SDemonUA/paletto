'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BaseColorPicker from '@/components/BaseColorPicker';
import StrategySelector from '@/components/StrategySelector';
import PaletteDisplay from '@/components/PaletteDisplay';
import ThemePreview from '@/components/ThemePreview';
import PlaceholderColorPicker from '@/components/PlaceholderColorPicker';
import { createPalette, PaletteStrategy, ColorPalette, ColorEntry } from '@/lib/palette-utils';
import { createThemeFromPalette, UITheme, PlaceholderSettings } from '@/lib/theme-utils';
import Color from 'colorjs.io';

export default function Step1() {
  const router = useRouter();
  const [baseColor, setBaseColor] = useState<Color>(new Color('#3498db'));
  const [strategy, setStrategy] = useState<PaletteStrategy>(PaletteStrategy.ANALOGOUS);
  const [palette, setPalette] = useState<ColorPalette | null>(null);
  const [theme, setTheme] = useState<UITheme | null>(null);
  
  // Створюємо палітру при зміні базового кольору або стратегії
  useEffect(() => {
    const newPalette = createPalette(baseColor, strategy);
    setPalette(newPalette);
    
    // Створюємо тему на основі палітри
    if (newPalette) {
      // Зберігаємо існуючі налаштування, якщо вони є
      const settings = theme ? theme.settings : {
        isDarkMode: false,
        contrastLevel: 3,
        placeholders: {
          background: { useDefault: true },
          text: { useDefault: true }
        }
      };
      
      const newTheme = createThemeFromPalette(newPalette, settings);
      setTheme(newTheme);
    }
  }, [baseColor, strategy]);
  
  // Обробник для зміни базового кольору
  const handleBaseColorChange = (color: Color) => {
    setBaseColor(color);
  };
  
  // Обробник для зміни стратегії
  const handleStrategyChange = (newStrategy: PaletteStrategy) => {
    setStrategy(newStrategy);
  };
  
  // Обробник для перегенерації палітри
  const handleRegeneratePalette = () => {
    if (palette) {
      const newPalette = createPalette(baseColor, strategy);
      setPalette(newPalette);
      
      if (theme) {
        const newTheme = createThemeFromPalette(newPalette, theme.settings);
        setTheme(newTheme);
      }
    }
  };
  
  // Обробник для випадкового базового кольору
  const handleRandomBaseColor = () => {
    // Генеруємо випадковий колір в LCH просторі для кращих результатів
    const h = Math.floor(Math.random() * 360);
    const c = Math.floor(Math.random() * 100) + 30; // Хроматичність від 30 до 130
    const l = Math.floor(Math.random() * 60) + 30; // Світлість від 30 до 90
    
    const randomColor = new Color("lch", [l, c, h]);
    
    // Переконуємося, що колір в межах sRGB гамуту
    if (!randomColor.inGamut("srgb")) {
      randomColor.toGamut("srgb");
    }
    
    setBaseColor(randomColor);
  };
  
  // Заглушки для обробників подій PaletteDisplay
  const handleColorChange = (index: number, newColor: ColorEntry) => {
    // Заглушка
  };
  
  const handleColorLockToggle = (index: number, color: ColorEntry) => {
    // Заглушка
  };
  
  // Обробник для зміни налаштувань плейсхолдера
  const handlePlaceholderChange = (
    placeholder: 'background' | 'text',
    settings: PlaceholderSettings
  ) => {
    if (theme && palette) {
      const updatedSettings = {
        ...theme.settings,
        placeholders: {
          ...theme.settings.placeholders,
          [placeholder]: settings
        }
      };
      
      const updatedTheme = createThemeFromPalette(palette, updatedSettings);
      setTheme(updatedTheme);
    }
  };
  
  // Перехід до наступного кроку
  const goToNextStep = () => {
    // Тут можна зберегти палітру та тему в localStorage або в стейт-менеджері
    if (theme) {
      localStorage.setItem('paletto-theme', JSON.stringify(theme));
      localStorage.setItem('paletto-palette', JSON.stringify(palette));
      router.push('/wizard/step-2');
    }
  };
  
  if (!palette || !theme) {
    return <div className="p-8">Завантаження...</div>;
  }
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Створення палітри кольорів</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-xl font-semibold mb-4">Базовий колір</h2>
            <BaseColorPicker color={baseColor} onChange={handleBaseColorChange} />
            
            <div className="mt-4">
              <button
                onClick={handleRandomBaseColor}
                className="w-full py-2 px-4 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors"
              >
                Випадковий колір
              </button>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-xl font-semibold mb-4">Стратегія палітри</h2>
            <StrategySelector selectedStrategy={strategy} onStrategyChange={handleStrategyChange} />
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-xl font-semibold mb-4">Плейсхолдери</h2>
            <p className="text-sm text-gray-600 mb-4">
              Виберіть кольори для фону та тексту з вашої палітри.
            </p>
            
            <PlaceholderColorPicker 
              label="Фон"
              palette={palette}
              settings={theme.settings.placeholders.background}
              onChange={(settings) => handlePlaceholderChange('background', settings)}
            />
            
            <PlaceholderColorPicker 
              label="Текст"
              palette={palette}
              settings={theme.settings.placeholders.text}
              onChange={(settings) => handlePlaceholderChange('text', settings)}
            />
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-xl font-semibold mb-4">Палітра кольорів</h2>
            <PaletteDisplay 
              palette={palette} 
              onColorChange={handleColorChange} 
              onColorLockToggle={handleColorLockToggle} 
            />
            
            <div className="mt-4">
              <button
                onClick={handleRegeneratePalette}
                className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Перегенерувати палітру
              </button>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              onClick={goToNextStep}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              disabled={!palette}
            >
              Перейти до налаштувань теми
            </button>
          </div>
        </div>
        
        <div>
          <ThemePreview theme={theme} />
        </div>
      </div>
    </div>
  );
}