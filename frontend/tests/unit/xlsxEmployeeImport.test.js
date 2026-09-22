import assert from "node:assert/strict";
import test from "node:test";
import JSZip from "jszip";
import {
  EMPLOYEE_EXCEL_COLUMNS,
  EMPLOYEE_EXCEL_HEADER_TO_KEY,
} from "./employeeExcelColumns.js";

const toColumnIndex = (colLetters = "") => {
  let result = 0;
  const letters = String(colLetters).toUpperCase();

  for (let i = 0; i < letters.length; i += 1) {
    const code = letters.charCodeAt(i);

    if (code < 65 || code > 90) continue;
    result = result * 26 + (code - 64);
  }

  return result - 1;
};

const toColumnName = (index) => {
  let value = index + 1;
  let result = "";

  while (value > 0) {
    const remainder = (value - 1) % 26;
    result = String.fromCharCode(65 + remainder) + result;
    value = Math.floor((value - 1) / 26);
  }

  return result;
};

const normalizeHeaderKey = (value = "") =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");

const extractCellValue = (cell, sharedStrings) => {
  const t = cell.getAttribute("t");

  if (t === "inlineStr") {
    const textNode = cell.querySelector("is t");

    return textNode?.textContent ?? "";
  }

  const v = cell.querySelector("v")?.textContent ?? "";

  if (t === "s") {
    const index = Number(v);

    return Number.isInteger(index) && index >= 0
      ? (sharedStrings[index] ?? "")
      : "";
  }

  return v;
};

const parseSharedStrings = (xml) => {
  if (!xml) return [];

  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "application/xml");
  const items = Array.from(doc.querySelectorAll("sst si"));

  return items.map((si) => {
    const parts = Array.from(si.querySelectorAll("t")).map(
      (t) => t.textContent || "",
    );

    return parts.join("");
  });
};

const parseWorksheetRows = (sheetXml, sharedStrings) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(sheetXml, "application/xml");
  const rows = Array.from(doc.querySelectorAll("worksheet sheetData row"));

  const table = rows.map((row) => {
    const cells = Array.from(row.querySelectorAll("c"));
    const record = {};

    for (const cell of cells) {
      const ref = cell.getAttribute("r") || "";
      const match = ref.match(/^([A-Z]+)[0-9]+$/i);
      const colIndex = match ? toColumnIndex(match[1]) : -1;

      if (colIndex < 0) continue;

      record[colIndex] = extractCellValue(cell, sharedStrings);
    }

    return record;
  });

  return table;
};

const DEFAULT_EMPLOYEE_HEADERS = EMPLOYEE_EXCEL_COLUMNS.map(
  ({ label }) => label,
);

export const normalizeResignDate = (value, date1904 = false) => {
  const text = String(value ?? "").trim();

  if (!text) return undefined;

  if (/^\d+(?:\.\d+)?$/.test(text)) {
    const serial = Math.floor(Number(text));

    if (
      (!date1904 && (serial < 1 || serial === 60)) ||
      serial > 2_958_465
    ) {
      throw new Error("resign_date berisi tanggal Excel yang tidak valid");
    }

    const epoch = date1904
      ? Date.UTC(1904, 0, 1)
      : Date.UTC(1899, 11, serial < 60 ? 31 : 30);

    const date = new Date(epoch + serial * 86_400_000);

    if (date.getUTCFullYear() > 9999) {
      throw new Error("resign_date berada di luar rentang tanggal");
    }

    return date.toISOString().slice(0, 10);
  }

  const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const local = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);

  const parts = iso
    ? [iso[1], iso[2], iso[3]]
    : local
      ? [local[3], local[2], local[1]]
      : null;

  if (!parts) {
    throw new Error(
      "resign_date harus berupa YYYY-MM-DD, DD/MM/YYYY, atau tanggal Excel",
    );
  }

  const [year, month, day] = parts.map(Number);
  const date = new Date(0);

  date.setUTCFullYear(year, month - 1, day);

  if (
    year < 1 ||
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new Error("resign_date berisi tanggal yang tidak valid");
  }

  return date.toISOString().slice(0, 10);
};

