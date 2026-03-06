import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import {
  getAllKaryawan,
  getKaryawanById,
  createKaryawan,
  updateStatusTidakAktif,
  getKaryawanBirthdayToday,
  getKaryawanByJoinDate,
  getJumlahKaryawanTidakAktif,
  getJumlahKaryawanAktif,
  updateKaryawan,
  updateInformasiPenggajian,
  // getKaryawanByemail,
  searchByNamaLengkap,
  getKeluargaByKaryawanId,
  getAllStatusWithKaryawan,
  getUnitKerjaByIdKaryawan,
  getDetailMengajarById,
  // getKontrakByEmail,
  getAlamatLengkapByIdKaryawan,
  getDetailPendidikanByIdKaryawan,
  getKontakDaruratByIdKaryawan,
  // getUnitKerjaWithDivisiBagianSeksi,
  // getKaryawanWithDokumenByEmail,
  getUnitKerjaByKaryawanId,
  getDetailKaryawan,
  getInformasiPenggajian,
  updateEmployeeProfile,
  updateAlamat,
  updateKontakDarurat,
  updateKeluarga,
  getKaryawanAdditionalById,
  updateAdditional,
  direktur,
} from '../controllers/PrsKaryawanController';
import { clerkAuthMiddleware } from '../middlewares/clerkAuth';

