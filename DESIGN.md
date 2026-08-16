---
name: Hanko
description: Catálogo personal de series de anime, estampado como feria de círculos de doujinshi.
colors:
  paper: "#f2efe6"
  paper-2: "#eae4d6"
  paper-3: "#e2dbc9"
  ink: "#23211d"
  ink-2: "#575349"
  ink-3: "#6b655a"
  ink-solid: "#000000"
  accent: "#c33f1b"
  accent-deep: "#982f0e"
typography:
  scale:
    micro: "0.58rem"
    micro-plus: "0.62rem"
    tiny: "0.64rem"
    small: "0.66rem"
    small-plus: "0.68rem"
    base-small: "0.7rem"
    base: "0.72rem"
    base-plus: "0.74rem"
    body-small: "0.76rem"
    body: "0.78rem"
    body-mid: "0.82rem"
    body-plus: "0.86rem"
    lead: "0.9rem"
    lead-plus: "0.92rem"
    base-rem: "1rem"
    wordmark: "1.05rem"
    input: "1.1rem"
    tally-total: "1.15rem"
    headline-small: "1.4rem"
    headline: "1.5rem"
    seal-kanji: "15px"
    fluid-min-16: "1.6rem"
    fluid-min-18: "1.8rem"
    fluid-min-19: "1.9rem"
    fluid-min-20: "2rem"
    fluid-max-26: "2.6rem"
    fluid-max-27: "2.7rem"
    fluid-max-30: "3rem"
    fluid-max-34: "3.4rem"
  display:
    fontFamily: "Archivo, sans-serif"
    fontWeight: 800
    letterSpacing: "-0.03em"
    lineHeight: "0.95"
    textTransform: "uppercase"
  title:
    fontFamily: "Archivo, sans-serif"
    fontWeight: 800
    letterSpacing: "-0.025em"
    lineHeight: "0.98"
    textTransform: "uppercase"
  body:
    fontFamily: "Archivo, sans-serif"
    lineHeight: "1.55"
  label:
    fontFamily: "Spline Sans Mono, monospace"
    fontWeight: 700
    letterSpacing: "0.06em"
    textTransform: "uppercase"
    fontSize: "0.7rem"
  kanji:
    fontFamily: "Hiragino Sans, Yu Gothic, Meiryo, sans-serif"
    fontWeight: 700
rounded:
  sm: "3px"
  md: "10px"
  cell: "2px"
  round: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "14px"
  lg: "18px"
  xl: "22px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.sm}"
    padding: "12px 18px"
    typography: "label"
  button-accent:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.paper}"
    rounded: "{rounded.sm}"
    padding: "12px 18px"
    typography: "label"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.sm}"
    padding: "12px 18px"
    typography: "label"
  stamp-plate:
    backgroundColor: "{colors.paper-2}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
  nav-link:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-2}"
    padding: "6px 10px"
    typography: "label"
  filter-chip:
    backgroundColor: "transparent"
    textColor: "{colors.ink-3}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
    typography: "label"
  search-box:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "0"
    padding: "16px 18px"
  panel:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "0"
    padding: "18px"
---

# Design System: Hanko

## Overview

**Creative North Star: "La Feria de Círculos"**

Hanko se ve como un catálogo de círculos de doujinshi impreso para una feria de comiket: papel de diario cálido, una única tinta casi negra, y una sola plancha de vermillón reservada para las marcas oficiales. Nada de UI de plataforma, nada de glassmorphism, nada de gradientes: solo tinta sobre papel, con la densidad y la honestidad de una hoja impresa.

Cada serie es un sello (stamp) en el catálogo, con su código de stand y su estado marcado a mano sobre la lámina. El sello es la unidad visual recurrente en toda la app — aparece en el mapa de sala, en el catálogo, en la ficha y en los resultados de búsqueda — y eso le da al sistema una sola gramática visual que se reconoce a cualquier escala.

