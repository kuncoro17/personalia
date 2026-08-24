const SAS_SESSION_TOKEN_KEY = "personalia:sas-session-token";
const SAS_SESSION_USER_KEY = "personalia:sas-session-user";
const SAS_ENTRY_KEY = "personalia:sas-entry";

const storage =
  typeof window !== "undefined" ? window.sessionStorage : undefined;

export const getSasSessionToken = () =>
  storage?.getItem(SAS_SESSION_TOKEN_KEY) || "";

export const setSasSession = ({ token, user }) => {
  if (!storage || !token) return;

  storage.setItem(SAS_SESSION_TOKEN_KEY, token);
  if (user) {
    storage.setItem(SAS_SESSION_USER_KEY, JSON.stringify(user));
  }
};

export const getSasSessionUser = () => {
  const raw = storage?.getItem(SAS_SESSION_USER_KEY);

  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const clearSasSession = () => {
  storage?.removeItem(SAS_SESSION_TOKEN_KEY);
  storage?.removeItem(SAS_SESSION_USER_KEY);
};

export const hasSasSession = () => Boolean(getSasSessionToken());

export const markSasEntry = () => {
  storage?.setItem(SAS_ENTRY_KEY, "true");
};

export const hasSasEntry = () => storage?.getItem(SAS_ENTRY_KEY) === "true";

export const getSasSdmUrl = () => {
  const configuredUrl = import.meta.env.VITE_SAS_SDM_URL;

  if (configuredUrl) return configuredUrl;

  const portalUrl = import.meta.env.VITE_SAS_PORTAL_URL;

  if (portalUrl) {
    try {
      return new URL("/sumber-daya-manusia", portalUrl).toString();
    } catch {
      // Gunakan fallback jika konfigurasi URL tidak valid.
    }
  }

  return "https://staging-new-sas.bpkpenaburjakarta.or.id/sumber-daya-manusia";
};
