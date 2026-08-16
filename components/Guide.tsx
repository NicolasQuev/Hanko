"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Disc3, LayoutGrid, Search, Stamp, Star, X } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";

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

export default function Guide() {
  const { t } = useI18n();
  const seen = useSyncExternalStore(subscribe, getSeen, () => true);
  const [manualOpen, setManualOpen] = useState(false);
  const startRef = useRef<HTMLButtonElement>(null);
  const open = manualOpen || !seen;

  const dismiss = () => {
    setManualOpen(false);
    markSeen();
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
    startRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

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
      </div>
    </div>
  );
}