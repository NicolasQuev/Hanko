import type { Series, SeriesStatus } from "./types";

export const BACKUP_APP = "hanko";
export const BACKUP_APP_LEGACY = "animepuntos";
export const BACKUP_KIND = "backup";
export const BACKUP_VERSION = 1;

export interface Backup {
  app: typeof BACKUP_APP;
  kind: typeof BACKUP_KIND;
  version: typeof BACKUP_VERSION;
  exportedAt: number;
  library: Series[];
  discName?: string;
  design?: string;
}

const STATUSES: SeriesStatus[] = ["watching", "completed", "planned", "paused"];

export function buildBackup(
  library: Series[],
  meta?: { discName?: string; design?: string },
): Backup {
  return {
    app: BACKUP_APP,
    kind: BACKUP_KIND,
    version: BACKUP_VERSION,
    exportedAt: Date.now(),
    library,
    ...(meta?.discName ? { discName: meta.discName } : {}),
    ...(meta?.design ? { design: meta.design } : {}),
  };
}

export interface ParsedBackup {
  ok: true;
  backup: Backup;
  series: Series[];
}

export interface ParseError {
  ok: false;
  error: "invalid" | "not-json";
}

export type ParseResult = ParsedBackup | ParseError;

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function asNumber(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

function sanitize(item: unknown): Series | null {
  if (!isRecord(item)) return null;
  const id = item.id;
  const title = item.title;
  if (typeof id !== "string" || id.length === 0) return null;
  if (typeof title !== "string" || title.length === 0) return null;

  const status: SeriesStatus = STATUSES.includes(item.status as SeriesStatus)
    ? (item.status as SeriesStatus)
    : "planned";
  const episodes = asNumber(item.episodes);
  const watched = Math.max(0, asNumber(item.watched) ?? 0);
  const rating = asNumber(item.rating);
  const addedAt = asNumber(item.addedAt) ?? Date.now();

  const streams = Array.isArray(item.streams)
    ? item.streams.filter(
        (s) =>
          isRecord(s) &&
          typeof s.site === "string" &&
          typeof s.url === "string",
      ) as { site: string; url: string }[]
    : [];

  return {
    id,
    malId: asNumber(item.malId) ?? 0,
    title,
    titleJapanese: typeof item.titleJapanese === "string" ? item.titleJapanese : null,
    imageUrl: typeof item.imageUrl === "string" ? item.imageUrl : "",
    imageLargeUrl: typeof item.imageLargeUrl === "string" ? item.imageLargeUrl : null,
    episodes,
    year: asNumber(item.year),
    type: typeof item.type === "string" ? item.type : null,
    genres: Array.isArray(item.genres)
      ? item.genres.filter((g): g is string => typeof g === "string")
      : [],
    synopsis: typeof item.synopsis === "string" ? item.synopsis : null,
    streams,
    status,
    watched,
    rating,
    addedAt,
  };
}

export function parseBackup(text: string): ParseResult {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return { ok: false, error: "not-json" };
  }
  if (!isRecord(data)) return { ok: false, error: "invalid" };
  if (
    (data.app !== BACKUP_APP && data.app !== BACKUP_APP_LEGACY) ||
    data.kind !== BACKUP_KIND ||
    data.version !== BACKUP_VERSION
  ) {
    return { ok: false, error: "invalid" };
  }
  const series = Array.isArray(data.library)
    ? data.library.map(sanitize).filter((s): s is Series => s !== null)
    : [];
  const backup: Backup = {
    app: BACKUP_APP,
    kind: BACKUP_KIND,
    version: BACKUP_VERSION,
    exportedAt: asNumber(data.exportedAt) ?? Date.now(),
    library: series,
    ...(typeof data.discName === "string" && data.discName
      ? { discName: data.discName }
      : {}),
    ...(typeof data.design === "string" && data.design
      ? { design: data.design }
      : {}),
  };
  return { ok: true, backup, series };
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function downloadBackup(
  library: Series[],
  meta?: { discName?: string; design?: string },
) {
  const backup = buildBackup(library, meta);
  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const stamp = new Date().toISOString().slice(0, 10);
  const slug = slugify(meta?.discName ?? "");
  const a = document.createElement("a");
  a.href = url;
  a.download = slug ? `hanko-${slug}-${stamp}.json` : `hanko-progreso-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}