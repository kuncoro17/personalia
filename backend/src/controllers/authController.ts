// controllers/authController.ts
import { Context } from 'hono';
import { authService } from '../services/authService';
import {
  ok,
  created,
  badRequest,
  unauthorized,
} from '../utils/response.helper';
import { z, ZodError } from 'zod';

const emailSchema = z.object({
  email: z.string().email('Format email tidak valid'),
});

export const register = async (c: Context): Promise<Response> => {
  try {
    const body = await c.req.json();
    const { email } = emailSchema.parse(body);

    const user = await authService.register(email);

    return created(c, user, 'User created successfully');
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      return badRequest(c, 'Validasi email gagal', err.issues);
    }
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    return unauthorized(c, errorMsg);
  }
};

export const login = async (c: Context): Promise<Response> => {
  try {
    const body = await c.req.json();
    const { email } = emailSchema.parse(body);

    const { token, user } = await authService.login(email);
    return ok(c, { token, user }, 'Login berhasil');
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      return badRequest(c, 'Validasi email gagal', err.issues);
    }
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    return unauthorized(c, errorMsg);
  }
};
