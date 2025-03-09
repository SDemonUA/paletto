'use client'

import { useEffect, useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import {
  createColor,
  generatePaletteColors,
  getContrastTextColor,
  getColorName,
} from '@/lib/color-utils'
import Color from 'colorjs.io'
import { useRouter } from 'next/navigation'
import { createThemeFromPalette } from '@/lib/theme-utils'
import {
  createPalette as createPaletteFromLib,
  PaletteStrategy,
} from '@/lib/palette-utils'
import { generateUUID, serializeWithColor } from '@/lib/utils'

export default function Wizard2() {
  const router = useRouter()
  const [baseColor, setBaseColor] = useState<string>('')
  const [secondaryColor, setSecondaryColor] = useState<string>('')
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false)
  const [spacing, setSpacing] = useState<number>(4)
  const [rounding, setRounding] = useState<number>(4)

  const [step, setStep] = useState<number>(1)
  const goToNextStep = () => {
    setStep(step + 1)
  }

  useEffect(() => {
    document.getElementById('step-' + step)?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [step])

  return (
    <Page>
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold text-center">
          Майстер створення теми
        </h1>
        <p className="text-center text-gray-500">
          Цей майстер допоможе вам створити тему для вашого проекту.
        </p>

        <Step
          label="Основний колір"
          index={1}
          activeStep={step}
          onNext={baseColor ? goToNextStep : undefined}
        >
          <div className="flex flex-row gap-2">
            <HexColorPicker
              color={baseColor}
              onChange={(color) => setBaseColor(color)}
            />
            <ColorDisplay color={baseColor} />
          </div>
        </Step>

        <Step
          label="Другорядний колір"
          index={2}
          activeStep={step}
          onNext={secondaryColor ? goToNextStep : undefined}
        >
          <div className="flex flex-row gap-2">
            <HexColorPicker
              color={secondaryColor}
              onChange={(color) => setSecondaryColor(color)}
            />
            <ColorDisplay color={secondaryColor} />
          </div>
          <div className="flex flex-row gap-4 items-center px-4">
            <div className="flex-1 h-[1px] bg-gray-200" />
            <span>або</span>
            <div className="flex-1 h-[1px] bg-gray-200" />
          </div>
          <Button
            onClick={() => {
              setSecondaryColor(generateSecondaryColor(baseColor))
            }}
          >
            Згенерувати автоматично
          </Button>
        </Step>

        <Step label="Тема" index={3} activeStep={step} onNext={goToNextStep}>
          <div className="flex flex-row relative">
            <button
              className="bg-white p-2 flex-1 cursor-pointer hover:bg-gray-100"
              aria-pressed={!isDarkTheme}
              onClick={() => setIsDarkTheme(false)}
            >
              Світла
            </button>
            <button
              className="bg-white p-2 flex-1 cursor-pointer hover:bg-gray-100"
              aria-pressed={isDarkTheme}
              onClick={() => setIsDarkTheme(true)}
            >
              Темна
            </button>
            <div
              className={`absolute bottom-0 left-0 w-[50%] h-[2px] bg-blue-500 transition-all duration-250 rounded-lg ${
                isDarkTheme ? 'translate-x-full' : 'translate-x-0'
              }`}
            />
          </div>
        </Step>

        <Step
          label="Відступи"
          index={4}
          activeStep={step}
          onNext={goToNextStep}
        >
          <div className="flex flex-row gap-2 flex-wrap">
            {[1, 2, 3, 4, 5].map((value) => (
              <SpacingBlock
                key={value}
                value={value}
                isSelected={spacing === value}
                onClick={() => setSpacing(value)}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Ви зможете налаштувати відступи більш детально пізніше у редакторі
            теми
          </p>
        </Step>

        <Step
          label="Округлення"
          index={5}
          activeStep={step}
          onNext={goToNextStep}
        >
          <div className="flex flex-row gap-2 flex-wrap">
            {[0, 1, 2, 3, 4].map((value) => (
              <RoundingBlock
                key={value}
                value={value}
                isSelected={rounding === value}
                onClick={() => setRounding(value)}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Ви зможете налаштувати радіуси округлення більш детально пізніше у
            редакторі теми
          </p>
        </Step>

        <Step
          label="Готово!"
          index={6}
          activeStep={step}
          onNext={() => {
            // Створюємо палітру
            const palette = createPaletteFromLib(
              new Color(baseColor),
              PaletteStrategy.COMPLEMENTARY
            )
            // Додаємо другорядний колір
            palette.colors.push({
              id: generateUUID(),
              name: 'Secondary',
              color: new Color(secondaryColor),
            })

            // Створюємо тему
            const theme = createThemeFromPalette(palette, {
              isDarkMode: isDarkTheme,
              contrastLevel: 4.5,
            })

            // Серіалізуємо тему в URL
            const themeQuery = encodeURIComponent(
              serializeWithColor({
                ...theme,
                spacing,
                rounding,
              })
            )

            // Переходимо на сторінку теми
            router.push(`/theme?data=${themeQuery}`)
          }}
        >
          <div className="text-center">
            <p className="text-lg mb-4">
              Вітаємо! Ви успішно створили базову тему.
            </p>
            <p className="text-gray-500">
              Натисніть &quot;Далі&quot; щоб перейти до редактора теми, де ви
              зможете налаштувати більше параметрів.
            </p>
          </div>
        </Step>
      </div>
    </Page>
  )
}

function Page(props: { children: React.ReactNode | React.ReactNode[] }) {
  return <div className="container mx-auto p-4">{props.children}</div>
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
      {isButtonVisible && onNext && <Button onClick={onNext}>Далі</Button>}
    </div>
  )
}

function Button(props: {
  children: React.ReactNode | React.ReactNode[]
  onClick: () => void
}) {
  const { children, onClick } = props
  return (
    <button
      className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600"
      onClick={onClick}
    >
      {children}
    </button>
  )
}

function generateSecondaryColor(baseColor: string) {
  // Створюємо палітру з розділено-комплементарною стратегією
  // Це дасть нам два кольори, які добре поєднуються з основним
  // TODO: Знайти кращий спосіб вибору кольору з більшою кількістю варіацій
  const palette = generatePaletteColors(
    createColor(baseColor),
    'split-complementary',
    3
  )

  // Беремо перший додатковий колір (Split 1)
  // Він буде гармонійним з основним, але достатньо контрастним
  const colorIndex = Math.floor(Math.random() * (palette.length - 1)) + 1
  return palette[colorIndex].color.to('sRGB').toString({ format: 'hex' })
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
        {getColorName(color)}
        <br />
        {new Color(color).toString({ format: 'hex' })}
      </span>
    </div>
  )
}

function SpacingBlock({
  value,
  isSelected,
  onClick,
}: {
  value: number
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`p-4 border rounded-lg ${
        isSelected ? 'border-blue-500' : 'border-gray-200'
      } hover:border-blue-300`}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="flex gap-2">
          <div className={`w-4 h-4 bg-gray-200 rounded`} />
          <div
            className={`w-4 h-4 bg-gray-200 rounded`}
            style={{ marginLeft: value * 4 }}
          />
        </div>
        <span className="text-sm">{value * 4}px</span>
      </div>
    </button>
  )
}

function RoundingBlock({
  value,
  isSelected,
  onClick,
}: {
  value: number
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`p-4 border ${
        isSelected ? 'border-blue-500' : 'border-gray-200'
      } hover:border-blue-300 rounded-lg`}
    >
      <div className="flex flex-col items-center gap-2">
        <div
          className="w-16 h-16 bg-gray-200"
          style={{ borderRadius: value * 4 }}
        />
        <span className="text-sm">{value * 4}px</span>
      </div>
    </button>
  )
}
