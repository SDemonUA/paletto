'use client';

/**
 * Генерує UUID v4 (випадковий)
 * Це проста реалізація для використання в браузері без залежності від crypto.randomUUID()
 */
export function generateUUID(): string {
  // Генеруємо випадкові шістнадцяткові цифри
  const getRandomHex = (): string => {
    return Math.floor(Math.random() * 16).toString(16);
  };
  
  // Шаблон для UUID v4
  const template = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
  
  // Замінюємо x та y на випадкові шістнадцяткові цифри
  return template.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
} 