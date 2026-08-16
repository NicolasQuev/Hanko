"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { StreamChips } from "./StreamChips";
import { standCode } from "@/lib/points";
import { translateText } from "@/lib/translate";
import { useI18n } from "@/components/I18nProvider";
import type { JikanResult } from "@/lib/types";

interface PreviewModalProps {
  result: JikanResult | null;
  onClose: () => void;
}

export function PreviewModal({ result, onClose }: PreviewModalProps) {
  const { locale, t } = useI18n();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [localized, setLocalized] = useState<string | null>(null);

  useEffect(() => {
    if (!result) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [result, onClose]);

  useEffect(() => {
    if (!result?.synopsis || locale === "en") return;
    let cancelled = false;
    translateText(result.synopsis, locale).then((r) => {
      if (!cancelled) setLocalized(r);
    });
    return () => {
      cancelled = true;
    };
  }, [result, locale]);

  if (!result) return null;

  const synopsis =
    locale === "en" ? result.synopsis : localized ?? result.synopsis;

  return (
    <div className="preview" role="dialog" aria-modal="true" aria-labelledby="preview-title">
      <div className="preview__backdrop" onClick={onClose} aria-hidden="true" />
      <div className="preview__panel">
        <div className="preview__head">
          <span className="preview__code">{standCode(0)}</span>
          <span className="preview__tag">{t("preview.tag")}</span>
          <button ref={closeRef} className="preview__close" onClick={onClose} aria-label={t("preview.close")}>
            <X size={15} aria-hidden="true" />
          </button>
        </div>
        <div className="preview__body">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="preview__img"
            src={result.imageLargeUrl || result.imageUrl}
            alt=""
          />
          <div className="preview__content">
            <h2 id="preview-title" className="preview__title">
              {result.title}
            </h2>
            {result.titleJapanese && (
              <div className="preview__jp jp">{result.titleJapanese}</div>
            )}
            <div className="preview__meta">
              {[result.year, result.type, result.episodes ? t("alta.caps", { n: result.episodes }) : null]
                .filter(Boolean)
                .join(" · ")}
              {result.genres.length > 0
                ? ` · ${result.genres.slice(0, 3).join(", ")}`
                : ""}
            </div>
            {synopsis ? (
              <p className="preview__synopsis">{synopsis}</p>
            ) : (
              <p className="preview__synopsis">
                {t("preview.noDescription")}
              </p>
            )}
            <StreamChips malId={result.malId} initial={result.streams} label={t("chips.whereToWatch")} />
          </div>
        </div>
      </div>
    </div>
  );
}