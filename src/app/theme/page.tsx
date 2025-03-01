'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { UITheme } from '@/lib/theme-utils'
import { createPalette, PaletteStrategy } from '@/lib/palette-utils'
import { createThemeFromPalette } from '@/lib/theme-utils'
import {
  createShadcnConfig,
  createMuiConfig,
  createHeroConfig,
} from '@/lib/theme-export'
import Color from 'colorjs.io'

import ThemePreview from '@/components/ThemePreview'
import { deserializeWithColor, serializeWithColor } from '@/lib/utils'
import RangeInput from '@/components/RangeInput'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import ColorPicker2 from '@/components/ColorPicker2'

export default function ThemePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
        </div>
      }
    >
      <ThemePageContent />
    </Suspense>
  )
}

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

  return newTheme
}

function ThemePageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [theme, setTheme] = useState<UITheme | null>(null)
  const [selectedLibrary, setSelectedLibrary] = useState<
    'shadcn' | 'mui' | 'heroui'
  >('shadcn')
  const [copySuccess, setCopySuccess] = useState<boolean>(false)

  useEffect(() => {
    // Отримуємо тему з URL
    const themeData = searchParams.get('data')
    if (themeData) {
      try {
        // Намагаємося розпарсити тему
        const parsedTheme = deserializeWithColor(themeData) as UITheme
        setTheme(parsedTheme)
        return
      } catch (error) {
        console.error('Помилка парсингу теми:', error)
      }
    }

    const newTheme = createDefaultTheme()
    router.push(`/theme?data=${serializeWithColor(newTheme)}`)
  }, [searchParams, router])

  // Функція для генерації конфігу теми в залежності від вибраної бібліотеки
  const generateThemeConfig = () => {
    if (!theme) return ''

    switch (selectedLibrary) {
      case 'shadcn':
        return createShadcnConfig(theme)
      case 'mui':
        return createMuiConfig(theme)
      case 'heroui':
        return createHeroConfig(theme)
      default:
        return ''
    }
  }

  // Функція для копіювання конфігу
  const copyConfigToClipboard = async () => {
    const config = generateThemeConfig()
    try {
      await navigator.clipboard.writeText(config)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Помилка копіювання:', err)
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
    <>
      <div className="container">
        <h1 className="text-4xl font-bold py-8">Редактор теми</h1>

        <Accordion type="multiple" className="w-full">
          <AccordionItem value="spacing" className="border p-2 px-4 rounded-lg">
            <AccordionTrigger className="text-lg font-bold cursor-pointer">
              Відступ
            </AccordionTrigger>
            <AccordionContent className="py-2">
              {/* Відображення основних параметрів теми */}
              <div className="flex flex-col gap-2">
                <RangeInput
                  value={theme.spacing || 4}
                  onChange={(value) => setTheme({ ...theme, spacing: value })}
                  min={1}
                  max={20}
                  step={1}
                  label="Відступ"
                  getValueDescription={(value) => `${value}px`}
                  description={
                    <div
                      className="grid grid-cols-[repeat(4,auto)] items-start w-auto justify-start"
                      style={{ gap: theme.spacing }}
                    >
                      <div className="w-4 h-4 bg-gray-400 rounded" />
                      <div className="w-4 h-4 bg-gray-400 rounded" />
                      <div className="w-4 h-4 bg-gray-400 rounded" />
                      <div className="w-4 h-4 bg-gray-400 rounded" />
                      <div className="w-4 h-4 bg-gray-400 rounded" />
                      <div className="w-4 h-4 bg-gray-400 rounded" />
                    </div>
                  }
                />
                <RangeInput
                  value={theme.rounding || 4}
                  onChange={(value) => setTheme({ ...theme, rounding: value })}
                  min={0}
                  max={50}
                  step={1}
                  label="Округлення"
                  getValueDescription={(value) => `${value}px`}
                  description={
                    <div
                      className="w-full h-16 bg-gray-400"
                      style={{ borderRadius: theme.rounding || 4 }}
                    />
                  }
                />
                <RangeInput
                  value={theme.fontSize || 16}
                  onChange={(value) => setTheme({ ...theme, fontSize: value })}
                  min={12}
                  max={24}
                  step={1}
                  label="Розмір шрифту"
                  getValueDescription={(value) => `${value}px`}
                  description={
                    <span style={{ fontSize: theme.fontSize || 16 }}>
                      The quick brown fox jumps over the lazy dog
                    </span>
                  }
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="colors" className="border p-2 px-4 rounded-lg">
            <AccordionTrigger className="text-lg font-bold cursor-pointer">
              Кольори
            </AccordionTrigger>
            <AccordionContent
              style={{
                backgroundColor: theme.themeProps.background.default,
                padding: theme.spacing + 'px',
              }}
            >
              <div
                className="flex flex-col gap-2"
                style={{
                  backgroundColor: theme.themeProps.background.paper,
                  padding: theme.spacing + 'px',
                }}
              >
                <ColorPicker2
                  label={
                    <span style={{ color: theme.themeProps.text.primary }}>
                      Головний текст
                    </span>
                  }
                  color={theme.themeProps.text.primary}
                  onChange={(color) =>
                    setTheme({
                      ...theme,
                      themeProps: {
                        ...theme.themeProps,
                        text: {
                          ...theme.themeProps.text,
                          primary: color,
                        },
                      },
                    })
                  }
                />
                <ColorPicker2
                  label={
                    <span style={{ color: theme.themeProps.text.secondary }}>
                      Другорядний текст
                    </span>
                  }
                  color={theme.themeProps.text.secondary}
                  onChange={(color) =>
                    setTheme({
                      ...theme,
                      themeProps: {
                        ...theme.themeProps,
                        text: {
                          ...theme.themeProps.text,
                          secondary: color,
                        },
                      },
                    })
                  }
                />
                <ColorPicker2
                  label={
                    <span style={{ color: theme.themeProps.text.disabled }}>
                      Приглушений текст
                    </span>
                  }
                  color={theme.themeProps.text.disabled}
                  onChange={(color) =>
                    setTheme({
                      ...theme,
                      themeProps: {
                        ...theme.themeProps,
                        text: {
                          ...theme.themeProps.text,
                          disabled: color,
                        },
                      },
                    })
                  }
                />

                {/* Додані нові ColorPicker2 для основних кольорів */}
                <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col gap-2">
                  <h3
                    className="font-medium mb-2"
                    style={{ color: theme.themeProps.text.primary }}
                  >
                    Основні кольори
                  </h3>
                  <ColorPicker2
                    label={
                      <span style={{ color: theme.themeProps.text.primary }}>
                        Основний колір
                      </span>
                    }
                    color={theme.palette.baseColor.toString({ format: 'hex' })}
                    onChange={(color) =>
                      setTheme({
                        ...theme,
                        palette: {
                          ...theme.palette,
                          baseColor: new Color(color),
                        },
                      })
                    }
                  />
                  <ColorPicker2
                    label={
                      <span style={{ color: theme.themeProps.text.primary }}>
                        Другорядний колір
                      </span>
                    }
                    color={theme.palette.colors[1].color.toString({
                      format: 'hex',
                    })}
                    onChange={(color) =>
                      setTheme({
                        ...theme,
                        palette: {
                          ...theme.palette,
                          colors: [
                            theme.palette.colors[0],
                            {
                              ...theme.palette.colors[1],
                              color: new Color(color),
                            },
                            ...theme.palette.colors.slice(2),
                          ],
                        },
                      })
                    }
                  />
                </div>

                {/* Додані нові ColorPicker2 для фонових кольорів */}
                <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col gap-2">
                  <h3
                    className="font-medium mb-2"
                    style={{ color: theme.themeProps.text.primary }}
                  >
                    Фонові кольори
                  </h3>
                  <ColorPicker2
                    label={
                      <span style={{ color: theme.themeProps.text.primary }}>
                        Основний фон
                      </span>
                    }
                    color={theme.themeProps.background.default}
                    onChange={(color) =>
                      setTheme({
                        ...theme,
                        themeProps: {
                          ...theme.themeProps,
                          background: {
                            ...theme.themeProps.background,
                            default: color,
                          },
                        },
                      })
                    }
                  />
                  <ColorPicker2
                    label={
                      <span style={{ color: theme.themeProps.text.primary }}>
                        Фон паперу
                      </span>
                    }
                    color={theme.themeProps.background.paper}
                    onChange={(color) =>
                      setTheme({
                        ...theme,
                        themeProps: {
                          ...theme.themeProps,
                          background: {
                            ...theme.themeProps.background,
                            paper: color,
                          },
                        },
                      })
                    }
                  />
                  <ColorPicker2
                    label={
                      <span style={{ color: theme.themeProps.text.primary }}>
                        Фон компонентів
                      </span>
                    }
                    color={theme.themeProps.background.component}
                    onChange={(color) =>
                      setTheme({
                        ...theme,
                        themeProps: {
                          ...theme.themeProps,
                          background: {
                            ...theme.themeProps.background,
                            component: color,
                          },
                        },
                      })
                    }
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <ThemePreview theme={theme} />

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

          <div className="relative">
            <button
              onClick={copyConfigToClipboard}
              className="absolute top-2 right-2 px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
            >
              {copySuccess ? 'Скопійовано!' : 'Копіювати'}
            </button>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <code>{generateThemeConfig()}</code>
            </pre>
          </div>
        </div>
      </div>
    </>
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
