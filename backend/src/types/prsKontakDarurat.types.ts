export interface PrsKontakDaruratCreateInput {
  karyawan_id: string;
  nama_kondar: string;
  telp_darurat?: string | null;
  email?: string | null;
  kategori_kontak?: string | null;
  no_hp?: string | null;
  hubungan_kondar?: string | null;
  alamat_kondar?: string | null;
}
