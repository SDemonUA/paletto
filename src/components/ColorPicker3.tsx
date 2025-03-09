'use client'

import { HslaStringColorPicker } from 'react-colorful'
import { usePreferences } from '@/contexts/PreferencesContext'
import Color from 'colorjs.io'
import { useEffect, useRef, useState } from 'react'
import {
  getColorAs,
  getColorName,
  getContrastTextColor,
} from '../lib/color-utils'

interface ColorPickerProps {
  label?: string
  color: string
  onChange: (color: string) => void
}

function Picker(props: ColorPickerProps) {
  const { color, onChange } = props

  const onChangeHandler = (color: string) => {
    onChange(color)
  }
  return <HslaStringColorPicker color={color} onChange={onChangeHandler} />
}

export default function ColorPicker3(props: ColorPickerProps) {
  const { color, onChange, label } = props
  const [isOpen, setIsOpen] = useState(false)
  const { colorFormat } = usePreferences()
  const inputRef = useRef<HTMLInputElement>(null!)

  const handleColorInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    try {
      const color = new Color(Color.parse(value))
      console.log(value, color)
      onChange(color.to('sRGB').toString({ format: 'hsla' }))
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      // ignore
    }
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = getColorAs(color, colorFormat)
    }
  }, [color, colorFormat])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown, { once: true })
    }

    return () => {
      if (isOpen) {
        document.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [isOpen])

  return (
    <div className="flex flex-col items-center gap-1 relative">
      {label && <div className="text-sm font-semibold">{label}</div>}

      <div
        className="flex items-center justify-center aspect-square size-[120px] border rounded-lg text-sm text-center cursor-pointer hover:ring-2 ring-blue-500 transition-all duration-200 p-2"
        style={{ backgroundColor: color, color: getContrastTextColor(color) }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{getColorName(color)}</span>
      </div>

      <div>
        <input
          type="text"
          ref={inputRef}
          onChange={handleColorInput}
          className="w-[120px] text-center border rounded-sm text-sm"
        />
      </div>

      {isOpen && (
        <>
          <div
            className="fixed top-0 left-0 w-full h-full bg-black/10 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 top-full left-1/2 -translate-x-1/2 -translate-y-full">
            <Picker color={color} onChange={onChange} />
          </div>
        </>
      )}
    </div>
  )
}
