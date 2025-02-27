'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  createThemeFromPalette,
  UITheme,
  PlaceholderSettings,
} from '@/lib/theme-utils'
import { createPalette, PaletteStrategy } from '@/lib/palette-utils'
import ThemePreview from '@/components/ThemePreview'
import PlaceholderColorPicker from '@/components/PlaceholderColorPicker'
import ContrastLevelPicker from '@/components/ContrastLevelPicker'
import Color from 'colorjs.io'
import { deserializeWithColor, serializeWithColor } from '@/lib/utils'

function Step2Content() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [theme, setTheme] = useState<UITheme | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Ініціалізація теми при першому рендері
  useEffect(() => {
    // Спробуємо отримати тему та палітру з URL
    const themeData = searchParams.get('theme')
    const paletteData = searchParams.get('palette')

    if (themeData && paletteData) {
      try {
        const savedTheme = deserializeWithColor(themeData) as UITheme
        setTheme(savedTheme)
        setIsDarkMode(savedTheme.settings.isDarkMode)
        return
      } catch (e) {
        console.error('Помилка при завантаженні теми з URL:', e)
      }
    }

    // Якщо немає теми в URL, створюємо нову
    const baseColor = new Color('#3b82f6')
    const palette = createPalette(baseColor, PaletteStrategy.ANALOGOUS)

    // Створюємо тему з палітри
    const initialTheme = createThemeFromPalette(palette, {
      isDarkMode: false,
      contrastLevel: 3,
      placeholders: {
        background: { useDefault: true },
        text: { useDefault: true },
      },
    })

    setTheme(initialTheme)
  }, [searchParams])

  // Функція для перемикання темного режиму
  const toggleDarkMode = () => {
    if (!theme) return

    const newIsDarkMode = !isDarkMode
    setIsDarkMode(newIsDarkMode)

    // Оновлюємо тему з новим налаштуванням темного режиму
    const updatedTheme = createThemeFromPalette(theme.palette, {
      ...theme.settings,
      isDarkMode: newIsDarkMode,
    })

    setTheme(updatedTheme)
  }

  // Функція для оновлення налаштувань плейсхолдера
  const updatePlaceholderSettings = (
    placeholder: 'background' | 'text',
    settings: PlaceholderSettings
  ) => {
    if (!theme) return

    const updatedSettings = {
      ...theme.settings,
      placeholders: {
        ...theme.settings.placeholders,
        [placeholder]: settings,
      },
    }

    const updatedTheme = createThemeFromPalette(theme.palette, updatedSettings)
    setTheme(updatedTheme)
  }

  // Функція для оновлення рівня контрасту
  const updateContrastLevel = (contrastLevel: number) => {
    if (!theme) return

    const updatedSettings = {
      ...theme.settings,
      contrastLevel,
    }

    const updatedTheme = createThemeFromPalette(theme.palette, updatedSettings)
    setTheme(updatedTheme)
  }

  // Функція для переходу на сторінку теми
  const goToThemePage = () => {
    if (!theme) return

    // Додаємо базові налаштування для відступів та округлення
    const extendedTheme = {
      ...theme,
      spacing: 4,
      rounding: 4,
    }

    // Серіалізуємо тему в URL
    const themeQuery = encodeURIComponent(serializeWithColor(extendedTheme))
    router.push(`/theme?data=${themeQuery}`)
  }

  if (!theme) {
    return <div className="p-4">Завантаження...</div>
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Налаштування теми</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Основні налаштування</h3>

            {/* Перемикач темного режиму */}
            <div className="mb-6">
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={isDarkMode}
                    onChange={toggleDarkMode}
                  />
                  <div className="block bg-gray-300 w-14 h-8 rounded-full"></div>
                  <div
                    className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
                      isDarkMode ? 'transform translate-x-6' : ''
                    }`}
                  ></div>
                </div>
                <div className="ml-3 font-medium">
                  {isDarkMode ? 'Темний режим' : 'Світлий режим'}
                </div>
              </label>
            </div>

            {/* Налаштування контрасту */}
            <ContrastLevelPicker
              value={theme.settings.contrastLevel}
              onChange={updateContrastLevel}
            />
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-semibold mb-4">
              Кольори плейсхолдерів
            </h3>

            {/* Вибір кольору фону */}
            <div className="mb-6">
              <PlaceholderColorPicker
                label="Фон"
                palette={theme.palette}
                settings={theme.settings.placeholders.background}
                onChange={(settings) =>
                  updatePlaceholderSettings('background', settings)
                }
              />
            </div>

            {/* Вибір кольору тексту */}
            <div className="mb-6">
              <PlaceholderColorPicker
                label="Текст"
                palette={theme.palette}
                settings={theme.settings.placeholders.text}
                onChange={(settings) =>
                  updatePlaceholderSettings('text', settings)
                }
              />
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <button
              onClick={goToThemePage}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Перейти до редактора теми
            </button>
          </div>
        </div>

        <div>
          <div className="sticky top-4">
            <h3 className="text-lg font-semibold mb-4">Попередній перегляд</h3>
            <div className="border rounded-lg overflow-hidden">
              <ThemePreview theme={theme} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Step2() {
  return (
    <Suspense fallback={<div className="p-4">Завантаження...</div>}>
      <Step2Content />
    </Suspense>
  )
}
