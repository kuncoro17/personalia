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

export default function FormulirCkeYayasan({ data }) {
  // ✅ today
  const today = new Date();
  const tanggalSurat = `${today.getDate()} ${BULAN[today.getMonth()]} ${today.getFullYear()}`;

  // ✅ nomor surat dinamis (sama pola yang kamu pakai)
  // 001/SDM/PT/02/2026
  const nomorSurat = `001/SDM/PT/${pad2(today.getMonth() + 1)}/${today.getFullYear()}`;

  // ✅ mapping data (sesuaikan field sesuai API kamu)
  const nama =
    (data?.nama_lengkap ?? data?.nama ?? "").toString().trim() || "—";
  const agama = (data?.agama_detail?.agama ?? "").toString().trim() || "—";
  const nik = (data?.nik ?? "").toString().trim() || "—";
  const tgl_join_penabur_jkt =
    (data?.tgl_join_penabur_jkt ?? "").toString().trim() || "—";
  // contoh field lain (kalau ada di API)

  const tempatLahir = (data?.tempat_lahir ?? "").toString().trim();
  const tglLahir = formatTanggalIndo(data?.birth_date ?? data?.tanggal_lahir);
  const ttl =
    tempatLahir && tglLahir !== "—"
      ? `${tempatLahir}, ${tglLahir}`
      : tempatLahir || tglLahir || "—";

  const statusKawin = (data?.status_nikah ?? "").toString().trim() || "—";
  const jumlahAnak = String(data?.jumlah_anak ?? "0");
  const tingkat = (data?.tingkat ?? "").toString().trim() || "—";
  
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

  const tipePerubahan = data?.["history.value_lama"]?.toString().trim() || "—";

  const extractAfterColon = (v) => {
    const s = (v ?? "").toString().trim();
    if (!s) return "—";
    return s.includes(":") ? s.split(":").slice(1).join(":").trim() : s;
  };

  const golongan_lama = extractAfterColon(data?.["history.value_lama"]);
  const golongan_baru = extractAfterColon(data?.["history.tipe_perubahan"]);

  const penempatan =
    (data?.penempatan ?? data?.unit_kerja ?? "").toString().trim() || "—";

  const tglPengangkatan = formatTanggalIndo(
    data?.tanggal_pengangkatan ?? data?.tgl_terhitung_mulai,
  );
  const golongan = (data?.golongan ?? data?.kode_golongan ?? "")
    .toString()
    .trim();
  const terhitungMulaiGol =
    tglPengangkatan !== "—" || golongan
      ? `${tglPengangkatan} / ${golongan || "—"}`
      : "—";

  const jabatan =
    data?.unit_kerja_karyawan?.[0]?.jabatan?.jabatan?.toString().trim() || "—";

  return (
    <Page style={styles.containerDocument} size="A4">
      <Image src="/assets/images/kop.png" style={styles.kopSurat} fixed />

      {/* ✅ tanggal today */}
      <Text style={[{ alignSelf: "flex-end" }, styles.textNormal]}>
        {tanggalSurat}
      </Text>

      <View>
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              width: "15%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.textNormal}>Nomor</Text>
            <Text style={styles.textNormal}>:</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.textNormal, { paddingLeft: 5 }]}>
              {nomorSurat}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              width: "15%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.textNormal}>Perihal</Text>
            <Text style={styles.textNormal}>:</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.textNormal, { paddingLeft: 5 }]}>
              Usul Pengangkatan
            </Text>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 30 }}>
        <Text style={styles.textNormal}>
          Yth. Sdr. Pengurus Yayasan BPK PENABUR
        </Text>
        <Text style={styles.textNormal}>Gedung UKRIDA Blok E Lantai 5</Text>
        <Text style={styles.textNormal}>Jl. Tanjung Duren Raya No. 4</Text>
        <Text style={styles.textNormal}>Jakarta Barat</Text>
      </View>

      <View style={styles.containerHeader}>
        <Text style={styles.titleHeader}>USULAN PENGANGKATAN</Text>
        <Text style={styles.textNormal}>Jalur BPK PENABUR Jakarta</Text>
      </View>

      <View style={{ marginTop: 10, rowGap: 5, paddingHorizontal: 10 }}>
        {/* 1 Nama */}
        <RowItem no="1." label="Nama" value={nama} />

        {/* 2 Agama */}
        <RowItem no="2." label="Agama" value={agama} />

        {/* 3 NIK */}
        <RowItem no="3." label="NIK" value={nik} />

        {/* 4 Mulai bekerja */}
        <RowItem
          no="4."
          label="Mulai Bekerja di BPK PENABUR Jakarta"
          value={tgl_join_penabur_jkt}
        />

        {/* 5 TTL */}
        <RowItem no="5." label="Tempat, tanggal lahir" value={ttl} />

        {/* 6 Status kawin */}
        <RowItem no="6." label="Kawin / Belum kawin" value={statusKawin} />

        {/* 7 Jumlah anak */}
        <RowItem no="7." label="Jumlah anak" value={jumlahAnak} />

        {/* 8 Ijazah */}
        <RowItem no="8." label="Ijazah" value={tingkat} />

        {/* 9 Penempatan */}
        <RowItem no="9." label="Supaya ditempatkan di" value={divisiList} />

        {/* 10 Terhitung mulai / Gol */}
        <RowItem
          no="10."
          label="Terhitung mulai tanggal / Golongan"
          value={`${golongan_lama} / ${golongan_baru}`}
        />

        {/* 11 Sebagai */}
        <RowItem no="11." label="Sebagai" value={jabatan} />
      </View>

      {/* sisanya biarkan sama */}
      <View style={{ marginTop: 5 }}>
        <Text style={styles.textNormal}>
          untuk dapat diangkat sebagai Karyawan/Guru Tetap, wajib memenuhi
          ketentuan dan melampirkan berkas sebagai berikut:
        </Text>
      </View>

      <View style={{ marginTop: 5, paddingHorizontal: 10 }}>
        <LineBullet no="1." text="Daftar Riwayat Hidup" />
        <LineBullet no="2." text="Summary Hasil Psikologi" />
        <LineBullet
          no="3."
          text="Fotokopi Ijazah dan Transkrip Nilai Terakhir"
        />
        <LineBullet no="4." text="Surat Keterangan Bekerja (apabila ada)" />
      </View>

      <View style={{ marginTop: 15 }}>
        <Text style={styles.textNormal}>
          Besar harapan kami, usulan tersebut di atas dapat diterima.
        </Text>
      </View>

      <View style={{ alignItems: "center", width: "100%" }} break>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.textNormal}>Hormat kami,</Text>
          <Text style={styles.textNormal}>Pengurus BPK PENABUR Jakarta</Text>
        </View>

        <View style={{ flexDirection: "row", marginTop: 80, width: "100%" }}>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={[styles.textNormal, { textDecoration: "underline" }]}>
              Ir. Kenny Lim
            </Text>
            <Text style={styles.textNormal}>Ketua</Text>
          </View>

          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={[styles.textNormal, { textDecoration: "underline" }]}>
              Ir. Yosafat Adrian Wiguna, MBA
            </Text>
            <Text style={styles.textNormal}>Sekretaris II</Text>
          </View>
        </View>
      </View>
    </Page>
  );
}

