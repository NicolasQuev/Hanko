"use client";

import Image from "next/image";
import Link from "next/link";
import type { Series } from "@/lib/types";
import { isComplete, standCode } from "@/lib/points";
import { Mark } from "@/components/Mark";
import { useI18n } from "@/components/I18nProvider";

interface StampProps {
  series: Series;
  index: number;
  size?: "xs" | "sm" | "lg";
  priority?: boolean;
}

export default function Stamp({
  series,
  index,
  size = "sm",
  priority = false,
}: StampProps) {
  const { t } = useI18n();
  const done = isComplete(series);
  const shownStatus = done ? "completed" : series.status;
  const progress =
    series.episodes != null && series.episodes > 0
      ? `${series.watched}/${series.episodes}`
      : `${series.watched}`;
  const markSize = size === "lg" ? 30 : size === "xs" ? 14 : 18;

  return (
    <Link
      href={`/serie/${series.id}`}
      className={`stamp${size === "lg" ? " stamp--lg" : ""}${size === "xs" ? " stamp--xs" : ""}`}
      title={size === "xs" ? series.title : undefined}
    >
      <span className="stamp__plate">
        <Image
          className="stamp-img"
          src={series.imageLargeUrl || series.imageUrl}
          alt={t("stamp.alt", { title: series.title })}
          fill
          sizes={size === "lg" ? "320px" : size === "xs" ? "96px" : "180px"}
          priority={priority}
        />
        <span className="stamp__code">{standCode(index)}</span>
        {shownStatus !== "completed" ? (
          <span className={`mark mark--svg mark--${shownStatus}`} aria-hidden="true">
            <Mark status={shownStatus} size={markSize} />
          </span>
        ) : (
          <>
            <span className="mark mark--strike" aria-hidden="true" />
            <span className="seal" aria-label={t("stamp.completeAria")}>
              <Mark status="completed" size={size === "xs" ? 16 : 30} />
            </span>
          </>
        )}
      </span>
      <span className="stamp__name">{series.title}</span>
      <span className="stamp__meta">
        {done
          ? t("stamp.metaComplete")
          : series.status === "watching"
            ? t("stamp.metaWatching", { progress })
            : series.status === "paused"
              ? t("stamp.metaPaused", { progress })
              : t("stamp.metaPlan", { progress })}
      </span>
    </Link>
  );
}