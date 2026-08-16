"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Disc3, LayoutGrid, Search, Stamp, Star, X } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";
import type { Locale } from "@/lib/i18n";

export const OPEN_GUIDE_EVENT = "hanko:open-guide";

const GUIDE_KEY = "hanko.guide.v1";

const listeners = new Set<() => void>();

function readSeen(): boolean {
  try {
    return localStorage.getItem(GUIDE_KEY) === "seen";
  } catch {
    return true;
  }
}

let seenCache = typeof window === "undefined" ? null : readSeen();

function getSeen(): boolean {
  if (seenCache === null) seenCache = readSeen();
  return seenCache;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function markSeen() {
  try {
    localStorage.setItem(GUIDE_KEY, "seen");
  } catch {
    /* storage unavailable */
  }
  seenCache = true;
  for (const l of listeners) l();
}

const STEPS = [
  { icon: Search, key: "step1" },
  { icon: Stamp, key: "step2" },
  { icon: Star, key: "step3" },
  { icon: LayoutGrid, key: "step4" },
  { icon: Disc3, key: "step5" },
] as const;

const LANGS: { code: Locale; label: string }[] = [
  { code: "es", label: "Español" },
  { code: "en", label: "English" },
  { code: "ja", label: "日本語" },
];

type Phase = "lang" | "steps";

export default function Guide() {
  const { locale, setLocale, t } = useI18n();
  const seen = useSyncExternalStore(subscribe, getSeen, () => true);
  const [phase, setPhase] = useState<Phase>("lang");
  const [manualOpen, setManualOpen] = useState(false);
  const langRef = useRef<HTMLButtonElement>(null);
  const startRef = useRef<HTMLButtonElement>(null);
  const open = manualOpen || !seen;

  const dismiss = () => {
    setManualOpen(false);
    markSeen();
  };

  const choose = (next: Locale) => {
    setLocale(next);
    setPhase("steps");
  };

  useEffect(() => {
    const onOpen = () => setManualOpen(true);
    window.addEventListener(OPEN_GUIDE_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_GUIDE_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (phase === "lang") {
      langRef.current?.focus();
    } else {
      startRef.current?.focus();
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, phase]);

  if (!open) return null;

  return (
    <div
      className="guide"
      role="dialog"
      aria-modal="true"
      aria-labelledby="guide-title"
    >
      <div className="guide__backdrop" onClick={dismiss} aria-hidden="true" />
      <div className="guide__panel">
        {phase === "lang" ? (
          <div className="guide__cover">
            <div className="guide__cover-band">
              <span className="guide__cover-seal" aria-hidden="true">
                印
              </span>
              <div className="guide__cover-wordmark">
                <span className="guide__cover-name">Hanko</span>
                <span className="guide__cover-tag">{t("brand.tag")}</span>
              </div>
            </div>
            <h2 id="guide-title" className="guide__cover-title">
              {t("guide.chooseLang")}
            </h2>
            <div className="guide__langs">
              {LANGS.map(({ code, label }, i) => (
                <button
                  key={code}
                  type="button"
                  ref={i === 0 ? langRef : undefined}
                  className={`guide__lang${code === locale ? " is-active" : ""}`}
                  onClick={() => choose(code)}
                >
                  <span className="guide__lang-code" aria-hidden="true">
                    {code.toUpperCase()}
                  </span>
                  <span className="guide__lang-name">{label}</span>
                </button>
              ))}
            </div>
            <button type="button" className="btn btn--quiet guide__skip" onClick={dismiss}>
              {t("guide.skip")}
            </button>
          </div>
        ) : (
          <>
            <div className="guide__head">
              <span className="guide__seal" aria-hidden="true">
                印
              </span>
              <div className="guide__titles">
                <div className="guide__tag">{t("guide.tag")}</div>
                <h2 id="guide-title" className="guide__title">
                  {t("guide.title")}
                </h2>
              </div>
              <button
                type="button"
                className="guide__close"
                onClick={dismiss}
                aria-label={t("guide.close")}
              >
                <X size={15} aria-hidden="true" />
              </button>
            </div>
            <p className="guide__intro">{t("guide.intro")}</p>
            <ol className="guide__list">
              {STEPS.map(({ icon: Icon, key }, i) => (
                <li key={key} className="guide__item">
                  <span className="guide__num" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="guide__icon" aria-hidden="true">
                    <Icon />
                  </span>
                  <div>
                    <div className="guide__step-title">{t(`guide.${key}Title`)}</div>
                    <p className="guide__step-text">{t(`guide.${key}Text`)}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="guide__foot">
              <p className="guide__privacy">{t("guide.privacy")}</p>
              <button type="button" className="btn btn--quiet guide__skip" onClick={dismiss}>
                {t("guide.skip")}
              </button>
              <button ref={startRef} type="button" className="btn btn--primary guide__start" onClick={dismiss}>
                {t("guide.start")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}