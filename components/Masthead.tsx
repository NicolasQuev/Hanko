"use client";

import Link from "next/link";
import Nav from "@/components/Nav";
import { useI18n } from "@/components/I18nProvider";

export default function Masthead() {
  const { t } = useI18n();

  return (
    <header className="masthead">
      <div className="shell masthead__inner">
        <Link className="wordmark" href="/" aria-label={t("brand.homeAria")}>
          <span className="wordmark__seal" aria-hidden="true" />
          <span className="wordmark__name">Hanko</span>
          <span className="wordmark__tag">{t("brand.tag")}</span>
        </Link>
        <Nav />
      </div>
    </header>
  );
}