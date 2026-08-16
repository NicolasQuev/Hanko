import { importLibrary } from "./store";
import type { Series, SeriesStatus } from "./types";

interface DemoEntry {
  malId: number;
  watched: number;
  rating: number | null;
  status: SeriesStatus;
}

const DEMO: DemoEntry[] = [
  { malId: 52991, watched: 22, rating: 9, status: "watching" },
  { malId: 1, watched: 26, rating: 10, status: "completed" },
  { malId: 5114, watched: 64, rating: 10, status: "completed" },
  { malId: 16498, watched: 12, rating: 8, status: "watching" },
  { malId: 50265, watched: 0, rating: null, status: "planned" },
  { malId: 40748, watched: 12, rating: 7, status: "paused" },
];

interface JikanAnime {
  mal_id: number;
  title: string;
  title_japanese: string | null;
  images: { jpg: { image_url?: string; large_image_url?: string } };
  episodes: number | null;
  year: number | null;
  type: string | null;
}

async function fetchOne(entry: DemoEntry): Promise<Series> {
  const res = await fetch(`https://api.jikan.moe/v4/anime/${entry.malId}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Jikan ${res.status}`);
  const { data } = (await res.json()) as { data: JikanAnime };
  return {
    id: `mal-${entry.malId}`,
    malId: entry.malId,
    title: data.title,
    titleJapanese: data.title_japanese ?? null,
    imageUrl: data.images?.jpg?.image_url ?? "",
    imageLargeUrl: data.images?.jpg?.large_image_url ?? "",
    episodes: data.episodes,
    year: data.year,
    type: data.type,
    genres: [],
    status: entry.status,
    watched: entry.watched,
    rating: entry.rating,
    addedAt: Date.now() - DEMO.indexOf(entry) * 1000,
  };
}

export async function seedDemo() {
  const series: Series[] = [];
  for (const entry of DEMO) {
    try {
      series.push(await fetchOne(entry));
    } catch {
      /* skip unreachable */
    }
    await new Promise((r) => setTimeout(r, 350));
  }
  if (series.length > 0) importLibrary(series);
}