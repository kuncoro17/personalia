// types/clerk.ts
export interface ClerkAuthPayload {
  sub: string;
  email?: string;
  email_address?: string | { email_address?: string; emailAddress?: string }[];
  email_addresses?: Array<
    string | { email_address?: string; emailAddress?: string }
  >;
  emailAddresses?: Array<
    string | { email_address?: string; emailAddress?: string }
  >;
  id_master_setempat?: number | string;
  publicMetadata?: { id_master_setempat?: number | string };
  public_metadata?: { id_master_setempat?: number | string };
  unsafeMetadata?: { id_master_setempat?: number | string };
  unsafe_metadata?: { id_master_setempat?: number | string };
  privateMetadata?: { id_master_setempat?: number | string };
  private_metadata?: { id_master_setempat?: number | string };
  metadata?: { id_master_setempat?: number | string };
}
