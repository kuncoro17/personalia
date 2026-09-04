import assert from "node:assert/strict";
import test from "node:test";

import {
  getNewEmployeeStatus,
  normalizeJoinTodayResponse,
} from "../../src/pages/newEmployee/utils.js";

test("normalizeJoinTodayResponse membaca respons endpoint join-today", () => {
  const employee = {
    id_karyawan: "employee-1",
    nama_lengkap: "Karyawan Baru",
  };
  const response = {
    success: true,
    data: { total: 1, date: "2026-07-23", data: [employee] },
  };

  assert.deepEqual(normalizeJoinTodayResponse(response), [employee]);
});

test("normalizeJoinTodayResponse mendukung dataValues dan mengabaikan data tanpa id", () => {
  const employee = { id_karyawan: "employee-1", nama_lengkap: "Baru" };

  assert.deepEqual(
    normalizeJoinTodayResponse({ data: [{ dataValues: employee }, {}] }),
    [employee],
  );
});

test("getNewEmployeeStatus memakai stat_karyawan_gp dari API", () => {
  assert.equal(getNewEmployeeStatus({ stat_karyawan_gp: "PKW-T" }), "PKW-T");
  assert.equal(getNewEmployeeStatus({ status_karyawan: "Tetap" }), "Tetap");
  assert.equal(getNewEmployeeStatus({}), "-");
});
