'use client';

import { useState } from 'react';
import { PaletteStrategy } from '@/lib/palette-utils';

interface StrategySelectorProps {
  selectedStrategy: PaletteStrategy;
  onStrategyChange: (strategy: PaletteStrategy) => void;
}

// Інформація про стратегії
const strategyInfo = [
  {
    id: PaletteStrategy.ANALOGOUS,
    name: 'Аналогічна',
    description: 'Кольори, розташовані поруч на колірному колі, створюють гармонійну палітру.'
  },
  {
    id: PaletteStrategy.COMPLEMENTARY,
    name: 'Комплементарна',
    description: 'Кольори, розташовані навпроти один одного на колірному колі, створюють контрастну палітру.'
  },
  {
    id: PaletteStrategy.TRIADIC,
    name: 'Тріадична',
    description: 'Три кольори, рівномірно розташовані на колірному колі, створюють збалансовану палітру.'
  },
  {
    id: PaletteStrategy.TETRADIC,
    name: 'Тетрадична',
    description: 'Чотири кольори, розташовані у формі прямокутника на колірному колі.'
  },
  {
    id: PaletteStrategy.MONOCHROMATIC,
    name: 'Монохроматична',
    description: 'Різні відтінки, тони та насиченість одного кольору.'
  }
];

export default function StrategySelector({ selectedStrategy, onStrategyChange }: StrategySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedStrategyInfo = strategyInfo.find(s => s.id === selectedStrategy);
  
  return (
    <div className="relative">
      <div className="mb-2 text-sm font-medium text-gray-700">Стратегія палітри</div>
      
      <button
        type="button"
        className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md bg-white text-left focus:outline-none focus:ring-2 focus:ring-indigo-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedStrategyInfo?.name || selectedStrategy}</span>
        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto">
          <ul className="py-1">
            {strategyInfo.map((strategy) => (
              <li 
                key={strategy.id}
                className={`px-4 py-2 hover:bg-indigo-50 cursor-pointer ${strategy.id === selectedStrategy ? 'bg-indigo-100' : ''}`}
                onClick={() => {
                  onStrategyChange(strategy.id);
                  setIsOpen(false);
                }}
              >
                <div className="font-medium">{strategy.name}</div>
                <div className="text-sm text-gray-500">{strategy.description}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 