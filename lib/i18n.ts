import { useSyncExternalStore } from "react";

export type Locale = "es" | "en" | "ja";

const LOCALE_KEY = "hanko.locale";

let locale: Locale = "es";
const listeners = new Set<() => void>();

if (typeof window !== "undefined") {
  const d = document.documentElement.dataset.locale;
  locale = d === "ja" || d === "en" ? d : "es";
}

function emit() {
  for (const l of listeners) l();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function getSnapshot(): Locale {
  return locale;
}

function getServerSnapshot(): Locale {
  return "es";
}

export function setLocale(next: Locale) {
  locale = next;
  document.documentElement.lang = next;
  document.documentElement.dataset.locale = next;
  try {
    localStorage.setItem(LOCALE_KEY, next);
  } catch {
    /* storage unavailable */
  }
  emit();
}

export function useLocale() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

const es = {
  brand: {
    tag: "— catálogo de circulos",
    homeAria: "Hanko, inicio",
  },
  nav: {
    aria: "Principal",
    map: "Mapa",
    catalog: "Catálogo",
    alta: "Alta",
    lang: "Idioma",
    themeLight: "Cambiar a modo claro",
    themeDark: "Cambiar a modo oscuro",
  },
  footer: "Impreso en papel de diario. Tus datos viven en este dispositivo.",
  statuses: {
    watching: "En curso",
    completed: "Completado",
    completedF: "Completada",
    planned: "Plan",
    paused: "En espera",
  },
  home: {
    coverTitle: "Mapa de sala",
    coverNote:
      "Cada sello es una serie. Entinta los capítulos que has visto y llena el mapa con tu propio canon.",
    tallyHead: "Totales",
    tallyPoints: "Puntos",
    tallyChapters: "Capítulos",
    tallyCompleted: "Completadas",
    tallyInProgress: "En curso",
    markCapAria: "Marcar capítulo {n} como visto",
    emptyTitle: "El catálogo está en blanco.",
    emptyText:
      "Todavía no has reclamado ningún círculo. Busca la primera serie en la sala de alta y llévala a tu catálogo.",
    emptyAction: "Abrir la sala de alta",
    quickProgress: "Sello activo · en curso",
    quickNoneProgress: "Sello activo",
    quickMark: "Marcar cap {n} · +{pts}",
    sealComplete: "Sello completo",
    ficha: "Ficha",
    noneTitle: "No tienes nada en curso.",
    noneText:
      "Elige un sello del mapa o retoma el catálogo para seguir entintando capítulos.",
    noneAction: "Abrir el catálogo",
    sections: "Sectores del mapa",
    hallEmpty: "Sector vacío",
  },
  contributors: {
    title: "Contribuidores",
    sub: "La gente que entinta este catálogo.",
    count: "{n} aportaciones",
  },
  catalog: {
    title: "Catálogo",
    sub: "{n} sellos · impreso en papel de diario",
    all: "Todos",
    searchAria: "Buscar en el catálogo",
    searchPlaceholder: "Buscar por título",
    emptyTitle: "La hoja está sin entintar.",
    emptyText:
      "No hay sellos que ordenar todavía. Añade tu primera serie desde la sala de alta y el catálogo empieza a llenarse.",
    emptyAction: "Ir a la sala de alta",
    noFilterTitle: "No hay sellos con ese filtro.",
    nothingTitle: "Nada que mostrar.",
    noFilterText: "Prueba otro término o cambia el sector del catálogo.",
    clearFilters: "Limpiar filtros",
    modeAria: "Modo de vista del catálogo",
    modeGrid: "Sellos",
    modeMini: "Estampitas",
    credits: "Créditos",
    cartilla: "Cartilla de sellos",
    cartillaAria: "Cartilla del catálogo",
    viewOnly: "Ver solo {label}",
    cartillaNote:
      "Pulsa un sello para filtrar el catálogo. Cada sello lleva su código de stand; el 完 y el trazo marcan las obras completadas.",
  },
  disco: {
    section: "Grabadora",
    sub: "Guarda tu progreso en un disco y llévalo donde quieras. Para recuperarlo, arrastra el archivo a la página o pulsa el disco.",
    discAria: "Disco de progreso. Pulsa para insertar uno.",
    save: "Grabar disco",
    saved: "Disco guardado",
    insertHint: "Arrastra el archivo aquí o pulsa el disco.",
    dropTitle: "Inserta el disco",
    dropText: "Suelta el archivo para leer tu progreso",
    dialogTitle: "Disco detectado",
    dialogText:
      "Contiene {n} sellos y {pts} puntos de {date}. ¿Reescribir tu catálogo actual?",
    overwrite: "Reescribir",
    keep: "Mantener actual",
    invalidTitle: "No es un disco de Hanko.",
    invalidText:
      "El archivo no tiene un progreso válido. Prueba con un disco guardado desde esta grabadora.",
    close: "Cerrar",
    status: "LISTO PARA GRABAR",
    hud: "PISTA 01 · GRABADORA",
    reading: "Leyendo disco…",
    titleLine1: "GUARDA TU PROGRESO",
    titleLine2: "EN UN DISCO",
    discNameLabel: "Nombre del disco",
    discNamePlaceholder: "Hanko",
    designLabel: "Diseño del disco",
    design: {
      tinta: "Tinta",
      vermillon: "Vermillón",
      noche: "Noche",
      ola: "Ola",
      sakura: "Sakura",
      sol: "Sol",
    },
  },
  ficha: {
    notFoundTitle: "Sello no encontrado.",
    notFoundText:
      "Este círculo no está en tu catálogo. Puede que ya lo hayas retirado.",
    backCatalog: "Volver al catálogo",
    alt: "{title} — sello del catálogo",
    completeAria: "completada",
    airingCaps: "caps en emisión",
    synopsis: "Sinopsis",
    status: "Estado",
    chaptersWatched: "Capítulos vistos",
    markChapterAria: "Marcar capítulo {n} como visto",
    overflow: "+{n} más",
    markCap: "Marcar cap {n}",
    markWatched: "Marcar visto",
    sealComplete: "Sello completo",
    unmarkAria: "Desmarcar el último capítulo",
    rating: "Puntuación",
    unrated: "sin puntuar",
    rateAria: "Puntuar {n} de 10",
    clear: "Borrar",
    ratingHint: "+{n} pts por punto de puntuación",
    pointsSheet: "Ficha de puntos",
    pointsRow: "{a} × {b} caps",
    completeSeries: "Completar la serie",
    pendingBonus: "+{n} (pendiente)",
    ratingRow: "Puntuación {a}",
    total: "Total",
    remove: "Retirar del catálogo",
    removeConfirmTitle: "Retirar del catálogo",
    removeConfirmMessage:
      "¿Retirar este círculo de tu catálogo? Los puntos volverán a su lugar.",
    removeConfirm: "Retirar",
    homeAria: "Volver al mapa de sala",
  },
  alta: {
    title: "Sala de alta",
    sub: "Distribución · MyAnimeList (Jikan)",
    placeholder: "Título de la serie…",
    searchAria: "Buscar una serie",
    suggestionsAria: "Sugerencias",
    autocompleteLoading: "Buscando en la distribución…",
    noMatches: "Sin coincidencias.",
    searchLoading: "Buscando…",
    search: "Buscar",
    idleTitle: "Reclama un nuevo círculo.",
    idleText:
      "Busca una serie en la distribución, revisa que es la correcta y llévala a tu catálogo. Desde ahí se entinta capítulo a capítulo.",
    loading: "Buscando en la sala de distribución…",
    errorTitle: "No se pudo contactar con la sala.",
    errorText:
      "La distribución (MyAnimeList) no respondió. Comprueba tu conexión y prueba otra vez.",
    retry: "Probar otra vez",
    results: "{n} resultados para «{q}»",
    noResultsTitle: "Nadie con ese nombre en la sala.",
    noResultsText:
      "Prueba con el título original, en japonés, o con menos palabras.",
    inCatalog: "En catálogo",
    view: "Ver",
    add: "Añadir",
    caps: "{n} caps",
  },
  chips: {
    loading: "Cargando ficha…",
    noStreams: "Sin plataformas conocidas.",
    searching: "Buscando…",
    whereToWatch: "Dónde verlo",
  },
  synopsis: {
    view: "Ver sinopsis",
  },
  preview: {
    tag: "Ficha de distribución",
    close: "Cerrar",
    noDescription: "Descripción no disponible en la distribución.",
  },
  stamp: {
    alt: "{title} — sello del catálogo",
    completeAria: "completada",
    metaComplete: "COMPLETO",
    metaWatching: "EN CURSO · {progress}",
    metaPaused: "EN ESPERA · {progress}",
    metaPlan: "PLAN · {progress}",
  },
  confirm: {
    cancel: "Cancelar",
  },
  notFound: {
    title: "Página fuera del catálogo.",
    text: "Esta ruta no existe en el mapa de sala. Vuelve al catálogo para seguir entintando.",
    action: "Volver al mapa",
  },
};

export type Dict = typeof es;

type DeepKeys<T> = {
  [K in keyof T]-?: T[K] extends string
    ? `${K & string}`
    : `${K & string}.${DeepKeys<T[K]>}`;
}[keyof T];

export type TKey = DeepKeys<Dict>;

const en: Dict = {
  brand: {
    tag: "— circle catalog",
    homeAria: "Hanko, home",
  },
  nav: {
    aria: "Main",
    map: "Map",
    catalog: "Catalog",
    alta: "Add",
    lang: "Language",
    themeLight: "Switch to light mode",
    themeDark: "Switch to dark mode",
  },
  footer: "Printed on newsprint. Your data lives on this device.",
  statuses: {
    watching: "Watching",
    completed: "Completed",
    completedF: "Completed",
    planned: "Plan",
    paused: "On hold",
  },
  home: {
    coverTitle: "Hall map",
    coverNote:
      "Every stamp is a series. Ink the episodes you've watched and fill the map with your own canon.",
    tallyHead: "Totals",
    tallyPoints: "Points",
    tallyChapters: "Episodes",
    tallyCompleted: "Completed",
    tallyInProgress: "Watching",
    markCapAria: "Mark episode {n} as watched",
    emptyTitle: "The catalog is blank.",
    emptyText:
      "You haven't claimed any circle yet. Find your first series in the add hall and bring it into your catalog.",
    emptyAction: "Open the add hall",
    quickProgress: "Active stamp · watching",
    quickNoneProgress: "Active stamp",
    quickMark: "Mark ep {n} · +{pts}",
    sealComplete: "Seal complete",
    ficha: "Details",
    noneTitle: "You have nothing in progress.",
    noneText:
      "Pick a stamp on the map or go back to the catalog to keep inking episodes.",
    noneAction: "Open the catalog",
    sections: "Map sectors",
    hallEmpty: "Empty sector",
  },
  contributors: {
    title: "Contributors",
    sub: "The people who ink this catalog.",
    count: "{n} contributions",
  },
  catalog: {
    title: "Catalog",
    sub: "{n} stamps · printed on newsprint",
    all: "All",
    searchAria: "Search the catalog",
    searchPlaceholder: "Search by title",
    emptyTitle: "The sheet has no ink.",
    emptyText:
      "There are no stamps to sort yet. Add your first series from the add hall and the catalog starts to fill.",
    emptyAction: "Go to the add hall",
    noFilterTitle: "No stamps match that filter.",
    nothingTitle: "Nothing to show.",
    noFilterText: "Try another term or change the catalog sector.",
    clearFilters: "Clear filters",
    modeAria: "Catalog view mode",
    modeGrid: "Stamps",
    modeMini: "Mini",
    credits: "Credits",
    cartilla: "Stamp card",
    cartillaAria: "Catalog stamp card",
    viewOnly: "Show only {label}",
    cartillaNote:
      "Press a stamp to filter the catalog. Each stamp carries its stand code; the 完 and the strike mark completed works.",
  },
  disco: {
    section: "Recorder",
    sub: "Save your progress to a disc and take it anywhere. To restore it, drag the file onto the page or press the disc.",
    discAria: "Progress disc. Press to insert one.",
    save: "Burn disc",
    saved: "Disc saved",
    insertHint: "Drag the file here or press the disc.",
    dropTitle: "Insert the disc",
    dropText: "Drop the file to read your progress",
    dialogTitle: "Disc detected",
    dialogText:
      "It holds {n} stamps and {pts} points from {date}. Overwrite your current catalog?",
    overwrite: "Overwrite",
    keep: "Keep current",
    invalidTitle: "Not a Hanko disc.",
    invalidText:
      "The file doesn't hold valid progress. Try a disc saved from this recorder.",
    close: "Close",
    status: "READY TO RECORD",
    hud: "TRACK 01 · RECORDER",
    reading: "Reading disc…",
    titleLine1: "SAVE YOUR PROGRESS",
    titleLine2: "ON A DISC",
    discNameLabel: "Disc name",
    discNamePlaceholder: "Hanko",
    designLabel: "Disc design",
    design: {
      tinta: "Ink",
      vermillon: "Vermilion",
      noche: "Night",
      ola: "Wave",
      sakura: "Sakura",
      sol: "Sun",
    },
  },
  ficha: {
    notFoundTitle: "Stamp not found.",
    notFoundText:
      "This circle isn't in your catalog. You may have retired it already.",
    backCatalog: "Back to the catalog",
    alt: "{title} — catalog stamp",
    completeAria: "completed",
    airingCaps: "eps airing",
    synopsis: "Synopsis",
    status: "Status",
    chaptersWatched: "Episodes watched",
    markChapterAria: "Mark episode {n} as watched",
    overflow: "+{n} more",
    markCap: "Mark ep {n}",
    markWatched: "Mark watched",
    sealComplete: "Seal complete",
    unmarkAria: "Unmark the last episode",
    rating: "Rating",
    unrated: "unrated",
    rateAria: "Rate {n} out of 10",
    clear: "Clear",
    ratingHint: "+{n} pts per rating point",
    pointsSheet: "Points sheet",
    pointsRow: "{a} × {b} eps",
    completeSeries: "Complete the series",
    pendingBonus: "+{n} (pending)",
    ratingRow: "Rating {a}",
    total: "Total",
    remove: "Remove from catalog",
    removeConfirmTitle: "Remove from catalog",
    removeConfirmMessage:
      "Remove this circle from your catalog? The points go back to their place.",
    removeConfirm: "Remove",
    homeAria: "Back to the hall map",
  },
  alta: {
    title: "Add hall",
    sub: "Distribution · MyAnimeList (Jikan)",
    placeholder: "Series title…",
    searchAria: "Search a series",
    suggestionsAria: "Suggestions",
    autocompleteLoading: "Searching the distribution…",
    noMatches: "No matches.",
    searchLoading: "Searching…",
    search: "Search",
    idleTitle: "Claim a new circle.",
    idleText:
      "Search a series in the distribution, make sure it's the right one and bring it into your catalog. From there it's inked episode by episode.",
    loading: "Searching the distribution hall…",
    errorTitle: "Couldn't reach the hall.",
    errorText:
      "The distribution (MyAnimeList) didn't respond. Check your connection and try again.",
    retry: "Try again",
    results: "{n} results for «{q}»",
    noResultsTitle: "No one by that name in the hall.",
    noResultsText:
      "Try the original title, in Japanese, or fewer words.",
    inCatalog: "In catalog",
    view: "View",
    add: "Add",
    caps: "{n} eps",
  },
  chips: {
    loading: "Loading details…",
    noStreams: "No known platforms.",
    searching: "Searching…",
    whereToWatch: "Where to watch",
  },
  synopsis: {
    view: "View synopsis",
  },
  preview: {
    tag: "Distribution sheet",
    close: "Close",
    noDescription: "No description available in the distribution.",
  },
  stamp: {
    alt: "{title} — catalog stamp",
    completeAria: "completed",
    metaComplete: "COMPLETE",
    metaWatching: "WATCHING · {progress}",
    metaPaused: "ON HOLD · {progress}",
    metaPlan: "PLAN · {progress}",
  },
  confirm: {
    cancel: "Cancel",
  },
  notFound: {
    title: "Page outside the catalog.",
    text: "This route doesn't exist on the hall map. Go back to the catalog to keep inking.",
    action: "Back to the map",
  },
};

const ja: Dict = {
  brand: {
    tag: "— サークルカタログ",
    homeAria: "ハンコ、ホーム",
  },
  nav: {
    aria: "メイン",
    map: "マップ",
    catalog: "カタログ",
    alta: "登録",
    lang: "言語",
    themeLight: "ライトモードに切り替え",
    themeDark: "ダークモードに切り替え",
  },
  footer: "新聞紙に印刷。データはこの端末にだけ保存されます。",
  statuses: {
    watching: "視聴中",
    completed: "完走",
    completedF: "完走",
    planned: "予定",
    paused: "一時停止",
  },
  home: {
    coverTitle: "会場図",
    coverNote:
      "それぞれの印は作品です。見た話をスタンプして、あなただけの会場図を完成させましょう。",
    tallyHead: "合計",
    tallyPoints: "ポイント",
    tallyChapters: "話数",
    tallyCompleted: "完走",
    tallyInProgress: "視聴中",
    markCapAria: "第{n}話を視聴済みにする",
    emptyTitle: "カタログはまだ白紙です。",
    emptyText:
      "まだサークルを申請していません。登録室で最初の作品を探して、カタログに入れましょう。",
    emptyAction: "登録室を開く",
    quickProgress: "進行中の印 · 視聴中",
    quickNoneProgress: "進行中の印",
    quickMark: "第{n}話をマーク · +{pts}",
    sealComplete: "印が完成",
    ficha: "詳細",
    noneTitle: "視聴中の作品はありません。",
    noneText:
      "会場図の印を選ぶか、カタログに戻って話をマークし続けましょう。",
    noneAction: "カタログを開く",
    sections: "会場の区画",
    hallEmpty: "空き区画",
  },
  contributors: {
    title: "コントリビューター",
    sub: "このカタログにインクを注ぐ人たち。",
    count: "{n}回の貢献",
  },
  catalog: {
    title: "カタログ",
    sub: "{n}個の印 · 新聞紙に印刷",
    all: "すべて",
    searchAria: "カタログを検索",
    searchPlaceholder: "タイトルで検索",
    emptyTitle: "紙にまだインクがありません。",
    emptyText:
      "並べる印はまだありません。登録室から最初の作品を追加すると、カタログが埋まり始めます。",
    emptyAction: "登録室へ",
    noFilterTitle: "そのフィルターに合う印はありません。",
    nothingTitle: "表示するものはありません。",
    noFilterText: "別の語句を試すか、カタログの区画を変えてください。",
    clearFilters: "フィルターを解除",
    modeAria: "カタログの表示モード",
    modeGrid: "印",
    modeMini: "ミニ",
    credits: "記録",
    cartilla: "印カード",
    cartillaAria: "カタログの印カード",
    viewOnly: "{label}のみ表示",
    cartillaNote:
      "印を押すとカタログを絞り込みます。各印にはスタンドコードが付いています。完と斜線は完走作品の印です。",
  },
  disco: {
    section: "レコーダー",
    sub: "進行状況をディスクに保存して、どこへでも持っていけます。復元するには、ファイルをページにドラッグするか、ディスクを押してください。",
    discAria: "進行ディスク。押すと挿入します。",
    save: "ディスクを焼く",
    saved: "ディスクを保存しました",
    insertHint: "ここにファイルをドラッグするか、ディスクを押してください。",
    dropTitle: "ディスクを挿入",
    dropText: "ファイルを離して進行状況を読み込みます",
    dialogTitle: "ディスクを検出",
    dialogText:
      "{date}の{n}個の印と{pts}ポイントが入っています。現在のカタログを書き換えますか？",
    overwrite: "書き換える",
    keep: "現在を維持",
    invalidTitle: "Hankoのディスクではありません。",
    invalidText:
      "有効な進行状況が含まれていません。このレコーダーで保存したディスクで試してください。",
    close: "閉じる",
    status: "録音準備完了",
    hud: "トラック 01 · レコーダー",
    reading: "ディスクを読み込み中…",
    titleLine1: "進行状況を",
    titleLine2: "ディスクに保存",
    discNameLabel: "ディスク名",
    discNamePlaceholder: "Hanko",
    designLabel: "ディスクデザイン",
    design: {
      tinta: "墨",
      vermillon: "朱",
      noche: "夜",
      ola: "波",
      sakura: "桜",
      sol: "陽",
    },
  },
  ficha: {
    notFoundTitle: "印が見つかりません。",
    notFoundText: "このサークルはカタログにありません。すでに外したのかもしれません。",
    backCatalog: "カタログへ戻る",
    alt: "{title} — カタログの印",
    completeAria: "完走",
    airingCaps: "放送中の話数",
    synopsis: "あらすじ",
    status: "状態",
    chaptersWatched: "視聴話数",
    markChapterAria: "第{n}話を視聴済みにする",
    overflow: "あと+{n}",
    markCap: "第{n}話をマーク",
    markWatched: "視聴済みにする",
    sealComplete: "印が完成",
    unmarkAria: "最後の話を取り消す",
    rating: "評価",
    unrated: "未評価",
    rateAria: "{n}/10で評価",
    clear: "消去",
    ratingHint: "評価1点につき+{n}pts",
    pointsSheet: "ポイント明細",
    pointsRow: "{a} × {b}話",
    completeSeries: "シリーズ完走",
    pendingBonus: "+{n} (未達成)",
    ratingRow: "評価 {a}",
    total: "合計",
    remove: "カタログから外す",
    removeConfirmTitle: "カタログから外す",
    removeConfirmMessage:
      "このサークルをカタログから外しますか？ポイントは元の場所に戻ります。",
    removeConfirm: "外す",
    homeAria: "会場図に戻る",
  },
  alta: {
    title: "登録室",
    sub: "配信元 · MyAnimeList (Jikan)",
    placeholder: "作品タイトル…",
    searchAria: "作品を検索",
    suggestionsAria: "候補",
    autocompleteLoading: "配信元を検索中…",
    noMatches: "該当なし。",
    searchLoading: "検索中…",
    search: "検索",
    idleTitle: "新しいサークルを申請します。",
    idleText:
      "配信元で作品を探し、正しい作品か確認してカタログに入れましょう。そこから1話ずつスタンプできます。",
    loading: "登録室を検索中…",
    errorTitle: "配信元に接続できませんでした。",
    errorText:
      "配信元 (MyAnimeList) が応答しませんでした。接続を確認してもう一度お試しください。",
    retry: "もう一度試す",
    results: "{q} の検索結果 {n}件",
    noResultsTitle: "その名前の作品は見つかりませんでした。",
    noResultsText: "原題や日本語タイトル、または少ない語で試してください。",
    inCatalog: "カタログ内",
    view: "表示",
    add: "追加",
    caps: "{n}話",
  },
  chips: {
    loading: "詳細を読み込み中…",
    noStreams: "既知の配信元はありません。",
    searching: "検索中…",
    whereToWatch: "視聴先",
  },
  synopsis: {
    view: "あらすじを見る",
  },
  preview: {
    tag: "配信台帳",
    close: "閉じる",
    noDescription: "配信元に説明がありません。",
  },
  stamp: {
    alt: "{title} — カタログの印",
    completeAria: "完走",
    metaComplete: "完走",
    metaWatching: "視聴中 · {progress}",
    metaPaused: "一時停止 · {progress}",
    metaPlan: "予定 · {progress}",
  },
  confirm: {
    cancel: "キャンセル",
  },
  notFound: {
    title: "カタログ外のページです。",
    text: "このルートは会場図に存在しません。カタログに戻って印を続けましょう。",
    action: "会場図に戻る",
  },
};

export const dicts: Record<Locale, Dict> = { es, en, ja };

export function translate(dict: Dict, key: TKey): string {
  return key
    .split(".")
    .reduce<unknown>((o, k) => (o as Record<string, unknown>)?.[k], dict) as string;
}