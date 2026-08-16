import puppeteer from "puppeteer-core";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const EDGE =
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const BASE = "http://localhost:3000";
const OUT = path.join(__dirname, ".impeccable", "screenshots");
const PROFILE = path.join(__dirname, ".impeccable", "edge-profile-pw");

const ROUTES = [
  { file: "dashboard", url: "/" },
  { file: "biblioteca", url: "/biblioteca" },
  { file: "ficha", url: "/serie/mal-52991" },
  { file: "alta", url: "/alta" },
];

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: EDGE,
    headless: "new",
    userDataDir: PROFILE,
    args: ["--no-first-run", "--no-default-browser-check", "--disable-gpu"],
  });

  const page = await browser.newPage();
  await page.goto(`${BASE}/?seed`, { waitUntil: "networkidle2", timeout: 60000 });
  await page.waitForFunction(
    () => document.querySelectorAll(".stamp").length > 0,
    { timeout: 45000 },
  );
  await new Promise((r) => setTimeout(r, 1500));

  const report = [];

  for (const size of [
    { label: "desktop", width: 1440, height: 900 },
    { label: "mobile", width: 390, height: 844 },
  ]) {
    await page.setViewport({ width: size.width, height: size.height });

    for (const route of ROUTES) {
      await page.goto(`${BASE}${route.url}`, {
        waitUntil: "networkidle2",
        timeout: 60000,
      });
      await new Promise((r) => setTimeout(r, 700));
      const file = `${size.label}-${route.file}.png`;
      await page.screenshot({ path: path.join(OUT, file), fullPage: true });

      const metrics = await page.evaluate(() => {
        const de = document.documentElement;
        const overflowX = de.scrollWidth > de.clientWidth + 1;
        const visibleStamps = document.querySelectorAll(".stamp").length;
        return { overflowX, visibleStamps, title: document.title };
      });
      report.push({
        viewport: `${size.width}x${size.height}`,
        route: route.url,
        file,
        overflowX: metrics.overflowX,
        visibleStamps: metrics.visibleStamps,
      });
    }
  }

  await browser.close();
  console.log(JSON.stringify(report, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});