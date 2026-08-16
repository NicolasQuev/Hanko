# Hanko

Personal anime tracker styled as a printed doujinshi circle catalog. Search anime, stamp series into your catalog, mark episodes watched, rate, and earn points — all stored locally, no accounts, no backend.

## About

Hanko is a personal anime tracker built with Next.js and React. Search any anime through the Jikan API, stamp it into your catalog, mark episodes as watched, rate your series, and earn points for every episode you finish — then watch it all come together in a dashboard of stats and progress. No accounts, no backend: your library lives entirely in your browser via localStorage.

The interface is designed as a printed doujinshi circle catalog for a comiket-style fair: warm newsprint paper, a single near-black ink, and one vermillion plate reserved for official marks. Each series is a physical *hanko* (seal) stamped on the sheet, with a stand code and a hand-drawn status mark — watching, completed, planned, or paused. Flat surfaces, guillotine borders, monospace tabular data. It feels like a fanzine, not a web app.

## Stack

- Next.js (App Router) · React 19 · TypeScript
- GSAP
- lucide-react
- Jikan API / AniList GraphQL (search and details, no API key needed)
- localStorage (no backend)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — start the production server
- `npm run lint` — ESLint
- `node scripts/generate-titles.mjs` — regenerate `public/anime-titles.json` (offline search index) from AniList
- `node scripts/shot.mjs` — capture UI screenshots with Edge (Puppeteer)

## Data & Privacy

Everything is stored in your browser via localStorage. No accounts, no sync, no telemetry.

## Design

The full design system (colors, typography, layout, components) lives in [DESIGN.md](DESIGN.md).

## License

[MIT](LICENSE).
