"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import Stamp from "@/components/Stamp";
import Reveal from "@/components/Reveal";
import { Mark } from "@/components/Mark";
import { useLibrary } from "@/lib/store";
import { isComplete, totalPoints, totalWatched } from "@/lib/points";
import type { SeriesStatus } from "@/lib/types";
import { useI18n } from "@/components/I18nProvider";

const FILTERS: { key: "all" | SeriesStatus }[] = [
  { key: "all" },
  { key: "watching" },
  { key: "completed" },
  { key: "planned" },
  { key: "paused" },
];

const LEGEND: SeriesStatus[] = ["watching", "completed", "planned", "paused"];

export default function Biblioteca() {
  const { library } = useLibrary();
  const { t } = useI18n();
  const [filter, setFilter] = useState<"all" | SeriesStatus>("all");
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"grid" | "mini">("grid");

  const counts = useMemo(() => {
    const c: Record<string, number> = {
      all: library.length,
      watching: 0,
      completed: 0,
      planned: 0,
      paused: 0,
    };
    for (const s of library) {
      c[s.status]++;
      if (isComplete(s) && s.status !== "completed") c.completed++;
    }
    return c;
  }, [library]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rank = { watching: 0, planned: 1, paused: 2, completed: 3 } as const;
    return [...library]
      .sort(
        (a, b) =>
          (rank[a.status] ?? 9) - (rank[b.status] ?? 9) ||
          b.addedAt - a.addedAt,
      )
      .filter((s) => {
        const matchStatus =
          filter === "all"
            ? true
            : filter === "completed"
              ? isComplete(s)
              : s.status === filter;
        const matchQuery = q.length === 0 || s.title.toLowerCase().includes(q);
        return matchStatus && matchQuery;
      });
  }, [library, filter, query]);

  const filterActive = filter !== "all" || query.trim().length > 0;

  return (
    <div className="shell page">
      <div className="page__head">
        <h1 className="page__title">{t("catalog.title")}</h1>
        <div className="page__head-right">
          <div className="page__sub">{t("catalog.sub", { n: library.length })}</div>
          <div className="viewbar" role="group" aria-label={t("catalog.modeAria")}>
            {(["grid", "mini"] as const).map((m) => (
              <button
                key={m}
                type="button"
                className={`viewbar__btn${mode === m ? " is-active" : ""}`}
                onClick={() => setMode(m)}
                aria-pressed={mode === m}
              >
                {m === "grid" ? t("catalog.modeGrid") : t("catalog.modeMini")}
              </button>
            ))}
          </div>
        </div>
      </div>

      {library.length === 0 ? (
        <div className="blank">
          <h2 className="state__title">{t("catalog.emptyTitle")}</h2>
          <p className="state__text">{t("catalog.emptyText")}</p>
          <Link href="/alta" className="btn btn--primary">
            {t("catalog.emptyAction")}
          </Link>
          <div className="blank__sheet" aria-hidden="true">
            {Array.from({ length: 8 }, (_, i) => (
              <span className="blank__plate" key={i}>
                <span className="blank__code">{String.fromCharCode(65 + i)}</span>
              </span>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="filterbar">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                className={`filter${filter === f.key ? " is-active" : ""}`}
                onClick={() => setFilter(f.key)}
              >
                {f.key === "all" ? t("catalog.all") : t(`statuses.${f.key}`)}
                <span className="filter__count">{counts[f.key] ?? 0}</span>
              </button>
            ))}
            <label className="searchbox">
              <Search size={15} aria-hidden="true" />
              <span className="visually-hidden">{t("catalog.searchAria")}</span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("catalog.searchPlaceholder")}
              />
            </label>
          </div>

          {visible.length === 0 ? (
            <div className="state">
              <h2 className="state__title">
                {filterActive
                  ? t("catalog.noFilterTitle")
                  : t("catalog.nothingTitle")}
              </h2>
              <p className="state__text">{t("catalog.noFilterText")}</p>
              {filterActive && (
                <button
                  className="btn btn--ghost"
                  onClick={() => {
                    setFilter("all");
                    setQuery("");
                  }}
                >
                  {t("catalog.clearFilters")}
                </button>
              )}
            </div>
          ) : (
            <div className="catalog">
              <Reveal
                className={`catalog__grid stamp-grid${mode === "mini" ? " stamp-grid--mini" : ""}`}
              >
                {visible.map((s) => (
                  <Stamp
                    key={s.id}
                    series={s}
                    index={library.indexOf(s)}
                    size={mode === "mini" ? "xs" : "sm"}
                  />
                ))}
              </Reveal>

              <aside className="cartilla" aria-label={t("catalog.cartillaAria")}>
                <div className="cartilla__block">
                  <div className="cartilla__title">{t("catalog.credits")}</div>
                  <div className="tally tally--cartilla">
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
                      <span className="tally__num">
                        {library.filter((s) => isComplete(s)).length}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="cartilla__block">
                  <div className="cartilla__title">{t("catalog.cartilla")}</div>
                  <ul className="legend">
                    {LEGEND.map((status) => {
                      const label = t(`statuses.${status}`);
                      return (
                        <li className="legend__item" key={status}>
                          <button
                            className={`legend__row${filter === status ? " is-active" : ""}`}
                            onClick={() => setFilter(filter === status ? "all" : status)}
                            aria-pressed={filter === status}
                            title={t("catalog.viewOnly", { label })}
                          >
                            <span
                              className={`legend__mark legend__mark--${status}`}
                            >
                              <Mark
                                status={status}
                                size={16}
                                variant={status === "completed" ? "strike" : "seal"}
                              />
                            </span>
                            <span className="legend__label">{label}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  <p className="cartilla__note">{t("catalog.cartillaNote")}</p>
                </div>
              </aside>
            </div>
          )}
        </>
      )}
    </div>
  );
}