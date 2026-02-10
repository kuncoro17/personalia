// src/utils/sanitize.ts
import xss from 'xss';

export function sanitizeObject<T extends Record<string, unknown>>(
  input: T,
  allowedFields: (keyof T)[]
): Partial<T> {
  const sanitized: Partial<T> = {};
  for (const key in input) {
    if (allowedFields.includes(key as keyof T)) {
      const value = input[key as keyof T];
      // Jika string, lakukan xss, tapi cast ke unknown dulu
      sanitized[key as keyof T] =
        typeof value === 'string'
          ? (xss(value) as unknown as T[keyof T])
          : value;
    }
  }
  return sanitized;
}

export function isValidUUID(id: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}
