'use client'

import { useEffect, useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import Color from 'colorjs.io'
import { useRouter } from 'next/navigation'
import { createThemeFromPalette } from '@/lib/theme-utils'
import { serializeWithColor } from '@/lib/utils'
import { generateUUID } from '@/lib/uuid-utils'
import { ColorPalette, PaletteStrategy } from '@/lib/palette-utils'

export default function Wizard3() {
  const router = useRouter()

  const [step, setStep] = useState<number>(1)
  const [primaryColor, setPrimaryColor] = useState<string>('#3b82f6')
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false)
  const [secondaryColor, setSecondaryColor] = useState<string>('')

  const [backgroundColor, setBackgroundColor] = useState<string>('')
  const [textColor, setTextColor] = useState<string>('')
  const [textSecondaryColor, setTextSecondaryColor] = useState<string>('')

  const [errorColor, setErrorColor] = useState<string>('#ef4444')
  const [warningColor, setWarningColor] = useState<string>('#f59e0b')
  const [successColor, setSuccessColor] = useState<string>('#10b981')

  const [contrastWarning, setContrastWarning] = useState<string>('')
  const [palette, setPalette] = useState<ColorPalette | null>(null)

  const goToNextStep = () => {
    setStep(step + 1)
  }

  // Прокрутка до актуального етапу майстра
  useEffect(() => {
    document.getElementById('step-' + step)?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [step])

  // Обчислення фонового кольору на основі теми та первинного кольору
  useEffect(() => {
    if (primaryColor) {
      if (isDarkTheme) {
        // Для темної теми: темний відтінок з нахилом до первинного кольору
        try {
          const primaryColorObj = new Color(primaryColor)
          const darkBg = primaryColorObj.clone()

          // Зменшуємо яскравість значно і трохи змінюємо насиченість
          darkBg.set('lch.l', 10) // Низька яскравість для темного фону
          darkBg.set('lch.c', darkBg.get('lch.c') * 0.2) // Знижена насиченість

          setBackgroundColor(darkBg.toString({ format: 'hex' }))

          // Перевіряємо, чи не занадто темний первинний колір для темної теми
          const primaryLightness = primaryColorObj.get('lch.l')
          if (primaryLightness < 40) {
            setContrastWarning(
              'Обраний первинний колір занадто темний для темної теми. Це може призвести до поганої видимості елементів.'
            )
          } else {
            setContrastWarning('')
          }
        } catch (e) {
          setBackgroundColor('#121212') // За замовчуванням, якщо щось пішло не так
        }
      } else {
        // Для світлої теми: білий колір
        setBackgroundColor('#ffffff')
        setContrastWarning('')
      }
    }
  }, [primaryColor, isDarkTheme])

  // Налаштовуємо первинний колір для кращої видимості на основі теми
  useEffect(() => {
    if (primaryColor) {
      try {
        const primaryColorObj = new Color(primaryColor)

        if (isDarkTheme) {
          // Для темної теми робимо первинний колір яскравішим
          const adjustedPrimary = primaryColorObj.clone()
          adjustedPrimary.set(
            'lch.l',
            Math.min(80, primaryColorObj.get('lch.l') + 10)
          )
          setPrimaryColor(adjustedPrimary.toString({ format: 'hex' }))
        } else {
          // Забезпечуємо достатній контраст з білим фоном
          const white = new Color('white')
          const contrast = primaryColorObj.contrast(white, 'WCAG21')

          if (contrast < 3) {
            // Якщо контраст недостатній, темніємо колір
            const adjustedPrimary = primaryColorObj.clone()
            adjustedPrimary.set(
              'lch.l',
              Math.max(40, primaryColorObj.get('lch.l') - 10)
            )
            setPrimaryColor(adjustedPrimary.toString({ format: 'hex' }))
          }
        }
      } catch (e) {
        // Ігноруємо помилки
      }
    }
  }, [isDarkTheme])

  // Генеруємо вторинний колір на основі первинного
  useEffect(() => {
    if (primaryColor && !secondaryColor) {
      try {
        const primaryColorObj = new Color(primaryColor)
        const hue = (primaryColorObj.get('lch.h') + 180) % 360 // Комплементарний колір

        const secondary = primaryColorObj.clone()
        secondary.set('lch.h', hue)

        setSecondaryColor(secondary.toString({ format: 'hex' }))
      } catch (e) {
        // Використовуємо стандартний вторинний колір, якщо щось пішло не так
        setSecondaryColor('#9c27b0')
      }
    }
  }, [primaryColor, secondaryColor])

  // Визначаємо кольори тексту на основі фону
  useEffect(() => {
    if (backgroundColor) {
      try {
        const bgColor = new Color(backgroundColor)
        const white = new Color('white')
        const black = new Color('black')

        // Визначаємо, який колір тексту (чорний чи білий) має кращий контраст з фоном
        const whiteContrast = bgColor.contrast(white, 'WCAG21')
        const blackContrast = bgColor.contrast(black, 'WCAG21')

        // Основний колір тексту з максимальним контрастом
        if (whiteContrast > blackContrast) {
          setTextColor('#ffffff')

          // Другорядний текст з меншим контрастом (напівпрозорий білий)
          const secondary = white.clone()
          secondary.set('alpha', 0.7)
          setTextSecondaryColor(secondary.toString({ format: 'rgba' }))
        } else {
          setTextColor('#000000')

          // Другорядний текст з меншим контрастом (напівпрозорий чорний)
          const secondary = black.clone()
          secondary.set('alpha', 0.6)
          setTextSecondaryColor(secondary.toString({ format: 'rgba' }))
        }
      } catch (e) {
        // За замовчуванням
        setTextColor(isDarkTheme ? '#ffffff' : '#000000')
        setTextSecondaryColor(
          isDarkTheme ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'
        )
      }
    }
  }, [backgroundColor, isDarkTheme])

  // Перевіряємо та забезпечуємо достатній контраст між кольорами
  useEffect(() => {
    if (backgroundColor && primaryColor) {
      try {
        const bgColorObj = new Color(backgroundColor)
        const primaryColorObj = new Color(primaryColor)

        // Перевіряємо контраст між фоном і первинним кольором
        const contrast = primaryColorObj.contrast(bgColorObj, 'WCAG21')

        // Якщо контраст недостатній, коригуємо первинний колір
        if (contrast < 4.5 && !contrastWarning) {
          const adjustedPrimary = primaryColorObj.clone()

          // Змінюємо яскравість, щоб збільшити контраст
          if (isDarkTheme) {
            adjustedPrimary.set(
              'lch.l',
              Math.min(85, adjustedPrimary.get('lch.l') + 15)
            )
          } else {
            adjustedPrimary.set(
              'lch.l',
              Math.max(35, adjustedPrimary.get('lch.l') - 15)
            )
          }

          setPrimaryColor(adjustedPrimary.toString({ format: 'hex' }))
        }
      } catch (e) {
        // Ігноруємо помилки
      }
    }
  }, [backgroundColor, primaryColor, isDarkTheme, contrastWarning])

  // Генеруємо палітру перед завершенням
  const generateFinalPalette = () => {
    // Створюємо базові кольори для палітри
    const colorEntries = [
      {
        id: generateUUID(),
        name: 'Базовий',
        color: primaryColor,
      },
      {
        id: generateUUID(),
        name: 'Другорядний',
        color: secondaryColor,
      },
      {
        id: generateUUID(),
        name: 'Фон',
        color: backgroundColor,
      },
      {
        id: generateUUID(),
        name: 'Текст',
        color: textColor,
      },
      {
        id: generateUUID(),
        name: 'Другорядний текст',
        color: textSecondaryColor,
      },
      {
        id: generateUUID(),
        name: 'Успіх',
        color: successColor,
      },
      {
        id: generateUUID(),
        name: 'Попередження',
        color: warningColor,
      },
      {
        id: generateUUID(),
        name: 'Помилка',
        color: errorColor,
      },
    ]

    // Створюємо палітру
    const newPalette: ColorPalette = {
      id: generateUUID(),
      baseColor: colorEntries[0],
      secondaryColor: colorEntries[1],
      strategy: PaletteStrategy.COMPLEMENTARY,
      intensity: isDarkTheme ? 'dark' : 'light',
      colors: colorEntries,
    }

    setPalette(newPalette)
    return newPalette
  }

  // Функція для відображення контрастного тексту на кольорі
  const getContrastTextColor = (color: string): string => {
    try {
      const bgColor = new Color(color)
      const white = new Color('white')
      const black = new Color('black')

      const whiteContrast = bgColor.contrast(white, 'WCAG21')
      const blackContrast = bgColor.contrast(black, 'WCAG21')

      return whiteContrast > blackContrast ? 'white' : 'black'
    } catch {
      return 'black'
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold text-center">
          Майстер створення палітри за алгоритмом
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Цей майстер допоможе вам створити тему та палітру кольорів з
          урахуванням доступності
        </p>

        <Step
          label="Основний колір"
          index={1}
          activeStep={step}
          onNext={goToNextStep}
        >
          <div className="flex flex-row gap-4">
            <div className="flex-1">
              <HexColorPicker
                color={primaryColor}
                onChange={(color) => {
                  setPrimaryColor(color)
                  setContrastWarning('')
                }}
              />
            </div>
            <ColorDisplay color={primaryColor} />
          </div>
        </Step>

        <Step
          label="Тип теми"
          index={2}
          activeStep={step}
          onNext={goToNextStep}
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-row relative">
              <button
                className={`bg-white p-4 flex-1 cursor-pointer hover:bg-gray-100 ${
                  !isDarkTheme ? 'text-blue-600 font-bold' : ''
                }`}
                onClick={() => setIsDarkTheme(false)}
              >
                Світла тема
              </button>
              <button
                className={`bg-gray-800 p-4 flex-1 cursor-pointer hover:bg-gray-900 text-white ${
                  isDarkTheme ? 'text-blue-400 font-bold' : ''
                }`}
                onClick={() => setIsDarkTheme(true)}
              >
                Темна тема
              </button>
            </div>

            <div
              className="p-4 rounded-lg"
              style={{ backgroundColor: backgroundColor }}
            >
              <h3
                className="text-xl font-bold mb-2"
                style={{ color: textColor }}
              >
                Попередній перегляд теми
              </h3>
              <p style={{ color: textColor }}>Основний текст виглядатиме так</p>
              <p style={{ color: textSecondaryColor }}>
                А другорядний текст виглядатиме так
              </p>

              <div className="flex gap-2 mt-4">
                <button
                  className="px-4 py-2 rounded"
                  style={{
                    backgroundColor: primaryColor,
                    color: getContrastTextColor(primaryColor),
                  }}
                >
                  Кнопка
                </button>
                {secondaryColor && (
                  <button
                    className="px-4 py-2 rounded"
                    style={{
                      backgroundColor: secondaryColor,
                      color: getContrastTextColor(secondaryColor),
                    }}
                  >
                    Другорядна
                  </button>
                )}
              </div>
            </div>

            {contrastWarning && (
              <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-4 my-4">
                <p className="font-bold">Попередження про контраст:</p>
                <p>{contrastWarning}</p>
              </div>
            )}
          </div>
        </Step>

        <Step
          label="Другорядний колір"
          index={3}
          activeStep={step}
          onNext={goToNextStep}
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-4">
              <div className="flex-1">
                <HexColorPicker
                  color={secondaryColor}
                  onChange={setSecondaryColor}
                />
              </div>
              <ColorDisplay color={secondaryColor} />
            </div>

            <button
              onClick={() => {
                // Генерація комплементарного кольору
                try {
                  const primaryColorObj = new Color(primaryColor)
                  const hue = (primaryColorObj.get('lch.h') + 180) % 360

                  const secondary = primaryColorObj.clone()
                  secondary.set('lch.h', hue)

                  setSecondaryColor(secondary.toString({ format: 'hex' }))
                } catch {
                  setSecondaryColor('#9c27b0')
                }
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600"
            >
              Згенерувати комплементарний колір
            </button>

            <button
              onClick={() => {
                // Генерація аналогового кольору
                try {
                  const primaryColorObj = new Color(primaryColor)
                  const hue = (primaryColorObj.get('lch.h') + 30) % 360

                  const secondary = primaryColorObj.clone()
                  secondary.set('lch.h', hue)

                  setSecondaryColor(secondary.toString({ format: 'hex' }))
                } catch {
                  setSecondaryColor('#9c27b0')
                }
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600"
            >
              Згенерувати аналоговий колір
            </button>
          </div>
        </Step>

        <Step
          label="Функціональні кольори"
          index={4}
          activeStep={step}
          onNext={goToNextStep}
        >
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center gap-2">
              <label className="text-sm font-medium">Успіх</label>
              <div className="w-full">
                <input
                  type="color"
                  value={successColor}
                  onChange={(e) => setSuccessColor(e.target.value)}
                  className="w-full h-12 cursor-pointer"
                />
              </div>
              <div
                className="w-full text-center p-2 rounded-lg"
                style={{
                  backgroundColor: successColor,
                  color: getContrastTextColor(successColor),
                }}
              >
                Успішна операція
              </div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <label className="text-sm font-medium">Попередження</label>
              <div className="w-full">
                <input
                  type="color"
                  value={warningColor}
                  onChange={(e) => setWarningColor(e.target.value)}
                  className="w-full h-12 cursor-pointer"
                />
              </div>
              <div
                className="w-full text-center p-2 rounded-lg"
                style={{
                  backgroundColor: warningColor,
                  color: getContrastTextColor(warningColor),
                }}
              >
                Попередження
              </div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <label className="text-sm font-medium">Помилка</label>
              <div className="w-full">
                <input
                  type="color"
                  value={errorColor}
                  onChange={(e) => setErrorColor(e.target.value)}
                  className="w-full h-12 cursor-pointer"
                />
              </div>
              <div
                className="w-full text-center p-2 rounded-lg"
                style={{
                  backgroundColor: errorColor,
                  color: getContrastTextColor(errorColor),
                }}
              >
                Помилка
              </div>
            </div>
          </div>
        </Step>

        <Step
          label="Готова палітра"
          index={5}
          activeStep={step}
          onNext={() => {
            const finalPalette = generateFinalPalette()

            // Створюємо тему на основі палітри
            const theme = createThemeFromPalette(finalPalette, {
              isDarkMode: isDarkTheme,
              contrastLevel: 4.5,
              spacing: 8,
              rounding: 4,
            })

            // Серіалізуємо тему для передачі через URL
            const themeQuery = encodeURIComponent(serializeWithColor(theme))

            // Переходимо на сторінку теми
            router.push(`/theme?data=${themeQuery}`)
          }}
        >
          <div className="space-y-4">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Підсумок</h3>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="font-medium">Тип теми:</div>
                  <div>{isDarkTheme ? 'Темна тема' : 'Світла тема'}</div>
                </div>

                <div>
                  <div className="font-medium">Рівень контрасту:</div>
                  <div>AA (4.5:1)</div>
                </div>
              </div>

              <h4 className="font-medium mb-2">Кольори палітри:</h4>
              <div className="grid grid-cols-4 gap-4">
                <ColorCard label="Основний" color={primaryColor} />
                <ColorCard label="Другорядний" color={secondaryColor} />
                <ColorCard label="Фон" color={backgroundColor} />
                <ColorCard label="Текст" color={textColor} />
                <ColorCard
                  label="Другорядний текст"
                  color={textSecondaryColor}
                />
                <ColorCard label="Успіх" color={successColor} />
                <ColorCard label="Попередження" color={warningColor} />
                <ColorCard label="Помилка" color={errorColor} />
              </div>
            </div>

            <div
              className="p-6 rounded-lg"
              style={{ backgroundColor: backgroundColor }}
            >
              <h3
                className="text-xl font-bold mb-4"
                style={{ color: textColor }}
              >
                Попередній перегляд
              </h3>

              <div className="flex gap-4 mb-4">
                <button
                  className="px-4 py-2 rounded-lg"
                  style={{
                    backgroundColor: primaryColor,
                    color: getContrastTextColor(primaryColor),
                  }}
                >
                  Основна кнопка
                </button>

                <button
                  className="px-4 py-2 rounded-lg"
                  style={{
                    backgroundColor: secondaryColor,
                    color: getContrastTextColor(secondaryColor),
                  }}
                >
                  Другорядна кнопка
                </button>
              </div>

              <div className="space-y-2">
                <p style={{ color: textColor }}>
                  Це приклад основного тексту у вашій темі. Він повинен мати
                  хороший контраст з фоном.
                </p>

                <p style={{ color: textSecondaryColor }}>
                  Це приклад другорядного тексту. Він також повинен бути
                  читабельним, хоч і менш помітним.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                <div
                  className="p-3 rounded-lg text-center"
                  style={{
                    backgroundColor: successColor,
                    color: getContrastTextColor(successColor),
                  }}
                >
                  Успішна операція
                </div>

                <div
                  className="p-3 rounded-lg text-center"
                  style={{
                    backgroundColor: warningColor,
                    color: getContrastTextColor(warningColor),
                  }}
                >
                  Попередження
                </div>

                <div
                  className="p-3 rounded-lg text-center"
                  style={{
                    backgroundColor: errorColor,
                    color: getContrastTextColor(errorColor),
                  }}
                >
                  Помилка
                </div>
              </div>
            </div>

            <p className="text-gray-500 text-center">
              Натисніть "Далі" щоб перейти до редактора теми, де ви зможете
              точно налаштувати всі параметри.
            </p>
          </div>
        </Step>
      </div>
    </div>
  )
}

function Step(props: {
  children: React.ReactNode | React.ReactNode[]
  label: string
  index: number
  activeStep: number
  onNext?: () => void
}) {
  const { index, activeStep, onNext, label, children } = props
  const isVisible = index <= activeStep
  const isButtonVisible = index === activeStep

  return (
    <div
      id={'step-' + index}
      className={`flex flex-col gap-4 border border-gray-200 rounded-lg p-4 ${
        isVisible ? 'block' : 'hidden'
      }`}
    >
      <h2 className="text-2xl font-bold">{label}</h2>
      {children}
      {isButtonVisible && onNext && (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600"
          onClick={onNext}
        >
          Далі
        </button>
      )}
    </div>
  )
}

function ColorDisplay(props: { color: string }) {
  const { color } = props

  if (!color) {
    return null
  }

  return (
    <div
      className="flex-1 rounded-lg bg-gray-100 p-2 flex flex-col items-center justify-center"
      style={{ backgroundColor: color }}
    >
      <span className="text-2xl" style={{ color: getContrastTextColor(color) }}>
        {color}
      </span>
    </div>
  )
}

function ColorCard(props: { label: string; color: string }) {
  const { label, color } = props

  return (
    <div className="flex flex-col items-center">
      <div
        className="w-full h-20 mb-1 rounded-lg"
        style={{ backgroundColor: color }}
      ></div>
      <div className="text-sm font-medium">{label}</div>
      <div className="text-xs text-gray-500">{color}</div>
    </div>
  )
}

function getContrastTextColor(color: string): string {
  try {
    const bgColor = new Color(color)
    const white = new Color('white')
    const black = new Color('black')

    const whiteContrast = bgColor.contrast(white, 'WCAG21')
    const blackContrast = bgColor.contrast(black, 'WCAG21')

    return whiteContrast > blackContrast ? 'white' : 'black'
  } catch {
    return 'black'
  }
}
