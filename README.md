# FP&A Roadmap Tracker

A 36-week FP&A / Finance Data career roadmap you can actually track — as a website.

The roadmap (phases 0–7, 26 steps, 18 portfolio outputs, exact week-by-week sequence) lives in one data file (`js/data.js`). Progress is computed, never hand-typed: mark a step Completed and the dashboard, week grid, project tracker, and percentages all update.

## What it answers in seconds

- Where am I in the roadmap? (current week, current phase, overall %)
- What do I work on this week? (next task, week view, deliverables)
- How much is done? (steps completed, projects completed)
- Which projects are finished, and where are their files/links?

## The roadmap itself

| Weeks | Focus | Phase |
|---|---|---|
| 1 | Baseline (skill audit, portfolio setup) | Phase 0 |
| 2 | Financial statement analysis | Phase 1 — Finance + FP&A Core |
| 3–4 | Budget vs actual | Phase 1 |
| 5–6 | Forecasting | Phase 1 |
| 7–9 | 3-statement financial model | Phase 1 |
| 10–11 | SQL for finance | Phase 2 — Data + Reporting |
| 12–13 | Finance dashboard (Power BI / Tableau) | Phase 2 |
| 14–15 | Automated reporting (Power Query, pandas) | Phase 2 |
| 16–17 | Management communication | Phase 2 |
| 18 | Capital budgeting (NPV, IRR) | Phase 3 — Corporate Finance |
| 19–20 | Valuation (DCF) | Phase 3 |
| 21 | Working capital + 13-week cash forecast | Phase 3 |
| 22–23 | Monthly FP&A pack | Phase 3 |
| 24–25 | AI-assisted finance workflow | Phase 4 — AI + Advanced Analytics |
| 26–27 | Forecasting + ML comparison | Phase 4 |
| 28 | Anomaly detection | Phase 4 |
| 29 | Finance automation architecture | Phase 4 |
| 30 | Business model + driver analysis | Phase 5 — Business Fluency |
| 31 | Strategy + finance case | Phase 5 |
| 32 | Cross-functional communication | Phase 5 |
| 33–35 | AI-augmented FP&A capstone | Phase 6 — Capstone |
| 36 | Portfolio, resume, interviews, job pipeline | Phase 7 — Career Preparation |

Every step carries its goal, what to learn, what to practice, the deliverable, and a completion test ("you can explain X without reading the numbers") — so you always know whether a step is really done, not just marked done.

## The website

No framework, no build step, no server. One HTML shell plus small CSS/JS modules:

- **Position panel** — overall progress, current week, current phase, steps done, projects done, next task.
- **36-week ledger** — the whole programme as one grid; the current week is ringed in red, completed weeks carry a red ✕. Click any week to jump to its steps.
- **Step register** — all 26 steps with goal → deliverable, learn/practice detail, status (Not Started / In Progress / Completed), and free-form notes per step.
- **Portfolio outputs** — the 18 projects with status, start/target/completion dates, progress, and a link field (GitHub repo, dashboard, etc.).
- **Weekly view** — every week with its focus, steps, and deliverable.
- **Start date control** — set when Week 1 begins; current week and phase derive from it.
- **Export / Import** — download your progress as JSON, load it on another device or browser.
- **Reset** — clears everything back to a clean slate.

Progress saves in your browser's localStorage, per device. Two people can use the same hosted site and keep independent progress.

## Customize the roadmap

Everything lives in `js/data.js` — phases (`RM`), `WEEKS`, `STEPS` (goal / learn / practice / output / completion test), and `PROJECTS`. Edit that one file; the whole site follows.

To use it for a different programme entirely (say, a data-engineering roadmap): replace the steps and weeks in `js/data.js` — the tracker mechanics (progress math, week derivation, status sync, export/import) are generic.

## Files

```
fpa_roadmap/
├── index.html            # HTML shell: markup + css/js includes
├── css/
│   ├── tokens.css        # design tokens, reset — retheme here
│   ├── layout.css        # shell, masthead, buttons, section heads, footer
│   ├── dashboard.css     # position panel, trackbar, 36-week strip
│   ├── register.css      # step register + projects table
│   ├── weekly.css        # weekly view cells
│   ├── components.css    # dialogs, toast
│   └── responsive.css    # breakpoints (keep last in the cascade)
├── js/
│   ├── data.js           # RM, WEEKS, STEPS, PROJECTS — edit content here only
│   ├── state.js          # localStorage load/save/seed
│   ├── derive.js         # currentWeek, stepByWeek, fmtDate
│   ├── ui.js             # $ helper, toast
│   ├── render.js         # one renderX() per section + renderAll()
│   └── app.js            # toolbar/dialog wiring + boot
└── README.md
```

Script load order matters: `data → state → derive → ui → render → app` (each file uses things defined above it).

## Notes

- First run: the site asks for your start date (Week 1 begins then). Steps 3–6 and their four projects are pre-marked Completed as a starting example — clear them with Reset if starting fresh.
- Progress lives in the browser. Export JSON before switching browsers or clearing site data.
- No accounts, no server, no data leaves your machine.
