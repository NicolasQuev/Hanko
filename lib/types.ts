export type SeriesStatus = "watching" | "completed" | "planned" | "paused";

export interface StreamLink {
  site: string;
  url: string;
}

export interface Series {
  id: string;
  malId: number;
  title: string;
  titleJapanese?: string | null;
  imageUrl: string;
  imageLargeUrl?: string | null;
  episodes: number | null;
  year?: number | null;
  type?: string | null;
  genres?: string[];
  synopsis?: string | null;
  streams?: StreamLink[];
  status: SeriesStatus;
  watched: number;
  rating: number | null;
  addedAt: number;
}

export interface JikanResult {
  malId: number;
  title: string;
  titleJapanese: string | null;
  imageUrl: string;
  imageLargeUrl: string;
  episodes: number | null;
  year: number | null;
  type: string | null;
  genres: string[];
  synopsis?: string | null;
  streams?: StreamLink[];
}