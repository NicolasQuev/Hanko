"use client";

import { OPEN_GUIDE_EVENT } from "@/components/Guide";
import { useI18n } from "@/components/I18nProvider";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="footer">
      <div className="shell footer__inner">
        <p className="footer__note">{t("footer")}</p>
        <button
          type="button"
          className="guide-trigger"
          onClick={() => window.dispatchEvent(new CustomEvent(OPEN_GUIDE_EVENT))}
        >
          {t("guide.trigger")}
        </button>
      </div>
    </footer>
  );
}