// utils/normalizeRelationalField.ts
export type RelationalValue = string | number | boolean | null | undefined;

export interface RelationalObject {
  id?: string | number | null;
}

export function normalizeRelationalField(
  value: RelationalValue | RelationalObject
): string | undefined {
  if (value === null || value === undefined) return undefined;

  if (typeof value === 'boolean') return undefined; // abaikan boolean

  if (typeof value === 'number') return value.toString(); // ubah number → string

  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed === '' ? undefined : trimmed;
  }

  if (typeof value === 'object' && 'id' in value) {
    return value.id !== null && value.id !== undefined
      ? String(value.id)
      : undefined;
  }

  return undefined;
}
