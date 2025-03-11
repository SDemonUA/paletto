'use client'

import { ColorPalette } from '@/lib/palette-utils'
import Color from 'colorjs.io'

interface PaletteDisplayProps {
  palette: ColorPalette
}

export default function PaletteDisplay({ palette }: PaletteDisplayProps) {
  // Функція для визначення контрастного кольору тексту
  const getContrastTextColor = (backgroundColor: string): string => {
    try {
      const white = new Color('white')
      const black = new Color('black')

      const colorInstance = new Color(backgroundColor)
      const whiteContrast = colorInstance.contrast(white, 'WCAG21')
      const blackContrast = colorInstance.contrast(black, 'WCAG21')

      return whiteContrast > blackContrast ? 'white' : 'black'
    } catch {
      return 'black' // За замовчуванням
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {palette.colors.map((colorEntry) => {
          const { color } = colorEntry
          const textColor = getContrastTextColor(color)

          return (
            <div
              key={colorEntry.id}
              className="p-4 rounded-lg h-24 flex flex-col justify-between"
              style={{ backgroundColor: color }}
            >
              <div className="text-sm font-medium" style={{ color: textColor }}>
                {colorEntry.name}
              </div>
              <div className="text-xs" style={{ color: textColor }}>
                {color}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
