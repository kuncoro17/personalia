// services/authService.ts
import { userRepository } from '../repositories/userRepository';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';

export interface LoginResponse {
  token: string;
  user: { id: string; email: string };
}

export class AuthService {
  async register(email: string): Promise<User> {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) throw new Error('Email sudah terdaftar');

    return await userRepository.createUser({ email });
  }

  async login(email: string): Promise<LoginResponse> {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new Error('Email tidak ditemukan');

    const userId = user.get('id');
    const userEmail = user.get('email');
    if (typeof userId !== 'string' || typeof userEmail !== 'string') {
      throw new Error(
        'Data user tidak lengkap (id/email kosong). Cek kolom tabel users dan mapping model User.'
      );
    }

    const token = jwt.sign(
      { id: userId, email: userEmail },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    return { token, user: { id: userId, email: userEmail } };
  }
}

export const authService = new AuthService();
