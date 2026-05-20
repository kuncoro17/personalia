import xss from 'xss';
import { z } from 'zod';
import repository from '../repositories/masterBankGiroRepo';
import groupBankRepository from '../repositories/masterGroupBankRepo';
import {
  BadRequestException,
  NotFoundException,
} from '../utils/http-exception';
import type {
  MasterBankGiroAttributes,
  MasterBankGiroCreationAttributes,
} from '../models/MasterBankGiro';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const isValidUUID = (value: string) => UUID_RE.test(value);

export const MasterBankGiroCreateSchema = z.object({
  bank_giro: z
    .string()
    .trim()
    .min(1, 'bank_giro wajib diisi')
    .max(10, 'bank_giro maksimal 10 karakter')
    .transform(v => xss(v)),
  id_group_bank: z
    .string()
    .trim()
    .optional()
    .refine(v => (v ? isValidUUID(v) : true), {
      message: 'id_group_bank harus UUID',
    }),
});

export type MasterBankGiroCreateDTO = z.infer<
  typeof MasterBankGiroCreateSchema
>;

export const MasterBankGiroUpdateSchema = MasterBankGiroCreateSchema.partial();
export type MasterBankGiroUpdateDTO = z.infer<
  typeof MasterBankGiroUpdateSchema
>;

export class MasterBankGiroService {
  async findAll(): Promise<MasterBankGiroAttributes[]> {
    return repository.findAll();
  }

  async findById(id_bank_giro: string): Promise<MasterBankGiroAttributes> {
    if (!isValidUUID(id_bank_giro))
      throw new BadRequestException('ID tidak valid');
    const data = await repository.findById(id_bank_giro);
    if (!data) throw new NotFoundException('Data tidak ditemukan');
    return data;
  }

  async create(payload: unknown): Promise<MasterBankGiroAttributes> {
    const parsed = MasterBankGiroCreateSchema.safeParse(payload);
    if (!parsed.success) {
      throw new BadRequestException(
        parsed.error.issues.map(issue => issue.message).join(', ')
      );
    }

    if (parsed.data.id_group_bank) {
      const group = await groupBankRepository.findById(
        parsed.data.id_group_bank
      );
      if (!group) {
        throw new NotFoundException('Group bank tidak ditemukan');
      }
    }

    const toCreate: MasterBankGiroCreationAttributes = {
      bank_giro: parsed.data.bank_giro,
      id_group_bank: parsed.data.id_group_bank ?? null,
    };

    return repository.create(toCreate);
  }

  async update(
    id_bank_giro: string,
    payload: unknown
  ): Promise<MasterBankGiroAttributes> {
    if (!isValidUUID(id_bank_giro))
      throw new BadRequestException('ID tidak valid');

    const parsed = MasterBankGiroUpdateSchema.safeParse(payload);
    if (!parsed.success) {
      throw new BadRequestException(
        parsed.error.issues.map(issue => issue.message).join(', ')
      );
    }

    if (parsed.data.id_group_bank) {
      const group = await groupBankRepository.findById(
        parsed.data.id_group_bank
      );
      if (!group) {
        throw new NotFoundException('Group bank tidak ditemukan');
      }
    }

    const updated = await repository.update(id_bank_giro, {
      ...parsed.data,
      id_group_bank:
        parsed.data.id_group_bank === undefined
          ? undefined
          : (parsed.data.id_group_bank ?? null),
    });

    if (!updated) throw new NotFoundException('Data tidak ditemukan');
    return updated;
  }

  async delete(id_bank_giro: string): Promise<boolean> {
    if (!isValidUUID(id_bank_giro))
      throw new BadRequestException('ID tidak valid');
    const deleted = await repository.delete(id_bank_giro);
    if (!deleted) throw new NotFoundException('Data tidak ditemukan');
    return deleted;
  }
}
