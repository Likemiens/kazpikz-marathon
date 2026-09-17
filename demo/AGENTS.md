# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

Owner UI direction from 12.09.2026: the light app header must always render the bundled full-color Kaspi.kz logo; the runner-name and phone controls share identical geometry and reserved support-text space; show six quick phrases on the form while keeping all eight in the overlay; the custom keyboard must begin directly with keys and must not reserve a caption or empty area above them.

Owner UI direction from 14.09.2026 supersedes the portrait direction: the public demo uses a fixed 16:9 landscape canvas. The welcome screen shows the untouched `assets/brand/kv-original.png` as the full visual source, including both supplied Kaspi.kz and Almaty Marathon logos and the campaign slogan. Its primary copy is a large, readable invitation saying that the wish will appear on city screens on 27 September, followed by the language choices. Subsequent public screens retain both logos by cropping the official KV header, use informal second-person copy consistently, omit the “support video” disclaimer everywhere, and title the form “Сообщение бегуну”. Do not add small instructional text to public screens.

Owner welcome refinement from 14.09.2026: keep the official KV visually separate from the action panel by scaling it down slightly and reduce the panel height. The panel may overlap only the lower edge of the KV; it must not cover the campaign slogan or materially crop the runners.

Owner refinement from 14.09.2026: use `assets/brand/kv-landscape-wide-v1.png`, the approved ultra-wide adaptation of the official KV, on the welcome screen so the artwork fills the horizontal media slot edge-to-edge without side gutters or cropped runners. On the form, remove the separate distance chip and include the selected distance directly in the localized heading. Keep one unified surface: runner name and phone in an equal two-column row, then the full-width wish field, six ready phrases, and one full-width primary action. Follow Apple-style principles of clear grouping, predictable geometry, immediate press feedback, and restrained depth without replacing the required Roboto typography or campaign identity.

Owner presentation requirement from 14.09.2026: `?screen=final` opens the final wish screen directly with realistic synthetic data and keeps it visible until the visitor returns to the start. Optional `lang=kk|ru|en` localizes this presentation state. Do not expose a public “demo” switch or reuse real visitor data for this route. The ordinary submit flow still shows the submitted name, wish and distance, then clears the kiosk after eight seconds.

Owner TV-output direction from 15.09.2026 supersedes the earlier split confirmation layout: S04 is a clean 16:9 broadcast composition for city screens. Keep the official two-logo header at the top, use the Kaspi brand red across the remaining canvas, and center only the recipient, the wish, and the distance. Do not show a confirmation side panel, checkmark, card, or “home” button on this display. Scale long recipient names and wishes down without changing the hierarchy; the normal kiosk flow may still reset after eight seconds, while `?screen=final` remains persistent for presentation.

Owner TV logo refinement from 15.09.2026: on S04, do not show the textured KV header strip as a separate band. Place the official white Kaspi.kz asset and the exact Almaty Marathon lockup independently on the same flat brand-red background as the wish. The Almaty lockup remains sourced from `kv-original.png`; isolate it in the UI without redrawing its lettering.

Owner header refinement from 15.09.2026 supersedes cropped-KV headers on S02/S03: never use the full KV as the header image. Render Kaspi.kz and Almaty Marathon as two independent, uncropped logo assets inside the red header with safe padding. Use the official Kaspi.kz SVG and the transparent Almaty Marathon extraction from the supplied KV; do not apply runtime filters, stretch either logo, or change their opacity.

Owner header correction from 15.09.2026: S02/S03 must not retain any KV texture or raster background behind the logos. The header background is a flat `#F14635` color with `background-image: none`; only the two independent transparent logo assets are rendered. Align their outer edges to the same 3cqw content gutter used by the back button and the form surface.

Owner content and logo correction from 17.09.2026: the supplied `Asset 1.svg` is the
canonical Almaty Marathon lockup. Use its exact vector in light S02/S03 headers and
the same geometry with a white fill on the red S04/welcome brand surfaces. Welcome
keeps the wide KV artwork, but covers its legacy baked logo/slogan zones with
independent logo and slogan layers so the supplied lockup and `10 жыл бойы
қарқынымыз бәсеңдемеді` are the visible source of truth. The welcome CTA is bilingual
with Kazakh on the left and Russian on the right; the language selector is lifted
onto the artwork. The distance screen carries the participant guidance about slang,
neologisms, profanity and abbreviations. Saving does not tell visitors to keep the
app open.

Owner raster localization correction from 17.09.2026: the welcome artwork now uses
`assets/brand/kv-landscape-wide-v3.png`, a generated sibling of the approved wide KV
with `10 жыл бойы қарқынымыз бәсеңдемеді` baked directly into the image and the
legacy baked logos erased. Do not render a duplicate HTML slogan over this asset.
Keep the separate transparent white logo layer above it so the canonical supplied
lockup remains crisp, independently replaceable, and aligned with the internal
header geometry. There must be no solid logo plate over the artwork.

Owner header rollback from 17.09.2026: S02/S03 must keep the original flat red
Kaspi header. The header still uses two independent white logo assets, but it must
not switch to a light surface or dark logo variants. Do not alter the distance/form
header when changing the welcome KV.

Owner form density refinement from 17.09.2026: reduce the shared logo header to a
compact height, keep the six visible phrases and «Все фразы» in the form surface,
and mount the custom keyboard as a bottom drawer that is closed on entry and opens
only after an input receives focus. Closing the focused field or pressing «Готово»
must collapse it again.

Owner welcome logo correction from 17.09.2026: S01 logos must use the exact same
`--app-header-height`, 3cqw horizontal gutter, and 20cqw/25cqw logo widths as the
independent S02/S03 header. They sit directly on the KV texture with a transparent
strip; never reintroduce a raster header, red plate, crop, or size-specific logo
variant on welcome.