La filosofía es de material impreso, no de pantalla: superficies planas con jerarquía por tinta y papel (no sombras profundas), líneas de guillotina y dobles filetes que recuerdan a la maquetación impresa, tipografía condensada y monospace para los datos, y un vermillón que rara vez supera el 5% de cualquier vista. Es un sistema Operate: todo está ordenado para escanear y completar tareas, pero la identidad vive en los detalles de imprenta.

**Key Characteristics:**
- Una sola tinta (casi negro) + una sola plancha de vermillón.
- Papel de diario cálido con superficies planas; la jerarquía viene de la tinta y el papel, no de las sombras.
- El sello (stamp) como unidad visual canónica, repetida a todas las escalas.
- Dobles filetes y bordes de guillotina como firmas de maquetación impresa.
- Datos en monospace tabular, con las marcas japonesas 完/漢 como sello de completado.

## Colors

Paleta de dos familias: papeles cálidos para el soporte y tintas para el contenido, con una sola plancha de vermillón.

### Primary
- **Vermillón Sello** (#c33f1b): la única plancha de color. Marca el estado activo, la puntuación rellena, el sello 完, el círculo de "en curso", y el acento de los números totales. Su rareza es su poder.
- **Vermillón Tinta** (#982f0e): el vermillón oscurecido, para texto y bordes cuando el acento necesita peso sin brillar (encabezados de sala, totales, hover quiet).

### Neutral
- **Papel Diario** (#f2efe6): fondo base de toda la app; también texto sobre fondo invertido.
- **Papel Prensado** (#eae4d6): superficies de soporte ligeramente más oscuras — fondos de lámina de sello, nav activa, quicks, filtros activos.
- **Papel Mancha** (#e2dbc9): la zona más oscura de papel; uso de reserva para el interior de las láminas.
- **Tinta** (#23211d): el casi-negro principal. Texto, bordes fuertes, botones primarios, capítulos vistos, fondo de la portada invertida.
- **Tinta Gris** (#575349): tinta rebajada para texto secundario y metadatos.
- **Tinta Tenue** (#6b655a): tinta muy rebajada para etiquetas, secciones, placeholders y notas; asegura contraste ≥ 4.5:1 sobre el papel.
- **Tinta Sólida** (#000000): negro puro, solo para el hover de botones primarios y del botón de búsqueda — el gesto más fuerte del sistema, reservado a acciones de confirmación.
- **Guillotina** (rgba(35,33,29,0.16)): línea de corte fina entre elementos.
- **Guillotina Fuerte** (rgba(35,33,29,0.42)): línea de corte marcada, para bordes de paneles, salas y tarjetas.

### Named Rules
**La Regla del Vermillón.** El vermillón se usa en ≤5% de cualquier vista. Rellena un sello, subraya una sala, sella una serie completa — y ahí se detiene. Si dos vermillones compiten en el mismo encuadre, uno de los dos sobra.
**La Regla de la Doble Tinta.** Toda superficie es papel (tinta sobre claro) o tinta (claro sobre oscuro), nunca un tercer tono intermedio que compita con el vermillón.

## Typography

**Display Font:** Archivo (variable, con eje wdth; fallback sans-serif)
**Body Font:** Archivo (fallback sans-serif)
**Label/Mono Font:** Spline Sans Mono (fallback monospace)
**Kanji Seal Font:** Hiragino Sans / Yu Gothic / Meiryo (solo para el 完 del sello)

**Character:** La pareja es de imprenta económica: una grotesca condensada y de alto peso para los títulos (como un titular de portada de fanzine), y una monoespaciada estrecha para todos los datos, etiquetas y cifras (como el texto de composición de un catálogo). Juntas huelen a fanzine fotocopiado, no a web app.

### Hierarchy
- **Display** (800, clamp(2rem, 5vw, 3.4rem), 0.95): solo la portada del mapa de sala ("Mapa de sala").
- **Title** (800, clamp(1.9rem, 4vw, 3rem), 0.98, uppercase): encabezados de página (Catálogo, Alta).
- **Headline** (800, 1.5rem, 1.05): títulos de panel de registro rápido.
- **Body** (400, 1rem, 1.55): descripciones, textos de estado, notas. Límite ~34–46ch en notas.
- **Label** (700, 0.66–0.74rem, 0.06em, uppercase): la voz del sistema — nav, botones, secciones, paneles, metadatos, tally, footer. Todo lo que no es contenido lleva monoespaciada.

### Named Rules
**La Regla de la Voz Mono.** Todo lo que no es contenido narrativo se compone en Spline Sans Mono mayúsculas: nav, botones, secciones, etiquetas de panel, metadatos, cifras, footer. El Archivo queda para títulos y texto de lectura. Si algo no es título ni párrafo, va en mono.

## Layout

Caja central de 1180px con padding lateral de 24px (16px bajo 640px). La densidad es media-alta, de catálogo impreso: las rejillas son apretadas y las cifras tabulares se alinean.

- **Rejilla de sellos**: `repeat(auto-fill, minmax(118px, 1fr))` con gap de 14px horizontal y 22px vertical; láminas de proporción 2:3.
- **Mapa de sala**: rejilla de 2 columnas con bordes compartidos (técnica `margin: -1px`) para líneas de guillotina continuas; cae a 1 columna bajo 640px.
- **Ficha**: 2 columnas `320px 1fr`; cae a 1 columna bajo 900px, con la lámina grande y los paneles apilados.
- **Encabezado de página**: título + subtítulo alineados a la línea base, con doble filete inferior (3px double) que separa del contenido.
- **Respuesta**: bajo 640px el masthead se apila verticalmente y la nav se reparte en anchos iguales; el registro rápido y los resultados de búsqueda pasan a una sola columna.
- **Ritmo vertical**: 26–34px entre bloques mayores, 14–18px dentro de los paneles, 4–8px entre elementos pequeños.

## Elevation & Depth

Sistema plano, de material impreso: sin capas flotantes ni sombras profundas. La jerarquía se logra con el contraste tinta/papel, los bordes de guillotina y el doble filete — exactamente como una página impresa separa sus bloques.

La única sombra es `--shadow-plate` (0 1px 2px rgba(35,33,29,0.16), 0 4px 12px rgba(35,33,29,0.10)), usada en las láminas de sello para darles un leve relieve de "pegatina sobre la página". En hover, la lámina sube 2px y la sombra se refuerza — el único gesto de elevación del sistema.

### Named Rules
**La Regla del Papel.** Las superficies se distinguen por tinta y papel, no por sombras. Si un bloque necesita separarse, primero se le da un borde de guillotina; la sombra es el último recurso y solo para las láminas.

## Shapes

Lenguaje de esquinas duras y rectas, como troqueles de imprenta: casi todo es cuadrado o de radio mínimo.

- **Placas y sellos**: radio de troquel de 3px (`--radius-plate`) — botones, láminas, filtros, sellos de puntuación.
- **Paneles**: cuadrados de 0px, solo borde de guillotina.
- **Celdas de capítulos**: radio 2px, casi cuadradas.
- **Círculo de "en curso"**: radio 999px, la única forma orgánica (una marca de rotulador, no una forma UI).
- **Marcas de estado**: formas geométricas puras — círculo (en curso), trazo diagonal (completado), guión (en espera), punto (plan).
- **Sello 完**: cuadrado de 30px de vermillón con el kanji en el centro; el único bloque de color puro del sistema.

## Components

### Botones
- **Forma:** troquel recto (radio 3px), borde de 1px de tinta, monoespaciada mayúscula de 0.74rem, peso 700, letter-spacing 0.06em, padding 12px 18px.
- **Primario:** tinta sobre papel (bg #23211d, texto #f2efe6); hover a negro sólido.
- **Acento:** vermillón (bg #c33f1b) para la acción principal de cada contexto — marcar capítulo, añadir serie; hover a vermillón tinta.
- **Ghost:** transparente con borde de guillotina fuerte y texto tinta gris; hover oscurece el borde y el texto.
- **Quiet:** sin borde, texto tinta tenue; hover a vermillón tinta. Solo para acciones terciarias (borrar puntuación).
- **Presionado:** `translateY(1px)` en active; `:focus-visible` con outline 2px vermillón.

### Sellos (Stamp) — componente firma
La unidad canónica. Enlace a la ficha con tres líneas: lámina 2:3 (imagen a escala de grises con contraste 1.14), código de stand en papel sobre la lámina (A-1, B-3…), nombre en dos líneas, y meta en mono. El estado se dibuja encima de la lámina como una marca a mano:
- **En curso:** círculo de vermillón de 2px de borde.
- **Completado:** trazo diagonal de vermillón + sello cuadrado 完 (30px).
- **En espera:** guión de vermillón de 14px.
- **Plan:** punto de vermillón de 8px.
La lámina es la única superficie con sombra del sistema; en hover se eleva 2px.

### Chips / Filtros
- **Estilo:** transparente con texto tinta tenue en mono; el activo se rellena de papel prensado con borde de tinta.
- **Estado:** el chip activo marca el sector del catálogo; el contador de cada chip va en mono tinta tenue, separado por un margen de 5px.

### Inputs / Búsqueda
- **Sala de alta:** caja compuesta por un input desnudo (padding 16px 18px) y un botón de tinta adherido por la derecha (borde izquierdo de 1px); el conjunto se cierra con un borde de tinta completo.
- **Búsqueda del catálogo:** solo subrayado de tinta con icono y placeholder en tinta tenue — la forma más quiet de entrada del sistema.
- **Focus:** `:focus-visible` con outline 2px vermillón.

### Navegación
- **Estilo:** enlaces mono mayúsculos de 0.72rem con padding 6px 10px; el activo se rellena de papel prensado con borde de guillotina y un cuadrado de 6px de vermillón a la izquierda.
- **Hover:** el texto pasa de tinta gris a tinta.
- **Móvil:** bajo 640px la nav se estira a 3 columnas iguales separadas por una guillotina superior.

### Paneles (Ficha)
- **Forma:** cuadrados con borde de guillotina fuerte y fondo papel; título de panel en mono mayúsculas tinta tenue con cifras en vermillón tinta.
- **Internos:** filas separadas por guillotina fina; los totales se separan con una línea de tinta y un peso 700.

### Tally (Portada del mapa)
Bloque de papel sobre la portada invertida: tabla mono con filas por estado y un total en vermillón tinta. Es el "pie de imprenta" de la tirada.

## Do's and Don'ts

### Do:
- **Do** usar el sello como unidad recurrente a toda escala (lámina pequeña en catálogo, grande en ficha, miniatura en búsqueda).
- **Do** separar bloques con guillotinas y dobles filetes antes que con sombras.
- **Do** componer todo dato y etiqueta en Spline Sans Mono mayúsculas con cifras tabulares.
- **Do** reservar el vermillón para un único foco por vista y mantenerlo en ≤5% de la pantalla.
- **Do** aplicar a las imágenes de portada escala de grises con contraste elevado para que sientan tinta sobre papel.

### Don't:
- **Don't** añadir gradientes, glassmorphism, sombras profundas ni fondos de marca de agua coloridos: el sistema es tinta sobre papel.
- **Don't** usar más de una plancha de color; el vermillón es el único acento.
- **Don't** dejar los títulos en caja normal: todos van en mayúsculas, comprimidos y de alto peso.
- **Don't** usar iconografía de marca o logos de plataforma; las marcas de estado son formas geométricas puras dibujadas a mano.
- **Don't** rellenar el estado con texto decorativo sobre la lámina: el estado se marca con los símbolos (círculo, trazo, guión, punto, sello 完), no con etiquetas flotantes.