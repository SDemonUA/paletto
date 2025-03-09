'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ROUTES } from '../../constants'

export default function ExamplesPage() {
  const [isLoading, setIsLoading] = useState(true)

  // Імітуємо завантаження даних
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-indigo-800 mb-4">
            Приклади палітр
          </h1>
          <p className="text-xl text-gray-700">
            Перегляньте готові приклади кольорових палітр та тем
          </p>
        </div>

        {/* Позначка про розробку */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-4 rounded w-full max-w-2xl">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-amber-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium">Сторінка в розробці</h3>
                  <div className="mt-2 text-sm">
                    <p>
                      Ми працюємо над наповненням цієї сторінки прикладами
                      палітр та тем. Незабаром тут з&apos;являться готові
                      рішення, які ви зможете використовувати у своїх проектах.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">Завантаження прикладів...</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <svg
                className="mx-auto h-24 w-24 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <h3 className="mt-4 text-xl font-medium text-gray-900">
                Поки що немає доступних прикладів
              </h3>
              <p className="mt-2 text-gray-600">
                Ми працюємо над створенням колекції прикладів палітр та тем.
                Перевірте цю сторінку пізніше.
              </p>
              <div className="mt-6">
                <Link
                  href={ROUTES.WIZARD}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Створити власну палітру
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="text-center mt-8">
          <Link
            href={ROUTES.HOME}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            ← Повернутися на головну
          </Link>
        </div>
      </div>
    </div>
  )
}
