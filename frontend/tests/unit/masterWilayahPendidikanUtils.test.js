import assert from "node:assert/strict";
import test from "node:test";

import {
  normalizeApiList,
  unwrapApiRecord,
} from "../../src/pages/masterWilayahPendidikan/components/utils.js";

test("normalizeApiList menerima array langsung", () => {
  const rows = [{ id: "SEK-1" }];

  assert.equal(normalizeApiList(rows), rows);
});

test("normalizeApiList mengambil array dari properti data", () => {
  const rows = [{ id: "SEK-1" }];

  assert.equal(normalizeApiList({ data: rows }), rows);
});

test("normalizeApiList mengembalikan array kosong untuk payload tidak valid", () => {
  assert.deepEqual(normalizeApiList(null), []);
  assert.deepEqual(normalizeApiList({ data: null }), []);
});

test("unwrapApiRecord mendukung respons Sequelize dataValues", () => {
  const row = { sek_id: "SEK-1", nama_sek: "Seksi Pendidikan" };

  assert.equal(unwrapApiRecord({ dataValues: row }), row);
  assert.equal(unwrapApiRecord(row), row);
  assert.deepEqual(unwrapApiRecord(null), {});
});
