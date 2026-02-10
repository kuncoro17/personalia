import { Page, Text, Image, StyleSheet, View, Font } from "@react-pdf/renderer";

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
Font.registerHyphenationCallback((word) => [word]);

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

function formatTanggalIndo(dateLike) {
  const d = dateLike ? new Date(dateLike) : new Date();
  if (Number.isNaN(d.getTime())) return "—";
  return `${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`;
}

export default function KenaikanRuang({ data }) {
  // support: {success,message,data:{...}} atau langsung {...}
  const payload = data?.data ? data.data : data;

  // ✅ tampilkan dulu id & nama
  const idKaryawan = payload?.id_karyawan ?? payload?.id ?? "—";
  const namaLengkap =
    (payload?.nama_lengkap ?? payload?.nama ?? "").toString().trim() || "—";
  const nik = (payload?.nik ?? "").toString().trim() || "—";

  // header
  const nomorSK =
    payload?.nomor_sk ?? payload?.nomor ?? "0001/KRG/JKT/SDM/01/2025";

  // isi keputusan
  const status = payload?.status ?? payload?.jabatan_kategori ?? "—";
  const pangkatLama = payload?.pangkat_lama ?? payload?.gol_lama ?? "—";
  const pangkatBaru = payload?.pangkat_baru ?? payload?.gol_baru ?? "—";

  // tanggal surat (today kalau tidak ada dari API)
  const tanggalSK = formatTanggalIndo(
    payload?.tanggal_sk ?? payload?.tanggal ?? null,
  );

  // lokasi (fallback)
  const ditetapkanDi = payload?.ditetapkan_di ?? "Jakarta";

  return (
    <Page style={styles.containerDocument} size="A4">
      <Image src="/assets/images/kop.png" style={styles.kopSurat} fixed />

      <View style={styles.containerHeader}>
        <Text style={styles.titleHeader}>SURAT KEPUTUSAN</Text>
        <Text style={[styles.textNormal, { color: "blue" }]}>
          Nomor: {nomorSK}
        </Text>
      </View>

      {/* ✅ DEBUG minimal - biar yakin payload masuk */}
      <View style={{ marginTop: 6 }}>
        <Text style={{ fontSize: 8 }}>
          DEBUG: id_karyawan={String(idKaryawan)} | nama_lengkap={namaLengkap} |
          nik={nik}
        </Text>
      </View>

      <View style={{ marginTop: 20, alignItems: "center" }}>
        <Text style={[styles.textNormal, { textAlign: "center" }]}>
          TENTANG
        </Text>
        <Text style={[styles.textBold, { textAlign: "center", width: "70%" }]}>
          KENAIKAN RUANG/KUARTER BADAN PENDIDIKAN KRISTEN PENABUR JAKARTA
        </Text>
      </View>

      <View style={{ marginTop: 20 }}>
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              width: "25%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.textNormal}>Mengingat</Text>
            <Text style={styles.textNormal}>:</Text>
          </View>
          <View style={{ flex: 1, width: "75%" }}>
            <View style={{ flexDirection: "row" }}>
              <Text style={[styles.textNormal, { paddingLeft: 5 }]}>1.</Text>
              <Text style={[styles.textNormal, { paddingLeft: 5 }]}>
                Peraturan Perusahaan BPK PENABUR Pasal 14: Kepangkatan dan
                Kenaikan Pangkat Karyawan (KKPK).
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={[styles.textNormal, { paddingLeft: 5 }]}>2.</Text>
              <Text style={[styles.textNormal, { paddingLeft: 5 }]}>
                Pedoman Kepangkatan dan Kenaikan Pangkat Karyawan.
              </Text>
            </View>
          </View>
        </View>

        <View style={{ flexDirection: "row", marginTop: 4 }}>
          <View
            style={{
              width: "25%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.textNormal}>Menimbang</Text>
            <Text style={styles.textNormal}>:</Text>
          </View>
          <View style={{ flex: 1, width: "75%" }}>
            <Text style={[styles.textNormal, { paddingLeft: 5 }]}>
              Hasil penilaian kinerja berdasarkan Sistem Kepangkatan dan
              Kenaikan Pangkat Karyawan (KKPK) Tahun Pelajaran 2024/2025.
            </Text>
          </View>
        </View>
      </View>

      <Text style={[styles.textNormal, { marginTop: 20, textAlign: "center" }]}>
        MEMUTUSKAN
      </Text>

      <View style={{ marginTop: 20, rowGap: 10 }}>
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              width: "25%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.textNormal}>PERTAMA</Text>
            <Text style={styles.textNormal}>:</Text>
          </View>

          <View style={{ flex: 1, width: "75%", paddingLeft: 5 }}>
            <Text style={styles.textNormal}>
              Menaikkan Ruang/Kuarter karyawan tetap BPK PENABUR Jakarta sebagai
              berikut:
            </Text>

            {/* 1 Nama */}
            <View style={{ flexDirection: "row" }}>
              <View style={{ width: 20 }}>
                <Text style={styles.textNormal}>1.</Text>
              </View>
              <View
                style={{
                  width: 150,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.textNormal}>Nama</Text>
                <Text style={styles.textNormal}>:</Text>
              </View>
              <View style={{ flex: 1, paddingLeft: 5 }}>
                <Text style={styles.textNormal}>{namaLengkap}</Text>
              </View>
            </View>

            {/* 2 NIK */}
            <View style={{ flexDirection: "row" }}>
              <View style={{ width: 20 }}>
                <Text style={styles.textNormal}>2.</Text>
              </View>
              <View
                style={{
                  width: 150,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.textNormal}>NIK</Text>
                <Text style={styles.textNormal}>:</Text>
              </View>
              <View style={{ flex: 1, paddingLeft: 5 }}>
                <Text style={styles.textNormal}>{nik}</Text>
              </View>
            </View>

            {/* 3 Status */}
            <View style={{ flexDirection: "row" }}>
              <View style={{ width: 20 }}>
                <Text style={styles.textNormal}>3.</Text>
              </View>
              <View
                style={{
                  width: 150,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.textNormal}>Status</Text>
                <Text style={styles.textNormal}>:</Text>
              </View>
              <View style={{ flex: 1, paddingLeft: 5 }}>
                <Text style={styles.textNormal}>{status}</Text>
              </View>
            </View>

            {/* 4 Gol lama */}
            <View style={{ flexDirection: "row" }}>
              <View style={{ width: 20 }}>
                <Text style={styles.textNormal}>4.</Text>
              </View>
              <View
                style={{
                  width: 150,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.textNormal}>Pangkat/Gol. Lama</Text>
                <Text style={styles.textNormal}>:</Text>
              </View>
              <View style={{ flex: 1, paddingLeft: 5 }}>
                <Text style={styles.textNormal}>{pangkatLama}</Text>
              </View>
            </View>

            {/* 5 Gol baru */}
            <View style={{ flexDirection: "row" }}>
              <View style={{ width: 20 }}>
                <Text style={styles.textNormal}>5.</Text>
              </View>
              <View
                style={{
                  width: 150,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.textNormal}>Pangkat/Gol. Baru</Text>
                <Text style={styles.textNormal}>:</Text>
              </View>
              <View style={{ flex: 1, paddingLeft: 5 }}>
                <Text style={styles.textNormal}>{pangkatBaru}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              width: "25%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.textNormal}>KEDUA</Text>
            <Text style={styles.textNormal}>:</Text>
          </View>
          <View style={{ flex: 1, width: "75%" }}>
            <Text style={[styles.textNormal, { paddingLeft: 5 }]}>
              Kepada yang bersangkutan diberikan penghasilan sesuai ketentuan
              yang berlaku.
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              width: "25%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.textNormal}>KETIGA</Text>
            <Text style={styles.textNormal}>:</Text>
          </View>
          <View style={{ flex: 1, width: "75%" }}>
            <Text style={[styles.textNormal, { paddingLeft: 5 }]}>
              Keputusan ini diberikan kepada yang bersangkutan untuk diketahui
              dan dilaksanakan sebagaimana mestinya.
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              width: "25%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.textNormal}>KEEMPAT</Text>
            <Text style={styles.textNormal}>:</Text>
          </View>
          <View style={{ flex: 1, width: "75%" }}>
            <Text style={[styles.textNormal, { paddingLeft: 5 }]}>
              Keputusan ini diberikan kepada yang bersangkutan untuk diketahui
              dan dilaksanakan sebagaimana mestinya.
            </Text>
          </View>
        </View>
      </View>

      <View style={{ width: "40%", alignSelf: "flex-end", marginTop: 40 }}>
        <View>
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                width: "45%",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.textNormal}>Ditetapkan di</Text>
              <Text style={styles.textNormal}>:</Text>
            </View>
            <View style={{ flex: 1, width: "55%" }}>
              <Text style={[styles.textNormal, { paddingLeft: 5 }]}>
                {ditetapkanDi}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                width: "45%",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.textNormal}>Pada tanggal</Text>
              <Text style={styles.textNormal}>:</Text>
            </View>
            <View style={{ flex: 1, width: "55%" }}>
              {/* ✅ today */}
              <Text style={[styles.textNormal, { paddingLeft: 5 }]}>
                {tanggalSK}
              </Text>
            </View>
          </View>
        </View>

        <Text style={[styles.textNormal, { marginTop: 40 }]}>
          BPK PENABUR Jakarta
        </Text>

        <View style={{ marginTop: 40 }}>
          <Text
            style={[
              styles.textNormal,
              { textDecoration: "underline", color: "blue" },
            ]}
          >
            Irwanto Hartono
          </Text>
          <Text style={[styles.textNormal, { color: "blue" }]}>
            Plt. Direktur Pelaksana
          </Text>
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
    paddingTop: 120,
    paddingBottom: 75.84,
  },
  containerHeader: { alignItems: "center", marginBottom: 10 },
  kopSurat: { left: 0, position: "absolute", top: 0, width: "100%" },
  textNormal: {
    fontFamily: "Times New Roman",
    fontSize: 12,
    textAlign: "justify",
  },
  textBold: { fontFamily: "Times New Roman", fontSize: 12, fontWeight: "bold" },
  titleHeader: {
    fontFamily: "Times New Roman",
    textDecoration: "underline",
    fontWeight: "bold",
    fontSize: 15,
  },
});
