const STORAGE_KEY = "personalia:last-error-refresh";
const COOLDOWN_MS = 60_000;

export function canAutoRefresh(storage, now = Date.now()) {
  try {
    const previous = storage.getItem(STORAGE_KEY);

    if (previous === null) return true;

    const timestamp = Number(previous);

    return Number.isFinite(timestamp) && now - timestamp >= COOLDOWN_MS;
  } catch {
    // Without persistent storage, reloading could cause an endless loop.
    return false;
  }
}

export function claimAutoRefresh(storage, now = Date.now()) {
  if (!canAutoRefresh(storage, now)) return false;

  try {
    storage.setItem(STORAGE_KEY, String(now));

    return true;
  } catch {
    return false;
  }
}
