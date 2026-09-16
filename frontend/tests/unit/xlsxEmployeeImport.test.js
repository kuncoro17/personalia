import assert from "node:assert/strict";
import test from "node:test";
import JSZip from "jszip";

import {
  buildEmployeeImportTemplateXlsx,
  mapEmployeeImportDates,
  normalizeResignDate,
} from "../../src/utils/xlsxEmployeeImport.js";

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

test("downloaded Excel template includes resign_date", async () => {
  const template = await buildEmployeeImportTemplateXlsx();
  const zip = await JSZip.loadAsync(await template.arrayBuffer());
  const sheet = await zip.file("xl/worksheets/sheet1.xml").async("text");

  assert.match(sheet, /<t>resign_date<\/t>/);
  assert.match(sheet, /<t>nik<\/t>/);
  assert.equal((sheet.match(/<c /g) || []).length, 25);
});
