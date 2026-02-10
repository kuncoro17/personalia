// utils/getCurrentUser.ts
import type { ClerkAuthPayload } from '../types/clerk';

export const getCurrentUser = (payload: ClerkAuthPayload) => {
  // Ambil email utama dari Clerk (kadang di array email_addresses)
  const email =
    payload.email_address?.[0]?.email_address || // kalau ada array email
    (typeof payload.email === 'string' ? payload.email : undefined); // fallback

  return {
    id: payload.sub, // sub dari JWT Clerk
    email: email,
  };
};
