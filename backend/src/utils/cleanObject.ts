export function cleanObject<T extends Record<string, unknown>>(
  obj?: Partial<T>
): Partial<T> | undefined {
  if (!obj) return undefined;

  const result: Partial<T> = {};

  for (const key in obj) {
    if (obj[key] !== undefined) {
      result[key] = obj[key];
    }
  }

  return result;
}
