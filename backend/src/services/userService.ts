import User from '../models/userModel';
import { userRepository } from '../repositories/userRepository';
import { Op } from 'sequelize';

export interface CreateUserInput {
  id?: string;
  email: string;
  name?: string | null;
}

export interface ListUsersQuery {
  q?: string;
  limit?: number;
  offset?: number;
}

export class UserService {
  async createUser(input: CreateUserInput): Promise<User> {
    const existingUser = await userRepository.findByEmail(input.email);
    if (existingUser) throw new Error('Email sudah terdaftar');

    return userRepository.createUser({
      id: input.id,
      email: input.email,
      name: input.name?.trim() || input.email,
    });
  }

  async listUsers(query: ListUsersQuery): Promise<{
    items: User[];
    total: number;
    limit: number;
    offset: number;
  }> {
    const limit = query.limit ?? 50;
    const offset = query.offset ?? 0;
    const q = query.q?.trim();

    const where = q
      ? {
          [Op.or]: [
            { email: { [Op.iLike]: `%${q}%` } },
            { name: { [Op.iLike]: `%${q}%` } },
          ],
        }
      : undefined;

    const { rows, count } = await User.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      limit,
      offset,
    });

    return {
      items: rows,
      total: count,
      limit,
      offset,
    };
  }
}

export const userService = new UserService();
