import assert from "node:assert/strict";
import test from "node:test";

import {
  canAutoRefresh,
  claimAutoRefresh,
} from "../../src/utils/errorRefresh.js";

function createStorage() {
  const values = new Map();

  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
}

test("allows the first refresh and blocks a repeated crash after reload", () => {
  const storage = createStorage();

  assert.equal(claimAutoRefresh(storage, 100_000), true);
  assert.equal(claimAutoRefresh(storage, 102_000), false);
  assert.equal(claimAutoRefresh(storage, 159_999), false);
  assert.equal(claimAutoRefresh(storage, 160_000), true);
});

test("checking before a cancelled timer does not consume the refresh", () => {
  const storage = createStorage();

  assert.equal(canAutoRefresh(storage, 100_000), true);
  assert.equal(canAutoRefresh(storage, 100_000), true);
  assert.equal(claimAutoRefresh(storage, 102_000), true);
  assert.equal(claimAutoRefresh(storage, 102_000), false);
});

test("storage failures disable auto refresh to prevent a reload loop", () => {
  const unreadable = {
    getItem: () => {
      throw new Error("denied");
    },
  };
  const unwritable = {
    getItem: () => null,
    setItem: () => {
      throw new Error("quota");
    },
  };

  assert.equal(canAutoRefresh(unreadable), false);
  assert.equal(claimAutoRefresh(unreadable), false);
  assert.equal(claimAutoRefresh(unwritable), false);
});

test("a clock adjustment backwards does not allow repeated refreshes", () => {
  const storage = createStorage();

  claimAutoRefresh(storage, 100_000);
  assert.equal(claimAutoRefresh(storage, 90_000), false);
});
