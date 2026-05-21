import { Context } from 'hono';
import { z, ZodError } from 'zod';
import { badRequest, created, ok } from '../utils/response.helper';
import { userService } from '../services/userService';

const createUserSchema = z.object({
  id: z.string().uuid().optional(),
  email: z.string().email('Format email tidak valid'),
  name: z.string().trim().min(1).nullable().optional(),
});

const listUsersQuerySchema = z.object({
  q: z.string().trim().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(200).optional(),
  offset: z.coerce.number().int().min(0).optional(),
});

export const createUser = async (c: Context): Promise<Response> => {
  try {
    const body = await c.req.json();
    const payload = createUserSchema.parse(body);

    const user = await userService.createUser(payload);
    const plain = user.toJSON ? user.toJSON() : user;

    return created(c, plain, 'User created successfully');
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      return badRequest(c, 'Validasi user gagal', err.issues);
    }

    const message = err instanceof Error ? err.message : 'Unknown error';
    return badRequest(c, message, { message });
  }
};

export const listUsers = async (c: Context): Promise<Response> => {
  try {
    const query = listUsersQuerySchema.parse(c.req.query());
    const data = await userService.listUsers(query);
    return ok(c, data, 'Berhasil mengambil data users');
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      return badRequest(c, 'Validasi query gagal', err.issues);
    }
    const message = err instanceof Error ? err.message : 'Unknown error';
    return badRequest(c, message, { message });
  }
};
