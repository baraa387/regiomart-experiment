# RegioMart Decision-Making Experiment

**Team 5 · Academic and Professional Practice · University of Bremen**

A self-contained web prototype for studying how different data presentation formats (Excel table, static dashboard, guided dashboard) affect decision-making speed, accuracy, and cognitive load.

---

## Live prototype

Hosted on GitHub Pages:
```
https://<your-github-username>.github.io/<repo-name>/
```

Force a specific condition for testing:
```
https://<your-github-username>.github.io/<repo-name>/?condition=A   ← Excel table
https://<your-github-username>.github.io/<repo-name>/?condition=B   ← Static dashboard
https://<your-github-username>.github.io/<repo-name>/?condition=C   ← Guided dashboard
```

---

## What participants experience

1. **Welcome + consent** — brief overview, random condition assignment
2. **Background questions** — age, education, work experience, Excel/dashboard/data-analysis experience, colour vision
3. **Instructions** — explains the assigned format
4. **Comprehension check** — must pass before tasks begin
5. **Five decision tasks** — timed, one per page, cannot go back
6. **Cognitive load survey** — 6 items adapted from NASA-TLX
7. **Manipulation check** — perceived format, interactivity (1–7), clarity (1–7)
8. **Results screen** — accuracy score, per-task times, backend submission status, CSV download

---

## Three conditions

| Condition | Format | Interaction |
|-----------|--------|-------------|
| A | Excel-style table | Scroll, search, filter, sort (no formulas) |
| B | Static dashboard | Fixed charts and KPI panels, no interaction |
| C | Guided dashboard | Same charts, organised into three tabs |

All conditions use the identical RegioMart fictional retail dataset (6 stores × 4 categories × 12 months = 288 rows).

---

## Variables collected

### Independent variable
`condition` — A / B / C

### Dependent variables
| Field | Description |
|-------|-------------|
| `q1_correct` – `q5_correct` | 1 = correct, 0 = wrong per question |
| `accuracy_score` | Total correct (0–5) |
| `accuracy_percent` | Percentage correct |
| `time_q1` – `time_q5` | Seconds per question |
| `total_time_seconds` | Sum of all task times |
| `cl_mental_demand` – `cl_confidence` | Cognitive load items (1–7) |

### Control variables
`age`, `education`, `work_experience`, `excel_experience`, `dashboard_experience`, `data_analysis_experience`, `color_vision`

### Manipulation check
`used_condition`, `perceived_interactivity`, `perceived_clarity`

---

## Backend

Responses are submitted automatically to Google Sheets via Google Apps Script.

- **Backend URL:** `https://script.google.com/macros/s/AKfycbyH0YktftWXqg9Tiblvk8y4Kk6UKtlPCF3JCckWarJEZhHrUvND3dYE0yiX_Xs_AnD0/exec`
- **Apps Script source:** `google_apps_script.js` in this repository
- **Fallback:** every participant can download their own result as CSV from the results screen

---

## Files in this repository

| File | Purpose |
|------|---------|
| `index.html` | Main prototype — the only file participants need |
| `google_apps_script.js` | Google Apps Script backend (paste into Apps Script editor) |
| `regiomart_data.csv` | Raw dataset for reference |
| `regiomart_data.xlsx` | Excel version of the dataset |
| `README.md` | This file |

---

## How to upload to GitHub Pages

1. Push this folder to a GitHub repository
2. Go to **Settings → Pages**
3. Source: **Deploy from a branch** → branch: `main` → folder: `/ (root)`
4. Save — GitHub will publish the site within ~60 seconds
5. The live URL will be `https://<username>.github.io/<repo-name>/`

---

## Research hypotheses

| | Hypothesis |
|-|-----------|
| H1 | Guided dashboard → faster decisions than Excel or static dashboard |
| H2 | Guided dashboard → higher accuracy than Excel or static dashboard |
| H3 | Guided dashboard → lower cognitive load than Excel table |
| H4 | Higher perceived clarity → higher decision accuracy |
| H5 | Prior experience (Excel, dashboard, data analysis) moderates performance |

Analysis plan: one-way ANOVA for H1–H3 (three conditions), Tukey HSD post-hoc, Pearson correlation for H4, ANCOVA with experience variables as covariates for H5.
