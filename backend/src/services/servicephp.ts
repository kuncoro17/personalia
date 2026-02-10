// src/services/servicephp.ts
export class PresensiService {
  static async getLatest(userid: string) {
    const url = `https://plims.bpkpenaburjakarta.or.id/presensi/absensi/latest?userid=${userid}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'X-API-KEY': process.env.PERSONALIA_API_KEY!, // API key PHP
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`PHP API error: ${text}`);
    }

    return res.json(); // parse JSON dari PHP
  }
}
