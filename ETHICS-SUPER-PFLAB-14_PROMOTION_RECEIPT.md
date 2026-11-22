# ETHICS-SUPER/PFLAB-14 — Promotion Receipt

**Status: PROMOTED AFTER BROWSER ACCEPTANCE PASS**

## Canonical pair

- SUPER: `ETHICS-SUPER-14-1.html`
- PFLAB: `ETHICS-PFLAB-14-1.html`

## Browser acceptance

GitHub Actions run: `45074474558`
Browser engine: headless system Chrome/Chromium through Playwright.
The test served the committed SUPER and PFLAB files over local HTTP in the GitHub runner and exercised the real browser DOM, localStorage, file download, and file upload paths.

### Current 14-tool path — PASS

- SUPER loaded 14 chapters.
- SUPER bound to `https://bobphil.github.io/ethics-power-flourishing-lab/ETHICS-PFLAB-14-1.html`.
- SUPER reached 14/14 READY.
- PFLAB launch enabled.
- SUPER exported a real handoff JSON.
- Handoff source = `ETHICS-SUPER-14-1`.
- Handoff ready = true.
- 14 Tool Record entries.
- 14 Output Cards.
- CH13 and CH14 records present.
- PFLAB imported the generated handoff as `CURRENT_14`.
- CH13 and CH14 selectable.
- PFLAB self-test PASS.

### Legacy 12-tool path — PASS

- REDO-1 legacy fixture imported as `LEGACY_12`.
- Lab unlocked in compatibility mode.
- CH13 and CH14 remained visible but disabled.
- No CH13/14 student records were synthesized.

## Promotion changes

### SUPER repository

- `ETHICS-SUPER-FINAL-1.html` → redirects to SUPER-14.
- `ETHICS-SUPER-REDO-1.html` → redirects to SUPER-14.
- `index.html` → defaults to SUPER-14.
- `ETHICS-SUPER-14-1.html` launches PFLAB-14.

### PFLAB repository

- `index.html` → defaults to PFLAB-14.
- `ETHICS-PFLAB-2.html` remains intact as a direct legacy fallback.

## Claim ceiling

The browser acceptance tested the committed production files through a real Chromium browser served from the GitHub Actions runner. It did not independently verify GitHub Pages CDN propagation from this ChatGPT environment, because the external checker could not reach the Pages URLs directly.

**Promotion verdict: SUPER-14 / PFLAB-14 pair = PASS and PROMOTED.**
