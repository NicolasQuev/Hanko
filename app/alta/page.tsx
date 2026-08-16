"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search } from "lucide-react";
import { useLibrary } from "@/lib/store";
import { searchAnime, localSuggestions, searchSuggestions, getDetails } from "@/lib/jikan";
import { standCode } from "@/lib/points";
import Reveal from "@/components/Reveal";
import { StampPress } from "@/components/StampPress";
import { StreamChips } from "@/components/StreamChips";
import { PreviewModal } from "@/components/PreviewModal";
import type { JikanResult } from "@/lib/types";
import { useI18n } from "@/components/I18nProvider";

type Phase = "idle" | "loading" | "results" | "error";

export default function Alta() {
  const { library, add } = useLibrary();
  const { t } = useI18n();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [results, setResults] = useState<JikanResult[]>([]);
  const [lastQuery, setLastQuery] = useState("");
  const [suggestions, setSuggestions] = useState<JikanResult[]>([]);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const seqRef = useRef(0);
  const [stamping, setStamping] = useState<{ result: JikanResult; id: string } | null>(null);
  const [preview, setPreview] = useState<JikanResult | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const search = async (q: string) => {
    setPhase("loading");
    try {
      const res = await searchAnime(q);
      setResults(res);
      setPhase("results");
    } catch {
      setPhase("error");
    }
  };

  const cancelSuggestions = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = null;
    seqRef.current++;
    setSuggestions([]);
    setSuggestOpen(false);
    setSuggestLoading(false);
    setActiveIndex(-1);
  };

  const run = (e?: React.FormEvent) => {
    e?.preventDefault();
    const q = query.trim();
    if (!q) return;
    cancelSuggestions();
    setLastQuery(q);
    void search(q);
  };

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setActiveIndex(-1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const q = value.trim();
    if (q.length < 1) {
      setSuggestions([]);
      setSuggestOpen(false);
      setSuggestLoading(false);
      return;
    }
    const seq = ++seqRef.current;
    setSuggestLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const [local, live] = await Promise.all([
          localSuggestions(q),
          searchSuggestions(q).catch(() => [] as JikanResult[]),
        ]);
        if (seq !== seqRef.current) return;
        const seen = new Set<number>();
        const merged: JikanResult[] = [];
        for (const r of [...live, ...local]) {
          if (seen.has(r.malId)) continue;
          seen.add(r.malId);
          merged.push(r);
          if (merged.length >= 12) break;
        }
        setSuggestions(merged);
        setSuggestOpen(true);
        setActiveIndex(merged.length > 0 ? 0 : -1);
      } catch {
        if (seq !== seqRef.current) return;
        setSuggestions([]);
        setSuggestOpen(false);
        setActiveIndex(-1);
      } finally {
        if (seq === seqRef.current) setSuggestLoading(false);
      }
    }, 120);
  };

  const pick = (r: JikanResult) => {
    setQuery(r.title);
    cancelSuggestions();
    setLastQuery(r.title);
    setResults([r]);
    setPhase("results");
    if (!r.synopsis || !r.streams || !r.episodes) {
      setBusyId(r.malId);
      getDetails(r.malId)
        .then((d) => {
          setResults((prev) =>
            prev.map((x) =>
              x.malId === r.malId
                ? {
                    ...x,
                    synopsis: x.synopsis ?? d.synopsis,
                    streams: x.streams ?? d.streams,
                    episodes: x.episodes ?? d.episodes,
                  }
                : x,
            ),
          );
        })
        .catch(() => {
          /* details optional */
        })
        .finally(() => setBusyId(null));
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!suggestOpen || suggestions.length === 0) return;
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!suggestOpen || suggestions.length === 0) return;
      setActiveIndex((i) =>
        i <= 0 ? suggestions.length - 1 : i - 1,
      );
    } else if (e.key === "Enter") {
      if (suggestOpen && activeIndex >= 0 && suggestions[activeIndex]) {
        e.preventDefault();
        pick(suggestions[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setSuggestOpen(false);
      setActiveIndex(-1);
    }
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  useEffect(() => {
    if (!preview) return;
    if (preview.synopsis && preview.streams && preview.episodes) return;
    let cancelled = false;
    getDetails(preview.malId)
      .then((d) => {
        if (cancelled) return;
        setPreview((p) =>
          p && p.malId === preview.malId
            ? {
                ...p,
                synopsis: p.synopsis ?? d.synopsis,
                streams: p.streams ?? d.streams,
                episodes: p.episodes ?? d.episodes,
              }
            : p,
        );
        setResults((prev) =>
          prev.map((x) =>
            x.malId === preview.malId
              ? {
                  ...x,
                  synopsis: x.synopsis ?? d.synopsis,
                  streams: x.streams ?? d.streams,
                  episodes: x.episodes ?? d.episodes,
                }
              : x,
          ),
        );
      })
      .catch(() => {
        /* details optional */
      });
    return () => {
      cancelled = true;
    };
  }, [preview]);

  const already = (malId: number) =>
    library.some((s) => s.malId === malId);

  return (
    <div className="shell page">
      <div className="page__head">
        <h1 className="page__title">{t("alta.title")}</h1>
        <div className="page__sub">{t("alta.sub")}</div>
      </div>

      <form className="search" onSubmit={run} role="search">
        <div className="search__field">
          <input
            className="search__input"
            type="search"
            value={query}
            onChange={onInput}
            placeholder={t("alta.placeholder")}
            aria-label={t("alta.searchAria")}
            aria-controls="sugerencias"
            aria-autocomplete="list"
            aria-activedescendant={
              suggestOpen && activeIndex >= 0
                ? `sugerencia-${activeIndex}`
                : undefined
            }
            autoComplete="off"
            autoFocus
            onKeyDown={onKeyDown}
          />
          {suggestOpen && (
            <div
              className="autocomplete"
              role="listbox"
              id="sugerencias"
              aria-label={t("alta.suggestionsAria")}
            >
              {suggestLoading ? (
                <div className="autocomplete__hint">{t("alta.autocompleteLoading")}</div>
              ) : suggestions.length === 0 ? (
                <div className="autocomplete__hint">{t("alta.noMatches")}</div>
              ) : (
                suggestions.slice(0, 7).map((r, i) => (
                  <button
                    key={r.malId}
                    type="button"
                    className={`autocomplete__item${
                      i === activeIndex ? " is-active" : ""
                    }`}
                    role="option"
                    id={`sugerencia-${i}`}
                    aria-selected={i === activeIndex}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => pick(r)}
                  >
                    <span className="autocomplete__plate">
                      <span className="autocomplete__code">{standCode(i)}</span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={r.imageLargeUrl || r.imageUrl}
                        alt=""
                        loading="lazy"
                      />
                    </span>
                    <span className="autocomplete__body">
                      <span className="autocomplete__name">{r.title}</span>
                      <span className="autocomplete__meta">
                        {[r.year, r.type].filter(Boolean).join(" · ")}
                      </span>
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
        <button className="search__submit" type="submit" disabled={phase === "loading"}>
          {phase === "loading" ? t("alta.searchLoading") : (
            <>
              <Search size={14} aria-hidden="true" /> {t("alta.search")}
            </>
          )}
        </button>
      </form>

      {phase === "idle" && (
        <div className="state">
          <h2 className="state__title">{t("alta.idleTitle")}</h2>
          <p className="state__text">{t("alta.idleText")}</p>
        </div>
      )}

      {phase === "loading" && (
        <p className="note">{t("alta.loading")}</p>
      )}

      {phase === "error" && (
        <div className="state">
          <h2 className="state__title">{t("alta.errorTitle")}</h2>
          <p className="state__text">{t("alta.errorText")}</p>
          <button className="btn btn--primary" onClick={run}>
            {t("alta.retry")}
          </button>
        </div>
      )}

      {phase === "results" && (
        <>
          <p className="note">
            {t("alta.results", { n: results.length, q: lastQuery })}
          </p>
          {results.length === 0 ? (
            <div className="state">
              <h2 className="state__title">{t("alta.noResultsTitle")}</h2>
              <p className="state__text">{t("alta.noResultsText")}</p>
            </div>
          ) : (
            <Reveal className="results" stagger={0.04}>
              {results.map((r, i) => {
                const has = already(r.malId);
                return (
                  <div className="result" key={r.malId}>
                    <span className="result__plate">
                      <span className="result__code">{standCode(i)}</span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={r.imageLargeUrl || r.imageUrl}
                        alt=""
                        loading="lazy"
                      />
                    </span>
                    <div>
                      <div className="result__name">{r.title}</div>
                      <div className="result__meta">
                        {[r.year, r.type, r.episodes ? t("alta.caps", { n: r.episodes }) : null]
                          .filter(Boolean)
                          .join(" · ")}
                        {r.genres.length > 0
                          ? ` · ${r.genres.slice(0, 3).join(", ")}`
                          : ""}
                      </div>
                      {r.synopsis && (
                        <div className="result__synopsis">{r.synopsis}</div>
                      )}
                      <StreamChips malId={r.malId} initial={r.streams} busy={busyId === r.malId} />
                    </div>
                    <div className="result__action">
                      {has ? (
                        <span className="btn btn--ghost" aria-disabled="true">
                          {t("alta.inCatalog")}
                        </span>
                      ) : (
                        <div className="result__actions">
                          <button
                            className="btn btn--ghost"
                            onClick={() => setPreview(r)}
                            aria-haspopup="dialog"
                          >
                            {t("alta.view")}
                          </button>
                          <button
                            className="btn btn--accent"
                            onClick={() => {
                              const created = add(r);
                              setStamping({ result: r, id: created.id });
                            }}
                          >
                            <Plus size={14} aria-hidden="true" /> {t("alta.add")}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </Reveal>
          )}
        </>
      )}

      <PreviewModal result={preview} onClose={() => setPreview(null)} />

      <StampPress
        active={stamping !== null}
        status="added"
        caption={stamping ? stamping.result.title : ""}
        onDone={() => {
          if (stamping) router.push(`/serie?id=${stamping.id}`);
        }}
      />
    </div>
  );
}