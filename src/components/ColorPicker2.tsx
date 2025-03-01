'use client'

import {
  RgbaColorPicker,
  RgbaColor,
  HslaColor,
  HslaColorPicker,
  HexAlphaColorPicker,
} from 'react-colorful'
import { usePreferences } from '@/contexts/PreferencesContext'
import Color from 'colorjs.io'
import { ReactNode, useEffect, useState } from 'react'

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
  label?: ReactNode
}

function Picker(props: ColorPickerProps) {
  const { color, onChange } = props
  const { colorFormat } = usePreferences()

  if (colorFormat === 'hex') {
    return <HexAlphaColorPicker color={color} onChange={onChange} />
  } else if (colorFormat === 'rgb') {
    const oColor = new Color(color)
    const rgbValue = {
      r: oColor.r,
      g: oColor.g,
      b: oColor.b,
      a: oColor.alpha,
    }
    const onChangeHandler = (color: RgbaColor) => {
      const result = new Color(
        `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`
      )
      onChange(result.toString({ format: 'rgba' }))
    }
    return <RgbaColorPicker color={rgbValue} onChange={onChangeHandler} />
  } else if (colorFormat === 'hsl') {
    const oColor = new Color(color)
    const hslValue = {
      h: oColor.hsl.h,
      s: oColor.hsl.s,
      l: oColor.hsl.l,
      a: oColor.alpha,
    }
    const onChangeHandler = (color: HslaColor) => {
      const result = new Color(
        `hsla(${color.h}, ${color.s}, ${color.l}, ${color.a})`
      )
      onChange(result.toString({ format: 'hsla' }))
    }
    return <HslaColorPicker color={hslValue} onChange={onChangeHandler} />
  }
}

export default function ColorPicker2(props: ColorPickerProps) {
  const { color, onChange, label } = props
  const [isOpen, setIsOpen] = useState(false)

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
    <div className="flex items-center gap-2">
      <div
        className="size-8 border rounded-lg"
        style={{ backgroundColor: color }}
        title={color}
        onClick={() => setIsOpen(true)}
      />
      {label && <div>{label}</div>}

      {isOpen && (
        <>
          <div
            className="fixed top-0 left-0 w-full h-full bg-black/10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute">
            <Picker color={color} onChange={onChange} />
          </div>
        </>
      )}
    </div>
  )
}
