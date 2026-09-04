import { Page, Text, Image, StyleSheet, View, Font } from "@react-pdf/renderer";

Font.register({
  family: "Cambria",
  fonts: [
    { src: "/assets/fonts/Cambria/cambria-regular.ttf" },
    { src: "/assets/fonts/Cambria/cambria-bold.ttf", fontWeight: "bold" },
  ],
});

Font.registerHyphenationCallback((word) => {
  return [word];
});

export default function PengangkatanSementara(data) {
  const payload = data?.data ?? data ?? {};

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

  function formatAlamat(a) {
    if (!a) return "—";
    if (typeof a === "string") return a.trim() || "—";

    const alamat = String(a?.alamat ?? "").trim();
    const rt = String(a?.rt ?? "").trim();
    const rw = String(a?.rw ?? "").trim();
    const kel = String(a?.kelurahan?.nama ?? "").trim();
    const kec = String(a?.kecamatan?.nama ?? "").trim();
    const kota = String(a?.kota?.nama ?? "").trim();
    const prov = String(a?.provinsi?.nama ?? "").trim();
    const kodePos = String(a?.kode_pos ?? "").trim();

    const rtRw = rt || rw ? `RT ${rt || "-"} / RW ${rw || "-"}` : "";
    const bagian = [alamat, rtRw, kel, kec, kota, prov, kodePos]
      .map((x) => String(x || "").trim())
      .filter(Boolean);

    return bagian.join(", ") || "—";
  }

  function formatTanggalIndo(value) {
    if (!value) return "—";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";

    const tanggal = date.getDate();
    const bulan = BULAN[date.getMonth()];
    const tahun = date.getFullYear();

    return `${tanggal} ${bulan} ${tahun}`;
  }
  const getNamaUnit = (uk) => {
    const detail = uk?.unit_kerja_detail;

    return (
      detail?.seksi?.nama_sek ||
      detail?.bagian?.nama_bag ||
      detail?.divisi?.nama_div ||
      detail?.deputi?.nama_dep ||
      detail?.deputi?.nama_deputi ||
      detail?.direktur?.nama_dir ||
      detail?.direktur?.nama_direktur ||
      null
    );
  };

  const unitKerja = payload?.unitKerja ?? payload?.unit_kerja_karyawan;
  const divisiList = Array.isArray(unitKerja)
    ? unitKerja.map((uk) => getNamaUnit(uk)).filter(Boolean)
    : unitKerja
      ? [getNamaUnit(unitKerja)].filter(Boolean)
      : [];
  const divisiText = divisiList.join(", ") || "—";
  const namaLengkap =
    String(payload?.nama_lengkap ?? payload?.nama ?? "").trim() || "—";
  const tgl_join_penabur_jkt = formatTanggalIndo(payload?.tgl_join_penabur_jkt);
  const tanggal_inactive = formatTanggalIndo(payload?.tanggal_inactive);
  const today = formatTanggalIndo(new Date());
  const kode_golongan = payload?.kode_golongan ?? "—";
  const jabatan =
    unitKerja?.jabatan?.jabatan ?? unitKerja?.[0]?.jabatan?.jabatan ?? "—";
  return (
    <Page style={styles.containerDocument} size={["8.27in", "11.69in"]}>
      <Image src={"/assets/images/kop.png"} style={styles.kopSurat} fixed />

      <View style={styles.containerHeader}>
        <Text style={styles.titleHeader}>SURAT PENGANGKATAN SEMENTARA</Text>
        <Text style={[styles.textNormal, { color: "blue" }]}>
          Nomor : 001/SDM/TKL/08/2024
        </Text>
      </View>

      <View style={{ flexDirection: "row", marginTop: 24 }}>
        <View style={{ width: "1.5in" }}>
          <Text style={styles.textNormal}>Menimbang</Text>
        </View>
        <View>
          <Text style={[styles.textNormal]}>
            : Kebutuhan untuk mempekerjakan{" "}
            <Text style={{ color: "blue" }}>jabatan & mata pelajaran</Text>
          </Text>
          <Text style={[styles.textNormal, { paddingLeft: 5 }]}>
            Sementara di <Text style={{ color: "blue" }}>lokasi kerja.</Text>
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", marginTop: 12 }}>
        <View style={{ width: "1.5in" }}>
          <Text style={styles.textNormal}>Menetapkan</Text>
        </View>
        <View>
          <Text style={[styles.textNormal]}>
            Sdr. <Text style={{ color: "blue" }}>Nama karyawan</Text>
          </Text>
          <Text style={[styles.textNormal, { paddingLeft: 5 }]}>
            sebagai{" "}
            <Text style={{ color: "blue" }}>
              jabatan & mata pelajaran Sementara
            </Text>
          </Text>
        </View>
      </View>

      <Text style={[styles.textNormal, { marginTop: 12 }]}>
        dalam dinas Badan Pendidikan Kristen PENABUR Jakarta dengan
        ketentuan-ketentuan sebagai berikut:
      </Text>

      <View style={{ flexDirection: "row" }}>
        <View
          style={{
            flexDirection: "row",
            width: "2in",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.textNormal, { width: "0.3in" }]}>1.</Text>
            <Text style={styles.textNormal}>Ditempatkan</Text>
          </View>
        </View>

        <View>
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.textNormal, { width: "0.3in" }]}>: a.</Text>
            <Text style={[styles.textNormal, { color: "blue" }]}>
              {divisiList[0] ?? "—"}
            </Text>
          </View>
          <Text
            style={[styles.textNormal, { paddingLeft: "0.3in", color: "blue" }]}
          >
            Alamat sekolah 1
          </Text>
        </View>
      </View>

      <View style={{ marginTop: 15, paddingLeft: "30%" }}>
        <View style={{ flexDirection: "row", paddingLeft: 5 }}>
          <Text style={[styles.textNormal, { width: 15 }]}>b.</Text>
          <Text style={[styles.textNormal, { color: "blue" }]}>
            {divisiList[1] ?? "—"}
          </Text>
        </View>
        <Text style={[styles.textNormal, { paddingLeft: 20, color: "blue" }]}>
          Alamat sekolah 2
        </Text>
      </View>

      <View style={{ marginTop: 15, paddingLeft: "30%" }}>
        <View style={{ flexDirection: "row", paddingLeft: 5 }}>
          <Text style={[styles.textNormal, { width: 15 }]}>c.</Text>
          <Text style={[styles.textNormal, { color: "blue" }]}>
            {divisiList[2] ?? "—"}
          </Text>
        </View>
        <Text style={[styles.textNormal, { paddingLeft: 20, color: "blue" }]}>
          Alamat sekolah 3
        </Text>
      </View>

      <View style={{ flexDirection: "row", marginTop: 15 }}>
        <View
          style={{
            flexDirection: "row",
            width: "30%",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.textNormal, { width: 20 }]}>2.</Text>
            <Text style={styles.textNormal}>Gaji dibayarkan di</Text>
          </View>
          <Text style={styles.textNormal}>:</Text>
        </View>

        <Text style={[styles.textNormal, { paddingLeft: 5 }]}>
          Sekretariat BPK PENABUR Jakarta dengan ketentuan:
        </Text>
      </View>

      <View
        style={{
          marginTop: 5,
          paddingLeft: "30%",
          flexDirection: "row",
          marginLeft: 5,
        }}
      >
        <Text style={[styles.textNormal, { width: 15 }]}>a.</Text>
        <Text style={styles.textNormal}>
          Gaji dibayarkan sesuai dengan peraturan yang berlaku di BPK PENABUR
          Jakarta.
        </Text>
      </View>

      <View
        style={{
          marginTop: 5,
          paddingLeft: "30%",
          flexDirection: "row",
          marginLeft: 5,
        }}
      >
        <Text style={[styles.textNormal, { width: 15 }]}>b.</Text>
        <Text style={styles.textNormal}>
          Pajak penghasilan (PPh 21) ditanggung oleh karyawan yang namanya
          tercantum dalam surat ini.
        </Text>
      </View>

      <View style={{ flexDirection: "row", marginTop: 15 }}>
        <View
          style={{
            flexDirection: "row",
            width: "30%",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.textNormal, { width: 20 }]}>3.</Text>
            <Text style={styles.textNormal}>Masa berlaku</Text>
          </View>
          <Text style={styles.textNormal}>:</Text>
        </View>

        <Text style={[styles.textNormal, { paddingLeft: 5, color: "blue" }]}>
          <Text style={styles.textBold}>tgl awal kontrak</Text>
          s.d.
          <Text style={styles.textBold}>tgl akhir kontrak.</Text>
        </Text>
      </View>

      <Text style={[styles.textNormal, { marginTop: 15 }]}>
        Demikian Surat Pengangkatan Sementara ini dibuat, semoga Saudara dapat
        menerima dan melaksanakan tugas Saudara dengan baik.
      </Text>

      <View
        style={{
          alignSelf: "flex-end",
          marginRight: 30,
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <Text style={styles.textNormal}>
          Jakarta, <Text style={{ color: "blue" }}>tanggal surat</Text>
        </Text>
        <Text style={styles.textNormal}>BPK PENABUR Jakarta,</Text>

        <Text
          style={[
            styles.textBold,
            { textDecoration: "underline", marginTop: 70, color: "blue" },
          ]}
        >
          Irwanto Hartono
        </Text>
        <Text style={styles.textNormal}> Plt. Direktur Pelaksana</Text>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  containerDocument: {
    backgroundColor: "white",
    alignSelf: "center",
    paddingHorizontal: "0.87in",
    paddingTop: 126,
    paddingBottom: "0.79in",
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
    fontFamily: "Cambria",
    fontSize: 12,
    fontWeight: "bold",
    lineHeight: 1.15,
  },

  textNormal: {
    fontFamily: "Cambria",
    fontSize: 12,
    lineHeight: 1.15,
  },

  titleHeader: {
    fontFamily: "Cambria",
    textDecoration: "underline",
    fontWeight: "bold",
    lineHeight: 1.15,
    fontSize: 14,
  },
});
