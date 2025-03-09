'use client'

import { useEffect, useState, Suspense, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getThemeColor, UITheme } from '@/lib/theme-utils'
import { createPalette, PaletteStrategy } from '@/lib/palette-utils'
import { createThemeFromPalette } from '@/lib/theme-utils'
import {
  createShadcnConfig,
  createMuiConfig,
  createHeroConfig,
  createShadcnCssVarsConfig,
} from '@/lib/theme-export'
import Color from 'colorjs.io'

import { deserializeWithColor, serializeWithColor } from '@/lib/utils'
import RangeInput from '@/components/RangeInput'
import { HEADER_HEIGHT } from '@/app/constants'
import ColorPicker3 from '../../../components/ColorPicker3'
import { Button } from '../../../components/ui/button'

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
  })

  return newTheme
}

function ThemePageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [uiType, setUiType] = useState<'shadcn-ui' | 'mui' | 'heroui'>('mui')
  const [theme, setTheme] = useState<UITheme | null>(null)
  const [selectedLibrary, setSelectedLibrary] = useState<
    'shadcn' | 'mui' | 'heroui' | 'shadcn-css-vars'
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
      case 'shadcn-css-vars':
        return createShadcnCssVarsConfig(theme)
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
    <ContentWithDrawer
      sidebarTitle="Редактор теми"
      sidebarContent={
        <div>
          <div>
            <Button
              variant={uiType === 'mui' ? 'default' : 'outline'}
              onClick={() => setUiType('mui')}
            >
              Material UI
            </Button>
            <Button
              variant={uiType === 'shadcn-ui' ? 'default' : 'outline'}
              onClick={() => setUiType('shadcn-ui')}
            >
              shadcn/ui
            </Button>
            <Button
              variant={uiType === 'heroui' ? 'default' : 'outline'}
              onClick={() => setUiType('heroui')}
            >
              Hero UI
            </Button>
          </div>

          <h2 className="text-2xl font-bold mb-4">Відступи</h2>
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

          <h2 className="text-2xl font-bold my-4">Кольори</h2>
          <div className="flex gap-1 flex-wrap">
            <ColorPicker3
              label="Основний текст"
              color={getThemeColor(
                theme.themeProps.text.primary,
                theme.palette
              )}
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
            <ColorPicker3
              label="Другорядний текст"
              color={getThemeColor(
                theme.themeProps.text.secondary,
                theme.palette
              )}
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
            <ColorPicker3
              label="Приглушений текст"
              color={getThemeColor(
                theme.themeProps.text.disabled,
                theme.palette
              )}
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
          </div>

          <h3 className="font-medium mb-2">Основні кольори</h3>
          <div className="flex gap-1 flex-wrap">
            {/* Додані нові ColorPicker2 для основних кольорів */}
            <ColorPicker3
              label="Основний колір"
              color={theme.palette.baseColor.toString({
                format: 'hex',
              })}
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
            <ColorPicker3
              label="Другорядний колір"
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

          <h3 className="font-medium mb-2">Фонові кольори</h3>
          <div className="flex gap-1 flex-wrap">
            <ColorPicker3
              label="Основний фон"
              color={getThemeColor(
                theme.themeProps.background.default,
                theme.palette
              )}
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
            <ColorPicker3
              label="Фон паперу"
              color={getThemeColor(
                theme.themeProps.background.paper,
                theme.palette
              )}
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
            <ColorPicker3
              label="Фон компонентів"
              color={getThemeColor(
                theme.themeProps.background.component,
                theme.palette
              )}
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

          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Експорт налаштувань</h2>

            <div className="flex gap-2 mb-4">
              <button
                className={`px-4 py-2 rounded ${
                  selectedLibrary === 'shadcn-css-vars'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100'
                }`}
                onClick={() => setSelectedLibrary('shadcn-css-vars')}
              >
                shadcn/ui (CSS Variables)
              </button>
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
      }
    >
      {theme && <Preview theme={theme} type={uiType} />}
    </ContentWithDrawer>
  )
}

interface ContentWithDrawerProps {
  children: React.ReactNode
  sidebarContent?: React.ReactNode
  sidebarTitle?: string
  initialMode?: 'hidden' | 'shown' | 'pinned'
}

