"use client";

import { useEffect, useRef } from "react";
import { useI18n } from "@/components/I18nProvider";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { t } = useI18n();
  const resolvedCancel = cancelLabel ?? t("confirm.cancel");
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    confirmRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="confirm" role="dialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-text">
      <div className="confirm__backdrop" onClick={onCancel} aria-hidden="true" />
      <div className="confirm__panel">
        <h2 id="confirm-title" className="confirm__title">
          {title}
        </h2>
        <p id="confirm-text" className="confirm__text">
          {message}
        </p>
        <div className="confirm__actions">
          <button className="btn btn--ghost" onClick={onCancel}>
            {resolvedCancel}
          </button>
          <button ref={confirmRef} className="btn btn--primary" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}