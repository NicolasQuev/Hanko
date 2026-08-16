import { writeFileSync } from "node:fs";
import path from "node:path";

const ANILIST_API = "https://graphql.anilist.co";
const PAGES = 30;
const PER_PAGE = 50;
const OUT = path.resolve("public/anime-titles.json");

const query = `query ($page: Int) {
  Page(perPage: ${PER_PAGE}, page: $page) {
    media(sort: POPULARITY_DESC, type: ANIME, isAdult: false) {
      id
      idMal
      title { romaji english native }
      coverImage { large medium }
      seasonYear
      format
    }
  }
}`;

async function fetchPage(page) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch(ANILIST_API, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ query, variables: { page } }),
    });
    if (res.status === 429) {
      const wait = 4000 * (attempt + 1);
      process.stdout.write(`rate-limited page ${page}, waiting ${wait}ms\n`);
      await new Promise((r) => setTimeout(r, wait));
      continue;
    }
    if (!res.ok) throw new Error(`AniList ${res.status} on page ${page}`);
    const json = await res.json();
    return json?.data?.Page?.media ?? [];
  }
  throw new Error(`AniList 429 persisted on page ${page}`);
}

const all = [];
for (let page = 1; page <= PAGES; page++) {
  try {
    const media = await fetchPage(page);
    if (media.length === 0) break;
    all.push(...media);
    process.stdout.write(`page ${page}: ${all.length} titles\n`);
  } catch (err) {
    process.stdout.write(`stopping at page ${page}: ${err.message}\n`);
    break;
  }
  await new Promise((r) => setTimeout(r, 1500));
}

const titles = all.map((m) => ({
  malId: m.idMal ?? m.id,
  title: m.title?.romaji || m.title?.english || m.title?.native || "",
  titleEnglish: m.title?.english ?? null,
  titleNative: m.title?.native ?? null,
  imageUrl: m.coverImage?.medium ?? "",
  imageLargeUrl: m.coverImage?.large ?? m.coverImage?.medium ?? "",
  year: m.seasonYear ?? null,
  type: m.format ?? null,
}));

writeFileSync(OUT, JSON.stringify(titles));
console.log(`\nWrote ${titles.length} titles to ${OUT}`);