function ContentWithDrawer({
  children,
  sidebarContent,
  sidebarTitle = 'Sidebar',
  initialMode = 'pinned',
}: ContentWithDrawerProps) {
  const [sidebarMode, setSidebarMode] = useState<'hidden' | 'shown' | 'pinned'>(
    initialMode
  )

  // Track if we're in mobile view using a media query
  const [isMobileView, setIsMobileView] = useState(false)

  useEffect(() => {
    // Set up media query to detect screen size
    const mediaQuery = window.matchMedia('(max-width: 900px)')

    // Initial check
    setIsMobileView(mediaQuery.matches)

    // If sidebar is pinned and we're in mobile view, unpin it
    if (mediaQuery.matches && sidebarMode === 'pinned') {
      setSidebarMode('shown')
    }

    // Add listener for changes
    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsMobileView(e.matches)
      if (e.matches && sidebarMode === 'pinned') {
        setSidebarMode('shown')
      }
    }

    mediaQuery.addEventListener('change', handleMediaChange)
    return () => mediaQuery.removeEventListener('change', handleMediaChange)
  }, [sidebarMode])

  useEffect(() => {
    document.body.style.transition = 'margin-left 0.3s ease-in-out'

    if (sidebarMode === 'pinned') {
      document.body.style.marginLeft = '480px'
    } else {
      document.body.style.marginLeft = '0'
    }

    return () => {
      document.body.style.marginLeft = ''
      document.body.style.transition = ''
    }
  }, [sidebarMode])

  return (
    <div
      className={`flex overflow-hidden`}
      style={{ height: `calc(100vh - ${HEADER_HEIGHT}px)` }}
    >
      {/* Sidebar with CSS-based responsive behavior */}
      <aside
        className={`
          fixed inset-y-0 left-0 bg-white shadow-lg transition-all duration-300 flex flex-col
          max-w-[480px] w-full
        `}
        style={{
          transform:
            sidebarMode === 'hidden' ? 'translateX(-100%)' : 'translateX(0)',
        }}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-bold text-lg">{sidebarTitle}</h3>
          <div className="flex gap-2">
            {!isMobileView && (
              <button
                onClick={() =>
                  setSidebarMode(sidebarMode === 'pinned' ? 'shown' : 'pinned')
                }
                className={`p-2 rounded-md ${
                  sidebarMode === 'pinned'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100'
                }`}
                title={
                  sidebarMode === 'pinned' ? 'Unpin sidebar' : 'Pin sidebar'
                }
              >
                📌
              </button>
            )}
            <button
              onClick={() => setSidebarMode('hidden')}
              className="p-2 rounded-md bg-gray-100"
              title="Hide sidebar"
            >
              ←
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{sidebarContent}</div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Floating action button to show sidebar when hidden */}
        {sidebarMode === 'hidden' && (
          <button
            onClick={() => setSidebarMode('shown')}
            className="fixed bottom-4 left-4 z-20 rounded-full bg-blue-500 text-white w-12 h-12 flex items-center justify-center shadow-lg"
            title="Show sidebar"
          >
            →
          </button>
        )}

        {/* Content from children prop */}
        <div className="h-full w-full">{children}</div>
      </main>
    </div>
  )
}

type UIFramework = 'shadcn-ui' | 'mui' | 'heroui'
function Preview({ theme, type }: { theme: UITheme; type: UIFramework }) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [iframeLoaded, setIframeLoaded] = useState(false)

  const sendTheme = (theme: UITheme) => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        {
          type: 'SET_THEME',
          theme: serializeWithColor(theme),
        },
        '*'
      )
    }
  }

  useEffect(() => {
    if (iframeLoaded) {
      sendTheme(theme)
    }
  }, [theme, iframeLoaded])

  useEffect(() => {
    setIframeLoaded(false)
  }, [type])

  // Add window message event listener
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (
        event.data?.type === 'READY' &&
        event.source === iframeRef.current?.contentWindow
      ) {
        sendTheme(theme)
        setIframeLoaded(true)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [theme])

  return (
    <iframe
      ref={iframeRef}
      src={`/preview/${type}`}
      className="w-full h-full border-0"
      style={{
        display: iframeLoaded ? 'block' : 'none',
      }}
    />
  )
}
