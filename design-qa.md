# Design QA · UX demo

- Source visual truth: `design/screenshots/language-ru.png`, `distance-ru.png`, `form-ru.png`, `success-ru.png`.
- Implementation: browser-rendered `http://localhost:4173/`, Codex in-app Browser tab 1; screenshots captured inline during QA on 11.09.2026.
- Source pixels: 1920×1080 per screen.
- Implementation capture: 1280×720 CSS viewport, 16:9, device scale factor 1.
- Normalization: both sources are the same 16:9 composition; the implementation was reviewed at 2/3 linear scale. The black reference switcher bar is intentionally excluded because it is reference tooling, not product UI.
- States: language, Russian distance, empty/form-filled, phrase replacement dialog, saving, success, Kazakh distance/form, English distance.

## Full-view comparison evidence

The supplied source screens and browser-rendered implementation were opened in the same QA turn. Composition, main region proportions, control hierarchy, KV containment, header treatment, form/keyboard split and success-screen alignment were compared at matched 16:9 scale. A same-page iframe contact sheet was attempted, but the in-app screenshot compositor did not paint the child frame; final judgment therefore uses the full-resolution source and implementation captures inspected immediately before and after that attempt.

## Focused comparison evidence

- Typography: display headings use system Arial Narrow/Arial, heavy italic, with the same compact uppercase hierarchy. Exact campaign font remains unavailable by source definition.
- Spacing: language split, distance card stack, form columns, persistent CTA and keyboard now follow the reference rhythm without overflow.
- Colors: `#F14635` is retained as the official Kaspi red; track, paper, ink, border and error roles come from the supplied proposed tokens.
- Images: the original `kv-original.png` is shown with `object-fit: contain`; the original white Kaspi.kz SVG is used in headers without filters, recoloring or redrawing.
- Copy: public labels and the two ready phrases match the supplied draft locale files for RU/KK/EN. The demo-only synthetic-data notice is an intentional safety addition.
- Interaction: all primary buttons, fields, phrase replacement, validation, keyboard keys, saving, success and reset states are functional.

## Comparison history

### Pass 1 findings

- P2 · Display headings rendered upright because font synthesis was disabled.
  - Fix: enabled style/weight synthesis and added the documented system condensed fallback for display text.
- P2 · Percentage distance tracks plus the grid gap pushed cards too close to the right edge.
  - Fix: changed tracks to bounded fractional columns so the gap participates in available width.
- P1 · The initial form grid allowed the submit CTA to overlap the on-screen keyboard; header contents could also fall under the form stacking context.
  - Fix: gave the form region an explicit reference-height row, aligned the grid from the top and raised the shared header stacking layer.
- P2 · Success headline was visually smaller than the supplied target.
  - Fix: increased success display size and vertical separation from the confirmation mark.

### Pass 2 evidence

Post-fix in-app Browser captures show: intact header/logo, fully visible CTA above the keyboard, balanced right margins on distance cards, italic display hierarchy and a larger success message. No actionable P0/P1/P2 differences remain.

## Residual P3 / device gates

- Exact display font cannot be matched until the owner supplies or approves one.
- Physical touch size, Android WebView rendering, system bars and actual panel viewport still require hardware verification.
- The browser demo notice is intentionally absent from the supplied reference and must not ship in the final public kiosk UI.

## Implementation checklist

- [x] Original source assets placed without visual modification.
- [x] Four public states implemented.
- [x] RU/KK/EN and 10/21/42 paths available.
- [x] Form, validation, phrase replacement and virtual keyboard functional.
- [x] Saving/success/reset behavior functional with synthetic data only.
- [x] TypeScript strict-check and production build pass.
- [ ] Android/native/device gates remain outside this demo.

final result: passed
