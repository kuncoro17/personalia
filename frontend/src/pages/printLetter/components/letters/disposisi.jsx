import { Page, Text, Image, StyleSheet, View, Font } from "@react-pdf/renderer";

Font.register({
  family: "Cambria",
  fonts: [
    { src: "/assets/fonts/Cambria/cambria-regular.ttf" },
    { src: "/assets/fonts/Cambria/cambria-bold.ttf", fontWeight: "bold" },
  ],
});
Font.registerHyphenationCallback((word) => [word]);

const pad2 = (n) => String(n).padStart(2, "0");
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

function formatTanggalIndo(d) {
  if (!d) return "—";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "—";
  return `${dt.getDate()} ${BULAN[dt.getMonth()]} ${dt.getFullYear()}`;
}

export default function Disposisi({ data }) {
  // ✅ basic employee
  const nama =
    (data?.nama_lengkap ?? data?.nama ?? "").toString().trim() || "—";
  const nik = (data?.nik ?? "").toString().trim();
  const namaNik = nik ? `${nama} (${nik})` : nama;

  // ✅ tanggal surat = today
  const today = new Date();
  const tanggalSurat = `${today.getDate()} ${BULAN[today.getMonth()]} ${today.getFullYear()}`;
  const tgl_join_penabur_jkt = (data?.tgl_join_penabur_jkt ?? "")
    .toString()
    .trim();
  // ✅ contoh mapping field (sesuaikan kalau beda)
  const nama_jabatan =
    data?.unitKerja?.jabatan?.jabatan?.toString().trim() || "—";
  const bidangStudi =
    (data?.jam_mengajar ?? [])
      .map((j) => (j?.mapel?.nama_mapel ?? "").toString().trim())
      .filter(Boolean)
      .join(", ") || "—";

  const jamMengajar =
    (data?.jam_mengajar ?? [])
      .map((j) => {
        const jam = j?.jam_mengajar;

        return jam ? ` (${jam} Jam)` : null;
      })
      .filter(Boolean)
      .join(", ") || "—";
  const statusKontrak =
    (data?.status_kontrak ?? data?.kode_status_gp ?? "").toString().trim() ||
    "—";
  const unit_kerja =
    data?.nama_div?.jabatan?.nama_div?.toString().trim() || "—";
  // ✅ unit kerja (kalau API kamu punya list)
  // contoh: data.unit_kerja = ["SMPK 1", "SMAK 2", ...]
 const getNamaUnit = (uk) => {
  const detail = uk?.unit_kerja_detail;

  return (
    detail?.seksi?.nama_sek ||
    detail?.bagian?.nama_bag ||
    detail?.divisi?.nama_div ||
    detail?.deputi?.nama_deputi ||
    detail?.direktur?.nama_direktur ||
    null
  );
};

const divisiList = Array.isArray(data?.unitKerja)
  ? data.unitKerja
      .map((uk) => getNamaUnit(uk))
      .filter(Boolean)
  : data?.unitKerja
    ? [getNamaUnit(data.unitKerja)].filter(Boolean)
    : [];


      

  const namaDivisi = divisiList.join(", ") || "—";
  const kode_status_gp =
    (data?.kode_status_gp ?? data?.kode_status_gp ?? "").toString().trim() ||
    "—";
  return (
    <Page style={styles.containerDocument} size={["8.5in", "11in"]}>
      <Image src="/assets/images/kop2.png" style={styles.kopSurat} fixed />

      {/* tanggal surat */}
      <Text
        style={[
          styles.textNormal,
          { textAlign: "right", paddingRight: "0.3in", fontSize: 11 },
        ]}
      >
        Jakarta, <Text style={{ color: "blue" }}>{tanggalSurat}</Text>
      </Text>

      <View style={{ paddingLeft: "4.33in", marginTop: "8pt" }}>
        <Text style={[styles.textNormal, { lineHeight: 1.15 }]}>
          Kepada Yth.
        </Text>
        <Text style={[styles.textBold, { lineHeight: 1.15 }]}>
          Ka. <Text style={{ color: "blue" }}>{namaDivisi}</Text>
        </Text>
        <Text style={[styles.textNormal, { lineHeight: 1.15 }]}>di Tempat</Text>
      </View>

      <View
        style={{
          paddingHorizontal: "0.19in",
          borderWidth: 1,
          borderColor: "black",
          marginTop: 2.5,
          paddingVertical: 1.1,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Text style={[{ width: "2in" }, styles.textBold]}>Perihal</Text>
          <Text style={styles.textNormal}>: Penempatan Pegawai</Text>
        </View>

        <Text style={[{ marginTop: 5.5 }, styles.textBold]}>Disposisi</Text>

        <View style={{ flexDirection: "row", marginTop: 5.5 }}>
          <View
            style={{ width: "2in", flexDirection: "row", alignItems: "center" }}
          >
            <Text style={[{ width: "0.25in" }, styles.textNormal]}>•</Text>
            <Text style={styles.textNormal}>Nama</Text>
          </View>
          <Text style={[styles.textNormal, { color: "blue" }]}>: {nama}</Text>
        </View>

        <View style={{ flexDirection: "row", marginTop: 4.7 }}>
          <View
            style={{ width: "2in", flexDirection: "row", alignItems: "center" }}
          >
            <Text style={[{ width: "0.25in" }, styles.textNormal]}>•</Text>
            <Text style={styles.textNormal}>Jabatan</Text>
          </View>
          <Text style={[styles.textNormal, { color: "blue" }]}>
            : {nama_jabatan}
          </Text>
        </View>

        <View style={{ flexDirection: "row", marginTop: 4.7 }}>
          <View
            style={{ width: "2in", flexDirection: "row", alignItems: "center" }}
          >
            <Text style={[{ width: "0.25in" }, styles.textNormal]}>•</Text>
            <Text style={styles.textNormal}>Bidang Studi</Text>
          </View>
          <Text style={[styles.textNormal, { color: "blue" }]}>
            : {bidangStudi}
          </Text>
        </View>

        <View style={{ flexDirection: "row", marginTop: 4.7 }}>
          <View
            style={{ width: "2in", flexDirection: "row", alignItems: "center" }}
          >
            <Text style={[{ width: "0.25in" }, styles.textNormal]}>•</Text>
            <Text style={styles.textNormal}>Terhitung Mulai Tanggal</Text>
          </View>
          <Text style={[styles.textNormal, { color: "blue" }]}>
            : {tgl_join_penabur_jkt}
          </Text>
        </View>

        <View style={{ flexDirection: "row", marginTop: 4.7 }}>
          <View
            style={{ width: "2in", flexDirection: "row", alignItems: "center" }}
          >
            <Text style={[{ width: "0.25in" }, styles.textNormal]}>•</Text>
            <Text style={styles.textNormal}>Status Kepegawaian</Text>
          </View>
          <Text style={[styles.textNormal, { color: "blue" }]}>
            : {statusKontrak}
          </Text>
        </View>

        {/* Unit kerja list */}
        <View style={{ flexDirection: "row", marginTop: 4.7 }}>
          <View
            style={{ width: "2in", flexDirection: "row", alignItems: "center" }}
          >
            <Text style={[{ width: "0.25in" }, styles.textNormal]}>•</Text>
            <Text style={styles.textNormal}>Unit Kerja</Text>
          </View>

          <Text style={styles.textNormal}>
            : (1) <Text style={styles.textBold}>{namaDivisi}</Text>
          </Text>
        </View>

        <Text style={[styles.textNormal, { marginVertical: 5.5 }]}>
          Keterangan :
        </Text>
        <Text style={styles.textNormal}>Mohon dibina dan dievaluasi</Text>
      </View>

      {/* (bagian bawah kamu biarkan sama) */}

      <View
        style={{
          paddingHorizontal: "0.19in",
          borderWidth: 1,
          borderTopWidth: 0,
          borderColor: "black",
          paddingVertical: 1.1,
        }}
      >
        <Text style={styles.textBold}>MOHON DIISI / DIKONFIRMASIKAN</Text>
        <View style={{ flexDirection: "row", marginTop: 5.5 }}>
          <View
            style={{
              width: "2.73in",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={styles.textNormal}>A. Dipekerjakan Mulai Tanggal</Text>
          </View>
          <Text style={styles.textNormal}>{tgl_join_penabur_jkt}</Text>
        </View>

        <Text style={[styles.textNormal, { marginTop: 5.6 }]}>
          B. Calon Guru / Karyawan ({kode_status_gp})
        </Text>

        <Text style={[styles.textBold, { marginVertical: 5.5 }]}>
          Diisi Khusus Untuk Calon Guru
        </Text>

        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              width: "2.73in",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={styles.textNormal}>C. Mengajar Bidang Studi</Text>
          </View>
          <Text style={styles.textNormal}>{bidangStudi}</Text>
        </View>

        <View style={{ flexDirection: "row", marginTop: 5.5 }}>
          <View
            style={{
              width: "2.73in",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={styles.textNormal}>D. Jumlah Jam Mengajar</Text>
          </View>
          <Text style={styles.textNormal}>{jamMengajar}</Text>
        </View>

        <View style={{ flexDirection: "row", marginTop: 5.5 }}>
          <View
            style={{
              width: "2.73in",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={styles.textNormal}>E. Pengganti Guru</Text>
          </View>
          <Text style={styles.textNormal}>
            ______________________________, tugas________________Jam
          </Text>
        </View>
      </View>

      {/* ... table V kamu lanjutkan sama persis ... */}

      <Text style={[styles.textBold, { marginTop: 13.1 }]}>
        CATATAN KEPALA SEKOLAH / BAGIAN:
      </Text>

      <Text
        style={[styles.textNormal, { marginTop: 19, paddingLeft: "4.81in" }]}
      >
        Menerima tugas tersebut di atas,
      </Text>

      <View style={{ marginTop: 68, paddingLeft: "0.44in" }}>
        <View style={{ flexDirection: "row" }}>
          <Text
            style={[
              styles.textNormal,
              { textDecoration: "underline", width: "4.37in" },
            ]}
          >
            .....................................................
          </Text>
          <Text
            style={[
              styles.textBold,
              { textDecoration: "underline", color: "blue" },
            ]}
          >
            {nama}
          </Text>
        </View>
        <Text style={styles.textNormal}>Kepala Sekolah / Bagian</Text>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  containerDocument: {
    backgroundColor: "white",
    alignSelf: "center",
    paddingLeft: "0.52in",
    paddingRight: "0.81in",
    paddingTop: 116,
    paddingBottom: "0.59in",
  },
  kopSurat: { left: 0, position: "absolute", top: 0, width: "100%" },
  textNormal: { fontFamily: "Cambria", fontSize: 10, textAlign: "justify" },
  textBold: { fontFamily: "Cambria", fontSize: 10, fontWeight: "bold" },
});
