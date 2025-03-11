'use client'

import Color from 'colorjs.io'
import { generateUUID } from './uuid-utils'

// Типи стратегій створення палітри
export enum PaletteStrategy {
  MONOCHROMATIC = 'monochromatic',
  ANALOGOUS = 'analogous',
  COMPLEMENTARY = 'complementary',
  TRIADIC = 'triadic',
  TETRADIC = 'tetradic',
  SPLIT_COMPLEMENTARY = 'split-complementary',
}

export type PaletteIntensity = 'pastel' | 'vibrant' | 'dark' | 'light'

// Інтерфейс для кольору в палітрі
export interface ColorEntry {
  id: string
  name: string
  color: string // hsla(0, 0%, 0%, 1)
}

// Інтерфейс для палітри кольорів
export interface ColorPalette {
  id: string
  baseColor: ColorEntry
  secondaryColor?: ColorEntry

  strategy: PaletteStrategy
  intensity: PaletteIntensity

  colors: ColorEntry[]
}

/**
 * Застосовує налаштування інтенсивності до кольору
 */
export function applyIntensity(
  color: Color,
  intensity: PaletteIntensity
): Color {
  const result = color.clone()
  const currentLightness = result.get('lch.l')
  const currentChroma = result.get('lch.c')

  switch (intensity) {
    case 'pastel':
      // Пастельні кольори: висока яскравість (70-85), низька насиченість (30-50% від оригіналу)
      if (currentLightness < 70) {
        result.set('lch.l', Math.min(85, currentLightness + 20))
      }
      if (currentChroma > currentChroma * 0.5) {
        result.set('lch.c', currentChroma * 0.5)
      }
      break

    case 'vibrant':
      // Яскраві кольори: середня яскравість (60-70), висока насиченість (120%+ від оригіналу)
      if (currentLightness < 60 || currentLightness > 70) {
        result.set('lch.l', 65)
      }
      if (currentChroma < currentChroma * 1.2) {
        result.set('lch.c', currentChroma * 1.2)
      }
      break

    case 'dark':
      // Темні кольори: низька яскравість (20-40), трохи зменшена насиченість (90% від оригіналу)
      if (currentLightness > 40) {
        result.set('lch.l', currentLightness * 0.5)
      }
      if (currentChroma > currentChroma * 0.9) {
        result.set('lch.c', currentChroma * 0.9)
      }
      break

    case 'light':
      // Світлі кольори: висока яскравість (80-95), зменшена насиченість (70% від оригіналу)
      if (currentLightness < 80) {
        result.set('lch.l', Math.min(95, currentLightness * 1.5))
      }
      if (currentChroma > currentChroma * 0.7) {
        result.set('lch.c', currentChroma * 0.7)
      }
      break
  }

  return result
}

/**
 * Створює палітру кольорів на основі базового кольору та стратегії
 */
