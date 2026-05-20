const DIGITS = [
  'nol',
  'satu',
  'dua',
  'tiga',
  'empat',
  'lima',
  'enam',
  'tujuh',
  'delapan',
  'sembilan',
] as const;

const trimSpaces = (value: string) => value.trim().replace(/\s+/g, ' ');

const terbilangUnderThousand = (n: bigint): string => {
  if (n < 0n || n >= 1000n) {
    throw new Error('terbilangUnderThousand expects 0..999');
  }
  if (n === 0n) return 'nol';

  const parts: string[] = [];
  const hundreds = n / 100n;
  const rest = n % 100n;

  if (hundreds > 0n) {
    if (hundreds === 1n) parts.push('seratus');
    else parts.push(`${DIGITS[Number(hundreds)]} ratus`);
  }

  if (rest > 0n) {
    if (rest < 10n) {
      parts.push(DIGITS[Number(rest)]);
    } else if (rest === 10n) {
      parts.push('sepuluh');
    } else if (rest === 11n) {
      parts.push('sebelas');
    } else if (rest < 20n) {
      parts.push(`${DIGITS[Number(rest - 10n)]} belas`);
    } else {
      const tens = rest / 10n;
      const ones = rest % 10n;
      parts.push(`${DIGITS[Number(tens)]} puluh`);
      if (ones > 0n) parts.push(DIGITS[Number(ones)]);
    }
  }

  return trimSpaces(parts.join(' '));
};

const UNITS: Array<{ value: bigint; label: string }> = [
  { value: 1000000000000000n, label: 'kuadriliun' },
  { value: 1000000000000n, label: 'triliun' },
  { value: 1000000000n, label: 'miliar' },
  { value: 1000000n, label: 'juta' },
  { value: 1000n, label: 'ribu' },
];

const terbilang = (n: bigint): string => {
  if (n === 0n) return 'nol';
  if (n < 0n) return `minus ${terbilang(-n)}`;

  const parts: string[] = [];
  let remaining = n;

  for (const unit of UNITS) {
    if (remaining < unit.value) continue;
    const chunk = remaining / unit.value;
    remaining = remaining % unit.value;

    if (unit.label === 'ribu' && chunk === 1n) {
      parts.push('seribu');
      continue;
    }

    parts.push(`${terbilang(chunk)} ${unit.label}`);
  }

  if (remaining > 0n) {
    parts.push(terbilangUnderThousand(remaining));
  }

  return trimSpaces(parts.join(' '));
};

export const terbilangRupiah = (value: string | bigint | number): string => {
  const asString =
    typeof value === 'bigint'
      ? value.toString()
      : typeof value === 'number'
        ? String(Math.trunc(value))
        : value;

  const normalized = asString.trim();
  if (!/^-?\d+$/.test(normalized)) {
    throw new Error('jumlah harus berupa integer');
  }

  const amount = BigInt(normalized);
  return `${terbilang(amount)} rupiah`;
};

