"use client";

import { createContext, useContext } from "react";
import {
  dicts,
  translate,
  useLocale,
  setLocale as changeLocale,
  type Locale,
  type TKey,
} from "@/lib/i18n";

type Vars = Record<string, string | number>;

interface I18nContextValue {
  locale: Locale;
  setLocale: (next: Locale) => void;
  t: (key: TKey, vars?: Vars) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const locale = useLocale();

  const value: I18nContextValue = {
    locale,
    setLocale: changeLocale,
    t: (key, vars) => {
      let s = translate(dicts[locale], key);
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          s = s.replaceAll(`{${k}}`, String(v));
        }
      }
      return s;
    },
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within an I18nProvider");
  return ctx;
}