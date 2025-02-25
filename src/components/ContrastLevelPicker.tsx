'use client';

import { useState, useEffect } from 'react';

interface ContrastLevelPickerProps {
  value: number;
  onChange: (value: number) => void;
}

export default function ContrastLevelPicker({ 
  value, 
  onChange 
}: ContrastLevelPickerProps) {
  const [level, setLevel] = useState<number>(value);
  
  // Синхронізуємо стан з пропсами
  useEffect(() => {
    setLevel(value);
  }, [value]);
  
  // Обробник зміни рівня контрасту
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setLevel(newValue);
    onChange(newValue);
  };
  
  // Функція для отримання опису рівня контрасту
  const getContrastDescription = (level: number): string => {
    if (level < 2) return 'Низький (не рекомендується)';
    if (level < 3) return 'Середній';
    if (level < 4.5) return 'Хороший';
    if (level < 7) return 'Високий (AA)';
    return 'Дуже високий (AAA)';
  };
  
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">
        Рівень контрасту: {level.toFixed(1)} - {getContrastDescription(level)}
      </label>
      
      <input
        type="range"
        min="1"
        max="7"
        step="0.1"
        value={level}
        onChange={handleChange}
        className="w-full"
      />
      
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>Низький</span>
        <span>Середній</span>
        <span>Високий</span>
      </div>
      
      <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
        <p>
          Рівень контрасту визначає, наскільки добре текст буде видно на фоні.
          Вищий рівень контрасту покращує читабельність, але може обмежити вибір кольорів.
        </p>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>Рівень 3.0 або вище рекомендується для основного тексту</li>
          <li>Рівень 4.5 відповідає стандарту доступності AA</li>
          <li>Рівень 7.0 відповідає стандарту доступності AAA</li>
        </ul>
      </div>
    </div>
  );
} 