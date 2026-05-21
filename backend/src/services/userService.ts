import User from '../models/userModel';
import { userRepository } from '../repositories/userRepository';

export interface CreateUserInput {
  id?: string;
  email: string;
  name?: string | null;
}

export class UserService {
  async createUser(input: CreateUserInput): Promise<User> {
    const existingUser = await userRepository.findByEmail(input.email);
    if (existingUser) throw new Error('Email sudah terdaftar');

    return userRepository.createUser({
      id: input.id,
      email: input.email,
      name: input.name ?? null,
    });
  }
}

export const userService = new UserService();
