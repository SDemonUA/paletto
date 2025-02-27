'use client'

import { UITheme } from '@/lib/theme-utils'
import Color from 'colorjs.io'

interface ThemePreviewProps {
  theme: UITheme
}

export default function ThemePreview({ theme }: ThemePreviewProps) {
  const { themeProps } = theme

  // Функція для визначення контрастного кольору тексту
  const getContrastTextColor = (backgroundColor: string): string => {
    try {
      const bgColor = new Color(backgroundColor)
      const white = new Color('white')
      const black = new Color('black')

      const whiteContrast = bgColor.contrast(white, 'WCAG21')
      const blackContrast = bgColor.contrast(black, 'WCAG21')

      return whiteContrast > blackContrast ? 'white' : 'black'
    } catch {
      return 'black' // За замовчуванням
    }
  }

  return (
    <div className="rounded-lg overflow-hidden border shadow-sm">
      <div className="p-4 bg-gray-100 border-b">
        <h3 className="font-medium">Перегляд теми</h3>
      </div>

      <div
        className="p-6"
        style={{ backgroundColor: themeProps.background.default }}
      >
        <div className="mb-6">
          <h2
            className="text-xl font-semibold mb-2"
            style={{ color: themeProps.text.primary }}
          >
            Основні кольори
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div
              className="p-4 rounded"
              style={{ backgroundColor: themeProps.background.default }}
            >
              <span style={{ color: themeProps.text.primary }}>
                Фон за замовчуванням
              </span>
            </div>
            <div
              className="p-4 rounded"
              style={{ backgroundColor: themeProps.background.paper }}
            >
              <span style={{ color: themeProps.text.primary }}>Фон паперу</span>
            </div>
            <div
              className="p-4 rounded"
              style={{ backgroundColor: themeProps.background.component }}
            >
              <span style={{ color: themeProps.text.primary }}>
                Фон компонента
              </span>
            </div>
            <div
              className="p-4 rounded"
              style={{ backgroundColor: themeProps.background.default }}
            >
              <span style={{ color: themeProps.text.primary }}>
                Основний текст
              </span>
              <br />
              <span style={{ color: themeProps.text.secondary }}>
                Другорядний текст
              </span>
              <br />
              <span style={{ color: themeProps.text.disabled }}>
                Неактивний текст
              </span>
            </div>
          </div>
        </div>

        {/* Інпути */}
        <div className="mb-6">
          <h2
            className="text-xl font-semibold mb-2"
            style={{ color: themeProps.text.primary }}
          >
            Елементи форм
          </h2>
          <div
            className="p-4 rounded mb-4"
            style={{ backgroundColor: themeProps.background.paper }}
          >
            <div className="space-y-4">
              {/* Текстовий інпут */}
              <div>
                <label
                  className="block mb-1 text-sm font-medium"
                  style={{ color: themeProps.text.primary }}
                >
                  Текстове поле
                </label>
                <input
                  type="text"
                  placeholder="Введіть текст"
                  className="w-full px-3 py-2 rounded border"
                  style={{
                    backgroundColor: themeProps.background.component,
                    color: themeProps.text.primary,
                    borderColor: themeProps.buttons.primary.outlined.border,
                  }}
                />
              </div>

              {/* Текстова область */}
              <div>
                <label
                  className="block mb-1 text-sm font-medium"
                  style={{ color: themeProps.text.primary }}
                >
                  Текстова область
                </label>
                <textarea
                  placeholder="Введіть багаторядковий текст"
                  rows={3}
                  className="w-full px-3 py-2 rounded border"
                  style={{
                    backgroundColor: themeProps.background.component,
                    color: themeProps.text.primary,
                    borderColor: themeProps.buttons.primary.outlined.border,
                  }}
                />
              </div>

              {/* Селект */}
              <div>
                <label
                  className="block mb-1 text-sm font-medium"
                  style={{ color: themeProps.text.primary }}
                >
                  Випадаючий список
                </label>
                <select
                  className="w-full px-3 py-2 rounded border"
                  style={{
                    backgroundColor: themeProps.background.component,
                    color: themeProps.text.primary,
                    borderColor: themeProps.buttons.primary.outlined.border,
                  }}
                >
                  <option>Опція 1</option>
                  <option>Опція 2</option>
                  <option>Опція 3</option>
                </select>
              </div>

              {/* Чекбокси */}
              <div>
                <label
                  className="block mb-1 text-sm font-medium"
                  style={{ color: themeProps.text.primary }}
                >
                  Чекбокси
                </label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2 h-4 w-4"
                      style={{
                        accentColor:
                          themeProps.buttons.primary.contained.background,
                      }}
                    />
                    <span style={{ color: themeProps.text.primary }}>
                      Опція 1
                    </span>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2 h-4 w-4"
                      style={{
                        accentColor:
                          themeProps.buttons.primary.contained.background,
                      }}
                    />
                    <span style={{ color: themeProps.text.primary }}>
                      Опція 2
                    </span>
                  </div>
                </div>
              </div>

              {/* Радіо кнопки */}
              <div>
                <label
                  className="block mb-1 text-sm font-medium"
                  style={{ color: themeProps.text.primary }}
                >
                  Радіо кнопки
                </label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="radio-group"
                      className="mr-2 h-4 w-4"
                      style={{
                        accentColor:
                          themeProps.buttons.primary.contained.background,
                      }}
                    />
                    <span style={{ color: themeProps.text.primary }}>
                      Варіант 1
                    </span>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="radio-group"
                      className="mr-2 h-4 w-4"
                      style={{
                        accentColor:
                          themeProps.buttons.primary.contained.background,
                      }}
                    />
                    <span style={{ color: themeProps.text.primary }}>
                      Варіант 2
                    </span>
                  </div>
                </div>
              </div>

              {/* Слайдер */}
              <div>
                <label
                  className="block mb-1 text-sm font-medium"
                  style={{ color: themeProps.text.primary }}
                >
                  Слайдер
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="50"
                  className="w-full"
                  style={{
                    accentColor:
                      themeProps.buttons.primary.contained.background,
                  }}
                />
              </div>

              {/* Вимкнений інпут */}
              <div>
                <label
                  className="block mb-1 text-sm font-medium"
                  style={{ color: themeProps.text.disabled }}
                >
                  Вимкнене поле
                </label>
                <input
                  type="text"
                  placeholder="Вимкнене поле"
                  disabled
                  className="w-full px-3 py-2 rounded border"
                  style={{
                    backgroundColor: themeProps.background.component,
                    color: themeProps.text.disabled,
                    borderColor: themeProps.buttons.disabled.outlined.border,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Сповіщення */}
        <div className="mb-6">
          <h2
            className="text-xl font-semibold mb-2"
            style={{ color: themeProps.text.primary }}
          >
            Сповіщення
          </h2>
          <div className="space-y-2">
            <div
              className="p-3 rounded"
              style={{
                backgroundColor: themeProps.alerts.info.background,
                color: themeProps.alerts.info.text,
              }}
            >
              Інформаційне сповіщення
            </div>
            <div
              className="p-3 rounded"
              style={{
                backgroundColor: themeProps.alerts.success.background,
                color: themeProps.alerts.success.text,
              }}
            >
              Успішне сповіщення
            </div>
            <div
              className="p-3 rounded"
              style={{
                backgroundColor: themeProps.alerts.warning.background,
                color: themeProps.alerts.warning.text,
              }}
            >
              Попереджувальне сповіщення
            </div>
            <div
              className="p-3 rounded"
              style={{
                backgroundColor: themeProps.alerts.error.background,
                color: themeProps.alerts.error.text,
              }}
            >
              Сповіщення про помилку
            </div>
          </div>
        </div>

        {/* Кнопки */}
        <div className="mb-6">
          <h2
            className="text-xl font-semibold mb-2"
            style={{ color: themeProps.text.primary }}
          >
            Кнопки
          </h2>

          {/* Contained кнопки */}
          <div className="mb-4">
            <h3
              className="text-lg mb-2"
              style={{ color: themeProps.text.primary }}
            >
              Contained
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                className="px-4 py-2 rounded"
                style={{
                  backgroundColor:
                    themeProps.buttons.primary.contained.background,
                  color: themeProps.buttons.primary.contained.text,
                }}
              >
                Primary
              </button>
              <button
                className="px-4 py-2 rounded"
                style={{
                  backgroundColor:
                    themeProps.buttons.secondary.contained.background,
                  color: themeProps.buttons.secondary.contained.text,
                }}
              >
                Secondary
              </button>
              <button
                className="px-4 py-2 rounded"
                style={{
                  backgroundColor:
                    themeProps.buttons.error.contained.background,
                  color: themeProps.buttons.error.contained.text,
                }}
              >
                Error
              </button>
              <button
                className="px-4 py-2 rounded"
                style={{
                  backgroundColor:
                    themeProps.buttons.muted.contained.background,
                  color: themeProps.buttons.muted.contained.text,
                }}
              >
                Muted
              </button>
              <button
                className="px-4 py-2 rounded"
                style={{
                  backgroundColor:
                    themeProps.buttons.disabled.contained.background,
                  color: themeProps.buttons.disabled.contained.text,
                }}
              >
                Disabled
              </button>
            </div>
          </div>

          {/* Outlined кнопки */}
          <div className="mb-4">
            <h3
              className="text-lg mb-2"
              style={{ color: themeProps.text.primary }}
            >
              Outlined
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                className="px-4 py-2 rounded"
                style={{
                  backgroundColor: 'transparent',
                  color: themeProps.buttons.primary.outlined.text,
                  border: `1px solid ${themeProps.buttons.primary.outlined.border}`,
                }}
              >
                Primary
              </button>
              <button
                className="px-4 py-2 rounded"
                style={{
                  backgroundColor: 'transparent',
                  color: themeProps.buttons.secondary.outlined.text,
                  border: `1px solid ${themeProps.buttons.secondary.outlined.border}`,
                }}
              >
                Secondary
              </button>
              <button
                className="px-4 py-2 rounded"
                style={{
                  backgroundColor: 'transparent',
                  color: themeProps.buttons.error.outlined.text,
                  border: `1px solid ${themeProps.buttons.error.outlined.border}`,
                }}
              >
                Error
              </button>
              <button
                className="px-4 py-2 rounded"
                style={{
                  backgroundColor: 'transparent',
                  color: themeProps.buttons.muted.outlined.text,
                  border: `1px solid ${themeProps.buttons.muted.outlined.border}`,
                }}
              >
                Muted
              </button>
              <button
                className="px-4 py-2 rounded"
                style={{
                  backgroundColor: 'transparent',
                  color: themeProps.buttons.disabled.outlined.text,
                  border: `1px solid ${themeProps.buttons.disabled.outlined.border}`,
                }}
              >
                Disabled
              </button>
            </div>
          </div>

          {/* Text кнопки */}
          <div>
            <h3
              className="text-lg mb-2"
              style={{ color: themeProps.text.primary }}
            >
              Text
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                className="px-4 py-2 rounded"
                style={{
                  backgroundColor: 'transparent',
                  color: themeProps.buttons.primary.text.text,
                }}
              >
                Primary
              </button>
              <button
                className="px-4 py-2 rounded"
                style={{
                  backgroundColor: 'transparent',
                  color: themeProps.buttons.secondary.text.text,
                }}
              >
                Secondary
              </button>
              <button
                className="px-4 py-2 rounded"
                style={{
                  backgroundColor: 'transparent',
                  color: themeProps.buttons.error.text.text,
                }}
              >
                Error
              </button>
              <button
                className="px-4 py-2 rounded"
                style={{
                  backgroundColor: 'transparent',
                  color: themeProps.buttons.muted.text.text,
                }}
              >
                Muted
              </button>
              <button
                className="px-4 py-2 rounded"
                style={{
                  backgroundColor: 'transparent',
                  color: themeProps.buttons.disabled.text.text,
                }}
              >
                Disabled
              </button>
            </div>
          </div>
        </div>

        {/* Палітра кольорів */}
        <div>
          <h2
            className="text-xl font-semibold mb-2"
            style={{ color: themeProps.text.primary }}
          >
            Палітра кольорів
          </h2>
          <div className="grid grid-cols-5 gap-2">
            {theme.palette.colors.map((colorEntry) => {
              const colorHex = colorEntry.color.toString({ format: 'hex' })
              const textColor = getContrastTextColor(colorHex)
              return (
                <div
                  key={colorEntry.id}
                  className="p-3 rounded text-center"
                  style={{
                    backgroundColor: colorHex,
                    color: textColor,
                  }}
                >
                  {colorEntry.name}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
