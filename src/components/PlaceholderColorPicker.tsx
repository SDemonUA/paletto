'use client'

import { useState } from 'react'
import { ColorPalette } from '@/lib/palette-utils'
import { ColorLink, getThemeColor, ThemeColor } from '@/lib/theme-utils'

interface PlaceholderColorPickerProps {
  label: string
  palette: ColorPalette
  value: ThemeColor
  defaultValue: ThemeColor
  onChange: (settings: ThemeColor) => void
}

export default function PlaceholderColorPicker({
  label,
  palette,
  value,
  defaultValue,
  onChange,
}: PlaceholderColorPickerProps) {
  const manualColor = typeof value === 'string' ? value : ''
  const { paletteId, adjustmets } =
    typeof value === 'string' ? { paletteId: '', adjustmets: {} } : value
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false)

  const getDisplayColor = () => getThemeColor(value, palette)

  const handleColorSelect = (paletteId: string) => {
    onChange({
      paletteId,
      adjustmets,
    })
  }

  const handleDefaultSelect = () => onChange(defaultValue)

  const getAdjustmentHandler =
    (adjustment: keyof ColorLink['adjustmets']) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value)
      onChange({
        paletteId,
        adjustmets: {
          ...adjustmets,
          [adjustment]: value,
        },
      })
    }

  const handleManualColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

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
            manualColor === defaultValue
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
              Прозорість: {adjustmets.alpha}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={adjustmets.alpha}
              onChange={getAdjustmentHandler('alpha')}
              className="w-full"
              disabled={!!manualColor}
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm mb-1">
              Насиченість: {adjustmets.saturation}%
            </label>
            <input
              type="range"
              min="0"
              max="200"
              value={adjustmets.saturation}
              onChange={getAdjustmentHandler('saturation')}
              className="w-full"
              disabled={!!manualColor}
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm mb-1">
              Яскравість: {adjustmets.lightness}%
            </label>
            <input
              type="range"
              min="0"
              max="200"
              value={adjustmets.lightness}
              onChange={getAdjustmentHandler('lightness')}
              className="w-full"
              disabled={!!manualColor}
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
                paletteId === color.id ? 'ring-2 ring-blue-500' : ''
              }`}
              style={{
                backgroundColor: color.color,
              }}
              onClick={() => handleColorSelect(color.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
