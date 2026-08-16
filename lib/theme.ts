import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

const THEME_KEY = "hanko.theme";
const LEGACY_THEME_KEY = "animepuntos.theme";

let theme: Theme = "light";
const listeners = new Set<() => void>();

if (typeof window !== "undefined") {
  theme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function emit() {
  for (const l of listeners) l();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function getSnapshot(): Theme {
  return theme;
}

function getServerSnapshot(): Theme {
  return "light";
}

export function setTheme(next: Theme) {
  theme = next;
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem(THEME_KEY, next);
    localStorage.removeItem(LEGACY_THEME_KEY);
  } catch {
    /* storage unavailable */
  }
  emit();
}

export function useTheme() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}