"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, House, Minus } from "lucide-react";
import { useLibrary } from "@/lib/store";
import { Mark } from "@/components/Mark";
import { StampPress } from "@/components/StampPress";
import { StreamChips } from "@/components/StreamChips";
import { Synopsis } from "@/components/Synopsis";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import {
  isComplete,
  POINTS_PER_EPISODE,
  COMPLETION_BONUS,
  RATING_MULTIPLIER,
  seriesPoints,
  standCode,
} from "@/lib/points";
import type { SeriesStatus } from "@/lib/types";
import { useI18n } from "@/components/I18nProvider";

gsap.registerPlugin(useGSAP);

const STATUSES: SeriesStatus[] = ["watching", "completed", "planned", "paused"];

const STATUS_ICONS: Record<SeriesStatus, React.ReactNode> = {
  watching: <Mark status="watching" size={14} />,
  completed: <Mark status="completed" variant="strike" size={14} />,
  planned: <Mark status="planned" size={14} />,
  paused: <Mark status="paused" size={14} />,
};

const STRIP_MAX = 60;

function SerieView() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "";
  const router = useRouter();
  const { t } = useI18n();
  const { library, setStatus, setWatched, markNext, unmark, setRating, remove } =
    useLibrary();
  const [stampActive, setStampActive] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const index = useMemo(() => library.findIndex((s) => s.id === id), [library, id]);
  const s = index >= 0 ? library[index] : undefined;
  const stripRef = useRef<HTMLDivElement>(null);
  const prevWatched = useRef(s?.watched ?? 0);

  useGSAP(
    () => {
      if (!s || stripRef.current === null) return;
      const cells = Array.from(stripRef.current.children) as HTMLElement[];
      const prev = prevWatched.current;
      const fresh = cells.slice(prev, s.watched).filter((c) => c.classList.contains("is-inked"));
      if (fresh.length === 0) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(fresh, {
          scale: 1.7,
          borderRadius: 3,
          duration: 0.28,
          ease: "back.out(2.5)",
          clearProps: "all",
          transformOrigin: "center",
        });
      });
      return () => mm.revert();
    },
    { dependencies: [s?.watched], scope: stripRef },
  );

  useEffect(() => {
    prevWatched.current = s?.watched ?? 0;
  }, [s?.watched]);

  if (!s) {
    return (
      <div className="shell page">
        <div className="state">
          <h2 className="state__title">{t("ficha.notFoundTitle")}</h2>
          <p className="state__text">{t("ficha.notFoundText")}</p>
          <Link href="/biblioteca" className="btn btn--primary">
            {t("ficha.backCatalog")}
          </Link>
        </div>
      </div>
    );
  }

  const done = isComplete(s);
  const total = s.episodes && s.episodes > 0 ? s.episodes : null;
  const pts = seriesPoints(s);
  const stripCells = total ? Math.min(total, STRIP_MAX) : Math.max(s.watched + 1, 12);

  return (
    <div className="shell page">
      <Link href="/biblioteca" className="back">
        <ArrowLeft size={14} aria-hidden="true" />
        {t("ficha.backCatalog")}
      </Link>

      <div className="ficha">
        <aside className="ficha__aside">
          <div className="stamp stamp--lg">
            <span className="stamp__plate">
              <Image
                className="stamp-img"
                src={s.imageLargeUrl || s.imageUrl}
                alt={t("ficha.alt", { title: s.title })}
                fill
                sizes="320px"
                priority
              />
              <span className="stamp__code">{standCode(index)}</span>
              {done ? (
                <>
                  <span className="mark mark--strike" aria-hidden="true" />
                  <span className="seal" aria-label={t("ficha.completeAria")}>
                    <Mark status="completed" size={30} />
                  </span>
                </>
              ) : (
                <span
                  className={`mark mark--svg mark--${s.status}`}
                  aria-hidden="true"
                >
                  <Mark status={s.status} size={26} />
                </span>
              )}
            </span>
            <span className="stamp__name">{s.title}</span>
          </div>
        </aside>

        <div className="ficha__main">
          <header>
            <h1 className="ficha__title">{s.title}</h1>
            {s.titleJapanese && (
              <div className="ficha__jp jp">{s.titleJapanese}</div>
            )}
            <div className="ficha__meta">
              {[s.year, s.type, total ? t("alta.caps", { n: total }) : t("ficha.airingCaps")]
                .filter(Boolean)
                .join(" · ")}
              {s.genres && s.genres.length > 0
                ? ` · ${s.genres.slice(0, 3).join(", ")}`
                : ""}
            </div>
          </header>

          <section className="panel" aria-label={t("ficha.synopsis")}>
              <div className="panel__title">{t("ficha.synopsis")}</div>
              <Synopsis malId={s.malId} initial={s.synopsis} />
              <StreamChips malId={s.malId} initial={s.streams} label={t("chips.whereToWatch")} />
            </section>

          <section className="panel" aria-label={t("ficha.status")}>
            <div className="panel__title">{t("ficha.status")}</div>
            <div className="status">
              {STATUSES.map((key) => {
                const label = key === "completed" ? t("statuses.completedF") : t(`statuses.${key}`);
                return (
                <button
                  key={key}
                  className={`status__btn${
                    s.status === key ? " is-active" : ""
                  }`}
                  onClick={() => {
                    setStatus(s.id, key);
                    if (key === "completed" && !done) setStampActive(true);
                  }}
                  aria-pressed={s.status === key}
                >
                  <span className="status__icon" aria-hidden="true">
                    {STATUS_ICONS[key]}
                  </span>
                  <span>{label}</span>
                </button>
                );
              })}
            </div>
          </section>

          <section className="panel" aria-label={t("ficha.chaptersWatched")}>
            <div className="panel__title">
              <span>{t("ficha.chaptersWatched")}</span>
              <span className="num mono">
                {s.watched}
                {total ? ` / ${total}` : ""}
              </span>
            </div>
            <div className="strip" ref={stripRef}>
              {Array.from({ length: stripCells }, (_, i) => i + 1).map(
                (n) => (
                  <button
                    key={n}
                    className={`strip__cell${
                      n <= s.watched ? " is-inked" : n === s.watched + 1 ? " is-next" : ""
                    }`}
                    onClick={() => setWatched(s.id, n)}
                    aria-label={t("ficha.markChapterAria", { n })}
                  />
                ),
              )}
              {total && total > STRIP_MAX && (
                <span className="strip__overflow">
                  {t("ficha.overflow", { n: total - STRIP_MAX })}
                </span>
              )}
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              {!done ? (
                <button
                  className="btn btn--accent"
                  onClick={() => markNext(s.id)}
                  aria-label={t("ficha.markChapterAria", { n: s.watched + 1 })}
                >
                  {total
                    ? t("ficha.markCap", { n: s.watched + 1 })
                    : t("ficha.markWatched")} · +{POINTS_PER_EPISODE}
                </button>
              ) : (
                <span className="mono" style={{ color: "var(--accent-deep)" }}>
                  {t("ficha.sealComplete")}
                </span>
              )}
              <button
                className="btn btn--ghost"
                onClick={() => unmark(s.id)}
                aria-label={t("ficha.unmarkAria")}
              >
                <Minus size={13} aria-hidden="true" /> 1
              </button>
            </div>
          </section>

          <section className="panel" aria-label={t("ficha.rating")}>
            <div className="panel__title">
              <span>{t("ficha.rating")}</span>
              <span className="num mono">
                {s.rating ? `+${s.rating * RATING_MULTIPLIER} pts` : t("ficha.unrated")}
              </span>
            </div>
            <div className="rating">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  className={`rating__seal${
                    s.rating != null && n <= s.rating ? " is-filled" : " is-empty"
                  }`}
                  onClick={() => setRating(s.id, n === s.rating ? null : n)}
                  aria-label={t("ficha.rateAria", { n })}
                  aria-pressed={s.rating != null && n <= s.rating}
                />
              ))}
              <button
                className="btn btn--quiet rating__clear"
                onClick={() => setRating(s.id, null)}
              >
                {t("ficha.clear")}
              </button>
            </div>
            <p className="mono" style={{ marginTop: 12, fontSize: "0.68rem", color: "var(--ink-3)" }}>
              {t("ficha.ratingHint", { n: RATING_MULTIPLIER })}
            </p>
          </section>

          <section className="panel" aria-label={t("ficha.pointsSheet")}>
            <div className="panel__title">
              <span>{t("ficha.pointsSheet")}</span>
            </div>
            <div className="points">
              <div className="points__row">
                <span>{t("ficha.pointsRow", { a: POINTS_PER_EPISODE, b: s.watched })}</span>
                <span className="pts mono">{pts.chapters}</span>
              </div>
              <div className="points__row">
                <span>{t("ficha.completeSeries")}</span>
                <span className="pts mono">
                  {done
                    ? `+${COMPLETION_BONUS}`
                    : t("ficha.pendingBonus", { n: COMPLETION_BONUS })}
                </span>
              </div>
              <div className="points__row">
                <span>{t("ficha.ratingRow", { a: s.rating ? `× ${s.rating}` : "× —" })}</span>
                <span className="pts mono">+{pts.rating}</span>
              </div>
              <div className="points__row is-total">
                <span>{t("ficha.total")}</span>
                <span className="pts mono">{pts.total}</span>
              </div>
            </div>
          </section>

          <button
            className="btn btn--quiet"
            onClick={() => setConfirming(true)}
          >
            {t("ficha.remove")}
          </button>
          <Link href="/" className="btn btn--quiet ficha__home" aria-label={t("ficha.homeAria")}>
            <House size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>

      <ConfirmDialog
        open={confirming}
        title={t("ficha.removeConfirmTitle")}
        message={t("ficha.removeConfirmMessage")}
        confirmLabel={t("ficha.removeConfirm")}
        onConfirm={() => {
          setConfirming(false);
          remove(s.id);
          router.push("/");
        }}
        onCancel={() => setConfirming(false)}
      />

      <StampPress
        active={stampActive}
        status="completed"
        caption={s.title}
        onDone={() => setStampActive(false)}
      />
    </div>
  );
}

export default function Serie() {
  return (
    <Suspense fallback={null}>
      <SerieView />
    </Suspense>
  );
}