# Ethics Power & Flourishing Laboratory

Production repository for the Ethics capstone laboratory.

## Current deployed surface

- `index.html` — root GitHub Pages entry
- `ETHICS-PFLAB-INTEGRATION-1.html` — currently deployed integrated Lab

## Reconciled production contract

- `ETHICS-PFLAB-2.md` — pre-interface reconciliation specification
- `ETHICS-PFLAB-2_CONTRACT.json` — machine-readable production contract
- `ETHICS-PFLAB-2_ACCEPTANCE.mjs` — executable acceptance harness

Run:

```bash
node ETHICS-PFLAB-2_ACCEPTANCE.mjs
```

## Handoff contract

The Lab accepts the `ETHICS-PFLAB-HANDOFF-1` payload exported by `ETHICS-SUPER-FINAL-1` only after all twelve chapter Output Cards are READY.

Student work remains governed by:

`MAP → TRIAGE → SELECT → SEQUENCE → JUDGE → REPAIR → REOPEN`

Power and Flourishing remain organizing questions, not Tools 13 and 14.

## Course boundary

Chapter 12 uses **Maathai / Green Belt Movement + Kijani** as its workbook case.

The PFLAB uses the separate fictional **Pathway Support System / Student-Success-System** transfer case.

## Production gate

**PRESSBOOKS READY + SUPER READY + PFLAB READY = COURSE READY**


## SUPER handoff compatibility

PFLAB-2 accepts both `ETHICS-SUPER-FINAL-1` and `ETHICS-SUPER-REDO-1` as valid `source_build` values during the SUPER migration window. The handoff must still satisfy `ETHICS-PFLAB-HANDOFF-1`, report `ready: true`, contain 12 Tool Record entries, and contain 12 Output Cards.
