"use client";

import { useState } from "react";
import Link from "next/link";
import Stamp from "@/components/Stamp";
import Reveal from "@/components/Reveal";
import DiscDeck from "@/components/DiscDeck";
import Contributors from "@/components/Contributors";
import { useLibrary } from "@/lib/store";
import {
  isComplete,
  POINTS_PER_EPISODE,
  totalPoints,
  totalWatched,
} from "@/lib/points";
import type { SeriesStatus } from "@/lib/types";
import { useI18n } from "@/components/I18nProvider";

const HALLS: SeriesStatus[] = ["watching", "completed", "planned", "paused"];

export default function Home() {
  const { library, markNext } = useLibrary();
  const { t } = useI18n();
  const [flash, setFlash] = useState<number | null>(null);

  const active = library.find((s) => s.status === "watching");
  const completedCount = library.filter((s) => isComplete(s)).length;
  const inProgress = library.filter((s) => s.status === "watching").length;

  const press = () => {
    if (!active) return;
    markNext(active.id);
    setFlash(active.watched + 1);
  };

  return (
    <div className="shell page">
      <Reveal className="cover">
        <div className="cover__inner">
          <div>
            <h1 className="cover__title">{t("home.coverTitle")}</h1>
            <p className="cover__note">{t("home.coverNote")}</p>
          </div>
          <div className="tally">
            <div className="tally__head">{t("home.tallyHead")}</div>
            <div className="tally__row">
              <span>{t("home.tallyPoints")}</span>
              <span className="tally__num">{totalPoints(library)}</span>
            </div>
            <div className="tally__row">
              <span>{t("home.tallyChapters")}</span>
              <span className="tally__num">{totalWatched(library)}</span>
            </div>
            <div className="tally__row">
              <span>{t("home.tallyCompleted")}</span>
              <span className="tally__num">{completedCount}</span>
            </div>
            <div className="tally__row is-total">
              <span>{t("home.tallyInProgress")}</span>
              <span className="tally__num">{inProgress}</span>
            </div>
          </div>
        </div>
      </Reveal>

      {library.length === 0 ? (
        <div className="state">
          <h2 className="state__title">{t("home.emptyTitle")}</h2>
          <p className="state__text">{t("home.emptyText")}</p>
          <Link href="/alta" className="btn btn--primary">
            {t("home.emptyAction")}
          </Link>
        </div>
      ) : (
        <>
          {active ? (
            <div className="quick">
              <Stamp series={active} index={library.indexOf(active)} size="lg" priority />
              <div>
                <div className="quick__progress">{t("home.quickProgress")}</div>
                <h2 className="quick__title">{active.title}</h2>
                <div className="quick__counter">
                  {active.episodes != null && active.episodes > 0
                    ? `${active.watched} / ${active.episodes}`
                    : t("alta.caps", { n: active.watched })}
                </div>
                <div className="quick__actions">
                  {!isComplete(active) ? (
                    <>
                      <button
                        className="btn btn--accent"
                        onClick={press}
                        aria-label={t("home.markCapAria", { n: active.watched + 1 })}
                      >
                        {t("home.quickMark", {
                          n: active.watched + 1,
                          pts: POINTS_PER_EPISODE,
                        })}
                      </button>
                      {flash !== null && (
                        <span
                          className="punch"
                          key={flash}
                          onAnimationEnd={() => setFlash(null)}
                          aria-hidden="true"
                        >
                          +{POINTS_PER_EPISODE}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="mono" style={{ color: "var(--accent-deep)" }}>
                      {t("home.sealComplete")}
                    </span>
                  )}
                  <Link href={`/serie/${active.id}`} className="btn btn--ghost">
                    {t("home.ficha")}
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="quick quick--none">
              <div>
                <div className="quick__progress">{t("home.quickNoneProgress")}</div>
                <h2 className="quick__title">{t("home.noneTitle")}</h2>
                <p style={{ color: "var(--ink-2)", margin: "8px 0 0" }}>
                  {t("home.noneText")}
                </p>
              </div>
              <Link href="/biblioteca" className="btn btn--primary">
                {t("home.noneAction")}
              </Link>
            </div>
          )}

          <div className="section">{t("home.sections")}</div>
          <div className="halls">
            {HALLS.map((key) => {
              const name = t(`statuses.${key}`);
              const list = library.filter((s) => s.status === key);
              return (
                <section className="hall" key={key} aria-label={name}>
                  <div className="hall__head">
                    <span className="hall__name">{name}</span>
                    <span className="hall__count">{list.length}</span>
                  </div>
                  {list.length === 0 ? (
                    <p className="hall__empty">{t("home.hallEmpty")}</p>
                  ) : (
                    <Reveal className="hall__grid" stagger={0.04}>
                      {list.map((s) => (
                        <Stamp
                          key={s.id}
                          series={s}
                          index={library.indexOf(s)}
                        />
                      ))}
                    </Reveal>
                  )}
                </section>
              );
            })}
          </div>
        </>
      )}

      <DiscDeck />

      <Contributors />
    </div>
  );
}
