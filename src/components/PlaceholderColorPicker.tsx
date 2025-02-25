'use client';

import { useState, useEffect } from 'react';
import { ColorPalette } from '@/lib/palette-utils';
import { PlaceholderSettings } from '@/lib/theme-utils';

interface PlaceholderColorPickerProps {
  label: string;
  palette: ColorPalette;
  settings: PlaceholderSettings;
  onChange: (settings: PlaceholderSettings) => void;
}

export default function PlaceholderColorPicker({
  label,
  palette,
  settings,
  onChange
}: PlaceholderColorPickerProps) {
  const [manualColor, setManualColor] = useState<string>(settings.manualColor || '#ffffff');
  const [saturation, setSaturation] = useState<number>(settings.saturation || 100);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  // Синхронізуємо стан з налаштуваннями
  useEffect(() => {
    if (settings.manualColor) {
      setManualColor(settings.manualColor);
    }
    if (settings.saturation) {
      setSaturation(settings.saturation);
    }
  }, [settings]);

  // Отримуємо колір для відображення
  const getDisplayColor = () => {
    if (settings.useDefault) {
      return '#cccccc'; // Placeholder для кольору за замовчуванням
    }
    
    if (settings.manualColor) {
      return settings.manualColor;
    }
    
    if (settings.colorId) {
      const colorEntry = palette.colors.find(c => c.id === settings.colorId);
      if (colorEntry) {
        if (settings.saturation !== undefined && settings.saturation !== 100) {
          try {
            const adjustedColor = colorEntry.color.clone();
            adjustedColor.set('lch.c', adjustedColor.get('lch.c') * (settings.saturation / 100));
            return adjustedColor.toString({format: 'hex'});
          } catch {
            return colorEntry.color.toString({format: 'hex'});
          }
        }
        return colorEntry.color.toString({format: 'hex'});
      }
    }
    
    return '#cccccc';
  };

  // Обробник вибору кольору з палітри
  const handleColorSelect = (colorId: string) => {
    onChange({
      ...settings,
      useDefault: false,
      colorId,
      manualColor: undefined
    });
  };

  // Обробник вибору кольору за замовчуванням
  const handleDefaultSelect = () => {
    onChange({
      useDefault: true,
      colorId: undefined,
      manualColor: undefined,
      saturation: 100
    });
  };

  // Обробник зміни насиченості
  const handleSaturationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSaturation = parseInt(e.target.value);
    setSaturation(newSaturation);
    onChange({
      ...settings,
      saturation: newSaturation
    });
  };

  // Обробник ручного вибору кольору
  const handleManualColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setManualColor(newColor);
    onChange({
      useDefault: false,
      colorId: undefined,
      manualColor: newColor,
      saturation: settings.saturation
    });
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium">{label}</label>
        <button 
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs text-blue-500 hover:text-blue-700"
        >
          {showAdvanced ? 'Сховати розширені' : 'Розширені налаштування'}
        </button>
      </div>
      
      <div className="flex items-center mb-2">
        <div 
          className="w-8 h-8 rounded border mr-2" 
          style={{ backgroundColor: getDisplayColor() }}
        />
        
        <button
          type="button"
          onClick={handleDefaultSelect}
          className={`px-3 py-1 text-sm rounded mr-2 ${
            settings.useDefault 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          За замовчуванням
        </button>
      </div>
      
      {showAdvanced && (
        <div className="mt-2 p-3 bg-gray-50 rounded">
          <div className="mb-3">
            <label className="block text-sm mb-1">Ручний вибір кольору</label>
            <input
              type="color"
              value={manualColor}
              onChange={handleManualColorChange}
              className="w-full h-8 cursor-pointer"
            />
          </div>
          
          <div className="mb-2">
            <label className="block text-sm mb-1">
              Насиченість: {saturation}%
            </label>
            <input
              type="range"
              min="0"
              max="200"
              value={saturation}
              onChange={handleSaturationChange}
              className="w-full"
              disabled={settings.useDefault || !!settings.manualColor}
            />
          </div>
        </div>
      )}
      
      <div className="mt-3">
        <div className="text-sm mb-1">Вибрати з палітри:</div>
        <div className="grid grid-cols-5 gap-2">
          {palette.colors.map((color) => (
            <button
              key={color.id}
              type="button"
              className={`w-full h-8 rounded border ${
                settings.colorId === color.id && !settings.useDefault && !settings.manualColor
                  ? 'ring-2 ring-blue-500'
                  : ''
              }`}
              style={{ 
                backgroundColor: color.color.toString({format: 'hex'})
              }}
              onClick={() => handleColorSelect(color.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 