import xss from 'xss';
import { z } from 'zod';
import repository from '../repositories/masterGroupBankRepo';
import {
  BadRequestException,
  NotFoundException,
} from '../utils/http-exception';
import type {
  MasterGroupBankAttributes,
  MasterGroupBankCreationAttributes,
} from '../models/MasterGroupBank';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const isValidUUID = (value: string) => UUID_RE.test(value);

export const MasterGroupBankCreateSchema = z.object({
  group_bank: z
    .string()
    .trim()
    .min(1, 'group_bank wajib diisi')
    .max(10, 'group_bank maksimal 10 karakter')
    .transform(v => xss(v)),
});

export type MasterGroupBankCreateDTO = z.infer<
  typeof MasterGroupBankCreateSchema
>;

export const MasterGroupBankUpdateSchema =
  MasterGroupBankCreateSchema.partial();
export type MasterGroupBankUpdateDTO = z.infer<
  typeof MasterGroupBankUpdateSchema
>;

export class MasterGroupBankService {
  async findAll(): Promise<MasterGroupBankAttributes[]> {
    return repository.findAll();
  }

  async findById(id: string): Promise<MasterGroupBankAttributes> {
    if (!isValidUUID(id)) throw new BadRequestException('ID tidak valid');
    const data = await repository.findById(id);
    if (!data) throw new NotFoundException('Data tidak ditemukan');
    return data;
  }

  async create(payload: unknown): Promise<MasterGroupBankAttributes> {
    const parsed = MasterGroupBankCreateSchema.safeParse(payload);
    if (!parsed.success) {
      throw new BadRequestException(
        parsed.error.issues.map(issue => issue.message).join(', ')
      );
    }

    const toCreate: MasterGroupBankCreationAttributes = {
      group_bank: parsed.data.group_bank,
    };

    return repository.create(toCreate);
  }

  async update(
    id: string,
    payload: unknown
  ): Promise<MasterGroupBankAttributes> {
    if (!isValidUUID(id)) throw new BadRequestException('ID tidak valid');

    const parsed = MasterGroupBankUpdateSchema.safeParse(payload);
    if (!parsed.success) {
      throw new BadRequestException(
        parsed.error.issues.map(issue => issue.message).join(', ')
      );
    }

    const updated = await repository.update(id, parsed.data);
    if (!updated) throw new NotFoundException('Data tidak ditemukan');
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    if (!isValidUUID(id)) throw new BadRequestException('ID tidak valid');
    const deleted = await repository.delete(id);
    if (!deleted) throw new NotFoundException('Data tidak ditemukan');
    return deleted;
  }
}
