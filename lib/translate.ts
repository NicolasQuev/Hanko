const CACHE_KEY = "hanko.translations";

let cache: Record<string, string> | null = null;

function loadCache(): Record<string, string> {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    cache = raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    cache = {};
  }
  return cache;
}

function saveCache() {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    /* storage unavailable */
  }
}

export async function translateText(text: string, target: string): Promise<string> {
  if (target === "en") return text;
  const trimmed = text.trim();
  if (!trimmed) return text;
  const key = `${target}\u0000${trimmed}`;
  const cached = loadCache()[key];
  if (cached) return cached;

  try {
    const res = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${target}&dt=t&q=${encodeURIComponent(
        trimmed.slice(0, 4500),
      )}`,
    );
    if (!res.ok) return text;
    const data = (await res.json()) as Array<Array<Array<string | number>>>;
    const translated = (data[0] ?? [])
      .map((seg) => String(seg[0] ?? ""))
      .join("");
    if (!translated.trim()) return text;
    loadCache()[key] = translated;
    saveCache();
    return translated;
  } catch {
    return text;
  }
}