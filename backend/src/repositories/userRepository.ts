// repositories/userRepository.ts
import User from '../models/userModel';
import { logError } from '../utils/log.helper'; // asumsi kamu punya ini

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    try {
      return await User.findOne({ where: { email } });
    } catch (err) {
      logError(`Error findByEmail: ${String(err)}`);
      throw new Error('Gagal mencari user');
    }
  }

  async createUser(data: { email: string }): Promise<User> {
    try {
      return await User.create(data);
    } catch (err) {
      logError(`Error createUser: ${String(err)}`);
      throw new Error('Gagal membuat user');
    }
  }
}

export const userRepository = new UserRepository();
