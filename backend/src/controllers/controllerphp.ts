// src/controllers/controllerphp.ts
import { Context } from 'hono';
import { PresensiService } from '../services/servicephp';

export const getPresensi = async (c: Context) => {
  const userid = c.req.query('userid')?.trim();

  if (!userid) {
    return c.json({ success: false, message: 'userid wajib diisi' }, 400);
  }

  try {
    const response = await PresensiService.getLatest(userid);
    return c.json(response);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Gagal mengambil data presensi';

    return c.json({ success: false, message }, 500);
  }
};
