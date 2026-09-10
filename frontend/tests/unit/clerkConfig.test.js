import assert from "node:assert/strict";
import test from "node:test";

import {
  normalizeClerkDomain,
  resolveSatelliteDomain,
} from "../../src/utils/clerkConfig.js";

test("normalizeClerkDomain membuang protokol dan path", () => {
  assert.equal(
    normalizeClerkDomain("https://staging-personalia.example.org/path"),
    "staging-personalia.example.org",
  );
});

test("configured domain menjadi sumber utama domain satellite", () => {
  assert.equal(
    resolveSatelliteDomain(
      "bpkpenabur.or.id",
      "localhost:3002",
    ),
    "bpkpenabur.or.id",
  );
});

test("runtime host digunakan ketika configured domain tidak tersedia", () => {
  assert.equal(
    resolveSatelliteDomain(undefined, "https://personalia.example.org"),
    "personalia.example.org",
  );
});
