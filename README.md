# Compliance Blueprint

A portfolio of compliance program management tools, AI automation agents, and reusable Claude skills for modern governance frameworks (SOC 2, ISO 27001, ISO 42001, NIST CSF).

**Live site:** [brianbahlmoore-code.github.io/compliance-blueprint](https://brianbahlmoore-code.github.io/compliance-blueprint/)

---

## Overview

Compliance Blueprint is a single-page portfolio that showcases three pillars of modern compliance and project management:

| Pillar | Status | Description |
|--------|--------|-------------|
| **Compliance Program Manager** | ✅ Live | Full-stack GRC tracking tool with Dashboard, Kanban, Gantt, and Control Matrix views. Supports SOC 2, ISO 27001, ISO 42001, and NIST frameworks. Embedded as an iframe from the [SOC2-GRC-AWS-Tracker](https://github.com/brianbahlmoore-code/SOC2-GRC-AWS-Tracker) repo. |
| **AI Agents** | ✅ 1 Live | Automated agents for audit report analysis. The SOC 2 Report Analyzer is live with a pre-baked demo that replays real analysis of GitHub, OneTrust, and Vanta SOC 2 reports. |
| **Claude Skills** | 🔜 Coming Soon | Reusable AI skills for compliance framework assessments, gap analysis, WBS generation, and project planning. |

---

## Tech Stack

This is a **zero-dependency static site** — no build step, no framework, no npm.

- **HTML5** — Semantic markup with SEO meta tags
- **CSS3** — Vanilla CSS with custom properties, glassmorphism, scroll-driven animations
- **JavaScript (ES6+)** — Scroll-driven video hero, IntersectionObserver reveals, accordion, pre-baked agent demo
- **Google Fonts** — Inter, Playfair Display, JetBrains Mono
- **Phosphor Icons** — Icon library via CDN
- **GitHub Pages** — Hosted directly from the `master` branch

---

## Project Structure

```
compliance-blueprint/
├── index.html                 # Main single-page application
├── styles.css                 # Complete design system (32 KB)
├── app.js                     # Scroll-driven video, reveals, accordion, agent demo
├── demo-data.json             # Pre-baked SOC 2 agent demo replay data
├── SOC2_Unified_Report.html   # Generated unified report (opened by the agent demo)
├── fortress_scroll.mp4        # Hero section scroll-driven video background
├── Imagen compliance hologram.jpg  # Hero imagery asset
├── Fortress scroll animation.mp4  # Alternate hero animation asset
├── README.md                  # This file
├── AGENTS.md                  # AI coding agent instructions (Codex, etc.)
└── .gitignore                 # Git ignore rules
```

---

## Running Locally

No build step needed. Simply serve the files with any static server:

```bash
# Python
python -m http.server 8000

# Node.js (npx)
npx serve .

# VS Code
# Use the "Live Server" extension and open index.html
```

Then open `http://localhost:8000` in your browser.

---

## Branches

| Branch | Purpose |
|--------|---------|
| `master` | Production — deployed to GitHub Pages |
| `v2-dev` | Version 2 development branch |
| `v3-dev` | Version 3 development branch |

---

## Key Features

### Scroll-Driven Video Hero
The hero section uses a scroll-driven approach: as the user scrolls through a 300vh tall track, JavaScript maps scroll position to video `currentTime`, creating a cinematic reveal effect.

### Pre-Baked Agent Demo
The SOC 2 Agent demo uses a "static replay" architecture — no backend or API keys needed. Pre-generated analysis results from real SOC 2 reports are stored in `demo-data.json` and replayed with realistic typing animations. The generated unified report (`SOC2_Unified_Report.html`) is a real output from Gemini AI analysis.

### Live Tool Embed
The Compliance Program Manager is embedded as a live iframe from the separate [SOC2-GRC-AWS-Tracker](https://github.com/brianbahlmoore-code/SOC2-GRC-AWS-Tracker) repository, giving visitors a fully interactive experience.

---

## Design System

The site uses an editorial-grade minimalist design:

- **Palette:** Warm monochrome with muted pastels (`#FAF9F6` background, `#2C2A25` text)
- **Typography:** Playfair Display for headings, Inter for body, JetBrains Mono for code/metadata
- **Effects:** Glassmorphism cards, gradient scrims, scroll-driven animations, micro-interactions

---

## Deployment

The site is deployed via **GitHub Pages** from the `master` branch. Any push to `master` automatically updates the live site.

---

## License

This project is a personal portfolio. All rights reserved.

---

## Author

**Brian Bahl Moore** — Compliance Program Manager & AI Automation Specialist

- GitHub: [@brianbahlmoore-code](https://github.com/brianbahlmoore-code)
