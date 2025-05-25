import Link from 'next/link'
import { ROUTES } from '../constants'

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12">
      <div className="container">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-indigo-800 mb-6">Paletto</h1>
          <p className="text-xl text-gray-700 mb-8">
            Потужний інструмент для створення, редагування та попереднього
            перегляду кольорових палітр та налаштувань UI
          </p>

          <div className="mb-8">
            <div className="inline-block bg-amber-100 border border-amber-400 text-amber-800 px-4 py-2 rounded-lg">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">Проект у розробці</span>
              </div>
              <p className="text-sm mt-1">
                Ми активно працюємо над покращенням функціоналу. Деякі
                можливості можуть бути недоступні.
              </p>
            </div>
          </div>

          <div className="flex justify-center space-x-4 mb-12">
            <Link
              href={ROUTES.WIZARD}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
            >
              Створити палітру
            </Link>
            <Link
              href="/wizard-2"
              className="px-6 py-3 bg-white text-indigo-600 border border-indigo-600 rounded-lg shadow-md hover:bg-indigo-50 transition-colors"
            >
              Майстер 2.0
            </Link>
            <Link
              href={ROUTES.BROWSE}
              className="px-6 py-3 bg-white text-indigo-600 border border-indigo-600 rounded-lg shadow-md hover:bg-indigo-50 transition-colors"
            >
              Переглянути приклади
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          <FeatureCard
            title="Генерація палітр"
            description="Створюйте гармонійні кольорові палітри за допомогою різних стратегій та алгоритмів"
            icon="🎨"
          />
          <FeatureCard
            title="Налаштування UI"
            description="Налаштовуйте параметри UI фреймворків для ідеального вигляду вашого проекту"
            icon="⚙️"
          />
          <FeatureCard
            title="Попередній перегляд"
            description="Миттєво переглядайте, як ваша палітра виглядатиме в реальному інтерфейсі"
            icon="👁️"
          />
          <FeatureCard
            title="Експорт конфігурацій"
            description="Експортуйте налаштування для популярних UI фреймворків та інструментів"
            icon="📤"
          />
          <FeatureCard
            title="Перевірка доступності"
            description="Тестуйте кольорові комбінації на відповідність стандартам доступності (A11Y)"
            icon="✓"
          />
          <FeatureCard
            title="Майбутні можливості"
            description="Збереження, обмін палітрами, розширення для браузера та багато іншого"
            icon="🚀"
          />
        </div>

        {/* Технології */}
        <div className="mt-16 bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-6 text-center">
            Технології використані у проекті
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <TechCard name="Next.js" icon="🔺" url="https://nextjs.org/" />
            <TechCard name="React" icon="⚛️" url="https://react.dev/" />
            <TechCard
              name="Tailwind CSS"
              icon="🌊"
              url="https://tailwindcss.com/"
            />
            <TechCard name="colorjs.io" icon="🌈" url="https://colorjs.io/" />
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-6">
            Готові розпочати?
          </h2>
          <Link
            href={ROUTES.WIZARD}
            className="px-8 py-4 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition-colors text-lg font-medium"
          >
            Створити свою першу палітру
          </Link>
        </div>
      </div>
    </div>
  )
}

interface FeatureCardProps {
  title: string
  description: string
  icon: string
}

function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-indigo-700 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

interface TechCardProps {
  name: string
  icon: string
  url: string
}

function TechCard({ name, url, icon }: TechCardProps) {
  return (
    <a
      href={url}
      className="flex flex-col items-center justify-center p-4 rounded-lg hover:bg-indigo-50 transition-colors"
    >
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-sm font-medium text-gray-800">{name}</div>
    </a>
  )
}
