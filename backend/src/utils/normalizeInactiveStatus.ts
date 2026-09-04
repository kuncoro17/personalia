import { ParsedBody } from '../types/ParsedBody';

const toBoolean = (value: ParsedBody[string]): boolean =>
  value === true || value === 1 || String(value).toLowerCase() === 'true';

export const normalizeInactiveStatus = (input: ParsedBody): ParsedBody => {
  const normalized = { ...input };
  const hasInactiveFlag = Object.prototype.hasOwnProperty.call(
    normalized,
    'flag_inactive'
  );

  if (hasInactiveFlag) {
    const isInactive = toBoolean(normalized.flag_inactive);
    normalized.status_aktif = isInactive ? 'Tidak Aktif' : 'Aktif';

    if (!isInactive) normalized.tanggal_inactive = null;
    delete normalized.flag_inactive;
  } else if (
    typeof normalized.tanggal_inactive === 'string' &&
    normalized.tanggal_inactive.trim()
  ) {
    normalized.status_aktif = 'Tidak Aktif';
  }

  return normalized;
};
