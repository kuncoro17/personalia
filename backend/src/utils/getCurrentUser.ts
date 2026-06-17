// utils/getCurrentUser.ts
import type { ClerkAuthPayload } from '../types/clerk';

const extractEmailFromUnknown = (value: unknown): string | undefined => {
  if (typeof value === 'string') {
    const email = value.trim();
    return email.includes('@') ? email : undefined;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const email = extractEmailFromUnknown(item);
      if (email) return email;
    }
    return undefined;
  }

  if (!value || typeof value !== 'object') return undefined;

  const record = value as Record<string, unknown>;
  return (
    extractEmailFromUnknown(record.email) ||
    extractEmailFromUnknown(record.email_address) ||
    extractEmailFromUnknown(record.emailAddress)
  );
};

export const getCurrentUser = (payload: ClerkAuthPayload) => {
  // Ambil email utama dari Clerk (kadang di array email_addresses)
  const email = extractEmailFromUnknown(payload);

  return {
    id: payload.sub, // sub dari JWT Clerk
    email: email,
  };
};
