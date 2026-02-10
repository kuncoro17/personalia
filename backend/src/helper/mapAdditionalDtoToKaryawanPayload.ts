import { AdditionalDTO } from '../types/AdditionalDTO';
import { KaryawanAttributes } from '../models/PrsKaryawanModel';

const parseDate = (value?: string): Date | undefined => {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
};

export const mapAdditionalDtoToKaryawanPayload = (
  dto: Partial<AdditionalDTO>
): Partial<KaryawanAttributes> => ({
  gol_darah: dto.gol_darah,
  tempat_lahir: dto.tempat_lahir,
  gender: dto.gender,
  birth_date: parseDate(dto.birth_date),
  kewarganegaraan: dto.kewarganegaraan,
  instagram: dto.instagram,
  twitter: dto.twitter,
  no_kitas: dto.no_kitas,
  no_visa: dto.no_visa,
  no_tabita: dto.no_tabita,
  npwp: dto.npwp,
  rekening: dto.rekening,
  kode_golongan: dto.kode_golongan,
  no_bpjs_ketenagakerjaan: dto.no_bpjs_ketenagakerjaan,
  no_bpjs_danpes: dto.no_bpjs_danpes,
  nama_bpjs_danpes: dto.nama_bpjs_danpes,
  no_pasport: dto.no_pasport,
});
