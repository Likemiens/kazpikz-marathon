# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

Owner UI direction from 12.09.2026: the light app header must always render the bundled full-color Kaspi.kz logo; the runner-name and phone controls share identical geometry and reserved support-text space; show six quick phrases on the form while keeping all eight in the overlay; the custom keyboard must begin directly with keys and must not reserve a caption or empty area above them.

Owner UI direction from 14.09.2026 supersedes the portrait direction: the public demo uses a fixed 16:9 landscape canvas. The welcome screen shows the untouched `assets/brand/kv-original.png` as the full visual source, including both supplied Kaspi.kz and Almaty Marathon logos and the campaign slogan. Its primary copy is a large, readable invitation saying that the wish will appear on city screens on 27 September, followed by the language choices. Subsequent public screens retain both logos by cropping the official KV header, use informal second-person copy consistently, omit the “support video” disclaimer everywhere, and title the form “Сообщение бегуну”. Do not add small instructional text to public screens.

Owner welcome refinement from 14.09.2026: keep the official KV visually separate from the action panel by scaling it down slightly and reduce the panel height. The panel may overlap only the lower edge of the KV; it must not cover the campaign slogan or materially crop the runners.
