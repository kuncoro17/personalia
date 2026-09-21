import { Context } from 'hono';
import { z, ZodError } from 'zod';
import { badRequest, ok, unauthorized } from '../utils/response.helper';
import { sasAutoLoginService } from '../services/sasAutoLoginService';

const autoLoginSchema = z.object({
  email: z.string().email(),
  timestamp: z.coerce.number().int(),
  nonce: z.string().min(12).max(128),
  signature: z.string().regex(/^[a-f0-9]{64}$/i),
});


const verifySchema = z.object({
  verify_token: z.string().min(32).max(256),
});

export const autoLogin = async (c: Context): Promise<Response> => {
  try {
    const body = await c.req.json();
    const payload = autoLoginSchema.parse(body);
    const result = await sasAutoLoginService.createVerifyToken(payload);

    return ok(c, result, 'Verify token berhasil dibuat');
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      return badRequest(c, 'Payload auto-login tidak valid', err.issues);
    }

    if (err instanceof Error && err.name === 'SAS_USER_NOT_REGISTERED') {
      return c.json(
        {
          success: false,
          code: 'USER_NOT_REGISTERED',
          message: 'User belum terdaftar di sistem personalia',
        },
        404
      );
    }

    const message = err instanceof Error ? err.message : 'Auto-login gagal';
    return unauthorized(c, message);
  }
};

export const verify = async (c: Context): Promise<Response> => {
  try {
    const body = await c.req.json();
    const { verify_token } = verifySchema.parse(body);
    const result = await sasAutoLoginService.verifyToken(verify_token);

    return ok(c, result, 'Verifikasi SAS berhasil');
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      return badRequest(c, 'Verify token tidak valid', err.issues);
    }

    const message = err instanceof Error ? err.message : 'Verifikasi gagal';
    return unauthorized(c, message);
  }
};
