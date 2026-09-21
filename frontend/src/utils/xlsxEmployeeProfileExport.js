import JSZip from "jszip";

const escapeXml = (value) =>
  String(value ?? "")
    // XML 1.0 rejects control characters other than tab, line-feed, and carriage-return.
    // Employee data may contain these through legacy imports or copied text.
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .replace(
      /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g,
      "",
    )
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const columnName = (index) => {
  let value = index + 1;
  let result = "";

  while (value > 0) {
    const remainder = (value - 1) % 26;

    result = String.fromCharCode(65 + remainder) + result;
    value = Math.floor((value - 1) / 26);
  }

  return result;
};

const dateValue = (value) => (value ? String(value).slice(0, 10) : "");
const firstUnit = (employee) => employee.unit_kerja_karyawan?.[0] ?? {};
const unitDetail = (employee) => firstUnit(employee).unit_kerja_detail ?? {};

const PROFILE_COLUMNS = [
  ["ID Karyawan", (e) => e.nik],
  ["Nama Lengkap", (e) => e.nama_lengkap],
  ["Nama Panggilan", (e) => e.nama_panggilan],
  [
    "Status Karyawan",
    (e) => e.status_karyawan?.stat_karyawan_gp || e.status_aktif,
  ],
  ["Status Aktif", (e) => e.status_aktif],
  ["Email PENABUR", (e) => e.email_penabur],
  ["Email Pribadi", (e) => e.email_pribadi],
  ["Nomor KTP", (e) => e.no_ktp],
  ["No Passport", (e) => e.no_pasport],
  ["Telepon Pribadi", (e) => e.telp_pribadi],
  ["Telepon Kantor", (e) => e.telp_kantor],
  ["Direktur", (e) => unitDetail(e).direktur?.nama_dir],
  ["Deputi", (e) => unitDetail(e).deputi?.nama_dep],
  ["Divisi", (e) => unitDetail(e).divisi?.nama_div],
  ["Bagian/Biro/Sekolah", (e) => unitDetail(e).bagian?.nama_bag],
  ["Seksi", (e) => unitDetail(e).seksi?.nama_sek],
  ["Jabatan", (e) => firstUnit(e).jabatan?.jabatan],
  ["Tipe Sekolah", (e) => e.tipe_sekolah],
  ["Kota Setempat", (e) => e.master_setempat?.kota_setempat],
  ["Tanggal Join PENABUR", (e) => dateValue(e.tgl_join_penabur)],
  ["Tanggal Join PENABUR Jakarta", (e) => dateValue(e.tgl_join_penabur_jkt)],
  ["Tanggal Status Tetap", (e) => dateValue(e.tgl_status_permanen)],
  ["Tanggal Penuh Waktu", (e) => dateValue(e.tgl_penuh_waktu)],
  ["Agama", (e) => e.agama_detail?.agama],
  ["Status Nikah", (e) => e.status_nikah],
  ["Tanggal Pernikahan", (e) => dateValue(e.tanggal_pernikahan)],
  ["Alasan Berhenti Kerja", (e) => e.alasan_berhenti_kerja],
  ["Tanggal Inactive", (e) => dateValue(e.tanggal_inactive)],
];

export const buildEmployeeProfileExportXlsx = async (employees = []) => {
  const rows = [
    PROFILE_COLUMNS.map(([header]) => header),
    ...employees.map((employee) =>
      PROFILE_COLUMNS.map(([, getValue]) => getValue(employee) ?? ""),
    ),
  ];
  const sheetRows = rows
    .map(
      (row, rowIndex) =>
        `<row r="${rowIndex + 1}">${row
          .map(
            (value, colIndex) =>
              `<c r="${columnName(colIndex)}${rowIndex + 1}" t="inlineStr"><is><t xml:space="preserve">${escapeXml(value)}</t></is></c>`,
          )
          .join("")}</row>`,
    )
    .join("");
  const widths = PROFILE_COLUMNS.map(
    (_, index) =>
      `<col min="${index + 1}" max="${index + 1}" width="22" customWidth="1"/>`,
  ).join("");
  const zip = new JSZip();

  zip.file(
    "[Content_Types].xml",
    `<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>`,
  );
  zip
    .folder("_rels")
    .file(
      ".rels",
      `<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`,
    );
  zip
    .folder("xl")
    .file(
      "workbook.xml",
      `<?xml version="1.0" encoding="UTF-8"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Profil Karyawan" sheetId="1" r:id="rId1"/></sheets></workbook>`,
    );
  zip
    .folder("xl")
    .folder("_rels")
    .file(
      "workbook.xml.rels",
      `<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>`,
    );
  zip
    .folder("xl")
    .folder("worksheets")
    .file(
      "sheet1.xml",
      `<?xml version="1.0" encoding="UTF-8"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><cols>${widths}</cols><sheetData>${sheetRows}</sheetData></worksheet>`,
    );

  return zip.generateAsync({ type: "blob" });
};
