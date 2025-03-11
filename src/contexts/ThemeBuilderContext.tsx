'use client'

import { createPalette, PaletteStrategy } from '@/lib/palette-utils'
import { createThemeFromPalette, UITheme } from '@/lib/theme-utils'
import Color from 'colorjs.io'
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { deserializeWithColor, serializeWithColor } from '@/lib/utils'

interface ThemeBuilderContextType {
  theme: UITheme
  setTheme: (theme: UITheme) => void
}

const ThemeBuilderContext = createContext<ThemeBuilderContextType | undefined>(
  undefined
)

export function ThemeBuilderProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [theme, setTheme] = useState<UITheme>(() => {
    const themeData = searchParams.get('data')
    if (themeData) {
      try {
        return deserializeWithColor(themeData) as UITheme
      } catch (error) {
        console.error('Помилка парсингу теми:', error)
      }
    }
    return createDefaultTheme()
  })

  useEffect(() => {
    if (router && theme) {
      router.replace(`?data=${serializeWithColor(theme)}`)
    }
  }, [theme, router])

  const updateTheme = (newTheme: UITheme) => {
    setTheme(newTheme)
  }

  return (
    <ThemeBuilderContext.Provider value={{ theme, setTheme: updateTheme }}>
      {children}
    </ThemeBuilderContext.Provider>
  )
}

export function useThemeBuilder() {
  const context = useContext(ThemeBuilderContext)
  if (!context) {
    throw new Error(
      'useThemeBuilder must be used within a ThemeBuilderProvider'
    )
  }
  return context
}

function createDefaultTheme(): UITheme {
  return createThemeFromPalette(
    createPalette(
      new Color('#2196f3'),
      null,
      PaletteStrategy.COMPLEMENTARY,
      'pastel'
    ),
    {}
  )
}
