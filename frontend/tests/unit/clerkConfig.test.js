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

test("runtime host menjadi sumber domain satellite", () => {
  assert.equal(
    resolveSatelliteDomain(
      "domain-yang-salah.example.org",
      "localhost:3002",
    ),
    "localhost:3002",
  );
});

test("configured domain digunakan ketika runtime host tidak tersedia", () => {
  assert.equal(
    resolveSatelliteDomain("https://personalia.example.org", undefined),
    "personalia.example.org",
  );
});
