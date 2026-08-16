"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  y?: number;
}

export default function Reveal({
  children,
  className,
  stagger = 0.05,
  y = 18,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const targets = ref.current?.children
          ? Array.from(ref.current.children)
          : [];
        if (targets.length === 0) return;
        gsap.from(targets, {
          opacity: 0,
          y,
          duration: 0.55,
          ease: "power2.out",
          stagger,
          clearProps: "all",
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}