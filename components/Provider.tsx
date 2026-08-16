"use client";

import { useEffect } from "react";
import { hydrateStore, useLibrary } from "@/lib/store";
import { seedDemo } from "@/lib/demo";

export default function LibraryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { hydrated, library } = useLibrary();

  useEffect(() => {
    hydrateStore();
  }, []);

  useEffect(() => {
    if (!hydrated || library.length > 0) return;
    if (typeof window !== "undefined" && window.location.search.includes("seed")) {
      void seedDemo();
    }
  }, [hydrated, library.length]);

  if (!hydrated) {
    return (
      <main className="shell">
        <div className="state" aria-hidden="true">
          <div className="state__title">…</div>
        </div>
      </main>
    );
  }

  return children;
}