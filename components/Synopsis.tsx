"use client";

import { useEffect, useState } from "react";
import { getDetails } from "@/lib/jikan";
import { translateText } from "@/lib/translate";
import { useI18n } from "@/components/I18nProvider";

interface SynopsisProps {
  malId: number;
  initial?: string | null;
}

export function Synopsis({ malId, initial }: SynopsisProps) {
  const { locale, t } = useI18n();
  const [text, setText] = useState<string | null>(initial ?? null);
  const [expanded, setExpanded] = useState(false);
  const [localized, setLocalized] = useState<string | null>(null);

  useEffect(() => {
    if (text) return;
    if (!expanded) return;
    let cancelled = false;
    getDetails(malId)
      .then((d) => {
        if (!cancelled) setText(d.synopsis);
      })
      .catch(() => {
        if (!cancelled) setText("");
      });
    return () => {
      cancelled = true;
    };
  }, [expanded, malId, text]);

  useEffect(() => {
    if (!text || locale === "en") return;
    let cancelled = false;
    translateText(text, locale).then((r) => {
      if (!cancelled) setLocalized(r);
    });
    return () => {
      cancelled = true;
    };
  }, [text, locale]);

  if (!text && !expanded) {
    return (
      <button
        type="button"
        className="result__watch"
        onClick={() => setExpanded(true)}
        aria-expanded={expanded}
      >
        {t("synopsis.view")}
      </button>
    );
  }

  if (!text) return null;

  const shown = locale === "en" ? text : localized ?? text;

  return <p className="panel__synopsis">{shown}</p>;
}