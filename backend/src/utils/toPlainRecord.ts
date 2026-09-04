/**
 * Konversi instance Sequelize (atau objek biasa) menjadi plain object
 * yang bisa diakses dengan index signature [key: string].
 *
 * ✅ Aman terhadap tipe (type-safe)
 * ✅ Tidak memunculkan warning "Conversion may be a mistake"
 */

export interface PlainRecord {
  [key: string]: string | number | boolean | null | undefined;
}

export const toPlainRecord = (input: unknown): PlainRecord => {
  if (typeof input === 'object' && input !== null) {
    const maybeHasToJSON = input as { toJSON?: () => unknown };
    if (typeof maybeHasToJSON.toJSON === 'function') {
      const json = maybeHasToJSON.toJSON();
      return (json as PlainRecord) ?? {};
    }
    return input as PlainRecord;
  }
  return {};
};
