import { Context } from 'hono';
import HistoryService from '../services/HistoryServices';

const service = new HistoryService();

export const createHistory = async (c: Context) => {
  try {
    const body = await c.req.json();
    const data = await service.createHistory(body);

    return c.json({ success: true, message: 'Berhasil membuat riwayat', data });
  } catch (e) {
    return c.json(
      { success: false, message: 'Gagal membuat riwayat', error: e },
      500
    );
  }
};

export const getAllHistory = async (c: Context) => {
  const data = await service.getAllHistory();
  return c.json({ success: true, data });
};

export const getHistoryById = async (c: Context) => {
  const id = c.req.param('id');
  const data = await service.getHistoryById(id);

  if (!data)
    return c.json({ success: false, message: 'Data tidak ditemukan' }, 404);

  return c.json({ success: true, data });
};

export const updateHistory = async (c: Context) => {
  const id = c.req.param('id');
  const body = await c.req.json();

  await service.updateHistory(id, body);

  return c.json({ success: true, message: 'Berhasil update data' });
};

export const deleteHistory = async (c: Context) => {
  const id = c.req.param('id');

  await service.deleteHistory(id);

  return c.json({ success: true, message: 'Berhasil hapus data' });
};
