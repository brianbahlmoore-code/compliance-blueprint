# AGENTS.md — Coding Agent Instructions

This file provides context for AI coding agents (OpenAI Codex, Claude, etc.) working on this repository.

---

## Project Summary

**Compliance Blueprint** is a single-page portfolio website showcasing compliance program management tools, AI automation agents, and Claude skills. It is a **zero-dependency static site** — no build step, no npm, no framework.

---

## Architecture

### File Roles

| File | Role |
|------|------|
| `index.html` | Main SPA — all sections (Hero, Portfolio, Tools, Agents, Skills, FAQ, Footer) |
| `styles.css` | Complete design system — tokens, layout, components, animations, responsive rules |
| `app.js` | All JavaScript — scroll-driven video, IntersectionObserver reveals, accordion, agent demo |
| `demo-data.json` | Pre-baked replay data for the SOC 2 agent demo (no backend) |
| `SOC2_Unified_Report.html` | Static HTML report opened by the agent demo |
| `fortress_scroll.mp4` | Hero background video (scroll-driven, not autoplay) |

### Key Patterns

1. **No Build Step:** Edit HTML/CSS/JS directly. No transpilation, bundling, or framework CLI.
2. **CSS Custom Properties:** The design system is token-driven via CSS variables in `:root`. Always use existing tokens rather than hardcoding colors.
3. **Scroll-Driven Video:** The hero video (`fortress_scroll.mp4`) is driven by `window.scrollY` mapped to `video.currentTime`. The scroll track is `300vh` tall.
4. **IntersectionObserver Reveals:** Elements with class `.reveal` are observed and receive `.is-visible` when they enter the viewport.
5. **Pre-Baked Agent Demo:** The demo replays `demo-data.json` steps with typed animations. No API calls are made. To update demo content, edit `demo-data.json`.
6. **Iframe Embed:** The Compliance Program Manager tool is an iframe pointing to `brianbahlmoore-code.github.io/SOC2-GRC-AWS-Tracker/`. It lives in a separate repo.

---

## Design System

### Color Palette (Warm Monochrome)
- Background: `#FAF9F6` (warm white)
- Text: `#2C2A25` (warm black)
- Muted: `#6B6861` (secondary text)
- Border: `#E8E6E1` (subtle dividers)
- Pastel accents: green `#E8F5E8`, blue `#E8F0FA`, red `#FDEAEA`, yellow `#FFF8E1`

### Typography
- **Headings:** `'Playfair Display', serif`
- **Body:** `'Inter', sans-serif`
- **Code/Meta:** `'JetBrains Mono', monospace`

### Component Naming
- `.portfolio-card` — top-level pillar cards
- `.agent-card` — AI agent cards (`.agent-card-live` for live agents)
- `.skill-card` — Claude skill cards
- `.accordion-item` — FAQ items (`.active` toggles open)
- `.demo-panel` — Agent demo panel (`.demo-panel-open` toggles visibility)
- `.faux-os-window` — macOS-style window chrome for iframes

---

## Coding Conventions

1. **Vanilla JS only.** No jQuery, no frameworks. Use `document.querySelector`, `addEventListener`, etc.
2. **No inline styles** unless absolutely necessary. All styling goes in `styles.css`.
3. **Semantic HTML5.** Use `<section>`, `<nav>`, `<footer>`, `<article>` appropriately.
4. **BEM-like naming** for CSS classes (e.g., `.demo-panel-header`, `.agent-card-footer`).
5. **Mobile-first responsive.** Media queries at `768px` and `480px` breakpoints.
6. **Preserve existing comments.** All section comments in HTML/CSS/JS are intentional landmarks.

---

## Deployment

- **Platform:** GitHub Pages
- **Branch:** `master` (auto-deploy)
- **URL:** `https://brianbahlmoore-code.github.io/compliance-blueprint/`
- **No CI/CD pipeline** — pushes to `master` deploy directly.

---

## Common Tasks

### Add a new section
1. Add HTML section in `index.html` between existing sections
2. Add styles in `styles.css` following existing patterns
3. Add `.reveal` class for scroll animation
4. Add nav link in `.nav-links`

### Update the agent demo
1. Edit `demo-data.json` — modify `replaySteps` array or `summaryData`
2. Replace `SOC2_Unified_Report.html` if report content changes
3. No code changes needed in `app.js` unless adding new UI elements

### Add a new AI agent card
1. Copy an existing `.agent-card` block in `index.html`
2. Update icon, title, description, and status pill
3. For a live agent, add class `.agent-card-live`

### Modify the design system
1. Update CSS custom properties in `:root` within `styles.css`
2. Changes propagate automatically to all components using those tokens
