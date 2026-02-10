// types/clerk.ts
export interface ClerkAuthPayload {
  sub: string;
  email?: string;
  email_address?: { email_address: string }[]; // <-- pastikan ini array objek
}
