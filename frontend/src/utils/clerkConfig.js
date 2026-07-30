export const normalizeClerkDomain = (value) => {
  if (!value) return undefined;

  const raw = String(value).trim();

  if (!raw) return undefined;

  if (/^https?:\/\//i.test(raw)) {
    try {
      return new URL(raw).host;
    } catch {
      return undefined;
    }
  }

  return raw.split("/")[0] || undefined;
};

export const resolveSatelliteDomain = (configuredDomain, runtimeHost) => {
  const normalizedRuntimeHost = normalizeClerkDomain(runtimeHost);

  // Di browser, host halaman adalah sumber kebenaran untuk domain satellite.
  // Ini mencegah Clerk mencoba mengatur cookie untuk domain dari build/CI yang
  // tidak sama dengan domain yang sedang dibuka.
  if (normalizedRuntimeHost) return normalizedRuntimeHost;

  return normalizeClerkDomain(configuredDomain);
};
