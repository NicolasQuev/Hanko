import type { JikanResult } from "./types";

interface JikanAnime {
  mal_id: number;
  title: string;
  title_japanese: string | null;
  images: {
    jpg: { image_url?: string; large_image_url?: string };
  };
  episodes: number | null;
  year: number | null;
  type: string | null;
  genres?: { name: string }[];
  synopsis?: string | null;
}

const API = "https://api.jikan.moe/v4";
const ANILIST_API = "https://graphql.anilist.co";

const RETRIES = 2;
const TIMEOUT_MS = 8000;

interface AniListMedia {
  id: number;
  idMal: number | null;
  title: { romaji?: string | null; english?: string | null; native?: string | null };
  coverImage: { large?: string | null; medium?: string | null };
  episodes: number | null;
  seasonYear: number | null;
  format: string | null;
  genres: string[];
  description?: string | null;
  externalLinks?: { site?: string | null; url?: string | null; type?: string | null }[];
}

async function fetchWithRetry(
  url: string,
  attempts: number = RETRIES,
  init?: RequestInit,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(url, { cache: "no-store", signal: controller.signal, ...init });
  } catch {
    if (attempts <= 0) throw new Error("Jikan unreachable");
    await new Promise((r) => setTimeout(r, 1200));
    return fetchWithRetry(url, attempts - 1, init);
  } finally {
    clearTimeout(timer);
  }
  if (!res.ok && (res.status === 504 || res.status >= 500) && attempts > 0) {
    await new Promise((r) => setTimeout(r, 1200));
    return fetchWithRetry(url, attempts - 1, init);
  }
  return res;
}

export async function searchAnime(query: string): Promise<JikanResult[]> {
  const url = `${API}/anime?q=${encodeURIComponent(query)}&limit=12&sfw=true`;
  try {
    const res = await fetchWithRetry(url);
    if (!res.ok) {
      throw new Error(`Jikan error ${res.status}`);
    }
    const data = (await res.json()) as { data: JikanAnime[] };
    const results = data.data
      .filter((a) => a.images?.jpg?.image_url)
      .map((a) => ({
        malId: a.mal_id,
        title: a.title,
        titleJapanese: a.title_japanese ?? null,
        imageUrl: a.images.jpg.image_url ?? "",
        imageLargeUrl: a.images.jpg.large_image_url ?? a.images.jpg.image_url ?? "",
        episodes: a.episodes,
        year: a.year,
        type: a.type,
        genres: (a.genres ?? []).map((g) => g.name),
        synopsis: a.synopsis ?? null,
      }));
    if (results.length > 0) return results;
  } catch {
    /* Jikan unreachable: fall through to AniList */
  }
  return searchAniList(query);
}

async function searchAniList(query: string): Promise<JikanResult[]> {
  const q = `query ($search: String) {
    Page(perPage: 12) {
      media(search: $search, type: ANIME, isAdult: false) {
        id
        idMal
        title { romaji english native }
        coverImage { large medium }
        episodes
        seasonYear
        format
        genres
        description
        externalLinks { site url type }
      }
    }
  }`;
  const res = await fetchWithRetry(ANILIST_API, 1, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ query: q, variables: { search: query } }),
  });
  if (!res.ok) {
    throw new Error(`AniList error ${res.status}`);
  }
  const data = (await res.json()) as {
    data?: { Page?: { media?: AniListMedia[] } };
  };
  const media = data?.data?.Page?.media ?? [];
  return media
    .filter((a) => a.coverImage?.large || a.coverImage?.medium)
    .map((a) => ({
      malId: a.idMal ?? a.id,
      title: a.title?.romaji || a.title?.english || a.title?.native || "",
      titleJapanese: a.title?.native ?? null,
      imageUrl: a.coverImage?.medium ?? "",
      imageLargeUrl: a.coverImage?.large ?? a.coverImage?.medium ?? "",
      episodes: a.episodes,
      year: a.seasonYear,
      type: a.format,
      genres: a.genres ?? [],
      synopsis: stripHtml(a.description ?? null),
      streams: streamingLinks(a.externalLinks),
    }));
}

async function fetchOnce(url: string, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { cache: "no-store", signal: controller.signal, ...init });
  } finally {
    clearTimeout(timer);
  }
}

