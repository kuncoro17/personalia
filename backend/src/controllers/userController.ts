import { Context } from 'hono';
import { z, ZodError } from 'zod';
import { badRequest, created } from '../utils/response.helper';
import { userService } from '../services/userService';

const createUserSchema = z.object({
  id: z.string().uuid().optional(),
  email: z.string().email('Format email tidak valid'),
  name: z.string().trim().min(1).nullable().optional(),
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
