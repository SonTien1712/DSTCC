---
name: retheme-swiss
description: >-
  Rethemes the DSTCC static website to Minimalism & Swiss Style using the
  ui-ux-pro-max skill, updating semantic CSS tokens in assets/css/tokens.css
  and stylesheets incrementally while preserving structure, JS behavior, and
  build verification. Use when the user asks to retheme, restyle, or apply
  Minimalism & Swiss Style to the project.
---

# Retheme DSTCC to Minimalism & Swiss Style

Use the `ui-ux-pro-max` skill (`.agent/skills/ui-ux-pro-max/SKILL.md`) to retheme the existing **DSTCC static website** (`dstcc-static-website`).

- **Target style:** Minimalism & Swiss Style
- **Core constraint:** Keep the existing HTML fragment structure, JS behavior, DOM hooks, SEO/canonical metadata, and business logic intact. Do **not** edit generated HTML files directly—edit `src/pages/`, `templates/`, `assets/css/`, and `js/`, then rebuild with `npm run build`.

---

## Step 1: Query `ui-ux-pro-max` for Minimalism & Swiss Style

Before modifying styles, consult `.agent/skills/ui-ux-pro-max/SKILL.md` and run its search script for Swiss/Minimalist design guidance:

```powershell
python .agent/skills/ui-ux-pro-max/scripts/search.py "engineering corporate minimalism swiss style" --design-system -p "DSTCC"
python .agent/skills/ui-ux-pro-max/scripts/search.py "Minimalism Swiss Style" --domain style
python .agent/skills/ui-ux-pro-max/scripts/search.py "swiss grid accessibility contrast" --domain ux
```

(Use `--stack html-tailwind` only as general HTML/CSS inspiration; this project uses Bootstrap CSS + custom CSS layers without Tailwind.)

---

## Step 2: Inspect Architecture, Styles, and Existing Theme Tokens

Inspect the project before making changes:

1. **Build & Config:** `package.json`, `scripts/build.mjs`, `data/pages.json`, `data/site.json`
2. **Templates & Fragments:** `templates/header.html`, `templates/footer.html`, `src/pages/**/*.html`
3. **JavaScript & Behavior Hooks:** `js/main.js`, `js/form.js`, `js/las-xd.js`, `js/projects.js`, `js/news.js` (preserve IDs, classes, `aria-*` attributes, and data attributes used by scripts)
4. **Stylesheet Cascade & Tokens:**
   - `assets/vendor/bootstrap/bootstrap.min.css` (do not edit vendor files)
   - `assets/css/tokens.css` (primary `:root` design tokens and base typography/resets)
   - `assets/css/layout.css`, `assets/css/components.css`, `assets/css/sections.css`, `assets/css/about.css`, `assets/css/las-xd.css`, `assets/css/mobile.css`
   - `assets/css/site.css` (final shared layer loaded last)

Document the current tokens (colors, typography, spacing, radii, shadows, transitions, focus styles) and identify hard-coded values across stylesheets and templates.

---

## Step 3: Update Semantic Tokens & Replace Hard-Coded Styles Incrementally

1. **Reuse and update existing semantic tokens** in `assets/css/tokens.css` (and shared aliases in `assets/css/site.css`) for:
   - Colors (surface, background, text, border, brand primary/accent, muted/subtle, semantic feedback)
   - Typography (font families, scale, weights, line-heights, letter-spacing)
   - Spacing and grid rhythm
   - Radii (sharp/minimal Swiss geometry)
   - Shadows / elevation (minimal or border-driven)
   - Interaction & focus states (`:hover`, `:focus-visible`, `:active`, disabled)
2. **Add missing tokens to `:root`** rather than creating a parallel theme system or duplicate variables.
3. **Replace hard-coded styles one stylesheet / section / template at a time** (e.g., `tokens.css` -> `layout.css` -> `components.css` -> `sections.css` -> `about.css` -> `las-xd.css` -> `mobile.css` -> `site.css`, plus any inline styles in `templates/` or `src/pages/`).
4. **Preserve progressive enhancement:** Ensure content remains readable before JS runs (`html:not(.js)` rules in `site.css`).

---

## Step 4: Build & Verify

After edits, rebuild and run the project verification suite:

```powershell
npm run verify
```

(`npm run verify` runs `npm run build && npm run check && npm test`.)

Also verify manually or via browser/preview (`npm start`):
- **Color contrast:** Text, links, buttons, badges, nav items, and form feedback meet WCAG AA contrast.
- **Keyboard focus:** Visible `:focus-visible` outlines on links, buttons, skip link, dropdown toggles, footer toggles, search input/clear button, and form controls.
- **Responsive layouts:** Mobile, tablet, and desktop breakpoints (no horizontal overflow, readable hierarchy, clean Swiss grid alignment).
- **Color modes:** Verify default light theme and any supported dark mode or `prefers-color-scheme` rules if present/added.

---

## Step 5: Summarize Results

In the final summary, report:
1. All changed files (tokens, CSS layers, templates/pages, and rebuilt outputs).
2. Semantic tokens updated or added in `assets/css/tokens.css` / `assets/css/site.css`.
3. Output of `npm run verify` and manual/visual verification findings (contrast, keyboard focus, responsiveness, light/dark modes).
4. Any remaining hard-coded styles (e.g., inside vendor CSS, PDF viewer, or specific fragments) and why they remain.