export const mapEmployeeImportDates = (record, date1904 = false) => {
  const {
    resign_date,
    tanggal_inactive,
    tlp_pribadi,
    tlp_kantor,
    status_karyawan,
    ...payload
  } = record;

  const resignDate = normalizeResignDate(resign_date, date1904);
  const inactiveDate = normalizeResignDate(tanggal_inactive, date1904);

  if (tlp_pribadi != null) {
    payload.telp_pribadi = tlp_pribadi;
  }

  if (tlp_kantor != null) {
    payload.telp_kantor = tlp_kantor;
  }

  if (status_karyawan != null) {
    payload.kode_status_karyawan = status_karyawan;
  }

  if (resignDate && inactiveDate && resignDate !== inactiveDate) {
    throw new Error("resign_date berbeda dengan tanggal_inactive");
  }

  const resolvedInactiveDate = inactiveDate ?? resignDate;

  if (resolvedInactiveDate) {
    payload.tanggal_inactive = resolvedInactiveDate;
  }

  return payload;
};

export const buildEmployeeImportTemplateXlsx = async (
  headers = DEFAULT_EMPLOYEE_HEADERS,
) => {
  const zip = new JSZip();

  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
</Types>`;

  const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;

  const workbook = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
 xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="Sheet1" sheetId="1" r:id="rId1"/>
  </sheets>
</workbook>`;

  const workbookRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
</Relationships>`;

  const cells = headers
    .map((h, i) => {
      const col = toColumnName(i);

      const safe = String(h)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      return `<c r="${col}1" t="inlineStr"><is><t>${safe}</t></is></c>`;
    })
    .join("");

  const sheet1 = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetData>
    <row r="1">
      ${cells}
    </row>
  </sheetData>
</worksheet>`;

  zip.file("[Content_Types].xml", contentTypes);
  zip.folder("_rels").file(".rels", rels);
  zip.folder("xl").file("workbook.xml", workbook);
  zip.folder("xl").folder("_rels").file("workbook.xml.rels", workbookRels);
  zip.folder("xl").folder("worksheets").file("sheet1.xml", sheet1);

  return zip.generateAsync({ type: "blob" });
};

export const parseEmployeeXlsxFile = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);

  const workbookXml = await zip.file("xl/workbook.xml")?.async("text");

  const dateSystem = workbookXml
    ? new DOMParser()
        .parseFromString(workbookXml, "application/xml")
        .querySelector("workbookPr")
        ?.getAttribute("date1904")
    : null;

  const date1904 = dateSystem === "1" || dateSystem === "true";

  const sheetFile = zip.file("xl/worksheets/sheet1.xml");

  if (!sheetFile) {
    throw new Error("Sheet1 tidak ditemukan (xl/worksheets/sheet1.xml).");
  }

  const sharedStringsXml = await zip
    .file("xl/sharedStrings.xml")
    ?.async("text")
    .catch(() => null);

  const sharedStrings = parseSharedStrings(sharedStringsXml);

  const sheetXml = await sheetFile.async("text");
  const table = parseWorksheetRows(sheetXml, sharedStrings);

  if (table.length === 0) {
    return [];
  }

  const headerRow = table[0] || {};

  const headers = Object.keys(headerRow)
    .map((k) => Number(k))
    .filter((n) => Number.isInteger(n) && n >= 0)
    .sort((a, b) => a - b)
    .map((idx) => {
      const original = String(headerRow[idx] ?? "").trim();

      return (
        EMPLOYEE_EXCEL_HEADER_TO_KEY[original] ||
        normalizeHeaderKey(original)
      );
    });

  /*
   * Field yang boleh kosong.
   *
   * Jika cell Excel kosong, field tetap dimasukkan
   * ke object dengan nilai string kosong.
   *
   * Ini berbeda dengan field lainnya yang tetap
   * diabaikan apabila kosong.
   */
  const ALLOW_EMPTY_FIELDS = new Set([
    "nama_panggilan",
    "email_pribadi",
  ]);

  const records = [];

  for (let i = 1; i < table.length; i += 1) {
    const row = table[i] || {};
    const obj = {};

    for (const [colIndexRaw, cellValue] of Object.entries(row)) {
      const colIndex = Number(colIndexRaw);
      const key = headers[colIndex];

      if (!key) continue;

      const value =
        typeof cellValue === "string" ? cellValue.trim() : cellValue;

      /*
       * Untuk nama_panggilan dan email_pribadi:
       * cell kosong tetap dimasukkan sebagai "".
       */
      if (value === "") {
        if (ALLOW_EMPTY_FIELDS.has(key)) {
          obj[key] = "";
        }

        continue;
      }
      obj[key] = value;
    }

    if (Object.keys(obj).length > 0) {
      try {
        records.push(mapEmployeeImportDates(obj, date1904));
      } catch (error) {
        throw new Error(`Baris ${i + 1}: ${error.message}`);
      }
    }
  }

  return records;
};