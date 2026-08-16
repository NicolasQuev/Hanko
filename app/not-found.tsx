"use client";

import Link from "next/link";
import { useI18n } from "@/components/I18nProvider";

export default function NotFound() {
  const { t } = useI18n();

  return (
    <div className="shell page">
      <div className="state">
        <h2 className="state__title">{t("notFound.title")}</h2>
        <p className="state__text">{t("notFound.text")}</p>
        <Link href="/" className="btn btn--primary">
          {t("notFound.action")}
        </Link>
      </div>
    </div>
  );
}