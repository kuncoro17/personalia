import JSZip from "jszip";

const escapeXml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const toColumnLetter = (index) => {
  let value = index + 1;
  let result = "";

  while (value > 0) {
    const remainder = (value - 1) % 26;
    result = String.fromCharCode(65 + remainder) + result;
    value = Math.floor((value - 1) / 26);
  }

  return result;
};

const toCell = (value, rowIndex, columnIndex) =>
  `<c r="${toColumnLetter(columnIndex)}${rowIndex}" t="inlineStr"><is><t>${escapeXml(value)}</t></is></c>`;

const DAY_COLUMN_PATTERN = /^\d{2}-[A-Za-z]{3}$/;
const TIME_RANGE_PATTERN = /^\d{2}:\d{2}-\d{2}:\d{2}$/;

const getAttendanceExportValue = (column, row) => {
  const value = String(row?.[column.key] ?? "").trim();

  if (!DAY_COLUMN_PATTERN.test(column.key)) return value || "-";
  if (!value || value === "-") return "0";
  if (value === "NC") return "NC";
  if (TIME_RANGE_PATTERN.test(value)) return "1";

  return value;
};

export const buildAttendanceExportXlsx = async (columns, rows) => {
  const zip = new JSZip();
  const headerCells = columns
    .map((column, index) => toCell(column.label, 1, index))
    .join("");
  const dataRows = rows
    .map(
      (row, rowIndex) =>
        `<row r="${rowIndex + 2}">${columns
          .map((column, columnIndex) =>
            toCell(
              getAttendanceExportValue(column, row),
              rowIndex + 2,
              columnIndex,
            ),
          )
          .join("")}</row>`,
    )
    .join("");
  const lastColumn = toColumnLetter(Math.max(columns.length - 1, 0));
  const lastRow = Math.max(rows.length + 1, 1);

  zip.file(
    "[Content_Types].xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
</Types>`,
  );
  zip.folder("_rels").file(
    ".rels",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`,
  );
  zip.folder("xl").file(
    "workbook.xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets><sheet name="Data Absensi" sheetId="1" r:id="rId1"/></sheets>
</workbook>`,
  );
  zip
    .folder("xl")
    .folder("_rels")
    .file(
      "workbook.xml.rels",
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
</Relationships>`,
    );
  zip
    .folder("xl")
    .folder("worksheets")
    .file(
      "sheet1.xml",
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <dimension ref="A1:${lastColumn}${lastRow}"/>
  <sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>
  <sheetData><row r="1">${headerCells}</row>${dataRows}</sheetData>
  <autoFilter ref="A1:${lastColumn}${lastRow}"/>
</worksheet>`,
    );

  return zip.generateAsync({ type: "blob" });
};
