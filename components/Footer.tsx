"use client";

import { useI18n } from "@/components/I18nProvider";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="footer">
      <div className="shell">{t("footer")}</div>
    </footer>
  );
}