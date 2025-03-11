'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import BaseColorPicker from '@/components/BaseColorPicker'
import StrategySelector from '@/components/StrategySelector'
import PaletteDisplay from '@/components/PaletteDisplay'
import ThemePreview from '@/components/ThemePreview'
import PlaceholderColorPicker from '@/components/PlaceholderColorPicker'
import {
  createPalette,
  PaletteStrategy,
  ColorPalette,
  PaletteIntensity,
  applyIntensity,
} from '@/lib/palette-utils'
import { createThemeFromPalette, ThemeColor, UITheme } from '@/lib/theme-utils'
import Color from 'colorjs.io'
import { serializeWithColor } from '@/lib/utils'
import IntensitySelector from '../../../../components/IntensitySelecor'

export default function Step1() {
  const router = useRouter()
  const [baseColor, setBaseColor] = useState<Color>(new Color('#3498db'))
  const [strategy, setStrategy] = useState<PaletteStrategy>(
    PaletteStrategy.ANALOGOUS
  )
  const [intensity, setIntensity] = useState<PaletteIntensity>('pastel')

  const [palette, setPalette] = useState<ColorPalette | null>(
    createPalette(new Color('#3498db'), null, strategy, intensity)
  )
  const [theme, setTheme] = useState<UITheme | null>(null)

  // Створюємо палітру при зміні базового кольору, стратегії або інтенсивності
  useEffect(() => {
    if (baseColor && strategy && intensity) {
      const newPalette = createPalette(baseColor, null, strategy, intensity)

      const settings: Pick<
        UITheme,
        'isDarkMode' | 'contrastLevel' | 'fontSize' | 'rounding' | 'spacing'
      > = {
        isDarkMode: false,
        contrastLevel: 3,
        fontSize: 16,
        rounding: 4,
        spacing: 8,
      }

      const newTheme = createThemeFromPalette(newPalette, settings)
      setTheme(newTheme)
    }
  }, [baseColor, strategy, intensity])

  // Обробник для зміни базового кольору
  const handleBaseColorChange = (color: Color) => {
    setBaseColor(color)
  }

  // Обробник для зміни стратегії
  const handleStrategyChange = (newStrategy: PaletteStrategy) => {
    setStrategy(newStrategy)
  }

  // Обробник для перегенерації палітри
  const handleRegeneratePalette = () => {
    if (palette) {
      const newPalette = createPalette(baseColor, null, strategy, intensity)
      setPalette(newPalette)

      if (theme) {
        const newTheme = createThemeFromPalette(newPalette, theme)
        setTheme(newTheme)
      }
    }
  }

  const handleIntensityChange = (newIntensity: PaletteIntensity) => {
    setIntensity(newIntensity)
    if (palette) {
      const newPalette = createPalette(baseColor, null, strategy, newIntensity)
      setPalette(newPalette)
      if (theme) {
        const newTheme = createThemeFromPalette(newPalette, theme)
        setTheme(newTheme)
      }
    }
  }

  // Обробник для випадкового базового кольору
  const handleRandomBaseColor = () => {
    // Генеруємо випадковий колір в LCH просторі для кращих результатів
    const h = Math.floor(Math.random() * 360)
    const c = Math.floor(Math.random() * 100) + 30 // Хроматичність від 30 до 130
    const l = Math.floor(Math.random() * 60) + 30 // Світлість від 30 до 90

    const randomColor = new Color('lch', [l, c, h])

    // Переконуємося, що колір в межах sRGB гамуту
    if (!randomColor.inGamut('srgb')) {
      randomColor.toGamut('srgb')
    }

    setBaseColor(applyIntensity(randomColor, intensity))
    handleRegeneratePalette()
  }

  const handlePlaceholderChange = (
    placeholder: 'background' | 'text',
    color: ThemeColor
  ) => {
    if (theme) {
      const newTheme = { ...theme }
      if (placeholder === 'background') {
        newTheme.themeProps.background.default = color
      } else if (placeholder === 'text') {
        newTheme.themeProps.text.primary = color
      }

      setTheme(newTheme)
    }
  }

  // Перехід до наступного кроку
  const goToNextStep = () => {
    // Тут можна зберегти палітру та тему в localStorage або в стейт-менеджері
    if (theme && palette) {
      const themeQuery = encodeURIComponent(serializeWithColor(theme))
      const paletteQuery = encodeURIComponent(serializeWithColor(palette))
      router.push(`/wizard/step-2?theme=${themeQuery}&palette=${paletteQuery}`)
    }
  }

  if (!palette || !theme) {
    return <div className="p-8">Завантаження...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Крок 1: Створення палітри</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Інтенсивність</h2>
            <IntensitySelector
              selectedIntensity={intensity}
              onIntensityChange={handleIntensityChange}
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Базовий колір</h2>
            <BaseColorPicker
              color={baseColor}
              onChange={handleBaseColorChange}
            />
            <div className="mt-4">
              <button
                onClick={handleRandomBaseColor}
                className="w-full py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
              >
                Випадковий колір
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Стратегія</h2>
            <StrategySelector
              selectedStrategy={strategy}
              onStrategyChange={handleStrategyChange}
            />
            <div className="mt-4">
              <button
                onClick={handleRegeneratePalette}
                className="w-full py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
              >
                Перегенерувати
              </button>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Палітра кольорів</h2>
            {palette && <PaletteDisplay palette={palette} />}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-xl font-semibold mb-4">Плейсхолдери</h2>
            <p className="text-sm text-gray-600 mb-4">
              Виберіть кольори для фону та тексту з вашої палітри.
            </p>

            <PlaceholderColorPicker
              label="Фон"
              palette={palette}
              value={theme.themeProps.background.default}
              defaultValue={'#ffffff'}
              onChange={(color: ThemeColor) =>
                handlePlaceholderChange('background', color)
              }
            />

            <PlaceholderColorPicker
              label="Текст"
              palette={palette}
              value={theme.themeProps.text.primary}
              defaultValue={'#000000'}
              onChange={(color: ThemeColor) =>
                handlePlaceholderChange('text', color)
              }
            />
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
      </div>

      <div className="mt-6">
        <ThemePreview theme={theme} />
      </div>
    </div>
  )
}
