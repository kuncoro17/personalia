import { describe, expect, it } from '@jest/globals';

import app from '../../src/server';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

const HTTP_METHODS = new Set<HttpMethod>([
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
]);

const apiRoutes = [
  ...new Set(
    app.routes
      .filter(route => HTTP_METHODS.has(route.method as HttpMethod))
      .map(route => `${route.method} ${route.path}`)
  ),
].sort();

const familyOf = (route: string) => {
  const path = route.split(' ')[1];
  return path.split('/').filter(Boolean)[0] ?? '/';
};

const expectedFamilyCounts: Record<string, number> = {
  '/': 1,
  CutiDiluarTanggungan: 1,
  CutiPanjang: 1,
  SuratKenaikanGolongan: 1,
  SuratPHK: 1,
  SuratPHKById: 1,
  auth: 5,
  bipartit: 1,
  bpjs_ketenagakerjaaan: 1,
  disposisi: 1,
  dok: 1,
  health: 1,
  history2: 5,
  'keu-cg-slip': 5,
  kwt: 1,
  'master-agama': 5,
  'master-alamat': 5,
  'master-bank-giro': 5,
  'master-deputi': 5,
  'master-direktur': 5,
  'master-group-bank': 5,
  'master-kecamatan': 6,
  'master-kelurahan': 6,
  'master-kota': 6,
  'master-mapel': 5,
  'master-provinsi': 5,
  'master-setempat': 5,
  mutasi: 1,
  'openapi.json': 1,
  pengalaman: 5,
  personalia: 83,
  presensi: 1,
  redis: 2,
  'riw-pendidikan-kar': 6,
  'riwayat-pendidikan': 5,
  seksi: 6,
  'status-karyawan': 5,
  surat_kesalahan_berat_pelanggaran: 1,
  surat_keterangan: 1,
  surat_pengunduran_diri: 1,
  'tipe-dokumen': 5,
  tkl: 1,
  ttp: 1,
  'unit-kerja': 7,
  'unit-kerja-karyawan': 6,
  usulan_pengangkatan: 1,
  wtt: 1,
};

const standardCrudResources = [
  '/history2',
  '/keu-cg-slip',
  '/master-direktur',
  '/master-group-bank',
  '/master-bank-giro',
  '/master-kecamatan',
  '/master-kelurahan',
  '/master-kota',
  '/master-provinsi',
  '/master-setempat',
  '/pengalaman',
  '/personalia/bagian',
  '/personalia/divisi',
  '/personalia/keluarga',
  '/personalia/kontrak',
  '/riw-pendidikan-kar',
  '/riwayat-pendidikan',
  '/seksi',
  '/status-karyawan',
  '/tipe-dokumen',
];

describe('kontrak seluruh API', () => {
  it('mendaftarkan 230 kombinasi method dan path unik', () => {
    expect(apiRoutes).toHaveLength(230);
  });

  it('menjaga jumlah endpoint setiap keluarga API', () => {
    const actualCounts = apiRoutes.reduce<Record<string, number>>(
      (counts, route) => {
        const family = familyOf(route);
        counts[family] = (counts[family] ?? 0) + 1;
        return counts;
      },
      {}
    );

    expect(actualCounts).toEqual(expectedFamilyCounts);
  });

  it.each(apiRoutes)('%s memiliki kontrak route yang valid', route => {
    const [method, path] = route.split(' ');

    expect(HTTP_METHODS.has(method as HttpMethod)).toBe(true);
    expect(path).toMatch(/^\//);
    expect(path).not.toMatch(/\s/);
    expect(path).not.toContain('//');
  });

  it.each(standardCrudResources)('%s memiliki operasi CRUD lengkap', path => {
    expect(apiRoutes).toEqual(
      expect.arrayContaining([
        `GET ${path}`,
        `GET ${path}/:id`,
        `POST ${path}`,
        `PUT ${path}/:id`,
        `DELETE ${path}/:id`,
      ])
    );
  });

  it('menjaga endpoint khusus yang digunakan frontend', () => {
    expect(apiRoutes).toEqual(
      expect.arrayContaining([
        'GET /personalia/docs/karyawan/:karyawanId',
        'POST /personalia/docs/upload',
        'PUT /personalia/docs/upload/:id',
        'POST /personalia/attendance/sync',
        'GET /personalia/bagian/divisi/:kode_divisi',
        'GET /personalia/jabatan/getall',
        'GET /master-mapel/GetAllMapel',
        'GET /seksi/bagian/:kode_bagian',
        'GET /unit-kerja/getall',
        'GET /unit-kerja/getllUnitKerja',
        'GET /unit-kerja/getallmaster',
        'GET /personalia/karyawan/getDetailKaryawan/:id',
        'GET /personalia/karyawan/getKaryawanAdditionalById/:id_karyawan',
        'GET /personalia/karyawan/offboarding-today',
        'PUT /personalia/karyawan/additional/:id_karyawan',
      ])
    );
  });
});

describe('endpoint sistem tanpa dependency eksternal', () => {
  it.each(['', '/api'])(
    'Swagger memuat spec dan mengirim request dengan prefix "%s"',
    async prefix => {
      // Simulate the proxy stripping the public prefix before forwarding to Hono.
      const publicDocsUrl = `https://personalia.example${prefix}/dok`;
      const response = await app.request('/dok');
      expect(response.status).toBe(200);
      const html = await response.text();
      const specReference = html.match(/\burl:\s*'([^']+)'/)?.[1];
      expect(specReference).toBe('./openapi.json');

      const specUrl = new URL(specReference!, publicDocsUrl);
      expect(specUrl.pathname).toBe(`${prefix}/openapi.json`);

      const specResponse = await app.request(
        specUrl.pathname.slice(prefix.length)
      );
      expect(specResponse.status).toBe(200);
      expect(specResponse.headers.get('content-type')).toContain(
        'application/json'
      );
      const spec = await specResponse.json();
      expect(spec.openapi).toBe('3.0.0');
      expect(Object.keys(spec.paths).length).toBeGreaterThan(0);
      const serverUrl = new URL(spec.servers[0].url, specUrl);
      expect(serverUrl.pathname).toBe(`${prefix}/`);
      const operationPath = Object.keys(spec.paths)[0];
      expect(new URL(operationPath.slice(1), serverUrl).pathname).toBe(
        `${prefix}${operationPath}`
      );
    }
  );

  it('GET /health mengembalikan status sehat', async () => {
    const response = await app.request('/health');
    const body = (await response.json()) as Record<string, unknown>;

    expect(response.status).toBe(200);
    expect(body.status).toBe('healthy');
    expect(body.timestamp).toEqual(expect.any(String));
    expect(body.uptime).toEqual(expect.any(Number));
  });

  it('OPTIONS mengembalikan header CORS', async () => {
    const response = await app.request('/seksi', {
      method: 'OPTIONS',
      headers: { Origin: 'http://localhost:3002' },
    });

    expect(response.status).toBe(204);
    expect(response.headers.get('access-control-allow-origin')).toBe(
      'http://localhost:3002'
    );
    expect(response.headers.get('access-control-allow-methods')).toContain(
      'DELETE'
    );
  });
});
