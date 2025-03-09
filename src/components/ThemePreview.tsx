'use client'

import { UITheme, getThemeColor } from '@/lib/theme-utils'
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
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        #theme-preview {
          --background: ${themeProps.background.default};
          --text: ${themeProps.text.primary};
          --border: ${themeProps.buttons.primary.outlined.border};
          --paper: ${themeProps.background.paper};
          --component: ${themeProps.background.component};
          --disabled: ${themeProps.buttons.disabled.outlined.border};
          --primary: ${themeProps.buttons.primary.contained.background};
          --secondary: ${themeProps.buttons.secondary.contained.background};
          --error: ${themeProps.buttons.error.contained.background};
          --spacing: ${theme.spacing}px;
          --radius: ${theme.rounding}px;
          --font-size: ${theme.fontSize}px;
        }
      `,
        }}
      />
      <div
        id="theme-preview"
        className="rounded-lg overflow-hidden border shadow-sm"
      >
        <div className="p-4 bg-gray-100 border-b">
          <h3 className="font-medium">Перегляд теми</h3>
        </div>

        <div
          className="p-6"
          style={{
            backgroundColor: getThemeColor(
              themeProps.background.default,
              theme.palette
            ),
          }}
        >
          <div className="mb-6">
            <h2
              className="text-xl font-semibold mb-2"
              style={{
                color: getThemeColor(themeProps.text.primary, theme.palette),
              }}
            >
              Основні кольори
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div
                className="p-4 rounded"
                style={{
                  backgroundColor: getThemeColor(
                    themeProps.background.default,
                    theme.palette
                  ),
                }}
              >
                <span
                  style={{
                    color: getThemeColor(
                      themeProps.text.primary,
                      theme.palette
                    ),
                  }}
                >
                  Фон за замовчуванням
                </span>
              </div>
              <div
                className="p-4 rounded"
                style={{
                  backgroundColor: getThemeColor(
                    themeProps.background.paper,
                    theme.palette
                  ),
                }}
              >
                <span
                  style={{
                    color: getThemeColor(
                      themeProps.text.primary,
                      theme.palette
                    ),
                  }}
                >
                  Фон паперу
                </span>
              </div>
              <div
                className="p-4 rounded"
                style={{
                  backgroundColor: getThemeColor(
                    themeProps.background.component,
                    theme.palette
                  ),
                }}
              >
                <span
                  style={{
                    color: getThemeColor(
                      themeProps.text.primary,
                      theme.palette
                    ),
                  }}
                >
                  Фон компонента
                </span>
              </div>
              <div
                className="p-4 rounded"
                style={{
                  backgroundColor: getThemeColor(
                    themeProps.background.default,
                    theme.palette
                  ),
                }}
              >
                <span
                  style={{
                    color: getThemeColor(
                      themeProps.text.primary,
                      theme.palette
                    ),
                  }}
                >
                  Основний текст
                </span>
                <br />
                <span
                  style={{
                    color: getThemeColor(
                      themeProps.text.secondary,
                      theme.palette
                    ),
                  }}
                >
                  Другорядний текст
                </span>
                <br />
                <span
                  style={{
                    color: getThemeColor(
                      themeProps.text.disabled,
                      theme.palette
                    ),
                  }}
                >
                  Неактивний текст
                </span>
              </div>
            </div>
          </div>

          {/* Інпути */}
          <div className="mb-6">
            <h2
              className="text-xl font-semibold mb-2"
              style={{
                color: getThemeColor(themeProps.text.primary, theme.palette),
              }}
            >
              Елементи форм
            </h2>
            <div
              className="p-4 rounded mb-4"
              style={{
                backgroundColor: getThemeColor(
                  themeProps.background.paper,
                  theme.palette
                ),
              }}
            >
              <div className="space-y-4">
                {/* Текстовий інпут */}
                <div>
                  <label
                    className="block mb-1 text-sm font-medium"
                    style={{
                      color: getThemeColor(
                        themeProps.text.primary,
                        theme.palette
                      ),
                    }}
                  >
                    Текстове поле
                  </label>
                  <input
                    type="text"
                    placeholder="Введіть текст"
                    className="w-full px-3 py-2 rounded border"
                    style={{
                      backgroundColor: getThemeColor(
                        themeProps.background.component,
                        theme.palette
                      ),
                      color: getThemeColor(
                        themeProps.text.primary,
                        theme.palette
                      ),
                      borderColor: getThemeColor(
                        themeProps.buttons.primary.outlined.border,
                        theme.palette
                      ),
                    }}
                  />
                </div>

                {/* Текстова область */}
                <div>
                  <label
                    className="block mb-1 text-sm font-medium"
                    style={{
                      color: getThemeColor(
                        themeProps.text.primary,
                        theme.palette
                      ),
                    }}
                  >
                    Текстова область
                  </label>
                  <textarea
                    placeholder="Введіть багаторядковий текст"
                    rows={3}
                    className="w-full px-3 py-2 rounded border"
                    style={{
                      backgroundColor: getThemeColor(
                        themeProps.background.component,
                        theme.palette
                      ),
                      color: getThemeColor(
                        themeProps.text.primary,
                        theme.palette
                      ),
                      borderColor: getThemeColor(
                        themeProps.buttons.primary.outlined.border,
                        theme.palette
                      ),
                    }}
                  />
                </div>

                {/* Селект */}
                <div>
                  <label
                    className="block mb-1 text-sm font-medium"
                    style={{
                      color: getThemeColor(
                        themeProps.text.primary,
                        theme.palette
                      ),
                    }}
                  >
                    Випадаючий список
                  </label>
                  <select
                    className="w-full px-3 py-2 rounded border"
                    style={{
                      backgroundColor: getThemeColor(
                        themeProps.background.component,
                        theme.palette
                      ),
                      color: getThemeColor(
                        themeProps.text.primary,
                        theme.palette
                      ),
                      borderColor: getThemeColor(
                        themeProps.buttons.primary.outlined.border,
                        theme.palette
                      ),
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
                    style={{
                      color: getThemeColor(
                        themeProps.text.primary,
                        theme.palette
                      ),
                    }}
                  >
                    Чекбокси
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2 h-4 w-4"
                        style={{
                          accentColor: getThemeColor(
                            themeProps.buttons.primary.contained.background,
                            theme.palette
                          ),
                        }}
                      />
                      <span
                        style={{
                          color: getThemeColor(
                            themeProps.text.primary,
                            theme.palette
                          ),
                        }}
                      >
                        Опція 1
                      </span>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2 h-4 w-4"
                        style={{
                          accentColor: getThemeColor(
                            themeProps.buttons.primary.contained.background,
                            theme.palette
                          ),
                        }}
                      />
                      <span
                        style={{
                          color: getThemeColor(
                            themeProps.text.primary,
                            theme.palette
                          ),
                        }}
                      >
                        Опція 2
                      </span>
                    </div>
                  </div>
                </div>

                {/* Радіо кнопки */}
                <div>
                  <label
                    className="block mb-1 text-sm font-medium"
                    style={{
                      color: getThemeColor(
                        themeProps.text.primary,
                        theme.palette
                      ),
                    }}
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
                          accentColor: getThemeColor(
                            themeProps.buttons.primary.contained.background,
                            theme.palette
                          ),
                        }}
                      />
                      <span
                        style={{
                          color: getThemeColor(
                            themeProps.text.primary,
                            theme.palette
                          ),
                        }}
                      >
                        Варіант 1
                      </span>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="radio-group"
                        className="mr-2 h-4 w-4"
                        style={{
                          accentColor: getThemeColor(
                            themeProps.buttons.primary.contained.background,
                            theme.palette
                          ),
                        }}
                      />
                      <span
                        style={{
                          color: getThemeColor(
                            themeProps.text.primary,
                            theme.palette
                          ),
                        }}
                      >
                        Варіант 2
                      </span>
                    </div>
                  </div>
                </div>

                {/* Слайдер */}
                <div>
                  <label
                    className="block mb-1 text-sm font-medium"
                    style={{
                      color: getThemeColor(
                        themeProps.text.primary,
                        theme.palette
                      ),
                    }}
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
                      accentColor: getThemeColor(
                        themeProps.buttons.primary.contained.background,
                        theme.palette
                      ),
                    }}
                  />
                </div>

                {/* Вимкнений інпут */}
                <div>
                  <label
                    className="block mb-1 text-sm font-medium"
                    style={{
                      color: getThemeColor(
                        themeProps.text.disabled,
                        theme.palette
                      ),
                    }}
                  >
                    Вимкнене поле
                  </label>
                  <input
                    type="text"
                    placeholder="Вимкнене поле"
                    disabled
                    className="w-full px-3 py-2 rounded border"
                    style={{
                      backgroundColor: getThemeColor(
                        themeProps.background.component,
                        theme.palette
                      ),
                      color: getThemeColor(
                        themeProps.text.disabled,
                        theme.palette
                      ),
                      borderColor: getThemeColor(
                        themeProps.buttons.disabled.outlined.border,
                        theme.palette
                      ),
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
              style={{
                color: getThemeColor(themeProps.text.primary, theme.palette),
              }}
            >
              Сповіщення
            </h2>
            <div className="space-y-2">
              <div
                className="p-3 rounded"
                style={{
                  backgroundColor: getThemeColor(
                    themeProps.info.background,
                    theme.palette
                  ),
                  color: getThemeColor(themeProps.info.text, theme.palette),
                }}
              >
                Інформаційне сповіщення
              </div>
              <div
                className="p-3 rounded"
                style={{
                  backgroundColor: getThemeColor(
                    themeProps.success.background,
                    theme.palette
                  ),
                  color: getThemeColor(themeProps.success.text, theme.palette),
                }}
              >
                Успішне сповіщення
              </div>
              <div
                className="p-3 rounded"
                style={{
                  backgroundColor: getThemeColor(
                    themeProps.warning.background,
                    theme.palette
                  ),
                  color: getThemeColor(themeProps.warning.text, theme.palette),
                }}
              >
                Попереджувальне сповіщення
              </div>
              <div
                className="p-3 rounded"
                style={{
                  backgroundColor: getThemeColor(
                    themeProps.error.background,
                    theme.palette
                  ),
                  color: getThemeColor(themeProps.error.text, theme.palette),
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
              style={{
                color: getThemeColor(themeProps.text.primary, theme.palette),
              }}
            >
              Кнопки
            </h2>

            {/* Contained кнопки */}
            <div className="mb-4">
              <h3
                className="text-lg mb-2"
                style={{
                  color: getThemeColor(themeProps.text.primary, theme.palette),
                }}
              >
                Contained
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  className="px-4 py-2 rounded"
                  style={{
                    backgroundColor: getThemeColor(
                      themeProps.buttons.primary.contained.background,
                      theme.palette
                    ),
                    color: getThemeColor(
                      themeProps.buttons.primary.contained.text,
                      theme.palette
                    ),
                  }}
                >
                  Primary
                </button>
                <button
                  className="px-4 py-2 rounded"
                  style={{
                    backgroundColor: getThemeColor(
                      themeProps.buttons.secondary.contained.background,
                      theme.palette
                    ),
                    color: getThemeColor(
                      themeProps.buttons.secondary.contained.text,
                      theme.palette
                    ),
                  }}
                >
                  Secondary
                </button>
                <button
                  className="px-4 py-2 rounded"
                  style={{
                    backgroundColor: getThemeColor(
                      themeProps.buttons.error.contained.background,
                      theme.palette
                    ),
                    color: getThemeColor(
                      themeProps.buttons.error.contained.text,
                      theme.palette
                    ),
                  }}
                >
                  Error
                </button>
                <button
                  className="px-4 py-2 rounded"
                  style={{
                    backgroundColor: getThemeColor(
                      themeProps.buttons.muted.contained.background,
                      theme.palette
                    ),
                    color: getThemeColor(
                      themeProps.buttons.muted.contained.text,
                      theme.palette
                    ),
                  }}
                >
                  Muted
                </button>
                <button
                  className="px-4 py-2 rounded"
                  style={{
                    backgroundColor: getThemeColor(
                      themeProps.buttons.disabled.contained.background,
                      theme.palette
                    ),
                    color: getThemeColor(
                      themeProps.buttons.disabled.contained.text,
                      theme.palette
                    ),
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
                style={{
                  color: getThemeColor(themeProps.text.primary, theme.palette),
                }}
              >
                Outlined
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  className="px-4 py-2 rounded"
                  style={{
                    backgroundColor: 'transparent',
                    color: getThemeColor(
                      themeProps.buttons.primary.outlined.text,
                      theme.palette
                    ),
                    border: `1px solid ${getThemeColor(
                      themeProps.buttons.primary.outlined.border,
                      theme.palette
                    )}`,
                  }}
                >
                  Primary
                </button>
                <button
                  className="px-4 py-2 rounded"
                  style={{
                    backgroundColor: 'transparent',
                    color: getThemeColor(
                      themeProps.buttons.secondary.outlined.text,
                      theme.palette
                    ),
                    border: `1px solid ${getThemeColor(
                      themeProps.buttons.secondary.outlined.border,
                      theme.palette
                    )}`,
                  }}
                >
                  Secondary
                </button>
                <button
                  className="px-4 py-2 rounded"
                  style={{
                    backgroundColor: 'transparent',
                    color: getThemeColor(
                      themeProps.buttons.error.outlined.text,
                      theme.palette
                    ),
                    border: `1px solid ${getThemeColor(
                      themeProps.buttons.error.outlined.border,
                      theme.palette
                    )}`,
                  }}
                >
                  Error
                </button>
                <button
                  className="px-4 py-2 rounded"
                  style={{
                    backgroundColor: 'transparent',
                    color: getThemeColor(
                      themeProps.buttons.muted.outlined.text,
                      theme.palette
                    ),
                    border: `1px solid ${getThemeColor(
                      themeProps.buttons.muted.outlined.border,
                      theme.palette
                    )}`,
                  }}
                >
                  Muted
                </button>
                <button
                  className="px-4 py-2 rounded"
                  style={{
                    backgroundColor: 'transparent',
                    color: getThemeColor(
                      themeProps.buttons.disabled.outlined.text,
                      theme.palette
                    ),
                    border: `1px solid ${getThemeColor(
                      themeProps.buttons.disabled.outlined.border,
                      theme.palette
                    )}`,
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
                style={{
                  color: getThemeColor(themeProps.text.primary, theme.palette),
                }}
              >
                Text
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  className="px-4 py-2 rounded"
                  style={{
                    backgroundColor: 'transparent',
                    color: getThemeColor(
                      themeProps.buttons.primary.text.text,
                      theme.palette
                    ),
                  }}
                >
                  Primary
                </button>
                <button
                  className="px-4 py-2 rounded"
                  style={{
                    backgroundColor: 'transparent',
                    color: getThemeColor(
                      themeProps.buttons.secondary.text.text,
                      theme.palette
                    ),
                  }}
                >
                  Secondary
                </button>
                <button
                  className="px-4 py-2 rounded"
                  style={{
                    backgroundColor: 'transparent',
                    color: getThemeColor(
                      themeProps.buttons.error.text.text,
                      theme.palette
                    ),
                  }}
                >
                  Error
                </button>
                <button
                  className="px-4 py-2 rounded"
                  style={{
                    backgroundColor: 'transparent',
                    color: getThemeColor(
                      themeProps.buttons.muted.text.text,
                      theme.palette
                    ),
                  }}
                >
                  Muted
                </button>
                <button
                  className="px-4 py-2 rounded"
                  style={{
                    backgroundColor: 'transparent',
                    color: getThemeColor(
                      themeProps.buttons.disabled.text.text,
                      theme.palette
                    ),
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
              style={{
                color: getThemeColor(themeProps.text.primary, theme.palette),
              }}
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
    </>
  )
}
