'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { UITheme } from '@/lib/theme-utils'
import { createPalette, PaletteStrategy } from '@/lib/palette-utils'
import { createThemeFromPalette } from '@/lib/theme-utils'
import Color from 'colorjs.io'

// Розширюємо інтерфейс UITheme
interface ExtendedUITheme extends UITheme {
  spacing?: number
  rounding?: number
}

export default function ThemePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [theme, setTheme] = useState<ExtendedUITheme | null>(null)
  const [selectedLibrary, setSelectedLibrary] = useState<
    'shadcn' | 'mui' | 'heroui'
  >('shadcn')

  useEffect(() => {
    // Отримуємо тему з URL
    const themeData = searchParams.get('data')

    if (themeData) {
      try {
        // Намагаємося розпарсити тему
        const parsedTheme = JSON.parse(decodeURIComponent(themeData))
        setTheme(parsedTheme)
      } catch (error) {
        console.error('Помилка парсингу теми:', error)
        createDefaultTheme()
      }
    } else {
      createDefaultTheme()
    }
  }, [searchParams])

  // Функція для створення теми за замовчуванням
  const createDefaultTheme = () => {
    // Створюємо базову палітру з синім кольором
    const palette = createPalette(
      new Color('#2196f3'),
      PaletteStrategy.COMPLEMENTARY
    )

    // Створюємо тему
    const newTheme = createThemeFromPalette(palette, {
      isDarkMode: false,
      contrastLevel: 4.5,
      placeholders: {
        background: { useDefault: true },
        text: { useDefault: true },
      },
    })

    // Серіалізуємо тему в URL
    const themeQuery = encodeURIComponent(JSON.stringify(newTheme))
    router.push(`/theme?data=${themeQuery}`)
  }

  // Функція для генерації конфігу теми в залежності від вибраної бібліотеки
  const generateThemeConfig = () => {
    switch (selectedLibrary) {
      case 'shadcn':
        return `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        background: '${theme?.themeProps.background.default}',
        foreground: '${theme?.themeProps.text.primary}',
        primary: {
          DEFAULT: '${theme?.themeProps.buttons.primary.contained.background}',
          foreground: '${theme?.themeProps.buttons.primary.contained.text}',
        },
        secondary: {
          DEFAULT: '${
            theme?.themeProps.buttons.secondary.contained.background
          }',
          foreground: '${theme?.themeProps.buttons.secondary.contained.text}',
        },
        destructive: {
          DEFAULT: '${theme?.themeProps.buttons.error.contained.background}',
          foreground: '${theme?.themeProps.buttons.error.contained.text}',
        },
        muted: {
          DEFAULT: '${theme?.themeProps.background.component}',
          foreground: '${theme?.themeProps.text.secondary}',
        },
      },
      borderRadius: {
        DEFAULT: '${(theme?.rounding || 4) * 4}px',
      },
      spacing: {
        DEFAULT: '${(theme?.spacing || 4) * 4}px',
      },
    },
  },
}`

      case 'mui':
        return `// theme.js
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    background: {
      default: '${theme?.themeProps.background.default}',
      paper: '${theme?.themeProps.background.component}',
    },
    text: {
      primary: '${theme?.themeProps.text.primary}',
      secondary: '${theme?.themeProps.text.secondary}',
    },
    primary: {
      main: '${theme?.themeProps.buttons.primary.contained.background}',
      contrastText: '${theme?.themeProps.buttons.primary.contained.text}',
    },
    secondary: {
      main: '${theme?.themeProps.buttons.secondary.contained.background}',
      contrastText: '${theme?.themeProps.buttons.secondary.contained.text}',
    },
    error: {
      main: '${theme?.themeProps.buttons.error.contained.background}',
      contrastText: '${theme?.themeProps.buttons.error.contained.text}',
    },
  },
  shape: {
    borderRadius: ${(theme?.rounding || 4) * 4},
  },
  spacing: ${(theme?.spacing || 4) * 4},
});`

      case 'heroui':
        return `// tailwind.config.js
const colors = require('tailwindcss/colors')

module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '${theme?.themeProps.buttons.primary.contained.background}',
        secondary: '${
          theme?.themeProps.buttons.secondary.contained.background
        }',
        background: '${theme?.themeProps.background.default}',
        error: '${theme?.themeProps.buttons.error.contained.background}',
      },
      borderRadius: {
        DEFAULT: '${(theme?.rounding || 4) * 4}px',
      },
      spacing: {
        DEFAULT: '${(theme?.spacing || 4) * 4}px',
      },
    },
  },
}`
    }
  }

  if (!theme) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Редактор теми</h1>

      {/* Відображення основних параметрів теми */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Секція відступів та округлення */}
        <div className="p-4 border rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Відступи та округлення</h2>
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="font-bold mb-2">Базовий відступ</h3>
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  <div className="w-4 h-4 bg-gray-200 rounded" />
                  <div
                    className="w-4 h-4 bg-gray-200 rounded"
                    style={{ marginLeft: (theme.spacing || 4) * 4 }}
                  />
                </div>
                <span className="text-gray-500">
                  {(theme.spacing || 4) * 4}px
                </span>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-2">Базове округлення</h3>
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 bg-gray-200"
                  style={{ borderRadius: (theme.rounding || 4) * 4 }}
                />
                <span className="text-gray-500">
                  {(theme.rounding || 4) * 4}px
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Основні кольори</h2>
          <div className="flex flex-col gap-2">
            <ColorPreview
              label="Фон"
              color={theme.themeProps.background.default}
            />
            <ColorPreview label="Текст" color={theme.themeProps.text.primary} />
          </div>
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Компоненти</h2>
          <div className="flex flex-col gap-2">
            <ColorPreview
              label="Фон компонентів"
              color={theme.themeProps.background.component}
            />
            <ColorPreview
              label="Другорядний текст"
              color={theme.themeProps.text.secondary}
            />
          </div>
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Кнопки</h2>
          <div className="flex flex-col gap-2">
            <ButtonPreview
              label="Основна"
              colors={theme.themeProps.buttons.primary}
            />
            <ButtonPreview
              label="Другорядна"
              colors={theme.themeProps.buttons.secondary}
            />
          </div>
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Сповіщення</h2>
          <div className="flex flex-col gap-2">
            <AlertPreview
              label="Успіх"
              colors={theme.themeProps.alerts.success}
            />
            <AlertPreview
              label="Помилка"
              colors={theme.themeProps.alerts.error}
            />
          </div>
        </div>
      </div>

      {/* Селектор бібліотеки та відображення конфігу */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Експорт налаштувань</h2>

        <div className="flex gap-2 mb-4">
          <button
            className={`px-4 py-2 rounded ${
              selectedLibrary === 'shadcn'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100'
            }`}
            onClick={() => setSelectedLibrary('shadcn')}
          >
            shadcn/ui
          </button>
          <button
            className={`px-4 py-2 rounded ${
              selectedLibrary === 'mui'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100'
            }`}
            onClick={() => setSelectedLibrary('mui')}
          >
            Material UI
          </button>
          <button
            className={`px-4 py-2 rounded ${
              selectedLibrary === 'heroui'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100'
            }`}
            onClick={() => setSelectedLibrary('heroui')}
          >
            Hero UI
          </button>
        </div>

        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
          <code>{generateThemeConfig()}</code>
        </pre>
      </div>
    </div>
  )
}

