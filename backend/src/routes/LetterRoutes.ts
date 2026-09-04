import { z } from 'zod';

import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import {
  getSuratKaryawanTTP,
  getSuratKaryawanKWT,
  getDisposisi,
  getSuratKaryawanTKL,
  getSuratKaryawanWTT,
  SuratBeritaAcaraBIPARTIT,
  CutiPanjang,
  SuratPHKbyId,
  SuratPHK,
  CutiDiLuarTangguangan,
  Mutasi,
  getSuratKeputusanKenaikanGolongan,
  usulan_pengangkatan,
  surat_kesalahan_berat_pelanggaran,
  // surat_kesepakatan_bersama,
  BPJS_Ketenagakerjaan,
  surat_keterangan,
  pengunduran_diri,
  // surat_penempatan,
} from '../controllers/LettersController';

import { clerkAuthMiddleware } from '../middlewares/clerkAuth';

export const LetterRoutes = (app: OpenAPIHono) => {
  app.use('*', clerkAuthMiddleware);

  app.openapi(
    createRoute({
      method: 'get',
      path: '/ttp/{id}',
      summary: 'Ambil data Surat Karyawan TTP',
      description:
        'Mengambil data lengkap karyawan dengan status TTP berdasarkan ID.',
      tags: ['Surat Karyawan'],
      request: {
        params: z.object({
          id: z.string().uuid().openapi({
            example: '4e1b1ab7-9c13-4f8a-b65b-0c6f2c28d9d3',
            description: 'ID karyawan (UUID)',
          }),
        }),
      },
      responses: {
        200: {
          description: 'Berhasil mendapatkan data surat karyawan TTP',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
                data: z.any(), // Bisa diganti schema detail jika ingin lebih strict
              }),
            },
          },
        },
        404: { description: 'Data karyawan tidak ditemukan' },
        400: { description: 'Parameter tidak valid' },
      },
    }),
    getSuratKaryawanTTP
  );

  app.openapi(
    createRoute({
      method: 'get',
      path: '/kwt/{id}',
      summary: 'Ambil data Surat Karyawan KWT',
      description:
        'Mengambil data lengkap karyawan dengan status KWT berdasarkan ID.',
      tags: ['Surat Karyawan'],
      request: {
        params: z.object({
          id: z.string().uuid().openapi({
            example: '4e1b1ab7-9c13-4f8a-b65b-0c6f2c28d9d3',
            description: 'ID karyawan (UUID)',
          }),
        }),
      },
      responses: {
        200: {
          description: 'Berhasil mendapatkan data surat karyawan KWT',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
                data: z.any(), // Bisa diganti schema detail jika ingin lebih strict
              }),
            },
          },
        },
        404: { description: 'Data karyawan tidak ditemukan' },
        400: { description: 'Parameter tidak valid' },
      },
    }),
    getSuratKaryawanKWT
  );
  app.openapi(
    createRoute({
      method: 'get',
      path: '/disposisi/{id}',
      summary: 'Ambil data Surat Disposisi',
      description:
        'Mengambil data disposisi karyawan berdasarkan ID dengan struktur data KWT.',
      tags: ['Surat Karyawan'],
      request: {
        params: z.object({
          id: z.string().uuid().openapi({
            example: '4e1b1ab7-9c13-4f8a-b65b-0c6f2c28d9d3',
            description: 'ID karyawan (UUID)',
          }),
        }),
      },
      responses: {
        200: {
          description: 'Berhasil mendapatkan data surat disposisi',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
                data: z.any(),
              }),
            },
          },
        },
        404: { description: 'Data karyawan tidak ditemukan' },
        400: { description: 'Parameter tidak valid' },
      },
    }),
    getDisposisi
  );
  app.openapi(
    createRoute({
      method: 'get',
      path: '/tkl/{id}',
      summary: 'Ambil data Surat Karyawan TKL',
      description:
        'Mengambil data lengkap karyawan dengan status TKL berdasarkan ID.',
      tags: ['Surat Karyawan'],
      request: {
        params: z.object({
          id: z.string().uuid().openapi({
            example: '4e1b1ab7-9c13-4f8a-b65b-0c6f2c28d9d3',
            description: 'ID karyawan (UUID)',
          }),
        }),
      },
      responses: {
        200: {
          description: 'Berhasil mendapatkan data surat karyawan TKL',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
                data: z.any(), // Bisa diganti schema detail jika ingin lebih strict
              }),
            },
          },
        },
        404: { description: 'Data karyawan tidak ditemukan' },
        400: { description: 'Parameter tidak valid' },
      },
    }),
    getSuratKaryawanTKL
  );
  app.openapi(
    createRoute({
      method: 'get',
      path: '/wtt/{id}',
      summary: 'Ambil data Surat Karyawan WTT',
      description:
        'Mengambil data lengkap karyawan dengan status WTT berdasarkan ID.',
      tags: ['Surat Karyawan'],
      request: {
        params: z.object({
          id: z.string().uuid().openapi({
            example: '4e1b1ab7-9c13-4f8a-b65b-0c6f2c28d9d3',
            description: 'ID karyawan (UUID)',
          }),
        }),
      },
      responses: {
        200: {
          description: 'Berhasil mendapatkan data surat karyawan WTT',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
                data: z.any(), // Bisa diganti schema detail jika ingin lebih strict
              }),
            },
          },
        },
        404: { description: 'Data karyawan tidak ditemukan' },
        400: { description: 'Parameter tidak valid' },
      },
    }),
    getSuratKaryawanWTT
  );
  app.openapi(
    createRoute({
      method: 'get',
      path: '/wtt/{id}',
      summary: 'Ambil data Surat Karyawan WTT',
      description:
        'Mengambil data lengkap karyawan dengan status WTT berdasarkan ID.',
      tags: ['Surat Karyawan'],
      request: {
        params: z.object({
          id: z.string().uuid().openapi({
            example: '4e1b1ab7-9c13-4f8a-b65b-0c6f2c28d9d3',
            description: 'ID karyawan (UUID)',
          }),
        }),
      },
      responses: {
        200: {
          description: 'Berhasil mendapatkan data surat karyawan WTT',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
                data: z.any(), // Bisa diganti schema detail jika ingin lebih strict
              }),
            },
          },
        },
        404: { description: 'Data karyawan tidak ditemukan' },
        400: { description: 'Parameter tidak valid' },
      },
    }),
    getSuratKaryawanWTT
  );
  app.openapi(
    createRoute({
      method: 'get',
      path: '/bipartit/{id}',
      summary: 'Ambil data Surat Karyawan bipartit',
      description: 'Mengambil data lengkap karyawan berdasarkan ID.',
      tags: ['Surat Karyawan'],
      request: {
        params: z.object({
          id: z.string().uuid().openapi({
            example: '4e1b1ab7-9c13-4f8a-b65b-0c6f2c28d9d3',
            description: 'ID karyawan (UUID)',
          }),
        }),
      },
      responses: {
        200: {
          description: 'Berhasil mendapatkan data surat karyawan',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
                data: z.any(), // Bisa diganti schema detail jika ingin lebih strict
              }),
            },
          },
        },
        404: { description: 'Data karyawan tidak ditemukan' },
        400: { description: 'Parameter tidak valid' },
      },
    }),
    SuratBeritaAcaraBIPARTIT
  );
  app.openapi(
    createRoute({
      method: 'get',
      path: '/CutiPanjang/{id}',
      summary: 'Ambil data Surat Karyawan bipartit',
      description: 'Mengambil data lengkap karyawan berdasarkan ID.',
      tags: ['Surat Karyawan'],
      request: {
        params: z.object({
          id: z.string().uuid().openapi({
            example: '4e1b1ab7-9c13-4f8a-b65b-0c6f2c28d9d3',
            description: 'ID karyawan (UUID)',
          }),
        }),
      },
      responses: {
        200: {
          description: 'Berhasil mendapatkan data surat karyawan',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
                data: z.any(), // Bisa diganti schema detail jika ingin lebih strict
              }),
            },
          },
        },
        404: { description: 'Data karyawan tidak ditemukan' },
        400: { description: 'Parameter tidak valid' },
      },
    }),
    CutiPanjang
  );
  app.openapi(
    createRoute({
      method: 'get',
      path: '/SuratPHKById/{id}',
      summary: 'Ambil data Surat Karyawan bipartit',
      description: 'Mengambil data lengkap karyawan berdasarkan ID.',
      tags: ['Surat Karyawan'],
      request: {
        params: z.object({
          id: z.string().uuid().openapi({
            example: '4e1b1ab7-9c13-4f8a-b65b-0c6f2c28d9d3',
            description: 'ID karyawan (UUID)',
          }),
        }),
      },
      responses: {
        200: {
          description: 'Berhasil mendapatkan data surat karyawan',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
                data: z.any(), // Bisa diganti schema detail jika ingin lebih strict
              }),
            },
          },
        },
        404: { description: 'Data karyawan tidak ditemukan' },
        400: { description: 'Parameter tidak valid' },
      },
    }),
    SuratPHKbyId
  );
  app.openapi(
    createRoute({
      method: 'get',
      path: '/SuratPHK',
      summary: 'Ambil data Surat Karyawan bipartit (PHK / Mengundurkan Diri)',
      description:
        'Mengambil semua karyawan dengan alasan berhenti Mengundurkan Diri atau PHK.',
      tags: ['Surat Karyawan'],
      responses: {
        200: {
          description: 'Berhasil mendapatkan data',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
                data: z.array(z.any()),
              }),
            },
          },
        },
        404: { description: 'Data tidak ditemukan' },
        500: { description: 'Server error' },
      },
    }),
    SuratPHK
  );

  app.openapi(
    createRoute({
      method: 'get',
      path: '/CutiDiluarTanggungan/{id}',
      summary: 'Ambil data Surat Karyawan Cuti',
      description:
        'Mengambil data karyawan yang sedang Cuti di Luar Tanggungan.',
      tags: ['Surat Karyawan'],

      request: {
        params: z.object({
          id: z.string().uuid().openapi({
            example: '5a59e0f4-06dc-4491-97ed-18384522e20b',
            description: 'ID karyawan (UUID)',
          }),
        }),
      },

      responses: {
        200: {
          description: 'Berhasil mendapatkan data surat cuti karyawan',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean().openapi({ example: true }),
                message: z
                  .string()
                  .openapi({ example: 'Data berhasil diambil' }),
              }),
            },
          },
        },

        404: {
          description: 'Data tidak ditemukan',
        },

        500: {
          description: 'Server error',
        },
      },
    }),
    CutiDiLuarTangguangan
  );
  app.openapi(
    createRoute({
      method: 'get',
      path: '/mutasi/{id}',
      summary: 'Ambil data Surat Karyawan Mutasi',
      description: 'Mengambil data karyawan yang mutasi.',
      tags: ['Surat Karyawan'],

      request: {
        params: z.object({
          id: z.string().uuid().openapi({
            example: '5a59e0f4-06dc-4491-97ed-18384522e20b',
            description: 'ID karyawan (UUID)',
          }),
        }),
      },

      responses: {
        200: {
          description: 'Berhasil mendapatkan data surat mutasi karyawan',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean().openapi({ example: true }),
                message: z
                  .string()
                  .openapi({ example: 'Data berhasil diambil' }),
              }),
            },
          },
        },

        404: {
          description: 'Data tidak ditemukan',
        },

        500: {
          description: 'Server error',
        },
      },
    }),
    Mutasi
  );
  app.openapi(
    createRoute({
      method: 'get',
      path: '/SuratKenaikanGolongan/{id}',
      summary: 'Ambil Surat Keputusan Kenaikan Golongan',
      description: 'Mengambil data lengkap SK Kenaikan Golongan karyawan.',
      tags: ['Surat Karyawan'],
      request: {
        params: z.object({
          id: z.string().uuid(),
        }),
      },
      responses: {
        200: {
          description: 'Berhasil mengambil SK',
        },
        404: { description: 'Data tidak ditemukan' },
      },
    }),
    getSuratKeputusanKenaikanGolongan
  );

  app.openapi(
    createRoute({
      method: 'get',
      path: '/usulan_pengangkatan/{id}',
      summary: 'Ambil Jumlah Anak Karyawan',
      description: 'Mengambil jumlah anak dari data keluarga karyawan.',
      tags: ['Karyawan'],
      request: {
        params: z.object({
          id: z.string().uuid(),
        }),
      },
      responses: {
        200: {
          description: 'Berhasil mengambil jumlah anak',
        },
        404: { description: 'Data tidak ditemukan' },
      },
    }),
    usulan_pengangkatan
  );

  app.openapi(
    createRoute({
      method: 'get',
      path: '/surat_kesalahan_berat_pelanggaran/{id}',
      summary: 'Ambil Surat Kesalahan Berat / Pelanggaran',
      description:
        'Mengambil data lengkap untuk surat kesalahan berat atau pelanggaran karyawan.',
      tags: ['Surat Karyawan'],
      request: {
        params: z.object({
          id: z.string().uuid().openapi({
            example: '5a59e0f4-06dc-4491-97ed-18384522e20b',
          }),
        }),
      },
      responses: {
        200: {
          description: 'Berhasil mengambil data surat pelanggaran',
        },
        404: {
          description: 'Data tidak ditemukan',
        },
        400: {
          description: 'Request tidak valid',
        },
      },
    }),
    surat_kesalahan_berat_pelanggaran
  );
  // app.openapi(
  //   createRoute({
  //     method: 'get',
  //     path: '/surat_kesepakatan_bersama/{id}',
  //     summary: 'Ambil Surat Kesepakatan Bersama',
  //     description:
  //       'Mengambil data lengkap Surat Kesepakatan Bersama (KWT) untuk karyawan.',
  //     tags: ['Surat Karyawan'],
  //     request: {
  //       params: z.object({
  //         id: z.string().uuid().openapi({
  //           example: '5a59e0f4-06dc-4491-97ed-18384522e20b',
  //         }),
  //       }),
  //     },
  //     responses: {
  //       200: { description: 'Berhasil mengambil data SKB' },
  //       404: { description: 'Karyawan tidak ditemukan' },
  //       400: { description: 'Request tidak valid' },
  //     },
  //   }),
  //   surat_kesepakatan_bersama
  // );
  app.openapi(
    createRoute({
      method: 'get',
      path: '/bpjs_ketenagakerjaaan/{id}',
      summary: 'Ambil Surat Kesalahan Berat / Pelanggaran',
      description:
        'Mengambil data lengkap untuk surat kesalahan berat atau pelanggaran karyawan.',
      tags: ['Surat Karyawan'],
      request: {
        params: z.object({
          id: z.string().uuid().openapi({
            example: '5a59e0f4-06dc-4491-97ed-18384522e20b',
          }),
        }),
      },
      responses: {
        200: {
          description: 'Berhasil mengambil data surat pelanggaran',
        },
        404: {
          description: 'Data tidak ditemukan',
        },
        400: {
          description: 'Request tidak valid',
        },
      },
    }),
    BPJS_Ketenagakerjaan
  );
  app.openapi(
    createRoute({
      method: 'get',
      path: '/surat_keterangan/{id}',
      summary: 'Ambil Surat surat_keterangan',
      description: 'Mengambil data lengkap untuk surat keterangan.',
      tags: ['Surat Karyawan'],
      request: {
        params: z.object({
          id: z.string().uuid().openapi({
            example: '5a59e0f4-06dc-4491-97ed-18384522e20b',
          }),
        }),
      },
      responses: {
        200: {
          description: 'Berhasil mengambil data surat surat keterangan',
        },
        404: {
          description: 'Data tidak ditemukan',
        },
        400: {
          description: 'Request tidak valid',
        },
      },
    }),
    surat_keterangan
  );

  app.openapi(
    createRoute({
      method: 'get',
      path: '/surat_pengunduran_diri/{id}',
      summary: 'Ambil Surat pengunduran_diri',
      description: 'Mengambil data lengkap untuk surat pengunduran_diri.',
      tags: ['Surat Karyawan'],
      request: {
        params: z.object({
          id: z.string().uuid().openapi({
            example: '5a59e0f4-06dc-4491-97ed-18384522e20b',
          }),
        }),
      },
      responses: {
        200: {
          description: 'Berhasil mengambil data surat surat pengunduran_diri',
        },
        404: {
          description: 'Data tidak ditemukan',
        },
        400: {
          description: 'Request tidak valid',
        },
      },
    }),
    pengunduran_diri
  );

  // app.openapi(
  //   createRoute({
  //     method: 'get',
  //     path: '/surat_penempatan/{id}',
  //     summary: 'Ambil Surat pengunduran_diri',
  //     description: 'Mengambil data lengkap untuk surat pengunduran_diri.',
  //     tags: ['Surat Karyawan'],
  //     request: {
  //       params: z.object({
  //         id: z.string().uuid().openapi({
  //           example: '5a59e0f4-06dc-4491-97ed-18384522e20b',
  //         }),
  //       }),
  //     },
  //     responses: {
  //       200: {
  //         description: 'Berhasil mengambil data surat surat pengunduran_diri',
  //       },
  //       404: {
  //         description: 'Data tidak ditemukan',
  //       },
  //       400: {
  //         description: 'Request tidak valid',
  //       },
  //     },
  //   }),
  //   surat_penempatan
  // );
};

export default LetterRoutes;
