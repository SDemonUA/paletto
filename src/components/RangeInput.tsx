'use client'

import { useState, useEffect } from 'react'

interface RangeInputProps {
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step?: number
  label?: string
  description?: React.ReactNode
  leftLabel?: string
  centerLabel?: string
  rightLabel?: string
  formatValue?: (value: number) => string
  getValueDescription?: (value: number) => string
  helpContent?: React.ReactNode
}

export default function RangeInput({
  value,
  onChange,
  min,
  max,
  step = 0.1,
  label,
  description,
  leftLabel = 'Мін',
  centerLabel,
  rightLabel = 'Макс',
  formatValue = (v: number) => v.toFixed(1),
  getValueDescription,
  helpContent,
}: RangeInputProps) {
  const [currentValue, setCurrentValue] = useState<number>(value)

  useEffect(() => {
    setCurrentValue(value)
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value)
    setCurrentValue(newValue)
    onChange(newValue)
  }

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium mb-2">
          {label}: {formatValue(currentValue)}
          {getValueDescription && ` - ${getValueDescription(currentValue)}`}
        </label>
      )}

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={currentValue}
        onChange={handleChange}
        className="w-full"
      />

      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{leftLabel}</span>
        {centerLabel && <span>{centerLabel}</span>}
        <span>{rightLabel}</span>
      </div>

      {(description || helpContent) && (
        <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
          {description && <div>{description}</div>}
          {helpContent}
        </div>
      )}
    </div>
  )
}
