export function unflattenObject<T extends Record<string, unknown>>(
  data: T
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const key in data) {
    const value = data[key];
    const keys = key.split('.');

    let current: Record<string, unknown> = result;
    keys.forEach((k, index) => {
      if (!k) return; // lewati key kosong seperti "provinsi."
      if (index === keys.length - 1) {
        current[k] = value;
      } else {
        if (
          !Object.prototype.hasOwnProperty.call(current, k) ||
          typeof current[k] !== 'object' ||
          current[k] === null
        ) {
          current[k] = {};
        }
        current = current[k] as Record<string, unknown>;
      }
    });
  }

  return result;
}
