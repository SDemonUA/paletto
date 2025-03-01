'use client'

import RangeInput from './RangeInput'

interface ContrastLevelPickerProps {
  value: number
  onChange: (value: number) => void
}

export default function ContrastLevelPicker({
  value,
  onChange,
}: ContrastLevelPickerProps) {
  // Функція для отримання опису рівня контрасту
  const getContrastDescription = (level: number): string => {
    if (level < 2) return 'Низький (не рекомендується)'
    if (level < 3) return 'Середній'
    if (level < 4.5) return 'Хороший'
    if (level < 7) return 'Високий (AA)'
    return 'Дуже високий (AAA)'
  }

  const helpContent = (
    <ul className="mt-2 list-disc pl-5 space-y-1">
      <li>Рівень 3.0 або вище рекомендується для основного тексту</li>
      <li>Рівень 4.5 відповідає стандарту доступності AA</li>
      <li>Рівень 7.0 відповідає стандарту доступності AAA</li>
    </ul>
  )

  return (
    <RangeInput
      value={value}
      onChange={onChange}
      min={1}
      max={7}
      step={0.1}
      label="Рівень контрасту"
      leftLabel="Низький"
      centerLabel="Середній"
      rightLabel="Високий"
      getValueDescription={getContrastDescription}
      description="Рівень контрасту визначає, наскільки добре текст буде видно на фоні. Вищий рівень контрасту покращує читабельність, але може обмежити вибір кольорів."
      helpContent={helpContent}
    />
  )
}