/** helper row biar rapih (tetap mengikuti layout kamu) */
function RowItem({ no, label, value }) {
  return (
    <View style={{ flexDirection: "row" }}>
      <View style={{ width: 20 }}>
        <Text style={styles.textNormal}>{no}</Text>
      </View>

      <View
        style={{
          width: 250,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={styles.textNormal}>{label}</Text>
        <Text style={styles.textNormal}>:</Text>
      </View>

      <View style={{ flex: 1, paddingLeft: 5 }}>
        <Text style={styles.textNormal}>{value || "—"}</Text>
      </View>
    </View>
  );
}

function LineBullet({ no, text }) {
  return (
    <View style={{ flexDirection: "row" }}>
      <View style={{ width: 20 }}>
        <Text style={styles.textNormal}>{no}</Text>
      </View>
      <View
        style={{
          width: 250,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={styles.textNormal}>{text}</Text>
      </View>
    </View>
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
  containerHeader: { alignItems: "center", marginBottom: 10, marginTop: 25 },
  kopSurat: { left: 0, position: "absolute", top: 0, width: "100%" },
  textNormal: {
    fontFamily: "Times New Roman",
    fontSize: 12,
    textAlign: "justify",
  },
  textBold: { fontFamily: "Times New Roman", fontWeight: "bold", fontSize: 12 },
  titleHeader: {
    fontFamily: "Times New Roman",
    textDecoration: "underline",
    fontWeight: "bold",
    fontSize: 15,
  },
});
