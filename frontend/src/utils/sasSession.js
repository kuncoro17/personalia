const SAS_SESSION_TOKEN_KEY = "personalia:sas-session-token";
const SAS_SESSION_USER_KEY = "personalia:sas-session-user";

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
