import {
  BadGatewayException,
  GatewayTimeoutException,
} from '../utils/http-exception';

// src/services/servicephp.ts
export class PresensiService {
  static async getLatest(userid: string) {
    const url = `https://plims.bpkpenaburjakarta.or.id/presensi/absensi/latest?userid=${encodeURIComponent(userid)}`;

    let res: Response;

    try {
      res = await fetch(url, {
        method: 'GET',
        headers: {
          'X-API-KEY': process.env.PERSONALIA_API_KEY!, // API key PHP
          Accept: 'application/json',
        },
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown upstream error';
      throw new GatewayTimeoutException(
        `Gagal menghubungi PHP API presensi: ${message}`
      );
    }

    const text = await res.text();

    if (!res.ok) {
      const detail = text.trim() || `HTTP ${res.status}`;
      throw new BadGatewayException(`PHP API error: ${detail}`);
    }

    if (!text.trim()) {
      throw new BadGatewayException('PHP API mengembalikan body kosong');
    }

    try {
      return JSON.parse(text);
    } catch {
      throw new BadGatewayException(
        'PHP API mengembalikan JSON tidak valid atau terpotong'
      );
    }
  }
}
