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

export default function PKWT({ data }) {
  return (
    <Page style={styles.containerDocument} size={["8.27in", "11.69in"]}>
      <Image src={"/assets/images/kop.png"} style={styles.kopSurat} fixed />

      <View style={styles.containerHeader}>
        <Text style={styles.titleHeader}>PERJANJIAN KERJA WAKTU TERTENTU</Text>
        <Text style={[styles.textNormal, { color: "blue" }]}>
          Nomor : 001/SDM/Ktk1/08/2024
        </Text>
      </View>

      <View style={{ flexDirection: "row" }}>
        <Text style={[{ width: "0.31in" }, styles.textNormal]}>I.</Text>
        <Text style={styles.textNormal}>Yang bertandatangan di bawah ini:</Text>
      </View>

      <View style={{ paddingLeft: "0.5in", marginBottom: 12 }}>
        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.textNormal, { width: "1.5in" }]}>Nama</Text>
          <Text style={[styles.textBold]}>: Iening Ananta, S.T.</Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.textNormal, { width: "1.5in" }]}>Jabatan</Text>
          <Text style={[styles.textNormal]}>: Ketua Bidang SDM</Text>
        </View>
      </View>

      <View style={{ paddingLeft: "0.5in", marginBottom: 12 }}>
        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.textNormal, { width: "1.5in" }]}>Nama</Text>
          <Text style={[styles.textBold]}>
            : Ir. Yosafat Adrian Wiguna, MBA
          </Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.textNormal, { width: "1.5in" }]}>Jabatan</Text>
          <Text style={[styles.textNormal]}>: Sekretaris II</Text>
        </View>
      </View>

      <Text
        style={[
          styles.textNormal,
          {
            marginLeft: "0.3in",
          },
        ]}
      >
        dari dan karenanya bertindak untuk dan atas nama BPK PENABUR Jakarta,
        beralamat di Jl. Tanjung Duren Raya No. 4, Jakarta Barat – 11470,
        selanjutnya disebut{" "}
        <Text style={styles.textBold}>“Pihak Pertama/BPK PENABUR Jakarta”</Text>
        .
      </Text>

      <View style={{ flexDirection: "row", marginTop: 12 }}>
        <View style={{ width: "2in", flexDirection: "row" }}>
          <Text style={[styles.textNormal, { width: "0.31in" }]}>II.</Text>
          <Text style={styles.textNormal}>Nama</Text>
        </View>
        <Text style={[styles.textNormal, { color: "blue" }]}>: ……………</Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          paddingLeft: "0.31in",
        }}
      >
        <Text style={[styles.textNormal, { width: "1.69in" }]}>NIK</Text>
        <Text style={[styles.textNormal, { color: "blue" }]}>: ……………</Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          paddingLeft: "0.31in",
        }}
      >
        <Text style={[styles.textNormal, { width: "1.69in" }]}>
          Jenis Kelamin
        </Text>
        <Text style={[styles.textNormal, { color: "blue" }]}>: ……………</Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          paddingLeft: "0.31in",
        }}
      >
        <Text style={[styles.textNormal, { width: "1.69in" }]}>
          Tempat, tanggal lahir
        </Text>
        <Text style={[styles.textNormal, { color: "blue" }]}>: ……………</Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          paddingLeft: "0.31in",
        }}
      >
        <Text style={[styles.textNormal, { width: "1.69in" }]}>Umur</Text>
        <Text style={[styles.textNormal, { color: "blue" }]}>: ……………</Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          paddingLeft: "0.31in",
        }}
      >
        <Text style={[styles.textNormal, { width: "1.69in" }]}>Alamat</Text>
        <Text style={[styles.textNormal, { color: "blue" }]}>: ……………</Text>
      </View>

      <Text
        style={[
          styles.textNormal,
          {
            marginLeft: "0.3in",
            marginTop: 12,
          },
        ]}
      >
        dalam hal ini bertindak atas nama dirinya sendiri, selanjutnya disebut{" "}
        <Text style={styles.textBold}>“Pihak Kedua/PEKERJA”</Text>.
      </Text>

      <Text
        style={[
          styles.textNormal,
          {
            marginTop: 12,
          },
        ]}
      >
        BPK PENABUR Jakarta dan PEKERJA apabila secara bersama-sama akan disebut{" "}
        <Text style={styles.textBold}>“PARA PIHAK”</Text>.
      </Text>

      <Text
        style={[
          styles.textNormal,
          {
            marginTop: 12,
          },
        ]}
      >
        PARA PIHAK menerangkan terlebih dahulu sebagai berikut:
      </Text>

      <View style={{ paddingLeft: "0.05in", width: "100%" }}>
        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.list, { width: "0.25in" }]}>1.</Text>
          <Text style={[styles.textNormal, { flex: 1 }]}>
            Bahwa Pihak Pertama adalah Badan Pendidikan Kristen di bawah Yayasan
            BPK PENABUR, yang bergerak di bidang Pendidikan, yang mengelola
            sekolah-sekolah mulai jenjang TK sampai dengan SLTA termasuk
            Sekretariat, di wilayah Jakarta, Depok, Tangerang dan Bekasi;
          </Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.list, { width: "0.25in" }]}>2.</Text>
          <Text style={[styles.textNormal, { flex: 1 }]}>
            Bahwa BPK PENABUR Jakarta membutuhkan pekerja yang dapat bekerja
            untuk waktu tertentu dan memiliki keahlian sesuai kebutuhan Sekolah
            BPK PENABUR Jakarta, sedangkan Pihak Kedua berdasarkan surat lamaran
            dan curriculum vitae memiliki kemampuan, keterampilan dan keahlian
            di bidang pendidikan, yang membutuhkan pekerjaan untuk waktu
            tertentu.
          </Text>
        </View>
      </View>

      <Text style={[styles.textNormal, { marginVertical: 12 }]}>
        Berdasarkan hal-hal tersebut di atas, Para Pihak telah setuju untuk
        saling mengikatkan diri dengan membuat Perjanjian Kerja Waktu Tertentu,
        (selanjutnya disebut “PKWT”), dengan syarat-syarat dan ketentuan-
        ketentuan sebagai berikut:
      </Text>

      <View
        style={{
          marginBottom: 12,
        }}
      >
        <View
          style={[
            {
              alignItems: "center",
            },
          ]}
        >
          <Text style={styles.textBold}>Pasal 1</Text>
          <Text style={styles.textBold}>Tugas dan Penempatan</Text>
        </View>
        <Text style={[styles.textNormal, { marginTop: 12 }]}>
          BPK PENABUR Jakarta dengan ini mempekerjakan dan PEKERJA dengan ini
          menerima pekerjaan sebagai{" "}
          <Text style={{ color: "blue" }}>jabatan & mata pelajaran</Text>, yang
          ditempatkan di{" "}
          <Text style={{ color: "blue" }}>
            lokasi kerja (sesuai penempatan).
          </Text>
        </Text>
      </View>

      <View
        style={{
          marginBottom: 12,
        }}
      >
        <View
          style={[
            {
              alignItems: "center",
            },
          ]}
        >
          <Text style={styles.textBold}>Pasal 2</Text>
          <Text style={styles.textBold}>Eksklusif</Text>
        </View>
        <Text style={[styles.textNormal, { marginTop: 12 }]}>
          Selama PEKERJA bekerja di BPK PENABUR Jakarta, PEKERJA tidak
          diperkenankan menjalankan bisnis, dipekerjakan oleh atau bekerja di
          tempat lain, baik secara tetap maupun tidak tetap, tanpa persetujuan
          tertulis dari BPK PENABUR Jakarta. Pelanggaran atas ketentuan ini BPK
          PENABUR Jakarta berhak menindak sesuai dengan Peraturan Perusahaan
          atau PEKERJA demi hukum dianggap mengundurkan diri dan mengakhiri PKWT
          dan wajib membayar ganti rugi sebesar Upah sampai batas waktu
          berakhirnya jangka waktu PKWT kepada BPK PENABUR Jakarta.
        </Text>
      </View>

      <View
        style={{
          marginBottom: 12,
        }}
      >
        <View
          style={[
            {
              alignItems: "center",
            },
          ]}
        >
          <Text style={styles.textBold}>Pasal 3</Text>
          <Text style={styles.textBold}>Upah dan PPh 21</Text>
        </View>
        <View style={{ marginTop: 12 }}>
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.list, { width: "0.3in" }]}>1.</Text>
            <Text style={[styles.textNormal, { flex: 1 }]}>
              Besarnya Upah sesuai dengan Surat Penawaran tertanggal{" "}
              <Text style={{ color: "blue" }}>tgl surat OFL</Text> yang telah
              disepakati PEKERJA, yang merupakan bagian yang tidak terpisahkan
              dari PKWT ini.
            </Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.list, { width: "0.3in" }]}>2.</Text>
            <Text style={[styles.textNormal, { flex: 1 }]}>
              Termasuk dalam komponen Upah, PEKERJA akan mendapatkan tunjangan
              uang kehadiran yang ditetapkan oleh BPK PENABUR Jakarta, sesuai
              dengan jumlah presensi PEKERJA per bulan.
            </Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.list, { width: "0.3in" }]}>3.</Text>
            <Text style={[styles.textNormal, { flex: 1 }]}>
              Pajak penghasilan PEKERJA (PPh 21) dan Tax Penalty (dalam hal
              belum menyerahkan atau belum mempunyai NPWP) ditanggung oleh
              PEKERJA.
            </Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.list, { width: "0.3in" }]}>4.</Text>
            <Text style={[styles.textNormal, { flex: 1 }]}>
              Pembayaran Upah dilakukan ke Rekening yang diberikan PEKERJA,
              mengikuti jadwal yang ditentukan BPK PENABUR Jakarta.
            </Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.list, { width: "0.3in" }]}>5.</Text>
            <Text style={[styles.textNormal, { flex: 1 }]}>
              Upah akan dipotong dalam hal PEKERJA terlambat atau tidak masuk
              kerja atau tidak melaksanakan pekerjaan tanpa alasan yang sah.
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{
          marginBottom: 12,
        }}
      >
        <View
          style={[
            {
              alignItems: "center",
            },
          ]}
        >
          <Text style={styles.textBold}>Pasal 4</Text>
          <Text style={styles.textBold}>Fasilitas Kesehatan</Text>
        </View>
        <Text style={[styles.textNormal, { marginTop: 12 }]}>
          Fasilitas kesehatan yang diberikan oleh BPK PENABUR Jakarta kepada
          PEKERJA yaitu PEKERJA didaftarkan pada Program BPJS Kesehatan dan
          Ketenagakerjaan, yang sebagian iurannya dipotong dari Upah PEKERJA
          sesuai ketentuan yang berlaku.
        </Text>
      </View>

      <View
        style={{
          marginBottom: 12,
        }}
      >
        <View
          style={[
            {
              alignItems: "center",
            },
          ]}
        >
          <Text style={styles.textBold}>Pasal 5</Text>
          <Text style={styles.textBold}>Waktu Kerja</Text>
        </View>
        <View style={{ marginTop: 12 }}>
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.list, { width: "0.3in" }]}>1.</Text>
            <Text style={[styles.textNormal, { flex: 1 }]}>
              Waktu kerja pada umumnya adalah :
            </Text>
          </View>

          <View style={{ flexDirection: "row", paddingLeft: "0.39in" }}>
            <Text style={[styles.list, { width: "1.11in" }]}>Hari Kerja</Text>
            <Text style={[styles.textNormal, { flex: 1 }]}>
              : 5 hari / minggu (Senin – Jumat)
            </Text>
          </View>

          <View style={{ flexDirection: "row", paddingLeft: "0.39in" }}>
            <Text style={[styles.list, { width: "1.11in" }]}>Jam Kerja</Text>
            <Text style={[styles.textNormal, { flex: 1 }]}>
              : Sesuai dengan waktu yang ditetapkan BPK PENABUR Jakarta atau
              Sekolah BPK PENABUR penempatan Pekerja.
            </Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.list, { width: "0.3in" }]}>2.</Text>
            <Text style={[styles.textNormal, { flex: 1 }]}>
              Dalam hal diperlukan atau sesuai kebutuhan pekerjaan atas
              instruksi BPK PENABUR Jakarta, PEKERJA bersedia bekerja di luar
              Waktu Kerja.
            </Text>
          </View>
        </View>
      </View>

      <View
        style={[
          {
            alignItems: "center",
          },
        ]}
      >
        <Text style={styles.textBold}>Pasal 6</Text>
        <Text style={styles.textBold}>
          Tata Tertib, Kewajiban dan Disiplin Kerja
        </Text>
      </View>

      <View style={{ marginTop: 12 }}>
        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.list, { width: "0.3in" }]}>1.</Text>
          <Text style={[styles.textNormal, { flex: 1 }]}>
            PEKERJA wajib mematuhi perintah dan instruksi kerja serta ketentuan
            yang ditetapkan BPK PENABUR Jakarta atau Sekolah BPK PENABUR
            penempatan PEKERJA, termasuk tetapi tidak terbatas pada Peraturan
            Perusahaan, tata tertib, kewajiban, disiplin kerja, etika kerja dan
            Peraturan lainnya yang berlaku di lingkungan BPK PENABUR Jakarta,
            baik tertulis maupun tidak tertulis.
          </Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.list, { width: "0.3in" }]}>2.</Text>
          <Text style={[styles.textNormal, { flex: 1 }]}>
            PEKERJA dilarang merokok di lingkungan sekolah, kantor atau unit
            kerja BPK PENABUR Jakarta.
          </Text>
        </View>

        <View style={{ flexDirection: "row", marginBottom: 12 }}>
          <Text style={[styles.list, { width: "0.3in" }]}>3.</Text>
          <Text style={[styles.textNormal, { flex: 1 }]}>
            PEKERJA wajib membuktikan keabsahan informasi dan/atau dokumen
            ijazah / Surat Keterangan Lulus dan Transkrip Nilai yang diserahkan
            ke BPK PENABUR Jakarta, baik pembuktian pada saat PEKERJA
            menandatangani perjanjian ini atau waktu yang dijanjikan PEKERJA
            kepada BPK PENABUR Jakarta. Apabila PEKERJA tidak bisa membuktikan
            keabsahan dokumen tersebut maka secara hukum perjanjian batal demi
            hukum.
          </Text>
        </View>
      </View>

      <View
        style={{
          marginBottom: 12,
        }}
      >
        <View
          style={[
            {
              alignItems: "center",
            },
          ]}
        >
          <Text style={styles.textBold}>Pasal 7</Text>
          <Text style={styles.textBold}>
            Hak, Kewajiban dan Jaminan PEKERJA
          </Text>
        </View>

        <View style={{ marginTop: 12 }}>
          <Text style={styles.textNormal}>
            Selain yang telah diuraikan dalam Pasal-pasal lain PKWT ini :
          </Text>
          <View>
            <View>
              <View style={{ flexDirection: "row" }}>
                <Text style={[styles.list, { width: "0.3in" }]}>1.</Text>
                <Text style={styles.textNormal}>Hak PEKERJA :</Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  paddingLeft: "0.34in",
                }}
              >
                <Text style={[styles.list, { width: "0.25in" }]}>a.</Text>
                <Text style={[styles.textNormal, { flex: 1 }]}>
                  Mendapat Upah dan tunjangan uang kehadiran sesuai Pasal 3
                  PKWT;
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  paddingLeft: "0.34in",
                }}
              >
                <Text style={[styles.list, { width: "0.25in" }]}>b.</Text>
                <Text style={[styles.textNormal, { flex: 1 }]}>
                  Mendapatkan fasilitas BPJS Kesehatan dan Ketenagakerjaan.
                </Text>
              </View>
            </View>

            <View>
              <View style={{ flexDirection: "row" }}>
                <Text style={[styles.list, { width: "0.3in" }]}>2.</Text>
                <Text style={styles.textNormal}>Kewajiban PEKERJA :</Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  paddingLeft: "0.34in",
                }}
              >
                <Text style={[styles.list, { width: "0.25in" }]}>a.</Text>
                <Text style={[styles.textNormal, { flex: 1 }]}>
                  Melaksanakan pekerjaan dengan sebaik-baiknya, sepenuh hati dan
                  dengan penuh tanggung jawab;
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  paddingLeft: "0.34in",
                }}
              >
                <Text style={[styles.list, { width: "0.25in" }]}>b.</Text>
                <Text style={[styles.textNormal, { flex: 1 }]}>
                  Menaati PKWT, instruksi dan perintah kerja, Peratuan
                  Perusahaan, tata tertib, disiplin kerja, etika kerja,
                  kebijakan dan Peraturan lainnya yang berlaku di lingkungan BPK
                  PENABUR Jakarta serta peraturan perundang-undangan yang
                  berlaku;
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  paddingLeft: "0.34in",
                }}
              >
                <Text style={[styles.list, { width: "0.25in" }]}>c.</Text>
                <Text style={[styles.textNormal, { flex: 1 }]}>
                  Menjalani training dan/atau pelatihan yang diinstruksikan;
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  paddingLeft: "0.34in",
                }}
              >
                <Text style={[styles.list, { width: "0.25in" }]}>d.</Text>
                <Text style={[styles.textNormal, { flex: 1 }]}>
                  Berperilaku pantas dan menjadi panutan yang baik bagi siswa;
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  paddingLeft: "0.34in",
                }}
              >
                <Text style={[styles.list, { width: "0.25in" }]}>e.</Text>
                <Text style={[styles.textNormal, { flex: 1 }]}>
                  Tidak melakukan tindakan yang baik disengaja maupun tidak
                  disengaja dapat menimbulkan keributan, kerugian dan/atau citra
                  negatif bagi BPK PENABUR Jakarta;
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  paddingLeft: "0.34in",
                }}
              >
                <Text style={[styles.list, { width: "0.25in" }]}>f.</Text>
                <Text style={[styles.textNormal, { flex: 1 }]}>
                  Menghormati dan menjalin kerjasama yang baik dengan pimpinan
                  dan sesama pekerja serta selalu bertingkah laku sesuai dengan
                  etika dan norma-norma yang berlaku di lingkungan Pendidikan
                  maupun masyarakat;
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  paddingLeft: "0.34in",
                }}
              >
                <Text style={[styles.list, { width: "0.25in" }]}>g.</Text>
                <Text style={[styles.textNormal, { flex: 1 }]}>
                  Membayar ganti rugi sebesar Upah sampai batas waktu
                  berakhirnya jangka waktu PKWT, dalam hal mengakhiri sepihak
                  PKWT.
                </Text>
              </View>
            </View>

            <View>
              <View style={{ flexDirection: "row" }}>
                <Text style={[styles.list, { width: "0.3in" }]}>3.</Text>
                <Text style={styles.textNormal}>Jaminan PEKERJA :</Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  paddingLeft: "0.34in",
                }}
              >
                <Text style={[styles.list, { width: "0.25in" }]}>a.</Text>
                <Text style={[styles.textNormal, { flex: 1 }]}>
                  PEKERJA menjamin kebenaran isi lamaran, curriculum vitae serta
                  seluruh data, identitas dan dokumen yang diberikan kepada BPK
                  PENABUR Jakarta dalam mendapatkan pekerjaan ini.
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  paddingLeft: "0.34in",
                }}
              >
                <Text style={[styles.list, { width: "0.25in" }]}>b.</Text>
                <Text style={[styles.textNormal, { flex: 1 }]}>
                  Dalam hal di kemudian hari PEKERJA melanggar jaminan ini, maka
                  PEKERJA akan mengundurkan diri dan PEKERJA wajib ganti rugi
                  sebesar Upah sampai batas waktu berakhirnya jangka waktu PKWT,
                  tanpa kompensasi dan ganti rugi apapun dari BPK PENABUR
                  Jakarta, tanpa mengurangi hak BPK PENABUR Jakarta mengajukan
                  tuntutan hukum sesuai hukum yang berlaku.
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  paddingLeft: "0.34in",
                }}
              >
                <Text style={[styles.list, { width: "0.25in" }]}>c.</Text>
                <Text style={[styles.textNormal, { flex: 1 }]}>
                  PEKERJA tidak akan mengundurkan diri atau memutus PKWT ini
                  (terutama di tengah tahun ajaran), tanpa persetujuan dari BPK
                  PENABUR Jakarta.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View
        style={{
          marginBottom: 12,
        }}
      >
        <View
          style={[
            {
              alignItems: "center",
            },
          ]}
        >
          <Text style={styles.textBold}>Pasal 8</Text>
          <Text style={styles.textBold}>
            Hak dan Kewajiban BPK PENABUR Jakarta
          </Text>
        </View>

        <View style={{ marginTop: 12 }}>
          <Text style={styles.textNormal}>
            Selain yang telah diuraikan dalam Pasal-pasal lain PKWT ini :
          </Text>

          <View>
            <View style={{ flexDirection: "row" }}>
              <Text style={[styles.list, { width: "0.3in" }]}>1.</Text>
              <Text style={styles.textNormal}>
                Hak PEKERJA :Hak BPK PENABUR Jakarta :
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                paddingLeft: "0.34in",
              }}
            >
              <Text style={[styles.list, { width: "0.25in" }]}>a.</Text>
              <Text style={[styles.textNormal, { flex: 1 }]}>
                Membuat Peraturan Perusahaan, tata tertib, disiplin kerja,
                kebijakan dan peraturan lainnya;
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                paddingLeft: "0.34in",
              }}
            >
              <Text style={[styles.list, { width: "0.25in" }]}>b.</Text>
              <Text style={[styles.textNormal, { flex: 1 }]}>
                Memberikan instruksi dan perintah kerja;
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                paddingLeft: "0.34in",
              }}
            >
              <Text style={[styles.list, { width: "0.25in" }]}>c.</Text>
              <Text style={[styles.textNormal, { flex: 1 }]}>
                Melakukan Evaluasi terhadap PEKERJA;
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                paddingLeft: "0.34in",
              }}
            >
              <Text style={[styles.list, { width: "0.25in" }]}>d.</Text>
              <Text style={[styles.textNormal, { flex: 1 }]}>
                Memutuskan penempatan, rotasi, mutasi, promosi dan demosi
                PEKERJA;
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                paddingLeft: "0.34in",
              }}
            >
              <Text style={[styles.list, { width: "0.25in" }]}>e.</Text>
              <Text style={[styles.textNormal, { flex: 1 }]}>
                Mendisiplinkan dan menetapkan sanksi atas setiap pelanggaran
                PEKERJA sesuai Peraturan Perusahan.
              </Text>
            </View>
          </View>

          <View>
            <View style={{ flexDirection: "row" }}>
              <Text style={[styles.list, { width: "0.3in" }]}>2.</Text>
              <Text style={[styles.textNormal, { flex: 1 }]}>
                Kewajiban PEKERJA :Kewajiban BPK PENABUR Jakarta :
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                paddingLeft: "0.34in",
              }}
            >
              <Text style={[styles.list, { width: "0.25in" }]}>a.</Text>
              <Text style={[styles.textNormal, { flex: 1 }]}>
                Membayar Upah PEKERJA;
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                paddingLeft: "0.34in",
              }}
            >
              <Text style={[styles.list, { width: "0.25in" }]}>b.</Text>
              <Text style={[styles.textNormal, { flex: 1 }]}>
                Mengikutsertakan PEKERJA dalam Program BPJS Kesehatan dan
                Ketenagakerjaan.
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View
        style={{
          marginBottom: 12,
        }}
      >
        <View
          style={[
            {
              alignItems: "center",
            },
          ]}
        >
          <Text style={styles.textBold}>Pasal 9</Text>
          <Text style={[styles.textBold, { textAlign: "center" }]}>
            Evaluasi Serta Penempatan, Rotasi, Mutasi, Demosi dan Promosi
          </Text>
        </View>

        <View style={{ marginTop: 12 }}>
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.list, { width: "0.3in" }]}>1.</Text>
            <Text style={[styles.textNormal, { flex: 1 }]}>
              PEKERJA bersedia ditempatkan di manapun dalam lingkungan BPK
              PENABUR Jakarta.
            </Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.list, { width: "0.3in" }]}>2.</Text>
            <Text style={[styles.textNormal, { flex: 1 }]}>
              PEKERJA setuju bahwa BPK PENABUR Jakarta berwenang penuh melakukan
              Evaluasi, Rotasi, Mutasi, Demosi maupun Promosi terhadap PEKERJA
              dengan konsekuensi penyesuaian Upah dan fasilitasnya dan PEKERJA
              dengan ini sepakat dan mengikatkan diri menjalani Evaluasi,
              Rotasi, Mutasi, Demosi atau Promosi tersebut dengan baik.
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{
          marginBottom: 12,
        }}
      >
        <View
          style={[
            {
              alignItems: "center",
            },
          ]}
        >
          <Text style={styles.textBold}>Pasal 10</Text>
          <Text style={[styles.textBold, { textAlign: "center" }]}>
            Sanksi atas Perbuatan dan atau Tindakan yang Dilarang
          </Text>
        </View>

        <Text style={[styles.textNormal, { marginTop: 12 }]}>
          Dalam hal selama berlakunya PKWT PEKERJA melakukan pelanggaran atas
          PKWT ini, maka PARA PIHAK dengan ini sepakat BPK PENABUR Jakarta
          berhak menggunakan opsi kesepakatan pengakhiran PKWT dengan kewajiban
          PEKERJA membayar ganti rugi sebesar Upah sampai batas waktu
          berakhirnya jangka waktu PKWT, tanpa kewajiban BPK PENABUR Jakarta
          membayar kompensasi dan/atau ganti rugi dalam bentuk apapun kepada
          PEKERJA.
        </Text>
      </View>

      <View
        style={{
          marginBottom: 12,
        }}
      >
        <View
          style={[
            {
              alignItems: "center",
            },
          ]}
        >
          <Text style={styles.textBold}>Pasal 11</Text>
          <Text style={[styles.textBold, { textAlign: "center" }]}>
            Sakit Berkepanjangan
          </Text>
        </View>

        <Text style={[styles.textNormal, { marginTop: 12 }]}>
          Dalam hal selama berlakunya PKWT PEKERJA sakit berkepanjangan selama 4
          (empat) minggu lebih (segala jenis penyakit terutama penyakit menular,
          berdasarkan rekomendasi dari dokter umum Klinik Pratama BPK PENABUR
          Jakarta), maka PARA PIHAK sepakat PKWT berakhir tanpa kewajiban BPK
          PENABUR Jakarta untuk membayar kompensasi dan/atau ganti rugi dalam
          bentuk apapun kepada PEKERJA.
        </Text>
      </View>

      <View
        style={{
          marginBottom: 12,
        }}
      >
        <View
          style={[
            {
              alignItems: "center",
            },
          ]}
        >
          <Text style={styles.textBold}>Pasal 12</Text>
          <Text style={[styles.textBold, { textAlign: "center" }]}>
            Peralihan Hak Cipta
          </Text>
        </View>

        <View style={{ marginTop: 12 }}>
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.list, { width: "0.3in" }]}>1.</Text>
            <Text style={[styles.textNormal, { flex: 1 }]}>
              PEKERJA dengan ini setuju untuk menyerahkan dan mengalihkan secara
              Eksklusif kepada BPK PENABUR Jakarta seluruh Hak Cipta berikut Hak
              Ekonominya atas setiap produk/hasil karya dan/atau hasil kegiatan
              belajar mengajar yang dirancang, dibuat, ditulis, dipikirkan
              dan/atau dihasilkan PEKERJA sehubungan dengan dan/atau selama
              PEKERJA bekerja pada BPK PENABUR Jakarta, termasuk tetapi tidak
              terbatas pada materi ajar, karya tulis, bahan/alat peraga, buku,
              cetakan, makalah, rekaman, presentasi, resume/rangkuman,
              soal-soal, tanya jawab (selanjutnya disebut “Ciptaan”).
            </Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.list, { width: "0.3in" }]}>2.</Text>
            <Text style={[styles.textNormal, { flex: 1 }]}>
              BPK PENABUR Jakarta berhak penuh (tanpa batasan apapun)
              menggunakan, memanfaatkan, merekam, memodifikasi, merangkum,
              mengkompilasi, menggandakan, menerjemahkan, mengadopsikan,
              mendistribusikan, mencetak, menerbitkan, membukukan, menayangkan,
              mengkomersialkan, meregister/ mendaftarkan, mengalihkan, menarik
              royalti dan melakukan tindakan apapun atas Ciptaan, untuk
              kepentingan seluruh BPK PENABUR atau Yayasan BPK PENABUR.
            </Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.list, { width: "0.3in" }]}>3.</Text>
            <Text style={[styles.textNormal, { flex: 1 }]}>
              PARA PIHAK sepakat bahwa peralihan Hak Cipta ini tunduk pada
              Undang-undang No. 28 tahun 2014 tentang Hak Cipta dan peraturan
              perundang-undangan yang berlaku.
            </Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.list, { width: "0.3in" }]}>4.</Text>
            <Text style={[styles.textNormal, { flex: 1 }]}>
              PEKERJA melepaskan hak untuk mengajukan tuntutan atau gugatan
              dalam bentuk apapun terhadap BPK PENABUR Jakarta sehubungan dengan
              Hak Cipta tersebut.
            </Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.list, { width: "0.3in" }]}>5.</Text>
            <Text style={[styles.textNormal, { flex: 1 }]}>
              PARA PIHAK sepakat ketentuan Pasal ini akan tetap berlaku dan
              mengikat selama maupun setelah PKWT ini berakhir.
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{
          marginBottom: 12,
        }}
      >
        <View
          style={[
            {
              alignItems: "center",
            },
          ]}
        >
          <Text style={styles.textBold}>Pasal 13</Text>
          <Text style={[styles.textBold, { textAlign: "center" }]}>
            Kerahasiaan, Anti Poaching dan Bad Mouth
          </Text>
        </View>

        <View style={{ marginTop: 12 }}>
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.list, { width: "0.3in" }]}>1.</Text>
            <Text style={[styles.textNormal, { flex: 1 }]}>
              BPK PENABUR Jakarta dan PEKERJA sepakat dan memahami sepenuhnya
              bahwa seluruh data, informasi dan/atau pengetahuan (termasuk
              tetapi tidak terbatas pada data siswa, data keuangan, penggajian
              dan sistem) yang diperoleh PEKERJA selama bekerja di BPK PENABUR
              Jakarta, baik secara langsung maupun tidak langsung merupakan
              Rahasia BPK PENABUR Jakarta maupun Yayasan BPK PENABUR
              (selanjutnya disebut “Rahasia BPK PENABUR”) yang berharga,
              sehingga PEKERJA memiliki kewajiban dan tanggung jawab untuk
              menjaga Rahasia Pihak Pertama tersebut, baik selama maupun setelah
              PKWT ini berakhir.
            </Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.list, { width: "0.3in" }]}>2.</Text>
            <Text style={[styles.textNormal, { flex: 1 }]}>
              PEKERJA mengikatkan diri dan menjamin tidak akan membocorkan
              dan/atau memberikan Rahasia BPK PENABUR tersebut, baik secara
              langsung maupun tidak langsung, baik untuk kepentingan pribadi
              maupun untuk/kepada pihak manapun, di dalam maupun di luar BPK
              PENABUR Jakarta, baik selama maupun setelah PEKERJA tidak lagi
              bekerja pada BPK PENABUR Jakarta.
            </Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.list, { width: "0.3in" }]}>3.</Text>
            <Text style={[styles.textNormal, { flex: 1 }]}>
              Dalam hal PEKERJA membocorkan Rahasia BPK PENABUR tersebut,
              PEKERJA wajib menanggung segala kerugian BPK PENABUR Jakarta, baik
              kerugian material maupun immaterial, termasuk menanggung segala
              biaya hukum yang timbul (biaya pengacara, biaya perkara dan
              lain-lain).
            </Text>
          </View>

          <View>
            <View style={{ flexDirection: "row" }}>
              <Text style={[styles.list, { width: "0.3in" }]}>4.</Text>
              <Text style={[styles.textNormal, { flex: 1 }]}>
                PEKERJA selama bekerja atau dalam hal Pekerja tidak lagi bekerja
                pada Yayasan/BPK PENABUR, berjanji dan mengikat diri tidak akan
                melakukan :
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                paddingLeft: "0.34in",
              }}
            >
              <Text style={[styles.list, { width: "0.25in" }]}>a.</Text>
              <Text style={[styles.textNormal, { flex: 1 }]}>
                Poaching (tindakan menarik/mengajak pekerja lain yang masih
                aktif untuk keluar atau pindah dari BPK PENABUR). Pelanggaran
                atas ketentuan ini, PEKERJA wajib membayar ganti rugi kepada BPK
                PENABUR Jakarta sebesar Upah sampai batas waktu berakhirnya
                jangka waktu PKWT ditambah Upah terakhir pekerja yang
                ditarik/diajak oleh PEKERJA;
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                paddingLeft: "0.34in",
              }}
            >
              <Text style={[styles.list, { width: "0.25in" }]}>b.</Text>
              <Text style={[styles.textNormal, { flex: 1 }]}>
                Bad mouthing (menjelek-jelekan atau membicarakan hal negatif
                tentang Yayasan/BPK PENABUR, guru, siswa, karyawan dan pihak
                terkait lainnya). Pelanggaran atas ketentuan ini, PEKERJA wajib
                membayar ganti rugi kepada BPK PENABUR Jakarta sebesar Upah
                sampai batas waktu berakhirnya jangka waktu PKWT ditambah
                kerugian material maupun immaterial yang timbul.
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View
        style={{
          marginBottom: 12,
        }}
      >
        <View
          style={[
            {
              alignItems: "center",
            },
          ]}
        >
          <Text style={styles.textBold}>Pasal 14</Text>
          <Text style={[styles.textBold, { textAlign: "center" }]}>
            Jangka Waktu PKWT
          </Text>
        </View>

        <View style={{ marginTop: 12 }}>
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.list, { width: "0.3in" }]}>1.</Text>
            <Text style={[styles.textNormal, { flex: 1 }]}>
              Jangka waktu PKWT ini adalah{" "}
              <Text style={{ color: "blue" }}>jumlah bulan (huruf)</Text> bulan,
              terhitung sejak tanggal{" "}
              <Text style={{ color: "blue" }}>tgl awal kontrak</Text> sampai
              dengan tanggal{" "}
              <Text style={{ color: "blue" }}>tgl akhir kontrak</Text> atau
              dalam hal berakhirnya PKWT sebagaimana Pasal 15 ayat 2.
            </Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.list, { width: "0.3in" }]}>2.</Text>
            <Text style={[styles.textNormal, { flex: 1 }]}>
              PKWT dapat diperpanjang dengan kesepakatan tertulis PARA PIHAK.
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{
          marginBottom: 12,
        }}
      >
        <View
          style={[
            {
              alignItems: "center",
            },
          ]}
        >
          <Text style={styles.textBold}>Pasal 15</Text>
          <Text style={[styles.textBold, { textAlign: "center" }]}>
            Berakhirnya PKWT
          </Text>
        </View>

        <View style={{ marginTop: 12 }}>
          <View>
            <View style={{ flexDirection: "row" }}>
              <Text style={[styles.list, { width: "0.3in" }]}>1.</Text>
              <Text style={styles.textNormal}>
                PKWT ini berakhir dalam hal :
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                paddingLeft: "0.34in",
              }}
            >
              <Text style={[styles.list, { width: "0.25in" }]}>a.</Text>
              <Text style={[styles.textNormal, { flex: 1 }]}>
                Berakhirnya jangka waktu PKWT;
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                paddingLeft: "0.34in",
              }}
            >
              <Text style={[styles.list, { width: "0.25in" }]}>b.</Text>
              <Text style={[styles.textNormal, { flex: 1 }]}>
                PEKERJA meninggal dunia;
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                paddingLeft: "0.34in",
              }}
            >
              <Text style={[styles.list, { width: "0.25in" }]}>c.</Text>
              <Text style={[styles.textNormal, { flex: 1 }]}>
                PEKERJA mengundurkan diri;
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                paddingLeft: "0.34in",
              }}
            >
              <Text style={[styles.list, { width: "0.25in" }]}>d.</Text>
              <Text style={[styles.textNormal, { flex: 1 }]}>
                BPK PENABUR Jakarta menilai kesehatan dan/atau kemampuan PEKERJA
                tidak lagi memungkinkan untuk melanjutkan Pekerjaan sebagaimana
                Pasal 11 PKWT ini;
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                paddingLeft: "0.34in",
              }}
            >
              <Text style={[styles.list, { width: "0.25in" }]}>e.</Text>
              <Text style={[styles.textNormal, { flex: 1 }]}>
                Adanya keadaan yang dicantumkan dalam PKWT, Peraturan Perusahaan
                dan/atau peraturan perundang-undangan yang menyebabkan
                berakhirnya PKWT.
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.list, { width: "0.3in" }]}>2.</Text>
            <Text style={[styles.textNormal, { flex: 1 }]}>
              Dalam hal PKWT berakhir saat baru berjalan kurang dari 1 (satu)
              bulan, maka PEKERJA tidak berhak atas kompensasi dan/atau ganti
              rugi dalam bentuk apapun.
            </Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.list, { width: "0.3in" }]}>3.</Text>
            <Text style={[styles.textNormal, { flex: 1 }]}>
              Dalam hal PKWT berakhir, PEKERJA wajib melakukan serah terima
              dengan baik dan menyerahkan seluruh barang-barang atau atribut
              kerja BPK PENABUR/Sekolah/Siswa yang ada padanya, serta
              menyelesaikan seluruh hal yang berhubungan dengan pekerjaan,
              administrasi keuangan, hutang atau pinjaman, dan/atau kewajiban
              PEKERJA.
            </Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.list, { width: "0.3in" }]}>4.</Text>
            <Text style={[styles.textNormal, { flex: 1 }]}>
              Saat berakhirnya PKWT, BPK PENABUR Jakarta berhak memperhitungkan
              pembayaran hak-hak PEKERJA dengan kewajiban-kewajiban PEKERJA.
            </Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.list, { width: "0.3in" }]}>5.</Text>
            <Text style={[styles.textNormal, { flex: 1 }]}>
              PARA PIHAK sepakat ketentuan Pasal 12, 13 dan 15 PKWT ini tetap
              berlaku dan mengikat, meskipun PKWT berakhir.
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{
          marginBottom: 12,
        }}
      >
        <View
          style={[
            {
              alignItems: "center",
            },
          ]}
        >
          <Text style={styles.textBold}>Pasal 16</Text>
          <Text style={[styles.textBold, { textAlign: "center" }]}>
            Penyelesaian Perselisihan
          </Text>
        </View>

        <View style={{ marginTop: 12 }}>
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.list, { width: "0.3in" }]}>1.</Text>
            <Text style={[styles.textNormal, { flex: 1 }]}>
              Dalam hal terjadi ketidaksepahaman atau perselisihan dalam
              pelaksanaan PKWT ini maka PARA PIHAK akan menyelesaikannya dengan
              cara musyawarah untuk mufakat (kekeluargaan).
            </Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.list, { width: "0.3in" }]}>2.</Text>
            <Text style={[styles.textNormal, { flex: 1 }]}>
              Dalam hal penyelesaian secara mufakat tidak tercapai, maka PARA
              PIHAK sepakat untuk menyelesaikan perselisihan pada pihak yang
              berwenang dalam wilayah domisili hukum BPK PENABUR Jakarta.
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{
          marginBottom: 12,
        }}
      >
        <View
          style={[
            {
              alignItems: "center",
            },
          ]}
        >
          <Text style={styles.textBold}>Pasal 17</Text>
          <Text style={styles.textBold}>Keterpisahan</Text>
        </View>
        <Text style={[styles.textNormal, { marginTop: 12 }]}>
          Dalam hal terdapat salah satu atau beberapa ketentuan dalam PKWT ini
          yang dinyatakan tidak sah atau tidak berlaku, tidak membatalkan PKWT
          ini secara keseluruhan. PARA PIHAK sepakat melaksanakan isi selebihnya
          PKWT ini dengan itikad baik sesuai dengan tujuan PKWT.
        </Text>
      </View>

      <Text style={styles.textNormal}>
        Demikian PKWT ini dibuat dalam rangkap 2 (dua) dengan meterai cukup dan
        mempunyai kekuatan hukum yang sama, serta ditandatangani secara sukarela
        oleh masing-masing pihak dalam keadaan sadar, baik jasmani maupun rohani
        dan tanpa adanya paksaan dari pihak manapun.
      </Text>

      <Text style={[styles.textNormal, { marginTop: 24, marginBottom: 12 }]}>
        Jakarta, <Text style={{ color: "blue" }}>tgl surat (diinput)</Text>
      </Text>

      <View style={{ flexDirection: "row" }}>
        <Text style={styles.textNormal}>BPK PENABUR Jakarta,</Text>

        <View style={{ position: "absolute", left: "4in", width: "2.54in" }}>
          <Text style={styles.textNormal}>PEKERJA,</Text>
          <Text style={styles.textNormal}>
            Telah membaca dan memahami isi PKWT ini, serta menandatangani
            sebagai tanda persetujuan
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          gap: "0.2in",
          marginTop: 132,
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Text style={[styles.textNormal, { color: "blue" }]}>
            Iening Ananta, S.T.
          </Text>
          <Text style={[styles.textNormal, { color: "blue" }]}>
            Ketua Bidang SDM
          </Text>
        </View>

        <View style={{ alignItems: "center" }}>
          <Text style={[styles.textNormal, { color: "blue" }]}>
            Ir. Yosafat Adrian Wiguna, MBA
          </Text>
          <Text style={[styles.textNormal, { color: "blue" }]}>
            Sekretaris II
          </Text>
        </View>

        <Text
          style={[
            styles.textNormal,
            { position: "absolute", left: "4in", width: "2.54in" },
          ]}
        >
          nama karyawan
        </Text>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  containerDocument: {
    backgroundColor: "white",
    alignSelf: "center",
    paddingHorizontal: "0.87in",
    paddingTop: 116,
    paddingBottom: "0.79in",
  },

  containerHeader: {
    alignItems: "center",
    marginBottom: 12,
  },

  nomorHeader: {
    fontSize: 12,
    fontFamily: "Cambria",
  },

  kopSurat: {
    left: 0,
    position: "absolute",
    top: 0,
    width: "100%",
  },

  list: {
    fontFamily: "Cambria",
    fontSize: 13,
    width: 20,
    lineHeight: 1.15,
  },

  textNormal: {
    fontFamily: "Cambria",
    fontSize: 12,
    lineHeight: 1.15,
    textAlign: "justify",
  },

  textBold: {
    fontWeight: "bold",
    fontFamily: "Cambria",
    fontSize: 12,
    lineHeight: 1.15,
  },

  titleHeader: {
    fontFamily: "Cambria",
    textDecoration: "underline",
    fontWeight: "bold",
    fontSize: 14,
    lineHeight: 1.15,
  },
});
