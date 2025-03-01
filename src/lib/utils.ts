import Color from "colorjs.io";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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

function isColorConstructor(value: unknown): boolean {
  if (value && typeof value === 'object') {
    if ("spaceId" in value && "coords" in value && "alpha" in value) {
      return true
    }
  }
  return false
}

export function serializeWithColor(obj: unknown): string {
  return JSON.stringify(obj, (key, value) => {
    if (value instanceof Color || isColorConstructor(value)) {
      return { __color__: Color.get(value).toString({ format: 'hex' }) };
    }
    
    return value;
  });
}

export function deserializeWithColor(serialized: string): unknown {
  return JSON.parse(serialized, (key, value) => {
    if (value && value.__color__) {
      return new Color(value.__color__);
    }
    return value;
  });
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}