interface TitleEntry {
  malId: number;
  title: string;
  titleEnglish: string | null;
  titleNative: string | null;
  imageUrl: string;
  imageLargeUrl: string;
  year: number | null;
  type: string | null;
}

export async function searchSuggestions(query: string): Promise<JikanResult[]> {
  const q = `query ($search: String) {
    Page(perPage: 8) {
      media(search: $search, type: ANIME, isAdult: false) {
        id
        idMal
        title { romaji english native }
        coverImage { large medium }
        seasonYear
        format
      }
    }
  }`;
  const res = await fetchOnce(ANILIST_API, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ query: q, variables: { search: query } }),
  });
  if (!res.ok) {
    throw new Error(`AniList error ${res.status}`);
  }
  const data = (await res.json()) as {
    data?: { Page?: { media?: AniListMedia[] } };
  };
  const media = data?.data?.Page?.media ?? [];
  return media
    .filter((a) => a.coverImage?.large || a.coverImage?.medium)
    .map((a) => ({
      malId: a.idMal ?? a.id,
      title: a.title?.romaji || a.title?.english || a.title?.native || "",
      titleJapanese: a.title?.native ?? null,
      imageUrl: a.coverImage?.medium ?? "",
      imageLargeUrl: a.coverImage?.large ?? a.coverImage?.medium ?? "",
      episodes: a.episodes,
      year: a.seasonYear,
      type: a.format,
      genres: [],
    }));
}

let titlesCache: TitleEntry[] | null = null;
let titlesPromise: Promise<TitleEntry[]> | null = null;

function loadTitles(): Promise<TitleEntry[]> {
  if (titlesCache) return Promise.resolve(titlesCache);
  if (!titlesPromise) {
    titlesPromise = fetch("/anime-titles.json")
      .then((r) => {
        if (!r.ok) throw new Error(`titles ${r.status}`);
        return r.json() as Promise<TitleEntry[]>;
      })
      .then((t) => {
        titlesCache = t;
        return t;
      });
  }
  return titlesPromise;
}

function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export async function localSuggestions(query: string): Promise<JikanResult[]> {
  const list = await loadTitles();
  const q = norm(query);
  if (!q) return [];
  const results: TitleEntry[] = [];
  for (const t of list) {
    const candidates = [t.title, t.titleEnglish, t.titleNative]
      .filter(Boolean)
      .map((s) => norm(s as string));
    if (candidates.some((c) => c.startsWith(q))) results.push(t);
    if (results.length >= 12) break;
  }
  return results.map((t) => ({
    malId: t.malId,
    title: t.title,
    titleJapanese: t.titleNative,
    imageUrl: t.imageUrl,
    imageLargeUrl: t.imageLargeUrl,
    episodes: null,
    year: t.year,
    type: t.type,
    genres: [],
  }));
}

function stripHtml(html: string | null): string | null {
  if (!html) return null;
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function streamingLinks(
  links?: { site?: string | null; url?: string | null; type?: string | null }[] | null,
): { site: string; url: string }[] {
  if (!links) return [];
  const seen = new Set<string>();
  const out: { site: string; url: string }[] = [];
  for (const l of links) {
    if (!l?.site || !l?.url) continue;
    if (l.type && l.type !== "STREAMING") continue;
    const key = l.site.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ site: l.site, url: l.url });
  }
  return out;
}

export async function getDetails(malId: number): Promise<{
  synopsis: string | null;
  streams: { site: string; url: string }[];
  episodes: number | null;
}> {
  const q = `query ($idMal: Int) {
    Media(idMal: $idMal, type: ANIME) {
      id
      title { romaji }
      episodes
      description
      externalLinks { site url type }
    }
  }`;
  const res = await fetchOnce(ANILIST_API, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ query: q, variables: { idMal: malId } }),
  });
  if (!res.ok) {
    throw new Error(`AniList error ${res.status}`);
  }
  const data = (await res.json()) as {
    data?: { Media?: { description?: string | null; episodes?: number | null; externalLinks?: AniListMedia["externalLinks"] } };
  };
  const media = data?.data?.Media;
  return {
    synopsis: stripHtml(media?.description ?? null),
    streams: streamingLinks(media?.externalLinks),
    episodes: media?.episodes ?? null,
  };
}