"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Check } from "lucide-react";
import { Mark } from "./Mark";

gsap.registerPlugin(useGSAP);

interface StampPressProps {
  active: boolean;
  status: "completed" | "added";
  caption: string;
  onDone?: () => void;
}

const SPLATS = Array.from({ length: 11 }, (_, i) => {
  const a = (i / 11) * Math.PI * 2 + (i % 3) * 0.22;
  const d = 96 + (i % 5) * 26;
  return {
    x: Math.round(Math.cos(a) * d),
    y: Math.round(Math.sin(a) * d),
  };
});

export function StampPress({ active, status, caption, onDone }: StampPressProps) {
  const scopeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!active) return;
      const root = scopeRef.current;
      if (!root) return;

      const seal = root.querySelector<HTMLElement>(".stamppress__seal");
      const splats = root.querySelectorAll(".stamppress__splatter span");

      if (!seal) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        onDone?.();
        return;
      }

      gsap.set(root, { display: "flex", opacity: 1 });
      gsap.set(seal, { opacity: 0, scale: 2.6, rotation: -14, y: -90 });
      gsap.set(splats, { opacity: 0, scale: 0 });

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(root, { display: "none" });
          onDone?.();
        },
      });

      tl.to(seal, {
        opacity: 1,
        y: -18,
        scale: 1.12,
        rotation: -8,
        duration: 0.16,
        ease: "power2.out",
      })
        .to(seal, {
          y: 0,
          scale: 1,
          rotation: -5,
          duration: 0.24,
          ease: "back.out(3)",
        })
        .add(() => {
          gsap.to(splats, {
            opacity: 1,
            scale: 1,
            duration: 0.18,
            ease: "power2.out",
            stagger: 0.03,
          });
        })
        .to({}, { duration: 0.35 })
        .to(root, { opacity: 0, duration: 0.3, ease: "power2.in" });
    },
    { dependencies: [active], scope: scopeRef },
  );

  return (
    <div
      className="stamppress"
      ref={scopeRef}
      style={{ display: "none" }}
      role="presentation"
      aria-hidden="true"
    >
      <div className="stamppress__splatter" aria-hidden="true">
        {SPLATS.map((s, i) => (
          <span
            key={i}
            style={{ "--sx": `${s.x}px`, "--sy": `${s.y}px` } as React.CSSProperties}
          />
        ))}
      </div>
      <div className="stamppress__seal" aria-hidden="true">
        {status === "completed" ? (
          <Mark status="completed" size={54} />
        ) : (
          <Check size={54} strokeWidth={2.6} />
        )}
      </div>
      <span className="stamppress__caption">{caption}</span>
    </div>
  );
}