export function createPalette(
  baseColor: Color | string,
  secondaryColor: Color | string | null,
  strategy: PaletteStrategy,
  intensity: PaletteIntensity
): ColorPalette {
  const colors: ColorEntry[] = []

  const baseColorObj =
    typeof baseColor === 'string' ? new Color(baseColor) : baseColor.clone()
  const secondaryColorObj = secondaryColor
    ? typeof secondaryColor === 'string'
      ? new Color(secondaryColor)
      : secondaryColor.clone()
    : null

  // Застосовуємо інтенсивність до базового кольору
  const adjustedBaseColor = applyIntensity(baseColorObj, intensity)
  colors.push({
    id: generateUUID(),
    name: 'Базовий',
    color: adjustedBaseColor.to('hsl').toString(),
  })

  if (secondaryColorObj) {
    // Застосовуємо інтенсивність до другого кольору
    const adjustedSecondaryColor = applyIntensity(secondaryColorObj, intensity)
    colors.push({
      id: generateUUID(),
      name: 'Другий',
      color: adjustedSecondaryColor.to('hsl').toString(),
    })
  }

  // Створюємо додаткові кольори в залежності від стратегії
  switch (strategy) {
    case PaletteStrategy.MONOCHROMATIC:
      // Додаємо відтінки того ж кольору з різною насиченістю та яскравістю
      for (let i = 1; i <= 4; i++) {
        const lightness = 30 + i * 15
        const color = baseColorObj.clone()
        color.set('lch.l', lightness)
        // Застосовуємо інтенсивність до кожного нового кольору
        const adjustedColor = applyIntensity(color, intensity)

        colors.push({
          id: generateUUID(),
          name: `Відтінок ${i}`,
          color: adjustedColor.to('hsl').toString(),
        })
      }
      break

    case PaletteStrategy.ANALOGOUS:
      // Додаємо кольори з сусідніх позицій на колірному колі
      for (let i = -2; i <= 2; i++) {
        if (i === 0) continue // Пропускаємо базовий колір, він вже доданий

        const hue = (baseColorObj.get('lch.h') + i * 30) % 360
        const color = baseColorObj.clone()
        color.set('lch.h', hue)
        // Застосовуємо інтенсивність до кожного нового кольору
        const adjustedColor = applyIntensity(color, intensity)

        colors.push({
          id: generateUUID(),
          name: `Аналогічний ${i < 0 ? Math.abs(i) : i}`,
          color: adjustedColor.to('hsl').toString(),
        })
      }
      break

    case PaletteStrategy.COMPLEMENTARY:
      // Додаємо комплементарний колір (протилежний на колірному колі)
      const complementaryHue = (baseColorObj.get('lch.h') + 180) % 360
      const complementaryColor = baseColorObj.clone()
      complementaryColor.set('lch.h', complementaryHue)
      // Застосовуємо інтенсивність до комплементарного кольору
      const adjustedComplementaryColor = applyIntensity(
        complementaryColor,
        intensity
      )

      colors.push({
        id: generateUUID(),
        name: 'Комплементарний',
        color: adjustedComplementaryColor.to('hsl').toString(),
      })

      // Додаємо відтінки базового та комплементарного кольорів
      for (let i = 1; i <= 2; i++) {
        const lightness = 40 + i * 20

        const baseShade = baseColorObj.clone()
        baseShade.set('lch.l', lightness)
        const adjustedBaseShade = applyIntensity(baseShade, intensity)

        const compShade = complementaryColor.clone()
        compShade.set('lch.l', lightness)
        const adjustedCompShade = applyIntensity(compShade, intensity)

        colors.push({
          id: generateUUID(),
          name: `Базовий відтінок ${i}`,
          color: adjustedBaseShade.to('hsl').toString(),
        })

        colors.push({
          id: generateUUID(),
          name: `Комплементарний відтінок ${i}`,
          color: adjustedCompShade.to('hsl').toString(),
        })
      }
      break

    case PaletteStrategy.TRIADIC:
      // Додаємо два кольори, рівномірно розподілені на колірному колі
      for (let i = 1; i <= 2; i++) {
        const hue = (baseColorObj.get('lch.h') + i * 120) % 360
        const color = baseColorObj.clone()
        color.set('lch.h', hue)
        // Застосовуємо інтенсивність до кожного нового кольору
        const adjustedColor = applyIntensity(color, intensity)

        colors.push({
          id: generateUUID(),
          name: `Тріадний ${i}`,
          color: adjustedColor.to('hsl').toString(),
        })
      }
      break

    case PaletteStrategy.TETRADIC:
      // Додаємо три кольори, рівномірно розподілені на колірному колі
      for (let i = 1; i <= 3; i++) {
        const hue = (baseColorObj.get('lch.h') + i * 90) % 360
        const color = baseColorObj.clone()
        color.set('lch.h', hue)
        // Застосовуємо інтенсивність до кожного нового кольору
        const adjustedColor = applyIntensity(color, intensity)

        colors.push({
          id: generateUUID(),
          name: `Тетрадний ${i}`,
          color: adjustedColor.to('hsl').toString(),
        })
      }
      break

    case PaletteStrategy.SPLIT_COMPLEMENTARY:
      // Додаємо два кольори, близькі до комплементарного
      const compHue = (baseColorObj.get('lch.h') + 180) % 360

      for (let i = -1; i <= 1; i += 2) {
        const hue = (compHue + i * 30) % 360
        const color = baseColorObj.clone()
        color.set('lch.h', hue)
        // Застосовуємо інтенсивність до кожного нового кольору
        const adjustedColor = applyIntensity(color, intensity)

        colors.push({
          id: generateUUID(),
          name: `Розділений комплементарний ${i === -1 ? 1 : 2}`,
          color: adjustedColor.to('hsl').toString(),
        })
      }
      break
  }

  return {
    id: generateUUID(),
    baseColor: colors[0],
    secondaryColor: secondaryColorObj ? colors[1] : undefined,
    strategy,
    intensity,
    colors,
  }
}
