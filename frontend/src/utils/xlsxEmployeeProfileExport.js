import JSZip from "jszip";
import { EMPLOYEE_EXCEL_COLUMNS } from "./employeeExcelColumns.js";

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

const getUnitKerjaValues = (employee, getValue) => {
  const unitKerja = Array.isArray(employee.unit_kerja_karyawan)
    ? employee.unit_kerja_karyawan
    : [];

  return [...new Set(unitKerja.map(getValue).filter(Boolean))].join(" | ");
};

const getColumnValue = (employee, key) => {
  if (key === "kode_status_karyawan") {
    return employee.status_karyawan?.stat_karyawan_gp || employee[key];
  }
  if (key === "kode_agama") {
    return employee.agama_detail?.kode_agama || employee[key];
  }
  if (key === "agama") return employee.agama_detail?.agama || employee[key];
  if (key === "kode_divisi") {
    return getUnitKerjaValues(
      employee,
      (unit) =>
        unit.unit_kerja_detail?.divisi?.kode ||
        unit.unit_kerja_detail?.kode_divisi,
    );
  }
  if (key === "nama_divisi") {
    return getUnitKerjaValues(
      employee,
      (unit) => unit.unit_kerja_detail?.divisi?.nama_div,
    );
  }
  if (key === "kode_bagian") {
    return getUnitKerjaValues(
      employee,
      (unit) =>
        unit.unit_kerja_detail?.bagian?.kode ||
        unit.unit_kerja_detail?.kode_bagian,
    );
  }
  if (key === "nama_bagian") {
    return getUnitKerjaValues(
      employee,
      (unit) => unit.unit_kerja_detail?.bagian?.nama_bag,
    );
  }
  if (key === "kode_seksi") {
    return getUnitKerjaValues(
      employee,
      (unit) =>
        unit.unit_kerja_detail?.seksi?.kode ||
        unit.unit_kerja_detail?.kode_seksi,
    );
  }
  if (key === "nama_seksi") {
    return getUnitKerjaValues(
      employee,
      (unit) => unit.unit_kerja_detail?.seksi?.nama_sek,
    );
  }
  if (key === "kode_jabatan") {
    return getUnitKerjaValues(
      employee,
      (unit) => unit.jabatan?.kode_jab || unit.jab_id,
    );
  }
  if (key === "jabatan") {
    return getUnitKerjaValues(employee, (unit) => unit.jabatan?.jabatan);
  }
  if (key === "id_master_setempat") {
    return employee.master_setempat?.kota_setempat || employee[key];
  }
  if (
    key.startsWith("tgl_") ||
    key === "tanggal_pernikahan" ||
    key === "tanggal_inactive" ||
    key === "birth_date"
  ) {
    return dateValue(employee[key]);
  }
  return employee[key];
};

export const buildEmployeeProfileExportXlsx = async (employees = []) => {
  const rows = [
    EMPLOYEE_EXCEL_COLUMNS.map(({ label }) => label),
    ...employees.map((employee) =>
      EMPLOYEE_EXCEL_COLUMNS.map(
        ({ key }) => getColumnValue(employee, key) ?? "",
      ),
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
  const widths = EMPLOYEE_EXCEL_COLUMNS.map(
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
