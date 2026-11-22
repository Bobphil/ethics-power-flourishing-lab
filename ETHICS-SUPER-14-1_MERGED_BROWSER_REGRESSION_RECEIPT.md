# ETHICS-SUPER-14-1 — Fresh Merged Browser Regression Receipt

**Status: PASS**

## Scope

Fresh browser regression against the newly installed merged production files:

- `Bobphil/ethics-super-final/ETHICS-SUPER-14-1.html`
- `Bobphil/ethics-super-final/ETHICS-PB-URL-BIND-1_MANIFEST.json`
- canonical PFLAB target `ETHICS-PFLAB-14-1.html`

Final GitHub Actions browser run: `45081136009`  
Conclusion: **success**

## Explicit merged-SUPER checks

- 14-chapter SUPER loads.
- CH01 student-facing title = **What Do You Actually Know?**
- CH01 case = **Nail Through the Boot**.
- CH01 explanation layer renders.
- CH01 rendered 15 help panels in the tested workbook view.
- Explanation content includes **Explain this question** instructional panels.
- CH13 Module Route opens the verified Pressbooks chapter:
  `https://pressbooks.pub/ethicalhistory/chapter/when-is-a-choice-still-yours/`
- CH14 Module Route opens the verified Pressbooks chapter:
  `https://pressbooks.pub/ethicalhistory/chapter/where-does-a-mind-begin-and-who-decides/`
- CH14 shows the canonical PFLAB-14 URL.
- No stale PFLAB-2 wording remains after the micro-patch.

## SUPER → PFLAB current path

- 14/14 Output Cards READY.
- Tool Record 14/14.
- Lab launch enabled.
- Exported handoff source = `ETHICS-SUPER-14-1`.
- Exported handoff ready = true.
- 14 Tool Record entries.
- 14 Output Cards.
- CH13 and CH14 handoff records present.
- PFLAB imports as `CURRENT_14`.
- CH13 and CH14 selectable.
- PFLAB self-test PASS.

## Legacy path

- REDO-1 legacy handoff imports as `LEGACY_12`.
- Lab unlocks in compatibility mode.
- CH13 and CH14 remain disabled because no legacy records exist.
- No CH13/CH14 student records are synthesized.

## Micro-patch during regression

The merged SUPER correctly bound PFLAB-14 but retained stale visible labels saying `PFLAB-2`. Those labels were changed to `PFLAB-14-1` and the full browser regression was rerun successfully.

Final SUPER label-cleanup commits:
- `ec2e4b78fcef926b52a49f14cc1419bea07a6c72`
- `59a890af788108ce632b2cea9647a678e349d26f`

## Freeze verdict

> **ETHICS-SUPER-14-1 merged production build — FRESH BROWSER REGRESSION PASS**
>
> CH1 corrections/help — PASS  
> CH13 Module Route — PASS  
> CH14 Module Route — PASS  
> SUPER-14 → PFLAB-14 handoff — PASS  
> Legacy 12-tool compatibility — PASS  
> Visible PFLAB labeling — PASS
