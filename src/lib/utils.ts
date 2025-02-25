/**
 * Утиліти для генерації унікальних ідентифікаторів
 */

/**
 * Генерує UUID, сумісний з браузером
 * Використовує Web Crypto API, якщо доступно, або Math.random() як запасний варіант
 */
export function generateUUID(): string {
  // Використовуємо Web Crypto API, якщо доступно
  if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  
  // Запасний варіант з використанням Math.random()
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
} 