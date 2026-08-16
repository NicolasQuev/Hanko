<div align="center">

<span style="display:inline-block;width:18px;height:18px;background:#c33f1b;border-radius:1px;vertical-align:middle;margin-right:10px"></span><span style="font-size:2rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;vertical-align:middle;line-height:1">Hanko</span>

<span style="display:block;margin-top:6px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.8rem;letter-spacing:.22em;text-transform:uppercase;color:#8b949e">— catálogo de círculos</span>

</div>

Tu tracker personal de anime con forma de catálogo de círculos impreso para una feria tipo comiket. Busca series, estampa tu catálogo, entinta capítulos vistos, puntúa y suma puntos — todo guardado en tu dispositivo. Sin cuentas, sin servidores.

## Cómo funciona

1. **Busca y reclama** — En la sala de alta buscas tu serie y la añades. Se estampa como un sello en tu catálogo.
2. **Entinta capítulos** — Cada episodio visto suma un punto. El sello activo del mapa los marca de uno en uno.
3. **Rellena la ficha** — Sinopsis, puntuación del 1 al 10 y dónde verla. Puntuar también suma puntos.
4. **Ordena el catálogo** — Los estados (en curso, completo, plan, en espera) llenan los sectores del mapa.
5. **Guarda tu progreso** — La grabadora guarda todo en un archivo (disco). Arrástralo de vuelta para recuperarlo.

La primera vez que entras, una guía te muestra este ciclo en tu idioma (ES · EN · JP).

## Stack

| Capa | Herramienta |
| --- | --- |
| Framework | Next.js (App Router) · React 19 · TypeScript |
| Animación | GSAP |
| Iconos | lucide-react |
| Datos | Jikan API / AniList GraphQL (sin API key) |
| Almacenamiento | localStorage (sin backend) |

## Empezar

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Scripts

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción (export estático) |
| `npm run start` | Sirve el build de producción |
| `npm run lint` | ESLint |
| `node scripts/generate-titles.mjs` | Regenera `public/anime-titles.json` (índice de búsqueda offline) desde AniList |
| `node scripts/shot.mjs` | Captura screenshots de la UI con Edge (Puppeteer) |

## Datos y privacidad

Todo se guarda en tu navegador mediante `localStorage`. Sin cuentas, sin sincronización, sin telemetría. Tus datos viven en este dispositivo.

## Diseño

El sistema de diseño completo (colores, tipografía, layout, componentes) está en [DESIGN.md](DESIGN.md).

## Licencia

[MIT](LICENSE).