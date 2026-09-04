import { Page, Text, StyleSheet, View, Font } from "@react-pdf/renderer";

Font.register({
  family: "Times New Roman",
  fonts: [
    { src: "/assets/fonts/TimesNewRoman/TimesNewRoman.ttf" },
    {
      src: "/assets/fonts/TimesNewRoman/TimesNewRoman_Bold.ttf",
      fontWeight: "bold",
    },
    {
      src: "/assets/fonts/TimesNewRoman/TimesNewRoman_BoldItalic.ttf",
      fontStyle: "bold italic",
    },
    {
      src: "/assets/fonts/TimesNewRoman/TimesNewRoman_Italic.ttf",
      fontStyle: "italic",
    },
  ],
});

Font.registerHyphenationCallback((word) => {
  return [word];
});

export default function KesepakatanBersama({ data }) {
  const payload = data?.data ?? data ?? {};

  // ✅ FIX: aman untuk null/undefined
  const namaLengkap =
    String(payload?.nama_lengkap ?? payload?.nama ?? "").trim() || "—";
  const nik = String(payload?.nik ?? "").trim() || "—";

  // ✅ FIX: jangan (null).toString()
  const tanggal_incative =
    payload?.tanggal_incative != null
      ? String(payload.tanggal_incative).trim()
      : "—";

  function formatAlamat(alamat) {
    if (!alamat) return "—";

    // kalau sudah string, langsung pakai
    if (typeof alamat === "string") {
      return alamat.trim() || "—";
    }

    // kalau object (hasil include alamat)
    const parts = [
      alamat.alamat,
      alamat.rt && alamat.rw ? `RT ${alamat.rt} / RW ${alamat.rw}` : null,
      alamat.kelurahan?.nama,
      alamat.kecamatan?.nama,
      alamat.kota?.nama,
      alamat.provinsi?.nama,
      alamat.kode_pos,
    ];

    return parts.filter(Boolean).join(", ");
  }
  // ✅ contoh alamat (sesuaikan field API kamu)
  const alamatKtp =
    String(
      payload?.alamat_ktp_detail?.alamat ?? payload?.alamatKtp ?? "",
    ).trim() || "—";

  const alamatTempatTinggal =
    String(
      payload?.alamat_tempat_tinggal_detail?.alamat ??
        payload?.alamatTempatTinggal ??
        "",
    ).trim() || "—";
  const BULAN = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  function formatTanggalIndo(value) {
    if (!value) return "—";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";

    const tanggal = date.getDate();
    const bulan = BULAN[date.getMonth()];
    const tahun = date.getFullYear();

    return `${tanggal} ${bulan} ${tahun}`;
  }

  // ✅ tanggal surat (today)
  const tanggalSurat = formatTanggalIndo(new Date());
  const jabatan =
    payload?.unit_kerja_karyawan?.[0]?.jabatan?.jabatan?.toString().trim() ||
    "—";

  // unit penugasan (TKK 10 PENABUR, dll)
  const unit =
    payload?.unit_penugasan ?? payload?.unit_kerja ?? payload?.unit ?? "—";

  const tablePasal = {
    17: [
      {
        no: 1,
        pasal: "Ayat 1.3.",
        isi: "Mentaati Peraturan Perusahaan YBPK PENABUR dan peraturan-peraturan lainnya, instruksi kerja baik tertulis maupun tidak tertulis dan kebiasaan-kebiasaan yang merupakan etika kerja di lingkungan YBPK PENABUR atau BPK PENABUR Setempat.",
      },
      {
        no: 2,
        pasal: "Ayat 1.5.",
        isi: "Menjaga citra Karyawan YBPK PENABUR dengan bersikap dan berperilaku sesuai dengan nilai-nilai Kristiani.",
      },
      {
        no: 3,
        pasal: "Ayat 1.6.",
        isi: "Menjaga nama baik dan martabat YBPK PENABUR atau BPK PENABUR Setempat sebagai institusi atau badan pendidikan Kristen, termasuk nama baik dan martabat pengurus dan Karyawan dengan cara tidak melakukan tindakan dan perbuatan yang bertentangan dengan norma agama, etika dan moral dalam masyarakat pada umumnya dan/atau hukum.",
      },
    ],
    18: [
      {
        no: 1,
        pasal: "Ayat 1.1.",
        isi: "Melakukan hal-hal yang dapat menurunkan kehormatan, nama baik dan martabat YBPK PENABUR atau BPK PENABUR Setempat sebagai institusi, maupun kepengurusan dan seluruh Karyawan.",
      },
    ],
    21: [
      {
        no: 1,
        pasal: "Ayat 1.10.",
        isi: "Melalaikan tugas dan kewajiban yang diberikan.",
      },
      {
        no: 2,
        pasal: "Ayat 1.11.",
        isi: "Melaksanakan tugas atau pekerjaan dengan sembarangan dan/atau tidak mengikuti prosedur yang berlaku.",
      },
      {
        no: 3,
        pasal: "Ayat 1.16.",
        isi: "Melakukan tindakan atau perbuatan yang secara langsung dan/atau secara tidak langsung dapat menimbulkan ketidak nyamanan, gangguan, ancaman, serta hal-hal yang dapat dikategorikan merugikan YBPK PENABUR, BPK PENABUR Setempat dan/atau Sekolah.",
      },
    ],
    24: [
      {
        no: 1,
        pasal: "Ayat 1.8.",
        isi: "Melakukan kelalaian yang dapat mengakibatkan kerugian bagi Yayasan atau pihak lain di luar Yayasan.",
      },
      {
        no: 2,
        pasal: "Ayat 1.9.",
        isi: "Kelalaian dalam mengelola dana Yayasan uang mengakibatkan kerugian bagi Yayasan.",
      },
    ],
    25: [
      {
        no: 1,
        pasal: "Ayat 1.7.",
        isi: "Menyerang, menganiaya, mengancam, berkelahi, membahayakan atau mengintimidasi teman sekerja, atasan, bawahan, atau siswa baik di dalam lingkungan maupun di luar lingkungan tempat kerja atau unit kerja YBPK PENABUR atau BPK PENABUR Setempat.",
      },
      {
        no: 2,
        pasal: "Ayat 1.12.",
        isi: "Melakukan perbuatan atau tindakan Pidana atau perbuatan lainnya yang diancam Pidana, yang dilakukannya baik di dalam maupun di luar lingkungan YBPK PENABUR/BPK PENABUR Setempat.",
      },
      {
        no: 3,
        pasal: "Ayat 1.13.",
        isi: "Melakukan perbuatan tidak menyenangkan atau merugikan terhadap siswa, teman  sekerja, atasan, bawahan  ataupun pihak lain di dalam lingkungan maupun di luar  lingkungan tempat kerja atau unit kerja YBPK PENABUR atau BPK PENABUR  Setempat.",
      },
      {
        no: 4,
        pasal: "Ayat 1.16.",
        isi: "Melakukan tindakan secara sengaja yang dapat mengakibatkan kerugian bagi Yayasan dan/atau pihak lain di luar Yayasan.",
      },
      {
        no: 5,
        pasal: "Ayat 1.17.",
        isi: "Melakukan perbuatan yang di indikasikan dapat mencemarkan kehormatan dan martabat Karyawan Yayasan.",
      },
    ],
  };

  return (
    <Page style={styles.containerDocument} size={"A4"}>
      <View style={styles.containerHeader}>
        <Text style={styles.titleHeader}>
          SURAT KESALAHAN BERAT ATAU PELANGGARAN BERSIFAT MENDESAK
        </Text>
      </View>

      <View
        style={{
          alignSelf: "flex-end",
          marginTop: 10,
          borderWidth: 1,
          paddingHorizontal: 10,
          paddingVertical: 5,
        }}
      >
        <Text style={[styles.textBold]}>CONFIDENTIAL</Text>
      </View>

      <Text style={[styles.textNormal]}>Kepada:</Text>

      <View style={{ borderWidth: 1, width: "100%" }}>
        <View
          style={{
            borderBottomWidth: 1,
            flexDirection: "row",
            paddingHorizontal: 5,
          }}
        >
          <View
            style={{ width: "30%", borderRightWidth: 1, paddingVertical: 1.5 }}
          >
            <Text style={styles.textNormal}>Nama Karyawan</Text>
          </View>
          <View style={{ paddingVertical: 1.5, paddingLeft: 5 }}>
            <Text style={styles.textNormal}>{namaLengkap}</Text>
          </View>
        </View>

        <View
          style={{
            borderBottomWidth: 1,
            flexDirection: "row",
            paddingHorizontal: 5,
          }}
        >
          <View
            style={{ width: "30%", borderRightWidth: 1, paddingVertical: 1.5 }}
          >
            <Text style={styles.textNormal}>NIK</Text>
          </View>
          <View style={{ paddingVertical: 1.5, paddingLeft: 5 }}>
            <Text style={styles.textNormal}>{nik}</Text>
          </View>
        </View>

        <View
          style={{
            borderBottomWidth: 1,
            flexDirection: "row",
            paddingHorizontal: 5,
          }}
        >
          <View
            style={{ width: "30%", borderRightWidth: 1, paddingVertical: 1.5 }}
          >
            <Text style={styles.textNormal}>Jabatan</Text>
          </View>
          <View style={{ paddingVertical: 1.5, paddingLeft: 5 }}>
            <Text style={styles.textNormal}>{jabatan}</Text>
          </View>
        </View>

        <View
          style={{
            borderBottomWidth: 1,
            flexDirection: "row",
            paddingHorizontal: 5,
          }}
        >
          <View
            style={{ width: "30%", borderRightWidth: 1, paddingVertical: 1.5 }}
          >
            <Text style={styles.textNormal}>Penempatan</Text>
          </View>
          <View style={{ paddingVertical: 1.5, paddingLeft: 5 }}>
            <Text style={styles.textNormal}>SDK PENABUR Gading Sepong</Text>
          </View>
        </View>

        <View
          style={{
            borderBottomWidth: 1,
            paddingHorizontal: 5,
            paddingTop: 10,
          }}
        >
          <Text style={styles.textNormal}>Permasalahan:</Text>
          <Text style={styles.textNormal}>
            _________________________________________________________
            _________________________________________________________
            _________________________________________________________
          </Text>

          <Text style={[styles.textNormal, { marginTop: 10 }]}>
            Berdasarkan fakta-fakta di atas, Saudara telah melanggar:
          </Text>
          <Text style={styles.textNormal}>
            Peraturan Perusahaan BPK PENABUR Tahun 2024 sebagai berikut:
          </Text>

          <View style={{ paddingHorizontal: 5, marginTop: 5 }}>
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <Text style={[styles.textNormal, { width: 20 }]}>a.</Text>
              <Text style={styles.textNormal}>Pasal 17 KEWAJIBAN, yaitu :</Text>
            </View>

            <View style={{ borderWidth: 1 }}>
              {tablePasal[17].map((item) => (
                <View
                  style={{
                    flexDirection: "row",
                    borderBottomWidth: tablePasal[17].length !== item.no && 1,
                  }}
                  key={item.no}
                >
                  <View
                    style={{
                      width: 20,
                      borderRightWidth: 1,
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.textNormal}>{item.no}</Text>
                  </View>
                  <View
                    style={{
                      width: 60,
                      borderRightWidth: 1,
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.textNormal}>{item.pasal}</Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      paddingHorizontal: 5,
                    }}
                  >
                    <Text style={styles.textNormal}>{item.isi}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={{ paddingHorizontal: 5, marginTop: 10 }}>
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <Text style={[styles.textNormal, { width: 20 }]}>b.</Text>
              <Text style={styles.textNormal}>
                Pasal 18 PERBUATAN DAN/ATAU TINDAKAN YANG DILARANG, yaitu :
              </Text>
            </View>

            <View style={{ borderWidth: 1 }}>
              {tablePasal[18].map((item) => (
                <View
                  style={{
                    flexDirection: "row",
                    borderBottomWidth: tablePasal[18].length !== item.no && 1,
                  }}
                  key={item.no}
                >
                  <View
                    style={{
                      width: 20,
                      borderRightWidth: 1,
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.textNormal}>{item.no}</Text>
                  </View>
                  <View
                    style={{
                      width: 60,
                      borderRightWidth: 1,
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.textNormal}>{item.pasal}</Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      paddingHorizontal: 5,
                    }}
                  >
                    <Text style={styles.textNormal}>{item.isi}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <Text style={[styles.textNormal, { marginTop: 10 }]}>
            Karenanya, Saudara telah melakukan :
          </Text>

          <View
            style={{
              flexDirection: "row",
            }}
          >
            <Text style={[styles.textNormal, { width: 20 }]}>1.</Text>
            <Text style={[styles.textNormal, { flex: 1 }]}>
              PELANGGARAN TINGKAT PERTAMA, sebagaimana diuraikan dalam Pasal 21
              Peraturan Perusahaan BPK PENABUR Tahun 2024, sebagai berikut :
            </Text>
          </View>

          <View style={{ paddingLeft: 20, paddingRight: 5 }}>
            <View style={{ borderWidth: 1 }}>
              {tablePasal[21].map((item) => (
                <View
                  style={{
                    flexDirection: "row",
                    borderBottomWidth: tablePasal[21].length !== item.no && 1,
                  }}
                  key={item.no}
                >
                  <View
                    style={{
                      width: 20,
                      borderRightWidth: 1,
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.textNormal}>{item.no}</Text>
                  </View>
                  <View
                    style={{
                      width: 60,
                      borderRightWidth: 1,
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.textNormal}>{item.pasal}</Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      paddingHorizontal: 5,
                    }}
                  >
                    <Text style={styles.textNormal}>{item.isi}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              marginTop: 10,
            }}
          >
            <Text style={[styles.textNormal, { width: 20 }]}>2.</Text>
            <Text style={[styles.textNormal, { flex: 1 }]}>
              PELANGGARAN TINGKAT KEEMPAT (SP PERTAMA DAN TERAKHIR), sebagaimana
              diuraikan dalam Pasal 24 Peraturan Perusahaan BPK PENABUR Tahun
              ____, sebagai berikut:
            </Text>
          </View>

          <View style={{ paddingLeft: 20, paddingRight: 5 }}>
            <View style={{ borderWidth: 1 }} break>
              {tablePasal[24].map((item) => (
                <View
                  style={{
                    flexDirection: "row",
                    borderBottomWidth: tablePasal[24].length !== item.no && 1,
                  }}
                  key={item.no}
                >
                  <View
                    style={{
                      width: 20,
                      borderRightWidth: 1,
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.textNormal}>{item.no}</Text>
                  </View>
                  <View
                    style={{
                      width: 60,
                      borderRightWidth: 1,
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.textNormal}>{item.pasal}</Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      paddingHorizontal: 5,
                    }}
                  >
                    <Text style={styles.textNormal}>{item.isi}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              marginTop: 10,
            }}
          >
            <Text style={[styles.textNormal, { width: 20 }]}>3.</Text>
            <Text style={[styles.textNormal, { flex: 1 }]}>
              KESALAHAN BERAT ATAU PELANGGARAN BERSIFAT MENDESAK sebagaimana
              diuraikan dalam Pasal 25 Peraturan Perusahaan BPK PENABUR Tahun
              2024, dengan sanksi dilakukan PEMUTUSAN HUBUNGAN KERJA.
            </Text>
          </View>

          <View style={{ paddingLeft: 20, paddingRight: 5 }}>
            <View style={{ borderWidth: 1 }}>
              {tablePasal[25].map((item) => (
                <View
                  style={{
                    flexDirection: "row",
                    borderBottomWidth: tablePasal[25].length !== item.no && 1,
                  }}
                  key={item.no}
                >
                  <View
                    style={{
                      width: 20,
                      borderRightWidth: 1,
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.textNormal}>{item.no}</Text>
                  </View>
                  <View
                    style={{
                      width: 60,
                      borderRightWidth: 1,
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.textNormal}>{item.pasal}</Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      paddingHorizontal: 5,
                    }}
                  >
                    <Text style={styles.textNormal}>{item.isi}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        <Text
          style={[
            styles.textNormal,
            { marginVertical: 10, paddingHorizontal: 5 },
          ]}
        >
          Berdasarkan uraian di atas, maka Yayasan tidak dapat mempekerjakan
          lagi Saudara dan memutuskan untuk memberi sanksi kepada Saudara berupa
          PEMUTUSAN HUBUNGAN KERJA sesuai ketentuan perundang-undangan serta
          peraturan yang berlaku dari tanggal ditandatanganinya surat ini.
          Adapun hak-hak Saudara sebagaimana diatur dalam perundang-undangan
          akan kami berikan sesuai dengan ketentuan yang berlaku.
        </Text>

        <View style={{ borderTopWidth: 1, flexDirection: "row" }}>
          <View
            style={{
              flex: 1,
              justifyContent: "space-between",
              height: 100,
              borderRightWidth: 1,
              alignItems: "center",
            }}
          >
            <Text style={styles.textNormal}>Direktur Pelaksana</Text>
            <Text style={styles.textNormal}>Irwanto Hartono</Text>
          </View>

          <View
            style={{
              flex: 1,
              justifyContent: "space-between",
              height: 100,
              borderRightWidth: 1,
              alignItems: "center",
            }}
          >
            <Text style={styles.textNormal}>Atasan Langsung</Text>
            <Text style={styles.textNormal}>Asteria Ratna Widihastuti</Text>
          </View>

          <View
            style={{
              flex: 1,
              justifyContent: "space-between",
              height: 100,
              alignItems: "center",
            }}
          >
            <Text
              style={[
                styles.textNormal,
                {
                  textAlign: "center",
                  paddingHorizontal: 5,
                },
              ]}
            >
              Karyawan yang bersangkutan
            </Text>
            <Text style={styles.textNormal}>Victoria</Text>
          </View>
        </View>

        <View style={{ borderTopWidth: 1, flexDirection: "row" }}>
          {Array.from({ length: 3 }).map((_, index) => (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                height: 20,
                borderRightWidth: index !== 2 && 1,
                alignItems: "flex-start",
                paddingLeft: 5,
              }}
              key={index}
            >
              <Text style={styles.textNormal}>Tanggal :</Text>
            </View>
          ))}
        </View>
      </View>

      <Text style={[styles.textNormal, { marginTop: 10 }]}>Distribusi :</Text>

      <View style={{ paddingLeft: 20, marginTop: 15 }}>
        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.textNormal, { width: "15%" }]}>1. Asli</Text>
          <Text style={styles.textNormal}>- Karyawan yang bersangkutan</Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.textNormal, { width: "15%" }]}>2. Copy 1</Text>
          <Text style={styles.textNormal}>- Atasan langsung</Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.textNormal, { width: "15%" }]}>3. Copy 2</Text>
          <Text style={styles.textNormal}>
            - Deputi Direktur Pelaksana I & II
          </Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.textNormal, { width: "15%" }]}>4. Copy 3</Text>
          <Text style={styles.textNormal}>- Kepala Divisi Pendidikan</Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.textNormal, { width: "15%" }]}>5. Copy 4</Text>
          <Text style={styles.textNormal}>- Kepala Jenjang SD</Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.textNormal, { width: "15%" }]}>6. Copy 5</Text>
          <Text style={styles.textNormal}>- SDM</Text>
        </View>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  containerDocument: {
    height: "11.69in",
    width: "8.26in",
    backgroundColor: "white",
    alignSelf: "center",
    paddingHorizontal: 83.52 - 18.27,
    paddingTop: 30,
    paddingBottom: 75.84,
  },

  containerHeader: {
    alignItems: "center",
    marginBottom: 10,
  },

  kopSurat: {
    left: 0,
    position: "absolute",
    top: 0,
    width: "100%",
  },

  textBold: {
    fontFamily: "Times New Roman",
    fontSize: 12,
    fontWeight: "bold",
  },

  textNormal: {
    fontFamily: "Times New Roman",
    fontSize: 12,
    textAlign: "justify",
  },

  titleHeader: {
    fontFamily: "Times New Roman",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});
