import assert from "node:assert/strict";
import test from "node:test";
import JSZip from "jszip";
import { EMPLOYEE_EXCEL_COLUMNS } from "../../src/utils/employeeExcelColumns.js";

import {
  buildEmployeeImportTemplateXlsx,
  mapEmployeeImportDates,
  normalizeResignDate,
} from "../../src/utils/xlsxEmployeeImport.js";
import { buildEmployeeProfileExportXlsx } from "../../src/utils/xlsxEmployeeProfileExport.js";

test("resign_date maps to the existing backend field without changing employee status", () => {
  assert.deepEqual(
    mapEmployeeImportDates({
      nik: "0012345",
      status_aktif: "Aktif",
      resign_date: "16/09/2026",
    }),
    {
      nik: "0012345",
      status_aktif: "Aktif",
      tanggal_inactive: "2026-09-16",
    },
  );
  assert.deepEqual(
    mapEmployeeImportDates({ nik: "0012345", resign_date: " " }),
    { nik: "0012345" },
  );
  assert.deepEqual(mapEmployeeImportDates({ nik: "0012345" }), {
    nik: "0012345",
  });
});

test("legacy import headers map to the backend employee fields", () => {
  assert.deepEqual(
    mapEmployeeImportDates({
      tlp_pribadi: "08123456789",
      tlp_kantor: "021123456",
      status_karyawan: "TETAP",
    }),
    {
      telp_pribadi: "08123456789",
      telp_kantor: "021123456",
      kode_status_karyawan: "TETAP",
    },
  );
});

test("supports ISO dates, Indonesian dates, and both Excel date systems", () => {
  const date = "2026-09-16";
  const serial = (Date.UTC(2026, 8, 16) - Date.UTC(1899, 11, 30)) / 86_400_000;

  assert.equal(normalizeResignDate(date), date);
  assert.equal(normalizeResignDate("16/09/2026"), date);
  assert.equal(normalizeResignDate(String(serial)), date);
  assert.equal(normalizeResignDate(String(serial + 0.5)), date);
  assert.equal(normalizeResignDate(String(serial - 1462), true), date);
  assert.equal(normalizeResignDate("0", true), "1904-01-01");
  assert.equal(normalizeResignDate("1"), "1900-01-01");
  assert.equal(normalizeResignDate("29/02/2024"), "2024-02-29");
});

test("invalid and conflicting resign dates are rejected", () => {
  for (const value of [
    "2026-02-30",
    "29/02/2026",
    "2026-13-01",
    "unknown",
    "60",
    "999999999",
  ]) {
    assert.throws(() => normalizeResignDate(value), /resign_date/);
  }
  assert.throws(
    () =>
      mapEmployeeImportDates({
        resign_date: "2026-09-16",
        tanggal_inactive: "2026-09-17",
      }),
    /berbeda/,
  );
  assert.equal(
    mapEmployeeImportDates({
      resign_date: "16/09/2026",
      tanggal_inactive: "2026-09-16",
    }).tanggal_inactive,
    "2026-09-16",
  );
});

test("downloaded Excel template uses the agreed employee profile headers", async () => {
  const template = await buildEmployeeImportTemplateXlsx();
  const zip = await JSZip.loadAsync(await template.arrayBuffer());
  const sheet = await zip.file("xl/worksheets/sheet1.xml").async("text");
  const instructions = await zip
    .file("xl/worksheets/sheet2.xml")
    .async("text");

  assert.match(sheet, /<t>ID Karyawan<\/t>/);
  assert.match(sheet, /<t>Nama Panggilan<\/t>/);
  assert.match(sheet, /<t>Telepon Pribadi<\/t>/);
  assert.match(sheet, /<t>Email Penabur<\/t>/);
  assert.match(sheet, /<t>Kode Status Karyawan<\/t>/);
  assert.match(sheet, /<t>Status Karyawan<\/t>/);
  assert.match(sheet, /<t>Tanggal Inactive<\/t>/);
  assert.match(sheet, /<t>No TABITA<\/t>/);
  assert.match(sheet, /r="AZ1"/);
  assert.equal(
    (sheet.match(/<c /g) || []).length,
    EMPLOYEE_EXCEL_COLUMNS.length,
  );
  assert.match(instructions, /CONTOH PENGISIAN IMPORT KARYAWAN/);
  assert.match(instructions, />SKB00</);
  assert.match(instructions, />KWT</);
  assert.match(instructions, /Harus sama persis dengan kode di Master Status Karyawan/);
});

test("profile export includes organization and religion codes with their values", async () => {
  const workbook = await buildEmployeeProfileExportXlsx([
    {
      nik: "0012345",
      nama_lengkap: "Contoh Karyawan",
      agama_detail: { kode_agama: 1, agama: "Kristen" },
      unit_kerja_karyawan: [
        {
          jabatan: { kode_jab: "GURU", jabatan: "Guru" },
          unit_kerja_detail: {
            kode_divisi: "DIV-01",
            kode_bagian: "BAG-01",
            kode_seksi: "SEK-01",
            divisi: { kode: "DIV-01", nama_div: "Pendidikan" },
            bagian: { kode: "BAG-01", nama_bag: "Sekolah" },
            seksi: { kode: "SEK-01", nama_sek: "SD" },
          },
        },
      ],
    },
  ]);
  const zip = await JSZip.loadAsync(await workbook.arrayBuffer());
  const sheet = await zip.file("xl/worksheets/sheet1.xml").async("text");

  for (const value of [
    "Kode Divisi",
    "Pendidikan",
    "Kode Bagian",
    "Sekolah",
    "Kode Seksi",
    "SD",
    "Kode Jabatan",
    "GURU",
    "Kode Agama",
    "Kristen",
  ]) {
    assert.match(sheet, new RegExp(`>${value}<`));
  }
});
