// src/controllers/controllerphp.ts
import { Context } from 'hono';
import { PresensiService } from '../services/servicephp';

export const getPresensi = async (c: Context) => {
  const userid = c.req.query('userid'); // ambil dari query param Node.js

  if (!userid) {
    return c.json({ success: false, message: 'userid wajib diisi' }, 400);
  }

  try {
    const phpResponse = await PresensiService.getLatest(userid);
    return c.json(phpResponse); // kembalikan langsung JSON PHP
  } catch (err: any) {
    const status =
      typeof err?.status === 'number' && err.status >= 100 && err.status <= 599
        ? err.status
        : 500;

    return c.json({ success: false, message: err.message }, status);
  }
};
