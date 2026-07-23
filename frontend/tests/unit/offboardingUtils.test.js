import assert from "node:assert/strict";
import test from "node:test";

import {
  formatOffboardingDate,
  normalizeOffboardingResponse,
} from "../../src/pages/offBoarding/utils.js";

test("normalizeOffboardingResponse membaca respons offboarding-today", () => {
  const employee = { id_karyawan: "employee-1", nama_lengkap: "Resign" };
  const response = {
    success: true,
    data: { total: 1, date: "2026-07-23", data: [employee] },
  };

  assert.deepEqual(normalizeOffboardingResponse(response), {
    total: 1,
    date: "2026-07-23",
    employees: [employee],
  });
});

test("normalizeOffboardingResponse menangani respons kosong", () => {
  assert.deepEqual(normalizeOffboardingResponse(null), {
    total: 0,
    date: "",
    employees: [],
  });
});

test("formatOffboardingDate menampilkan tanggal Indonesia", () => {
  assert.equal(formatOffboardingDate("2026-07-23"), "23 Juli 2026");
  assert.equal(formatOffboardingDate(""), "Hari ini");
});
