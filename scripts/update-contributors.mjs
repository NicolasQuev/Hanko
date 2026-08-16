import { writeFile } from "node:fs/promises";
import path from "node:path";

const TOKEN = process.env.GITHUB_TOKEN;
const REPO = process.env.GITHUB_REPOSITORY ?? "NicolasQuev/Hanko";
const OUT = path.resolve("public/contributors.json");

const headers = {
  "X-GitHub-Api-Version": "2022-11-28",
  Accept: "application/vnd.github+json",
  ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
};

const res = await fetch(`https://api.github.com/repos/${REPO}/contributors?per_page=100`, {
  headers,
});

if (!res.ok) {
  throw new Error(`GitHub API responded ${res.status} ${res.statusText}`);
}

const list = (await res.json()) ?? [];
if (!Array.isArray(list)) {
  throw new Error("Unexpected payload from GitHub API");
}

const out = list
  .filter((u) => !u.type || u.type === "User")
  .map((u) => ({
    login: u.login,
    name: u.name ?? "",
    html_url: u.html_url,
    avatar_url: u.avatar_url,
    contributions: u.contributions,
  }));

await writeFile(OUT, `${JSON.stringify(out, null, 2)}\n`);
console.log(`wrote ${out.length} contributors to ${OUT}`);