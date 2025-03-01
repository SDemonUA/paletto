'use client'

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react'

type ColorFormat = 'hex' | 'rgb' | 'hsl'

interface PreferencesContextType {
  colorFormat: ColorFormat
  setColorFormat: (format: ColorFormat) => void
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(
  undefined
)

const STORAGE_KEY = 'paletto-preferences'

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [colorFormat, setColorFormat] = useState<ColorFormat>(() => {
    const saved = globalThis.localStorage?.getItem(STORAGE_KEY)
    return saved ? (JSON.parse(saved).colorFormat as ColorFormat) : 'hex'
  })

  useEffect(() => {
    globalThis.localStorage?.setItem(
      STORAGE_KEY,
      JSON.stringify({ colorFormat })
    )
  }, [colorFormat])

  return (
    <PreferencesContext.Provider value={{ colorFormat, setColorFormat }}>
      {children}
    </PreferencesContext.Provider>
  )
}

export function usePreferences() {
  const context = useContext(PreferencesContext)
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider')
  }
  return context
}
