import type { Series } from "./types";

export const POINTS_PER_EPISODE = 10;
export const COMPLETION_BONUS = 50;
export const RATING_MULTIPLIER = 5;

export interface SeriesPoints {
  chapters: number;
  completion: number;
  rating: number;
  total: number;
}

export function isComplete(s: Series): boolean {
  return (
    s.status === "completed" ||
    (s.episodes != null && s.episodes > 0 && s.watched >= s.episodes)
  );
}

export function seriesPoints(s: Series): SeriesPoints {
  const chapters = s.watched * POINTS_PER_EPISODE;
  const completion = isComplete(s) ? COMPLETION_BONUS : 0;
  const rating = s.rating != null ? s.rating * RATING_MULTIPLIER : 0;
  return { chapters, completion, rating, total: chapters + completion + rating };
}

export function totalPoints(library: Series[]): number {
  return library.reduce((sum, s) => sum + seriesPoints(s).total, 0);
}

export function totalWatched(library: Series[]): number {
  return library.reduce((sum, s) => sum + s.watched, 0);
}

export function standCode(index: number): string {
  const row = String.fromCharCode(65 + Math.floor(index / 16));
  const col = String((index % 16) + 1).padStart(2, "0");
  return `${row}-${col}`;
}