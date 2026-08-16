"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun } from "lucide-react";

const GITHUB_URL = "https://github.com/NicolasQuev/Hanko";
import { useLibrary } from "@/lib/store";
import { setTheme, useTheme } from "@/lib/theme";
import { useI18n } from "@/components/I18nProvider";
import type { Locale } from "@/lib/i18n";

const ITEMS: { href: string; key: "map" | "catalog" | "alta" }[] = [
  { href: "/", key: "map" },
  { href: "/biblioteca", key: "catalog" },
  { href: "/alta", key: "alta" },
];

const LANG_OPTIONS: { value: Locale; label: string }[] = [
  { value: "es", label: "ES" },
  { value: "en", label: "EN" },
  { value: "ja", label: "JP" },
];

export default function Nav() {
  const pathname = usePathname();
  const { library } = useLibrary();
  const dark = useTheme() === "dark";
  const { locale, setLocale, t } = useI18n();

  const toggleTheme = () => setTheme(dark ? "light" : "dark");

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="nav" aria-label={t("nav.aria")}>
      {ITEMS.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`nav__link${active ? " is-active" : ""}`}
            aria-current={active ? "page" : undefined}
          >
            {t(`nav.${item.key}`)}
            {item.href === "/biblioteca" && library.length > 0 && (
              <span className="mono">({library.length})</span>
            )}
          </Link>
        );
      })}
      <div className="nav__lang" role="group" aria-label={t("nav.lang")}>
        {LANG_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`nav__lang-btn${locale === opt.value ? " is-active" : ""}`}
            onClick={() => setLocale(opt.value)}
            aria-pressed={locale === opt.value}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <a
        className="nav__theme"
        href={GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
      >
        <svg viewBox="0 0 24 24" width={14} height={14} aria-hidden="true" focusable="false">
          <path
            fill="currentColor"
            d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
          />
        </svg>
      </a>
      <button
        type="button"
        className="nav__theme"
        onClick={toggleTheme}
        aria-pressed={dark}
        aria-label={dark ? t("nav.themeLight") : t("nav.themeDark")}
      >
        {dark ? <Sun size={14} aria-hidden="true" /> : <Moon size={14} aria-hidden="true" />}
      </button>
    </nav>
  );
}