export const registerPrsKaryawanRoutes = (app: OpenAPIHono) => {
  app.use('*', clerkAuthMiddleware);
  const basePath = '/personalia/karyawan';
  const UpdatePayrollSchema = z.object({
    npwp: z.string().optional().openapi({ example: '12.345.678.9-012.345' }),
    no_tabita: z.string().optional().openapi({ example: '99887766' }),
    rekening: z.string().optional().openapi({ example: '1234567890' }),
    no_bpjs_kesehatan: z.string().optional().openapi({ example: 'BPJS-0091' }),
    no_bpjs_ketenagakerjaan: z
      .string()
      .optional()
      .openapi({ example: 'BPJS-TK-29384' }),
    no_bpjs_danpes: z.string().optional().openapi({ example: 'DANPES-11223' }),
  });
  // ---------------------------
  // SCHEMA DEFINITIONS
  // ---------------------------
  const KaryawanSchema = z.object({
    id: z.number().optional().openapi({ example: 10 }),
    nama_lengkap: z.string().optional().openapi({ example: 'Deri Pratama' }),
    nama_panggilan: z.string().optional().openapi({ example: 'deri' }),
    jabatan: z.string().optional(),
    direktur: z.string().optional(),
    divisi: z.string().optional(),
    bagian: z.string().optional(),
    seksi: z.string().optional(),
    email: z
      .string()
      .email()
      .optional()
      .openapi({ example: 'deri@example.com' }),
    status: z.string().optional().openapi({ example: 'Aktif' }),
    created_at: z.string().datetime().optional(),
    updated_at: z.string().datetime().optional(),
  });

  const UpdateEmployeeProfileSchema = z
    .object({
      id: z.number().optional().openapi({ example: 10 }),
      nama_lengkap: z.string().optional().openapi({ example: 'Deri Pratama' }),
      nama_panggilan: z.string().optional().openapi({ example: 'deri' }),

      // relasional: kirimkan ID (UUID) dari entitas terkait
      jabatan: z.string().optional().openapi({ example: 'JDS' }),

      direktur: z.string().optional(),
      deputi: z.string().optional(),
      divisi: z.string().optional(),
      bagian: z.string().optional(),
      seksi: z.string().optional(),
      unit_kerja: z.string().optional(),
      mapel: z.string().optional(), // tergantung tipe di backend

      tinggi_badan: z.string().optional().openapi({ example: '170' }),
      berat_badan: z.string().optional().openapi({ example: '65' }),

      email: z
        .string()
        .email()
        .optional()
        .openapi({ example: 'deri@example.com' }),
      status: z.string().optional().openapi({ example: 'Aktif' }),

      // incline untuk photo: di multipart akan dipakai; di JSON gunakan path/url jika sudah diupload
      foto: z
        .string()
        .optional()
        .openapi({ example: 'uploads/karyawan/uuid.jpg' }),

      // tambahkan field lain yang mungkin dikirim
    })
    .passthrough();
  const CreateKaryawanSchema = KaryawanSchema.omit({
    id: true,
    created_at: true,
    updated_at: true,
  });

  const keluargaResponseSchema = z
    .object({
      id: z.string(),
      karyawan_id: z.string(),
      agama: z.number().nullable().optional(),
      // alias
      nama: z.number().nullable().optional(),

      nama_lengkap: z.string().nullable().optional(),
      nomor_identitas: z.string().nullable().optional(),
      tempat_lahir: z.string().nullable().optional(),
      tanggal_lahir: z.string().nullable().optional(),
      kewarganegaraan: z.string().nullable().optional(),
      pekerjaan: z.string().nullable().optional(),
      pendidikan: z.string().nullable().optional(),
      gender: z.string().nullable().optional(),
      hubungan: z.string().nullable().optional(),
      no_telp: z.string().nullable().optional(),
      flag_status: z.number().nullable().optional(),
      tanggungan_medical: z.number().nullable().optional(),
      kebijakan_khusus_medical: z.number().nullable().optional(),
      flag_berpisah: z.number().nullable().optional(),
      keterangan: z.string().nullable().optional(),
      created_at: z.string().nullable().optional(),
      updated_at: z.string().nullable().optional(),
    })
    .transform(d => ({
      ...d,
      nama: d.nama ?? d.agama ?? null, // alias
    }))
    .openapi('KeluargaResponse');

  const CountSchema = z.object({ count: z.number().openapi({ example: 10 }) });
  const SimpleMessageSchema = z.object({
    message: z.string().openapi({ example: 'success' }),
  });
  const UnitKerjaSchema = z.object({
    id_karyawan: z
      .string()
      .openapi({ example: '4092cd75-b7ca-4646-8882-5ea06e794a9b' }),
    nik: z.string().nullable().openapi({ example: '0193041' }),
    nama_lengkap: z.string().nullable().openapi({ example: 'A TATIK KUSWORO' }),
    tgl_join_penabur: z.string().nullable().openapi({ example: '2020-01-01' }),
    tgl_join_penabur_jkt: z
      .string()
      .nullable()
      .openapi({ example: '2020-01-01' }),
    tanggal_inactive: z.string().nullable().openapi({ example: null }),
    unit_kerja: z.array(
      z.object({
        id: z
          .string()
          .openapi({ example: '8f0d63b8-f09d-4fc1-a1d8-9f7c3f5bbf77' }),
        jam_mengajar: z.string().openapi({ example: '24' }),
        mengajar_mapel: z.string().openapi({ example: 'Matematika' }),
        lokasi_kerja: z.object({
          id: z.string().nullable().openapi({ example: 'VPS' }),
          name: z.string().nullable().openapi({ example: 'Seksi VPS' }),
        }),
        jabatan: z
          .object({
            id: z.string().nullable().openapi({ example: 'JDS' }),
            name: z.string().nullable().openapi({ example: 'Guru' }),
          })
          .optional(),
      })
    ),
  });
  const AlamatSchema = z.object({
    alamat: z.string().optional().openapi({ example: 'Jl. Melati No. 12' }),
    rt: z.string().optional().nullable().openapi({ example: '001' }),
    rw: z.string().optional().nullable().openapi({ example: '002' }),
    kode_pos: z.string().optional().nullable().openapi({ example: '12345' }),
    status_tempat_tinggal: z
      .string()
      .nullable()
      .openapi({ example: 'Kontrak' }),

    // Foreign key lengkap

    kecamatan: z.string().optional().openapi({ example: 55 }),
    kelurahan: z.string().optional().openapi({ example: 55 }),
    kota: z.string().optional().openapi({ example: 55 }),

    provinsi: z.string().optional().openapi({ example: 55 }),
  });
  const PendidikanSchema = z.object({
    pendidikan: z.string().openapi({ example: 'S1 Informatika' }),
    institusi: z.string().openapi({ example: 'Universitas ABC' }),
    tahun_lulus: z.number().openapi({ example: 2020 }),
  });
  const KontakDaruratSchema = z.object({
    nama_kondar: z.string().openapi({ example: 'Siti Ranias' }),
    hubungan_kondar: z.string().openapi({ example: 'Ibu' }),
    alamat_kondar: z.string().openapi({ example: 'Jl. Kebon Jeruk No. 12' }),
    telp_darurat: z.string().openapi({ example: '081234567790' }),
    email: z.string().email().openapi({ example: 'example@gmail.com' }),
    kategori_kontak: z.string().openapi({ example: 'Keluarga' }),
    no_hp: z.string().openapi({ example: '08676767676' }),
  });

  // const DokumenSchema = z.object({
  //   nama_dokumen: z.string().openapi({ example: 'KTP' }),
  //   file_url: z.string().openapi({ example: 'https://example.com/ktp.pdf' }),
  // });
  const MengajarSchema = z.object({
    mata_pelajaran: z.string().openapi({ example: 'Matematika' }),
    kelas: z.string().openapi({ example: 'X IPA 1' }),
    jam: z.string().openapi({ example: '08:00-10:00' }),
  });
  // const KontrakSchema = z.object({
  //   nomor_kontrak: z.string().openapi({ example: 'KONTRAK-001' }),
  //   tanggal_mulai: z
  //     .string()
  //     .datetime()
  //     .openapi({ example: '2024-01-01T00:00:00Z' }),
  //   tanggal_selesai: z
  //     .string()
  //     .datetime()
  //     .openapi({ example: '2024-12-31T00:00:00Z' }),
  // });
  const PayrollSchema = z.object({
    gaji_pokok: z.number().openapi({ example: 5000000 }),
    tunjangan: z.number().openapi({ example: 1000000 }),
    potongan: z.number().openapi({ example: 50000 }),
  });

  // const AlamatInputSchema = z
  //   .object({
  //     alamat: z.string().openapi({ example: 'Jl. Melati No. 12' }),
  //     rt: z.string().nullable().optional().openapi({ example: '001' }),
  //     rw: z.string().nullable().optional().openapi({ example: '002' }),
  //     kode_pos: z.string().nullable().optional().openapi({ example: '12345' }),
  //     status_tempat_tinggal: z
  //       .string()
  //       .optional()
  //       .nullable()
  //       .openapi({ example: 'Kontrak' }),
  //     kelurahan_id: z.number().nullable().optional().openapi({ example: 101 }),
  //   })
  //   .partial()
  //   .openapi('Alamat');
  const KaryawanAlamatUpdateSchema = z
    .object({
      alamat_tempat_tinggal: AlamatSchema.optional(),
      alamat_ktp: AlamatSchema.optional(),
    })
    .openapi('KaryawanAlamatUpdateSchema');

  // ---------------------------
  // ROUTES
  // ---------------------------

  // GET ALL KARYAWAN
  app.openapi(
    createRoute({
      method: 'get',
      path: `${basePath}/employee`,
      tags: ['Karyawan'],
      summary: 'Get all Karyawan',
      responses: {
        200: {
          description: 'Berhasil mengambil semua karyawan',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
                data: z.array(KaryawanSchema),
              }),
            },
          },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    getAllKaryawan
  );

  // GET KARYAWAN BY ID
  app.openapi(
    createRoute({
      method: 'get',
      path: `${basePath}/employee/by-id/{id}`,
      tags: ['Karyawan'],
      summary: 'Get Karyawan by ID',
      request: {
        params: z.object({
          id: z.string().openapi({ example: '10' }),
        }),
      },
      responses: {
        200: {
          description: 'Karyawan ditemukan',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
                data: KaryawanSchema,
              }),
            },
          },
        },
        404: {
          description: 'Karyawan tidak ditemukan',
          content: { 'application/json': { schema: SimpleMessageSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    getKaryawanById
  );

  // CREATE KARYAWAN
  app.openapi(
    createRoute({
      method: 'post',
      path: `${basePath}/created`,
      tags: ['Karyawan'],
      summary: 'Create Karyawan Baru',
      request: {
        body: {
          content: { 'application/json': { schema: CreateKaryawanSchema } },
        },
      },
      responses: {
        201: {
          description: 'Karyawan berhasil dibuat',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean().default(true),
                message: z.string().default('Karyawan berhasil dibuat'),
                data: KaryawanSchema,
              }),
            },
          },
        },
        400: { description: 'Validasi gagal' },
        401: { description: 'Unauthorized' },
      },
    }),
    createKaryawan
  );

  // --------------------------------
  // UPDATE STATUS TIDAK AKTIF
  // --------------------------------
  app.openapi(
    createRoute({
      method: 'put',
      path: `${basePath}/update_stats/{id}`,
      tags: ['Karyawan'],
      summary: 'Update Status Karyawan jadi Tidak Aktif',
      request: {
        params: z.object({
          id: z.string().openapi({ example: '10' }),
        }),
      },
      responses: {
        200: {
          description: 'Status karyawan berhasil diupdate',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean().default(true),
                message: z
                  .string()
                  .default(
                    'Status karyawan berhasil diupdate menjadi Tidak Aktif'
                  ),
                data: z.null().optional(), // tidak ada payload data tambahan
              }),
            },
          },
        },
        404: {
          description: 'Karyawan tidak ditemukan',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean().default(false),
                message: z
                  .string()
                  .default('Karyawan dengan ID 10 tidak ditemukan'),
                data: z.null().optional(),
              }),
            },
          },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    updateStatusTidakAktif
  );

  // UPDATE KARYAWAN
  app.openapi(
    createRoute({
      method: 'put',
      path: `${basePath}/employee/update/{id}`,
      tags: ['Karyawan'],
      summary: 'Update Data Karyawan',
      request: {
        params: z.object({ id: z.string().openapi({ example: '10' }) }),
        body: {
          content: {
            'application/json': {
              schema: KaryawanSchema,
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Data karyawan berhasil diperbarui',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean().default(true),
                message: z
                  .string()
                  .default('Data karyawan berhasil diperbarui'),
                data: KaryawanSchema,
              }),
            },
          },
        },
        404: {
          description: 'Karyawan tidak ditemukan',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean().default(false),
                message: z
                  .string()
                  .default('Karyawan dengan ID 10 tidak ditemukan'),
                data: z.null().optional(),
              }),
            },
          },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    updateKaryawan
  );

  // UNIT KERJA BY KARYAWAN ID
  app.openapi(
    createRoute({
      method: 'get',
      path: `${basePath}/unitkerja/by-id/{id_karyawan}`,
      tags: ['Karyawan Detail'],
      summary: 'Get Unit Kerja berdasarkan ID',
      request: {
        params: z.object({
          id_karyawan: z.string().openapi({
            example: '056aff36-b3d7-4505-b2f5-ad6ee24aab15',
          }),
        }),
      },

      responses: {
        200: {
          description: 'Data Unit Kerja ditemukan',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean().default(true),
                message: z.string().default('Data Unit Kerja berhasil diambil'),
                data: UnitKerjaSchema,
              }),
            },
          },
        },
        404: {
          description: 'Data Unit Kerja tidak ditemukan',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean().default(false),
                message: z
                  .string()
                  .default('Unit Kerja dengan ID 10 tidak ditemukan'),
                data: z.null().optional(),
              }),
            },
          },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    getUnitKerjaByIdKaryawan
  );

  // COUNT OFFBOARDING
  app.openapi(
    createRoute({
      method: 'get',
      path: `${basePath}/count/offboarding`,
      tags: ['Karyawan'],
      summary: 'Jumlah Karyawan Tidak Aktif',
      responses: {
        200: {
          description: 'Counter Karyawan Tidak Aktif',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean().default(true),
                message: z
                  .string()
                  .default('Jumlah karyawan tidak aktif berhasil diambil'),
                data: CountSchema,
              }),
            },
          },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    getJumlahKaryawanTidakAktif
  );

  // COUNT AKTIF
  app.openapi(
    createRoute({
      method: 'get',
      path: `${basePath}/count/aktif`,
      tags: ['Karyawan'],
      summary: 'Jumlah Karyawan Aktif',
      responses: {
        200: {
          description: 'Counter Karyawan Aktif',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean().default(true),
                message: z
                  .string()
                  .default('Jumlah karyawan aktif berhasil diambil'),
                data: CountSchema,
              }),
            },
          },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    getJumlahKaryawanAktif
  );

  app.openapi(
    createRoute({
      method: 'get',
      path: `${basePath}/search`,
      tags: ['Karyawan'],
      summary: 'Search Karyawan by Nama Lengkap',
      request: {
        query: z.object({
          nama_lengkap: z.string().openapi({ example: 'deri' }),
        }),
      },
      responses: {
        200: {
          description: 'Data ditemukan',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean().default(true),
                message: z.string().default('Data karyawan berhasil ditemukan'),
                data: z.array(
                  z.object({
                    id: z.number().openapi({ example: 10 }),
                    nama_lengkap: z
                      .string()
                      .openapi({ example: 'Deri Pratama' }),
                    email: z
                      .string()
                      .email()
                      .openapi({ example: 'deri@example.com' }),
                    status: z.string().openapi({ example: 'Aktif' }),
                    created_at: z.string().datetime().optional(),
                    updated_at: z.string().datetime().optional(),
                  })
                ),
              }),
            },
          },
        },
        404: {
          description: 'Tidak ada karyawan yang ditemukan',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean().default(false),
                message: z.string().default('Data karyawan tidak ditemukan'),
                data: z.null(),
              }),
            },
          },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    searchByNamaLengkap
  );

  // BIRTHDAY HARI INI
  app.openapi(
    createRoute({
      method: 'get',
      path: `${basePath}/birthday`,
      tags: ['Karyawan'],
      summary: 'Karyawan yang ulang tahun hari ini',
      responses: {
        200: {
          description: 'Data Birthday',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean().default(true),
                message: z
                  .string()
                  .default('Data karyawan ulang tahun berhasil diambil'),
                data: z.array(KaryawanSchema),
              }),
            },
          },
        },
        401: { description: 'Unauthorized' },
        404: {
          description: 'Tidak ada karyawan yang ulang tahun hari ini',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean().default(false),
                message: z
                  .string()
                  .default('Tidak ada karyawan yang ulang tahun hari ini'),
                data: z.null(),
              }),
            },
          },
        },
      },
    }),
    getKaryawanBirthdayToday
  );

  // JOIN TODAY
  app.openapi(
    createRoute({
      method: 'get',
      path: `${basePath}/join-today`,
      tags: ['Karyawan'],
      summary: 'Karyawan yang bergabung hari ini',
      responses: {
        200: {
          description: 'Data Join Today',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean().default(true),
                message: z
                  .string()
                  .default(
                    'Data karyawan yang bergabung hari ini berhasil diambil'
                  ),
                data: z.array(KaryawanSchema),
              }),
            },
          },
        },
        401: { description: 'Unauthorized' },
        404: {
          description: 'Tidak ada karyawan yang bergabung hari ini',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean().default(false),
                message: z
                  .string()
                  .default('Tidak ada karyawan yang bergabung hari ini'),
                data: z.null(),
              }),
            },
          },
        },
      },
    }),
    getKaryawanByJoinDate
  );

  // DATA KELUARGA KARYAWAN
  app.openapi(
    createRoute({
      method: 'get',
      path: `${basePath}/keluarga/{id}`,
      tags: ['Karyawan Detail'],
      summary: 'Get Data Keluarga Karyawan',
      request: {
        params: z.object({
          id: z.string().openapi({ example: '10' }),
        }),
      },
      responses: {
        200: {
          description: 'Data Keluarga',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean().default(true),
                message: z
                  .string()
                  .default('Data keluarga karyawan berhasil diambil'),
                data: z.array(SimpleMessageSchema),
              }),
            },
          },
        },
        404: {
          description: 'Data keluarga tidak ditemukan',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean().default(false),
                message: z
                  .string()
                  .default('Data keluarga karyawan tidak ditemukan'),
                data: z.null(),
              }),
            },
          },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    getKeluargaByKaryawanId
  );

  // DETAIL ALAMAT KARYAWAN
  app.openapi(
    createRoute({
      method: 'get',
      path: `${basePath}/alamat-lengkap/by-id/{id}`,
      tags: ['Karyawan Detail'],
      summary: 'Get Alamat Lengkap Karyawan',
      request: {
        params: z.object({
          id: z.string().openapi({ example: '10' }),
        }),
      },
      responses: {
        200: {
          description: 'Alamat Lengkap',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean().default(true),
                message: z
                  .string()
                  .default('Alamat lengkap karyawan berhasil diambil'),
                data: AlamatSchema,
              }),
            },
          },
        },
        404: {
          description: 'Alamat tidak ditemukan',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean().default(false),
                message: z
                  .string()
                  .default('Alamat lengkap karyawan tidak ditemukan'),
                data: z.null(),
              }),
            },
          },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    getAlamatLengkapByIdKaryawan
  );

  // DETAIL PENDIDIKAN
  app.openapi(
    createRoute({
      method: 'get',
      path: `${basePath}/detail-pendidikan/{id_karyawan}`,
      tags: ['Karyawan Detail'],
      summary: 'Get Detail Pendidikan Karyawan',
      request: {
        params: z.object({
          id_karyawan: z.string().openapi({ example: '10' }),
        }),
      },
      responses: {
        200: {
          description: 'Data Pendidikan',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean().default(true),
                message: z
                  .string()
                  .default('Detail pendidikan karyawan berhasil diambil'),
                data: z.array(PendidikanSchema),
              }),
            },
          },
        },
        404: {
          description: 'Detail pendidikan tidak ditemukan',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean().default(false),
                message: z
                  .string()
                  .default('Detail pendidikan karyawan tidak ditemukan'),
                data: z.null(),
              }),
            },
          },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    getDetailPendidikanByIdKaryawan
  );

  // KONTAK DARURAT
  app.openapi(
    createRoute({
      method: 'get',
      path: `${basePath}/kontak-darurat/by-id/{id}`,
      tags: ['Karyawan Detail'],
      summary: 'Kontak Darurat Karyawan',
      request: {
        params: z.object({ id: z.string().openapi({ example: '10' }) }),
      },
      responses: {
        200: {
          description: 'Kontak Darurat berhasil diambil',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean().default(true),
                message: z
                  .string()
                  .default('Kontak darurat karyawan berhasil diambil'),
                data: z.array(KontakDaruratSchema),
              }),
            },
          },
        },
        404: {
          description: 'Kontak darurat tidak ditemukan',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean().default(false),
                message: z
                  .string()
                  .default('Kontak darurat karyawan tidak ditemukan'),
                data: z.null(),
              }),
            },
          },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    getKontakDaruratByIdKaryawan
  );

  // DETAIL UNIT KERJA (DIVISI/BAGIAN/SEKSI) BY EMAIL
  // app.openapi(
  //   createRoute({
  //     method: 'get',
  //     path: `${basePath}/detail-unit-kerja-by-email`,
  //     tags: ['Karyawan Detail'],
  //     summary: 'Get Detail Unit Kerja Lengkap berdasarkan Email',
  //     responses: {
  //       200: {
  //         description: 'Detail Unit Kerja',
  //         content: { 'application/json': { schema: z.array(UnitKerjaSchema) } },
  //       },
  //     },
  //   }),
  //   getUnitKerjaWithDivisiBagianSeksi
  // );

  // DETAIL MENGAJAR
  app.openapi(
    createRoute({
      method: 'get',
      path: `${basePath}/detail-mengajar/by-email`,
      tags: ['Karyawan Detail'],
      summary: 'Get Detail Mengajar berdasarkan Email',
      responses: {
        200: {
          description: 'Data Mengajar berhasil diambil',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean().default(true),
                message: z.string().default('Detail mengajar berhasil diambil'),
                data: z.array(MengajarSchema),
              }),
            },
          },
        },
        404: {
          description: 'Detail mengajar tidak ditemukan',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean().default(false),
                message: z.string().default('Detail mengajar tidak ditemukan'),
                data: z.null(),
              }),
            },
          },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    getDetailMengajarById
  );

  // KONTRAK BY EMAIL
  //   app.openapi(
  //   createRoute({
  //     method: 'get',
  //     path: `${basePath}/karyawan/kontrak/by-email`,
  //     tags: ['Kontrak Karyawan'],
  //     summary: 'Get Kontrak Karyawan berdasarkan Email',
  //     responses: {
  //       200: {
  //         description: 'Detail Kontrak berhasil diambil',
  //         content: {
  //           'application/json': {
  //             schema: z.object({
  //               success: z.boolean().default(true),
  //               message: z.string().default('Detail kontrak berhasil diambil'),
  //               data: z.array(KontrakSchema),
  //             }),
  //           },
  //         },
  //       },
  //       404: {
  //         description: 'Kontrak tidak ditemukan',
  //         content: {
  //           'application/json': {
  //             schema: z.object({
  //               success: z.boolean().default(false),
  //               message: z.string().default('Kontrak karyawan tidak ditemukan'),
  //               data: z.null(),
  //             }),
  //           },
  //         },
  //       },
  //       401: { description: 'Unauthorized' },
  //     },
  //   }),
  //   getKontrakByEmail
  // );

  // INFORMASI PENGGAJIAN
  app.openapi(
    createRoute({
      method: 'get',
      path: `${basePath}/InfoPenggajian/{id}`,
      tags: ['Karyawan Detail'],
      summary: 'Informasi Penggajian Karyawan',
      request: {
        params: z.object({ id: z.string().openapi({ example: '10' }) }),
      },
      responses: {
        200: {
          description: 'Data Payroll berhasil diambil',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean().default(true),
                message: z
                  .string()
                  .default('Informasi penggajian berhasil diambil'),
                data: PayrollSchema,
              }),
            },
          },
        },
        404: {
          description: 'Data Payroll tidak ditemukan',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean().default(false),
                message: z
                  .string()
                  .default('Data penggajian karyawan tidak ditemukan'),
                data: z.null(),
              }),
            },
          },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    getInformasiPenggajian
  );

  // KARYAWAN DENGAN DOKUMEN
  // app.openapi(
  //   createRoute({
  //     method: 'get',
  //     path: `${basePath}/karyawan-with-dokumen/{email}`,
  //     tags: ['Dokumen Karyawan'],
  //     summary: 'Get Karyawan with Dokumen by Email',
  //     request: {
  //       params: z.object({
  //         email: z.string().openapi({ example: 'deri@example.com' }),
  //       }),
  //     },
  //     responses: {
  //       200: {
  //         description: 'Karyawan + Dokumen',
  //         content: { 'application/json': { schema: z.array(DokumenSchema) } },
  //       },
  //     },
  //   }),
  //   getKaryawanWithDokumenByEmail
  // );

  // UPDATE EMPLOYEE PROFILE
  app.openapi(
    createRoute({
      method: 'put',
      path: `${basePath}/employee/profile/{id_karyawan}`,
      tags: ['Karyawan'],
      summary: 'Update Employee Profile',
      request: {
        params: z.object({
          id_karyawan: z.string().openapi({
            example: '5a59e0f4-06dc-4491-97ed-18384522e20b',
          }),
        }),
        body: {
          content: {
            'application/json': { schema: UpdateEmployeeProfileSchema },
            'multipart/form-data': {
              schema: z.object({}).passthrough(), // untuk upload foto + fields
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Profile berhasil diperbarui',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean().default(true),
                message: z.string().default('Profile berhasil diperbarui'),
                data: UpdateEmployeeProfileSchema.optional(),
              }),
            },
          },
        },
        400: {
          description: 'Validasi gagal atau request tidak valid',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean().default(false),
                message: z.string().default('Validasi gagal'),
                issues: z.any().optional(),
                data: z.null(),
              }),
            },
          },
        },
        401: { description: 'Unauthorized' },
        404: { description: 'Karyawan tidak ditemukan' },
      },
    }),
    updateEmployeeProfile
  );

  // UPDATE ALAMAT KARYAWAN
  app.openapi(
    createRoute({
      method: 'put',
      path: `${basePath}/update_alamat_karyawan/{id_karyawan}`,
      tags: ['Karyawan'],
      summary: 'Update alamat Karyawan (KTP & Tempat Tinggal)',
      request: {
        params: z.object({
          id_karyawan: z.string().openapi({ example: '10' }),
        }),
        body: {
          content: {
            'application/json': {
              schema: KaryawanAlamatUpdateSchema,
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Alamat berhasil diperbarui',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean().default(true),
                message: z.string().default('Alamat berhasil diperbarui'),
                data: KaryawanAlamatUpdateSchema.optional(),
              }),
            },
          },
        },
        400: {
          description: 'Gagal memperbarui alamat',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean().default(false),
                message: z.string().default('Gagal memperbarui alamat'),
                data: z.null(),
              }),
            },
          },
        },
        401: { description: 'Unauthorized' },
        404: { description: 'Karyawan tidak ditemukan' },
      },
    }),
    updateAlamat
  );

  app.openapi(
    createRoute({
      method: 'get',
      path: `${basePath}/status-karyawan`,
      tags: ['Karyawan'],
      summary: 'Get semua status & jumlah karyawan',
      responses: {
        200: {
          description: 'List Status Karyawan',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean().default(true),
                message: z
                  .string()
                  .default('Berhasil mengambil status karyawan'),
                data: z.array(
                  z.object({
                    status: z.string().openapi({ example: 'Aktif' }),
                    jumlah: z.number().openapi({ example: 120 }),
                  })
                ),
              }),
            },
          },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    getAllStatusWithKaryawan
  );

  // GET UNIT KERJA KARYAWAN BY ID
  app.openapi(
    createRoute({
      method: 'get',
      path: `${basePath}/unitkerja_karyawan/{id}`,
      tags: ['Karyawan Detail'],
      summary: 'Get Unit Kerja karyawan berdasarkan ID karyawan',
      request: {
        params: z.object({
          id: z.string().openapi({ example: '10', description: 'ID Karyawan' }),
        }),
      },
      responses: {
        200: {
          description: 'Data Unit Kerja',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean().default(true),
                message: z
                  .string()
                  .default('Berhasil mengambil data unit kerja karyawan'),
                data: UnitKerjaSchema,
              }),
            },
          },
        },
        404: {
          description: 'Karyawan atau data unit kerja tidak ditemukan',
          content: {
            'application/json': {
              schema: SimpleMessageSchema,
            },
          },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    getUnitKerjaByKaryawanId
  );

  app.openapi(
    createRoute({
      method: 'get',
      path: `${basePath}/direktur/`,
      tags: ['Karyawan Detail'],
      summary: 'Get Unit Kerja karyawan berdasarkan ID karyawan',
      // request: {
      //   params: z.object({
      //     id: z.string().openapi({ example: '10', description: 'ID Karyawan' }),
      //   }),
      // },
      responses: {
        200: {
          description: 'Data Unit Kerja direktur',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean().default(true),
                message: z
                  .string()
                  .default('Berhasil mengambil data unit kerja direktur '),
                data: UnitKerjaSchema,
              }),
            },
          },
        },
        404: {
          description: 'Karyawan atau data unit kerja tidak ditemukan',
          content: {
            'application/json': {
              schema: SimpleMessageSchema,
            },
          },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    direktur
  );
  app.openapi(
    createRoute({
      method: 'get',
      path: `${basePath}/getDetailKaryawan/{id}`,
      tags: ['Karyawan Detail'],
      summary: 'Get Detail Karyawan Lengkap by ID',
      request: {
        params: z.object({
          id: z.string().openapi({ example: '10' }),
        }),
      },
      responses: {
        200: {
          description: 'Detail Karyawan',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean().default(true),
                message: z
                  .string()
                  .default('Berhasil mengambil detail karyawan'),
                data: z.object({
                  id: z.number().openapi({ example: 10 }),
                  nama_lengkap: z.string().openapi({ example: 'Deri Pratama' }),
                  email: z
                    .string()
                    .email()
                    .openapi({ example: 'deri@example.com' }),
                  status: z.string().openapi({ example: 'Aktif' }),
                  alamat: z
                    .string()
                    .nullable()
                    .openapi({ example: 'Jl. Mawar No. 123' }),
                  unit_kerja: z.string().openapi({ example: 'SDM' }),
                  divisi: z.string().nullable().openapi({ example: 'HRD' }),
                  bagian: z
                    .string()
                    .nullable()
                    .openapi({ example: 'Rekrutmen' }),
                  seksi: z
                    .string()
                    .nullable()
                    .openapi({ example: 'Pelatihan' }),
                  tanggal_lahir: z.string().datetime().optional(),
                  tanggal_masuk: z.string().datetime().optional(),
                  created_at: z.string().datetime().optional(),
                  updated_at: z.string().datetime().optional(),
                }),
              }),
            },
          },
        },
        404: {
          description: 'Karyawan tidak ditemukan',
          content: {
            'application/json': {
              schema: SimpleMessageSchema,
            },
          },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    getDetailKaryawan
  );

  // PUT /kontak-darurat/:id_karyawan/:id
  app.openapi(
    createRoute({
      method: 'put',
      path: `${basePath}/kontak-darurat/{id_karyawan}/{id}`,
      tags: ['Karyawan Additional'],
      summary: 'Update Kontak Darurat Karyawan',
      request: {
        params: z.object({
          id_karyawan: z.string().openapi({ example: '123' }),
          id: z.string().openapi({ example: '1' }),
        }),
        body: {
          content: {
            'application/json': {
              schema: z.object({
                id_karyawan: z
                  .string()
                  .openapi({ example: '2dfa35e4-6030-11ef-bedd-005056a30012' }),
                id: z
                  .string()
                  .openapi({ example: 'b2c73bd2-7e92-11ef-88ed-005056a30012' }),
                nama_kondar: z
                  .string()
                  .optional()
                  .openapi({ example: 'Siti Ranias' }),
                hubungan_kondar: z
                  .string()
                  .optional()
                  .openapi({ example: 'Ibu' }),
                alamat_kondar: z
                  .string()
                  .optional()
                  .openapi({ example: 'Jl. Melati No. 10' }),
                telp_darurat: z
                  .string()
                  .optional()
                  .openapi({ example: '081234567790' }),
                email: z
                  .string()
                  .email()
                  .optional()
                  .openapi({ example: 'example@gmail.com' }),
                kategori_kontak: z
                  .string()
                  .optional()
                  .openapi({ example: 'Keluarga' }),
                no_hp: z
                  .string()
                  .optional()
                  .openapi({ example: '08676767676' }),
              }),
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Kontak darurat berhasil diupdate',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean().default(true),
                message: z.string().default('Kontak darurat berhasil diupdate'),
                data: z.object({
                  id: z.string(),
                  id_karyawan: z.string(),
                  nama_kondar: z.string(),
                  hubungan_kondar: z.string(),
                  alamat_kondar: z.string(),
                  telp_darurat: z.string(),
                  email: z.string(),
                  kategori_kontak: z.string(),
                  no_hp: z.string(),
                }),
              }),
            },
          },
        },
        400: {
          description: 'Validasi gagal / request error',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean().default(false),
                message: z.string().default('Gagal memperbarui kontak darurat'),
                data: z.null(),
              }),
            },
          },
        },
        404: {
          description: 'Kontak darurat tidak ditemukan',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean().default(false),
                message: z.string().default('Kontak darurat tidak ditemukan'),
                data: z.null(),
              }),
            },
          },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    updateKontakDarurat
  );

  // PUT /update-keluarga/:id_karyawan/:id
  app.openapi(
    createRoute({
      method: 'put',
      path: `${basePath}/update-keluarga/{id_karyawan}/{id}`,
      tags: ['Karyawan Additional'],
      summary: 'Update Data Keluarga Karyawan',
      request: {
        params: z.object({
          id_karyawan: z.string().openapi({ example: '123' }),
          id: z.string().openapi({ example: '1' }),
        }),
        body: {
          content: {
            'application/json': {
              schema: z.object({
                nama_lengkap: z.string().optional(),
                nomor_identitas: z.string().optional(),
                tempat_lahir: z.string().optional(),
                tanggal_lahir: z.string().optional(),
                agama: z.number().optional(),
                kewarganegaraan: z.string().optional(),
                pekerjaan: z.string().optional(),
                pendidikan: z.string().optional(),
                gender: z.string().optional(),
                hubungan: z.string().optional(),
                no_telp: z.string().optional(),
                flag_status: z.number().optional(),
                tanggungan_medical: z.number().optional(),
                kebijakan_khusus_medical: z.number().optional(),
                flag_berpisah: z.number().optional(),
                keterangan: z.number().optional(),
              }),
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Data keluarga berhasil diupdate',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean().default(true),
                message: z.string().default('Data keluarga berhasil diupdate'),
                data: keluargaResponseSchema, // schema keluarga
              }),
            },
          },
        },
        400: {
          description: 'Validasi gagal / request error',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean().default(false),
                message: z.string().default('Gagal memperbarui data keluarga'),
                data: z.null(),
              }),
            },
          },
        },
        404: {
          description: 'Data keluarga tidak ditemukan',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean().default(false),
                message: z.string().default('Data keluarga tidak ditemukan'),
                data: z.null(),
              }),
            },
          },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    updateKeluarga
  );

  // GET /getKaryawanAdditionalById/:id_karyawan
  app.openapi(
    createRoute({
      method: 'get',
      path: `${basePath}/getKaryawanAdditionalById/{id_karyawan}`,
      tags: ['Karyawan Additional'],
      summary: 'Get Data Additional Karyawan by ID',
      request: {
        params: z.object({
          id_karyawan: z.string().openapi({ example: '123' }),
        }),
      },
      responses: {
        200: {
          description: 'Detail Additional Karyawan',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean().default(true),
                message: z
                  .string()
                  .default('Berhasil mengambil data additional karyawan'),
                data: z.object({
                  kewarganegaraan: z.string().optional(),
                  tempat_lahir: z.string().optional(),
                  birth_date: z.string().optional(),
                  gol_darah: z.string().optional(),
                  instagram: z.string().optional(),
                  twitter: z.string().optional(),
                  no_kitas: z.number().optional(),
                  no_visa: z.number().optional(),
                  no_tabita: z.number().optional(),
                  npwp: z.string().optional(),
                  rekening: z.string().optional(),
                  kode_golongan: z.string().optional(),
                  no_bpjs_ketenagakerjaan: z.string().optional(),
                  no_bpjs_danpes: z.string().optional(),
                  nama_bpjs_danpes: z.string().optional(),
                  no_pasport: z.number().optional(),
                }),
              }),
            },
          },
        },
        404: {
          description: 'Additional data tidak ditemukan',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean().default(false),
                message: z
                  .string()
                  .default('Data additional karyawan tidak ditemukan'),
                data: z.null(),
              }),
            },
          },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    getKaryawanAdditionalById
  );

  // PUT /additional/:id_karyawan
  app.openapi(
    createRoute({
      method: 'put',
      path: `${basePath}/additional/{id_karyawan}`,
      tags: ['Karyawan Additional'],
      summary: 'Update Additional Karyawan (Custom)',
      request: {
        params: z.object({
          id_karyawan: z.string().openapi({ example: '123' }),
        }),
        body: {
          content: {
            'application/json': {
              schema: z.object({
                kewarganegaraan: z.string().optional(),
                tempat_lahir: z.string().optional(),
                birth_date: z.string().optional(),
                gol_darah: z.string().optional(),
                gender: z.string().optional(),
                instagram: z.string().optional(),
                twitter: z.string().optional(),
                no_kitas: z.number().optional(),
                no_visa: z.number().optional(),
                no_tabita: z.number().optional(),
                npwp: z.string().optional(),
                rekening: z.string().optional(),
                kode_golongan: z.string().optional(),
                no_bpjs_ketenagakerjaan: z.string().optional(),
                no_bpjs_danpes: z.string().optional(),
                nama_bpjs_danpes: z.string().optional(),
                no_pasport: z.number().optional(),
              }),
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Additional berhasil diupdate',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean().default(true),
                message: z
                  .string()
                  .default('Berhasil memperbarui additional karyawan'),
                data: z.object({
                  kewarganegaraan: z.string().optional(),
                  tempat_lahir: z.string().optional(),
                  birth_date: z.string().optional(),
                  gol_darah: z.string().optional(),
                  gender: z.string().optional(),
                  instagram: z.string().optional(),
                  twitter: z.string().optional(),
                  no_kitas: z.number().optional(),
                  no_visa: z.number().optional(),
                  no_tabita: z.number().optional(),
                  npwp: z.string().optional(),
                  rekening: z.string().optional(),
                  kode_golongan: z.string().optional(),
                  no_bpjs_ketenagakerjaan: z.string().optional(),
                  no_bpjs_danpes: z.string().optional(),
                  nama_bpjs_danpes: z.string().optional(),
                  no_pasport: z.number().optional(),
                }),
              }),
            },
          },
        },
        404: {
          description: 'Data additional tidak ditemukan',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean().default(false),
                message: z
                  .string()
                  .default('Data additional karyawan tidak ditemukan'),
                data: z.null(),
              }),
            },
          },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    updateAdditional
  );

  app.openapi(
    createRoute({
      method: 'put',
      path: `${basePath}/InfoPenggajian/{id}`,
      tags: ['Karyawan Detail'],
      summary: 'Update Informasi Penggajian Karyawan',
      request: {
        params: z.object({
          id: z.string().openapi({ example: '10' }),
        }),
        body: {
          content: {
            'application/json': {
              schema: UpdatePayrollSchema,
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Berhasil update informasi penggajian',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean().default(true),
                message: z
                  .string()
                  .default('Informasi penggajian berhasil diupdate'),
                // Optional data jika ingin embed updated payroll info
                data: z.object({}).optional(),
              }),
            },
          },
        },
        400: {
          description: 'Gagal update atau data tidak ditemukan',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean().default(false),
                message: z
                  .string()
                  .default('Data tidak ditemukan atau tidak berubah'),
                data: z.null().optional(),
              }),
            },
          },
        },
        404: {
          description: 'Data penggajian tidak ditemukan',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean().default(false),
                message: z.string().default('Data penggajian tidak ditemukan'),
                data: z.null(),
              }),
            },
          },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    updateInformasiPenggajian
  );
};
