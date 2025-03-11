'use client'

import { useState } from 'react'
import { PaletteIntensity } from '@/lib/palette-utils'

interface IntensitySelectorProps {
  selectedIntensity: PaletteIntensity
  onIntensityChange: (intensity: PaletteIntensity) => void
}

// Інформація про стратегії
const intensityInfo: {
  id: PaletteIntensity
  name: string
  description: string
}[] = [
  {
    id: 'vibrant',
    name: 'Яскравий',
    description: 'Яскраві кольори з високою насиченістю та контрастом.',
  },
  {
    id: 'pastel',
    name: 'Пастельний',
    description:
      'Кольори з ніжними відтінками, які створюють гармонійну палітру.',
  },
  {
    id: 'light',
    name: 'Світлий',
    description: 'Ніжні, світлі відтінки, які створюють м’яку палітру.',
  },
  {
    id: 'dark',
    name: 'Темний',
    description: 'Темні кольори з високим контрастом та глибиною.',
  },
]

export default function IntensitySelector({
  selectedIntensity,
  onIntensityChange,
}: IntensitySelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedIntensityInfo = intensityInfo.find(
    (s) => s.id === selectedIntensity
  )

  return (
    <div className="relative">
      <div className="mb-2 text-sm font-medium text-gray-700">
        Стратегія палітри
      </div>

      <button
        type="button"
        className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md bg-white text-left focus:outline-none focus:ring-2 focus:ring-indigo-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedIntensityInfo?.name || selectedIntensity}</span>
        <svg
          className="h-5 w-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto">
          <ul className="py-1">
            {intensityInfo.map((intensity) => (
              <li
                key={intensity.id}
                className={`px-4 py-2 hover:bg-indigo-50 cursor-pointer ${
                  intensity.id === selectedIntensity ? 'bg-indigo-100' : ''
                }`}
                onClick={() => {
                  onIntensityChange(intensity.id)
                  setIsOpen(false)
                }}
              >
                <div className="font-medium">{intensity.name}</div>
                <div className="text-sm text-gray-500">
                  {intensity.description}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