// Компонент для відображення кольору
function ColorPreview({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-8 h-8 rounded-full border"
        style={{ backgroundColor: color }}
      />
      <span>{label}</span>
      <span className="text-gray-500 text-sm">{color}</span>
    </div>
  )
}

// Компонент для відображення кнопки
function ButtonPreview({
  label,
  colors,
}: {
  label: string
  colors: {
    contained: { background: string; text: string }
    outlined: { border: string; text: string }
    text: { text: string }
  }
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-bold">{label}</span>
      <div className="flex gap-2">
        <button
          className="px-4 py-2 rounded"
          style={{
            backgroundColor: colors.contained.background,
            color: colors.contained.text,
          }}
        >
          Contained
        </button>
        <button
          className="px-4 py-2 rounded border"
          style={{
            borderColor: colors.outlined.border,
            color: colors.outlined.text,
          }}
        >
          Outlined
        </button>
        <button
          className="px-4 py-2 rounded"
          style={{
            color: colors.text.text,
          }}
        >
          Text
        </button>
      </div>
    </div>
  )
}

// Компонент для відображення сповіщення
function AlertPreview({
  label,
  colors,
}: {
  label: string
  colors: {
    background: string
    text: string
  }
}) {
  return (
    <div
      className="p-4 rounded"
      style={{
        backgroundColor: colors.background,
        color: colors.text,
      }}
    >
      {label}
    </div>
  )
}
