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

Font.registerHyphenationCallback((word) => {
  return [word];
});

export default function KeteranganKaryawanAktif({ data }) {
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

  const namaLengkap =
    String(payload?.nama_lengkap ?? payload?.nama ?? "").trim() || "—";
  const tgl_join_penabur_jkt = formatTanggalIndo(payload?.tgl_join_penabur_jkt);
  const nik = String(payload?.nik ?? "").trim() || "—";
  const today = formatTanggalIndo(new Date());

  const unitKerja = payload?.unitKerja ?? payload?.unit_kerja_karyawan;
  const jabatan =
    unitKerja?.jabatan?.jabatan ?? unitKerja?.[0]?.jabatan?.jabatan ?? "—";
  const alamatKtpDetail = formatAlamat(
    payload?.alamatKtpDetail ?? payload?.alamat_ktp_detail,
  );
  return (

    <Page style={styles.containerDocument} size={"A4"}>
      <Image src={"/assets/images/kop.png"} style={styles.kopSurat} fixed />

      <View style={styles.containerHeader}>
        <Text style={styles.titleHeader}>SURAT KETERANGAN</Text>
        <Text style={[styles.textNormal, { color: "blue" }]}>
          Nomor : 01/SDM/Sket/01/2025
        </Text>
      </View>

      <Text style={[styles.textNormal, { marginTop: 20 }]}>
        Yang bertandatangan di bawah ini menerangkan bahwa :
      </Text>

      <View style={{ paddingHorizontal: 20, marginTop: 20, rowGap: 10 }}>
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              width: "40%",
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <Text style={styles.textNormal}>Nama</Text>
            <Text style={styles.textNormal}>:</Text>
          </View>

          <View style={{ flex: 1, paddingLeft: 10 }}>
            <Text style={styles.textNormal}>{namaLengkap}</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              width: "40%",
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <Text style={styles.textNormal}>NIK</Text>
            <Text style={styles.textNormal}>:</Text>
          </View>

          <View style={{ flex: 1, paddingLeft: 10 }}>
            <Text style={styles.textNormal}>{nik}</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              width: "40%",
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <Text style={styles.textNormal}>Jabatan</Text>
            <Text style={styles.textNormal}>:</Text>
          </View>

          <View style={{ flex: 1, paddingLeft: 10 }}>
            <Text style={styles.textNormal}>{jabatan}</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              width: "40%",
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <Text style={styles.textNormal}>Alamat</Text>
            <Text style={styles.textNormal}>:</Text>
          </View>

          <View style={{ flex: 1, paddingLeft: 10 }}>
            <Text style={styles.textNormal}>
             {alamatKtpDetail}
            </Text>
          </View>
        </View>
      </View>

      <Text style={[styles.textNormal, { marginTop: 15 }]}>
        adalah benar karyawan tetap BPK PENABUR Jakarta yang bekerja dari
       {tgl_join_penabur_jkt}  dan sampai sekarang masih aktif bekerja.
      </Text>

      <Text style={[styles.textNormal, { marginTop: 20 }]}>
        Demikian Surat Keterangan ini kami buat untuk keperluan pengajuan KPR di
        Bank Tabungan Negara (BTN) Syariah.
      </Text>

      <View style={{ marginTop: 40, alignSelf: "flex-end", width: "50%" }}>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.textNormal}>Jakarta, {today}</Text>
          <Text style={styles.textNormal}>BPK PENABUR Jakarta</Text>
        </View>

        <View style={{ flexDirection: "row", marginTop: 80, width: "100%" }}>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={[styles.textNormal, { textDecoration: "underline" }]}>
              Dena Ekawati
            </Text>

            <Text style={styles.textNormal}>Kepala Bagian PPKSDM</Text>
          </View>
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

  textNormal: {
    fontFamily: "Times New Roman",
    fontSize: 12,
    textAlign: "justify",
  },

  textBold: {
    fontFamily: "Times New Roman",
    fontWeight: "bold",
    fontSize: 12,
  },

  titleHeader: {
    fontFamily: "Times New Roman",
    textDecoration: "underline",
    fontWeight: "bold",
    fontSize: 15,
  },
});
