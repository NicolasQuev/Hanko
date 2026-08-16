"use client";

import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { getDetails } from "@/lib/jikan";
import { PlatformIcon } from "./PlatformIcon";
import { useI18n } from "@/components/I18nProvider";
import type { StreamLink } from "@/lib/types";

interface StreamChipsProps {
  malId: number;
  initial?: StreamLink[];
  label?: string;
  busy?: boolean;
}

export function StreamChips({ malId, initial, label, busy }: StreamChipsProps) {
  const { t } = useI18n();
  const resolvedLabel = label ?? t("chips.whereToWatch");
  const [fetched, setFetched] = useState<StreamLink[] | null>(null);
  const [expanded, setExpanded] = useState(false);

  const streams = initial && initial.length > 0 ? initial : fetched;

  useEffect(() => {
    if (streams) return;
    if (!expanded) return;
    let cancelled = false;
    getDetails(malId)
      .then((d) => {
        if (!cancelled) setFetched(d.streams);
      })
      .catch(() => {
        if (!cancelled) setFetched([]);
      });
    return () => {
      cancelled = true;
    };
  }, [expanded, malId, streams]);

  if (busy) {
    return <span className="note mono">{t("chips.loading")}</span>;
  }

  if (streams && streams.length === 0) {
    return <span className="note mono">{t("chips.noStreams")}</span>;
  }

  if (streams) {
    return (
      <div className="panel__streams result__streams">
        {streams.map((s) => (
          <a
            key={s.site}
            className="stream-chip"
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <PlatformIcon site={s.site} size={13} />
            {s.site}
            <ExternalLink size={11} aria-hidden="true" />
          </a>
        ))}
      </div>
    );
  }

  if (expanded) {
    return <span className="note mono">{t("chips.searching")}</span>;
  }

  return (
    <button
      type="button"
      className="result__watch"
      onClick={() => setExpanded(true)}
      aria-expanded={expanded}
    >
      {resolvedLabel}
    </button>
  );
}