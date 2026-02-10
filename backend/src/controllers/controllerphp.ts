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
    return c.json({ success: false, message: err.message }, 500);
  }
};
