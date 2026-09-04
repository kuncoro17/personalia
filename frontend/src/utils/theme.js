const THEME_STORAGE_KEY = "personalia:theme";
const THEME_EVENT = "personalia-theme-change";

const isBrowser = typeof window !== "undefined";

export const THEME = {
  LIGHT: "light",
  DARK: "dark",
};

export const getPreferredTheme = () => {
  if (!isBrowser) return THEME.LIGHT;

  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

  if (savedTheme === THEME.LIGHT || savedTheme === THEME.DARK) {
    return savedTheme;
  }

  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? THEME.DARK
    : THEME.LIGHT;
};

export const applyTheme = (theme) => {
  if (!isBrowser) return;

  const nextTheme = theme === THEME.DARK ? THEME.DARK : THEME.LIGHT;
  const root = document.documentElement;

  root.classList.toggle("dark", nextTheme === THEME.DARK);
  root.dataset.theme = nextTheme;
  root.style.colorScheme = nextTheme;
  window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: nextTheme }));
};

export const listenThemeChange = (handler) => {
  if (!isBrowser) return () => {};

  const onThemeChange = (event) => handler(event.detail || getPreferredTheme());

  window.addEventListener(THEME_EVENT, onThemeChange);

  return () => window.removeEventListener(THEME_EVENT, onThemeChange);
};
