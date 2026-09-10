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
  const normalizedConfiguredDomain = normalizeClerkDomain(configuredDomain);

  if (normalizedConfiguredDomain) return normalizedConfiguredDomain;

  return normalizeClerkDomain(runtimeHost);
};
