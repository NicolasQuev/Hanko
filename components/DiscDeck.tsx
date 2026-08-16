"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Download } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";
import { useLibrary, importLibrary } from "@/lib/store";
import { downloadBackup, parseBackup, type ParseResult } from "@/lib/backup";
import { totalPoints } from "@/lib/points";
import type { Series } from "@/lib/types";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type DesignId = "tinta" | "vermillon" | "noche" | "ola" | "sakura" | "sol";
const DESIGN_IDS: DesignId[] = ["tinta", "vermillon", "noche", "ola", "sakura", "sol"];
const DISC_NAME_KEY = "hanko.discName";
const DISC_DESIGN_KEY = "hanko.discDesign";

interface PendingDisc {
  series: Series[];
  count: number;
  points: number;
  date: string;
  discName?: string;
  design?: string;
}

interface ErrorDisc {
  title: string;
  text: string;
}

export default function DiscDeck() {
  const { library } = useLibrary();
  const { t } = useI18n();

  const [dragging, setDragging] = useState(false);
  const [reading, setReading] = useState(false);
  const [saved, setSaved] = useState<number | null>(null);
  const [pending, setPending] = useState<PendingDisc | null>(null);
  const [error, setError] = useState<ErrorDisc | null>(null);
  const [discName, setDiscName] = useState(() => {
    if (typeof window === "undefined") return "";
    try {
      return localStorage.getItem(DISC_NAME_KEY) ?? "";
    } catch {
      return "";
    }
  });
  const [design, setDesign] = useState<DesignId>(() => {
    if (typeof window === "undefined") return "tinta";
    try {
      const d = localStorage.getItem(DISC_DESIGN_KEY);
      return DESIGN_IDS.includes(d as DesignId) ? (d as DesignId) : "tinta";
    } catch {
      return "tinta";
    }
  });

  const sectionRef = useRef<HTMLElement>(null);
  const overlayRootRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const savedAtRef = useRef(0);

  useEffect(() => {
    try {
      localStorage.setItem(DISC_NAME_KEY, discName);
    } catch {
      /* storage unavailable */
    }
  }, [discName]);

  useEffect(() => {
    try {
      localStorage.setItem(DISC_DESIGN_KEY, design);
    } catch {
      /* storage unavailable */
    }
  }, [design]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".deck__panel",
            start: "top 82%",
            once: true,
          },
        });
        tl.from(".deck__label-chip", {
          opacity: 0,
          x: -14,
          duration: 0.5,
          ease: "power2.out",
        })
          .from(".deck__label-status", {
            opacity: 0,
            duration: 0.4,
          }, "-=.3")
          .from(".deck__panel", {
            opacity: 0,
            y: 36,
            duration: 0.65,
            ease: "power3.out",
          }, "-=.3")
          .from(".deck__stage", {
            opacity: 0,
            scale: 0.85,
            duration: 0.6,
            ease: "power2.out",
          }, "-=.4")
          .from(".deck__ring", {
            opacity: 0,
            duration: 0.5,
            stagger: 0.09,
            ease: "power1.out",
          }, "-=.5")
          .from(".deck__spin", {
            opacity: 0,
            rotation: -160,
            scale: 0.3,
            duration: 0.9,
            ease: "power4.out",
          }, "-=.75")
          .from(".deck__title", {
            opacity: 0,
            y: 18,
            duration: 0.5,
            ease: "power2.out",
          }, "-=.5")
          .from(".deck__sub", {
            opacity: 0,
            y: 14,
            duration: 0.45,
            ease: "power2.out",
          }, "-=.3")
          .from(".deck__actions", {
            opacity: 0,
            y: 14,
            duration: 0.4,
            ease: "power2.out",
          }, "-=.35")
          .from(".deck__hint", {
            opacity: 0,
            duration: 0.4,
          }, "-=.25")
          .from(".deck__config", {
            opacity: 0,
            y: 14,
            duration: 0.4,
            ease: "power2.out",
          }, "-=.2");
      });
      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  useEffect(() => {
    if (!(dragging || reading)) return;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".deck-drop__inner",
          { scale: 0.5, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.55, ease: "power3.out" },
        );
        gsap.fromTo(
          ".deck-drop__ring",
          { opacity: 0 },
          { opacity: 1, duration: 0.5, stagger: 0.09, ease: "power1.out" },
        );
        gsap.fromTo(
          ".deck-drop__text",
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: "power2.out", delay: 0.15 },
        );
      });
      return () => mm.revert();
    }, overlayRootRef);
    return () => ctx.revert();
  }, [dragging, reading]);

  const flashSaved = useCallback(() => {
    savedAtRef.current = Date.now();
    setSaved(Date.now());
    window.setTimeout(() => {
      if (savedAtRef.current === Date.now()) setSaved(null);
    }, 1800);
  }, []);

  const handleParse = useCallback(
    (result: ParseResult) => {
      if (!result.ok) {
        setError({
          title: t("disco.invalidTitle"),
          text: t("disco.invalidText"),
        });
        return;
      }
      const locale = typeof navigator !== "undefined" ? navigator.language : "es";
      setPending({
        series: result.series,
        count: result.series.length,
        points: totalPoints(result.series),
        date: new Date(result.backup.exportedAt).toLocaleDateString(locale),
        discName: result.backup.discName ?? "",
        design: result.backup.design,
      });
    },
    [t],
  );

  const handleFile = useCallback(
    (file: File) => {
      setReading(true);
      const reader = new FileReader();
      reader.onload = () => {
        const text = typeof reader.result === "string" ? reader.result : "";
        const result = parseBackup(text);
        window.setTimeout(() => {
          setReading(false);
          handleParse(result);
        }, 950);
      };
      reader.readAsText(file);
    },
    [handleParse],
  );

  const handleFileRef = useRef(handleFile);

  useEffect(() => {
    handleFileRef.current = handleFile;
  }, [handleFile]);

  useEffect(() => {
    let depth = 0;
    const hasFiles = (e: DragEvent) =>
      Array.from(e.dataTransfer?.types ?? []).includes("Files");
    const onEnter = (e: DragEvent) => {
      if (!hasFiles(e)) return;
      e.preventDefault();
      depth += 1;
      setDragging(true);
    };
    const onOver = (e: DragEvent) => {
      if (hasFiles(e)) e.preventDefault();
    };
    const onLeave = (e: DragEvent) => {
      if (!hasFiles(e)) return;
      depth = Math.max(0, depth - 1);
      if (depth === 0) setDragging(false);
    };
    const onDrop = (e: DragEvent) => {
      if (!hasFiles(e)) return;
      e.preventDefault();
      depth = 0;
      setDragging(false);
      const file = e.dataTransfer?.files?.[0];
      if (file) handleFileRef.current(file);
    };
    window.addEventListener("dragenter", onEnter);
    window.addEventListener("dragover", onOver);
    window.addEventListener("dragleave", onLeave);
    window.addEventListener("drop", onDrop);
    return () => {
      window.removeEventListener("dragenter", onEnter);
      window.removeEventListener("dragover", onOver);
      window.removeEventListener("dragleave", onLeave);
      window.removeEventListener("drop", onDrop);
    };
  }, []);

  const onSave = () => {
    downloadBackup(library, { discName: displayName, design });
    flashSaved();
  };

  const onOverwrite = () => {
    if (!pending) return;
    importLibrary(pending.series);
    if (pending.discName) setDiscName(pending.discName);
    if (pending.design && DESIGN_IDS.includes(pending.design as DesignId)) {
      setDesign(pending.design as DesignId);
    }
    setPending(null);
    flashSaved();
  };

  const close = () => {
    setPending(null);
    setError(null);
  };

  const displayName = discName.trim() || t("disco.discNamePlaceholder");

  return (
    <section className="deck" ref={sectionRef} aria-label={t("disco.section")}>
      <div className="deck__label">
        <span className="deck__label-chip">
          <span>{t("disco.section")}</span>
        </span>
        <span className="deck__label-line" aria-hidden="true" />
        <span className="deck__label-status">{t("disco.status")}</span>
      </div>

      <div className="deck__panel">
        <div className="deck__stage">
          <span className="deck__ring deck__ring--1" aria-hidden="true" />
          <span className="deck__ring deck__ring--2" aria-hidden="true" />
          <span className="deck__ring deck__ring--3" aria-hidden="true" />
          <span className="deck__spin">
            <button
              type="button"
              className={`deck__disc deck__disc--${design}`}
              aria-label={t("disco.discAria")}
              onClick={() => fileInputRef.current?.click()}
            >
              <span className="deck__grooves" aria-hidden="true" />
              <span className="deck__disc-label" aria-hidden="true">
                <span className="deck__disc-seal" />
                <span className="deck__disc-label-name">{displayName}</span>
                <span className="deck__disc-hole" />
              </span>
            </button>
          </span>
          <span className="deck__hud">{t("disco.hud")}</span>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          className="visually-hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileRef.current(file);
            e.target.value = "";
          }}
        />
        <div className="deck__info">
          <h2 className="deck__title">
            <span>{t("disco.titleLine1")}</span>
            <span className="deck__title-accent">{t("disco.titleLine2")}</span>
          </h2>
          <p className="deck__sub">{t("disco.sub")}</p>
          <div className="deck__actions">
            <button
              type="button"
              className="btn btn--primary deck__btn deck__btn--save"
              onClick={onSave}
            >
              <span>
                <Download size={14} aria-hidden="true" />
                {t("disco.save")}
              </span>
            </button>
            {saved !== null && (
              <span
                className="deck__flash"
                key={saved}
                role="status"
                onAnimationEnd={() => {
                  if (savedAtRef.current === saved) setSaved(null);
                }}
              >
                {t("disco.saved")}
              </span>
            )}
          </div>
          <p className="deck__hint">{t("disco.insertHint")}</p>
          <div className="deck__config">
            <label className="deck__config-field">
              <span className="deck__config-label">{t("disco.discNameLabel")}</span>
              <input
                className="deck__config-input"
                value={discName}
                maxLength={12}
                placeholder={t("disco.discNamePlaceholder")}
                aria-label={t("disco.discNameLabel")}
                onChange={(e) => setDiscName(e.target.value)}
              />
            </label>
            <div className="deck__config-designs">
              <span className="deck__config-label">{t("disco.designLabel")}</span>
              <div className="deck__swatches" role="group" aria-label={t("disco.designLabel")}>
                {DESIGN_IDS.map((id) => (
                  <button
                    key={id}
                    type="button"
                    className={`deck__swatch${design === id ? " is-active" : ""}`}
                    onClick={() => setDesign(id)}
                    aria-pressed={design === id}
                    title={t(`disco.design.${id}`)}
                  >
                    <span className={`deck__swatch-disc deck__disc--${id}`}>
                      <span className="deck__swatch-grooves" aria-hidden="true" />
                    </span>
                    <span className="deck__swatch-name">{t(`disco.design.${id}`)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {(dragging || reading) && (
        <div
          className={`deck-drop${reading ? " is-reading" : ""}`}
          ref={overlayRootRef}
          aria-hidden="true"
        >
          <div className="deck-drop__inner">
            <span className="deck-drop__ring deck-drop__ring--a" />
            <span className="deck-drop__ring deck-drop__ring--b" />
            <div className="deck-drop__core">
              <div className={`deck-drop__disc deck__disc--${design}`}>
                <span className="deck-drop__grooves" />
                <span className="deck-drop__label">
                  <span className="deck-drop__seal" />
                  <span className="deck-drop__name">{displayName}</span>
                </span>
              </div>
              <span className="deck-drop__scan" />
            </div>
          </div>
          <div className="deck-drop__text">
            <div className="deck-drop__title">
              {reading ? t("disco.reading") : t("disco.dropTitle")}
            </div>
            {!reading && <div className="deck-drop__sub">{t("disco.dropText")}</div>}
          </div>
        </div>
      )}

      {(pending || error) && (
        <div className="deck-dialog" role="dialog" aria-modal="true" aria-labelledby="deck-dialog-title">
          <div className="deck-dialog__backdrop" onClick={close} aria-hidden="true" />
          <div className="deck-dialog__panel">
            <div className="deck-dialog__head">
              <span className="deck-dialog__tag">
                <span>{error ? "ERROR" : t("disco.status")}</span>
              </span>
              <h2 id="deck-dialog-title" className="deck-dialog__title">
                {error ? error.title : t("disco.dialogTitle")}
              </h2>
            </div>
            {!error && pending && (
              <div className="deck-dialog__summary">
                {String(pending.count).padStart(2, "0")} / {String(pending.points).padStart(4, "0")} PTS / {pending.date}
              </div>
            )}
            <p className="deck-dialog__text">
              {error
                ? error.text
                : t("disco.dialogText", {
                    n: pending?.count ?? 0,
                    pts: pending?.points ?? 0,
                    date: pending?.date ?? "",
                  })}
            </p>
            <div className="deck-dialog__actions">
              {error ? (
                <button type="button" className="btn btn--ghost deck__btn" onClick={close}>
                  <span>{t("disco.close")}</span>
                </button>
              ) : (
                <>
                  <button type="button" className="btn btn--ghost deck__btn" onClick={close}>
                    <span>{t("disco.keep")}</span>
                  </button>
                  <button type="button" className="btn btn--accent deck__btn" onClick={onOverwrite}>
                    <span>{t("disco.overwrite")}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}