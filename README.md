# RegioMart Web Experiment Prototype

This is a one-link static web prototype for Team 5's experiment.

## What it includes
- Welcome + consent
- Control-variable questions
- Random assignment to Condition A/B/C
- Condition A: Excel/table view
- Condition B: Static dashboard view
- Condition C: Guided dashboard with limited tabs
- Five decision-making tasks
- Cognitive-load questions
- Manipulation check
- Result preview + CSV download

## How to run locally
Open `index.html` in a browser.

For testing a specific condition, use:
- `index.html?condition=A`
- `index.html?condition=B`
- `index.html?condition=C`

## Important limitation
This static prototype does not automatically collect responses from participants online.
For real data collection, either:
1. implement the same flow in SoSci Survey, or
2. connect this web app to a backend/database/form service.

For class presentation, this prototype is useful as a live demo invitation link.

## Hosting
Upload the full folder to Netlify, Vercel, or GitHub Pages.
The main file is `index.html`.
