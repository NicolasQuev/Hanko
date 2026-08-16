import { useSyncExternalStore } from "react";
import type { JikanResult, Series, SeriesStatus } from "./types";

const KEY = "hanko.library.v1";
const LEGACY_KEY = "animepuntos.library.v1";

interface State {
  hydrated: boolean;
  library: Series[];
}

let state: State = { hydrated: false, library: [] };
const serverSnapshot: State = { hydrated: false, library: [] };
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function readStorage(): Series[] {
  try {
    const current = localStorage.getItem(KEY);
    const legacy = localStorage.getItem(LEGACY_KEY);
    const raw = current ?? legacy;
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Series[];
    if (!Array.isArray(parsed)) return [];
    if (current == null && legacy != null) {
      localStorage.setItem(KEY, raw);
      localStorage.removeItem(LEGACY_KEY);
    }
    return parsed;
  } catch {
    return [];
  }
}

function commit(next: Series[]) {
  state = { hydrated: true, library: next };
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable: keep in-memory */
  }
  emit();
}

export function hydrateStore() {
  if (!state.hydrated) {
    state = { hydrated: true, library: readStorage() };
    emit();
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function getSnapshot(): State {
  return state;
}

function getServerSnapshot(): State {
  return serverSnapshot;
}

function fromResult(r: JikanResult): Series {
  return {
    id: `mal-${r.malId}`,
    malId: r.malId,
    title: r.title,
    titleJapanese: r.titleJapanese,
    imageUrl: r.imageUrl,
    imageLargeUrl: r.imageLargeUrl,
    episodes: r.episodes,
    year: r.year,
    type: r.type,
    genres: r.genres,
    synopsis: r.synopsis ?? null,
    streams: r.streams ?? [],
    status: "watching",
    watched: 0,
    rating: null,
    addedAt: Date.now(),
  };
}

function mutate(id: string, fn: (s: Series) => Series) {
  const next = state.library.map((s) => (s.id === id ? fn(s) : s));
  commit(next);
}

export function importLibrary(next: Series[]) {
  commit(next);
}

export function useLibrary() {
  const { hydrated, library } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return {
    hydrated,
    library,
    add(result: JikanResult, status: SeriesStatus = "watching"): Series {
      const existing = state.library.find((s) => s.id === `mal-${result.malId}`);
      if (existing) return existing;
      const created = { ...fromResult(result), status };
      commit([created, ...state.library]);
      return created;
    },
    remove(id: string) {
      commit(state.library.filter((s) => s.id !== id));
    },
    setStatus(id: string, status: SeriesStatus) {
      mutate(id, (s) => ({ ...s, status }));
    },
    setWatched(id: string, watched: number) {
      mutate(id, (s) => {
        const max = s.episodes != null && s.episodes > 0 ? s.episodes : Number.MAX_SAFE_INTEGER;
        const clamped = Math.max(0, Math.min(max, watched));
        return { ...s, watched: clamped };
      });
    },
    markNext(id: string) {
      mutate(id, (s) => {
        const max = s.episodes != null && s.episodes > 0 ? s.episodes : Number.MAX_SAFE_INTEGER;
        const watched = Math.min(max, s.watched + 1);
        const status = s.status === "completed" ? s.status : "watching";
        return { ...s, watched, status };
      });
    },
    unmark(id: string) {
      mutate(id, (s) => ({ ...s, watched: Math.max(0, s.watched - 1) }));
    },
    setRating(id: string, rating: number | null) {
      mutate(id, (s) => ({ ...s, rating }));
    },
  };
}