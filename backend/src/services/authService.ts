// services/authService.ts
import { userRepository } from '../repositories/userRepository';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';

export interface LoginResponse {
  token: string;
  user: { id: number; email: string };
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

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    return { token, user: { id: user.id, email: user.email } };
  }
}

export const authService = new AuthService();
