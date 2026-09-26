# Color Scheme Screenshots & Theme Preview Strategy

**Date:** 2026-04-29
**Branch:** `feat/color-schemes`
**Status:** Awaiting user review before implementation

## Problem

The theme ships with 7 color schemes and dark/light mode, but this is invisible in
the places where prospective users discover the theme:

- The Hugo Themes preview (`images/screenshot.png`) shows a single light-mode hero
  in one scheme — no hint that customization or other schemes exist.
- The README's "Live demo & Preview" section shows light/dark of the same default
  scheme. Same gap.
- The README's `#### Color schemes` section describes the 7 schemes in a table but
  has no visual proof and no link to a showcase.
- An existing demo blog post (`exampleSite/content/blog/color-schemes.md`)
  references 7 screenshots at `/img/blog/color-scheme-<name>.png`. Those PNGs
  exist (April 25) but show the **blog list page**, **light mode only** — a weak
  showcase of the schemes themselves.

We want every surface (Hugo Themes, GitHub README top, README schemes section,
demo blog post, demo site) to convey the variety of schemes at the right depth
for that audience.

## Decisions (from brainstorming)

| # | Choice | Decided |
|---|--------|---------|
| 1 | Subject of the per-scheme shots | Homepage hero (above the fold) |
| 2 | Modes captured | Light + dark for each scheme |
| 3 | Capture method | Playwright script driving the live switcher |
| 4 | Layout in the blog post | 7 side-by-side light/dark composites (not 14 separate) |
| 5 | Hero strategy for theme preview | Triptych — three schemes side-by-side (Ocean / Default / Warm) |

## Architecture

### Capture pipeline

```
scripts/capture-color-schemes.ts
        │
        ▼
[ Playwright ] ──► boots Hugo example site (port 1313, reuses existing webServer
        │           command from playwright.config.ts)
        │
        ▼
For each scheme × {light, dark}:
   - localStorage.setItem('colorScheme', name)
   - document.documentElement.setAttribute('data-bs-theme', mode)
   - wait for scheme override CSS load + networkidle
   - take viewport screenshot at 1280×800
   - write to exampleSite/static/img/blog/raw/color-scheme-<name>-<mode>.png
        │
        ▼
[ sharp compositor ] ──► For each scheme:
        │                  joins light + dark with 16px gutter
        │                  writes color-scheme-<name>.png (overwrites existing)
        │
        ▼
[ triptych compositor ] ──► takes ocean-light + default-light + warm-light,
        │                     joins horizontally → images/screenshot.png
        │                   takes ocean-dark + default-dark + warm-dark,
        │                     joins horizontally → images/screenshot-dark.png
        ▼
14 raw PNGs (gitignored) + 7 composites + 2 triptychs (committed)
```

### Files created

| Path | Purpose | Git |
|------|---------|-----|
| `scripts/capture-color-schemes.ts` | Playwright capture + sharp compositor | ✅ commit |
| `exampleSite/static/img/blog/raw/color-scheme-<name>-<mode>.png` (14) | Raw shots, build artifacts | ❌ gitignore |
| `exampleSite/static/img/blog/color-scheme-<name>.png` (7) | Light+dark composites — overwrites existing files | ✅ commit |
| `images/screenshot.png` | Light triptych — overwrites existing | ✅ commit |
| `images/screenshot-dark.png` | New dark triptych | ✅ commit |
| `docs/superpowers/specs/2026-04-29-color-scheme-screenshots-design.md` | This spec | ✅ commit |

### Files modified

| Path | Change |
|------|--------|
| `package.json` | Add `sharp` to `devDependencies`; add `screenshots:colors` npm script |
| `.gitignore` | Add `exampleSite/static/img/blog/raw/` |
| `exampleSite/content/blog/color-schemes.md` | Update alt text on the 7 image references; add one-paragraph intro about side-by-side view |
| `README.md` | (a) Replace `screenshot-light-fullscroll.jpeg`/`screenshot-dark-fullscroll.jpeg` URLs in the Live demo & Preview table with the two new triptychs; (b) update the table caption to mention "three of the seven built-in color schemes shown"; (c) in the `#### Color schemes` section, add a callout linking to the demo blog post |

## Component details

### `scripts/capture-color-schemes.ts`

- Runs as a Node script via `tsx` (already a transitive dep through Playwright)
  or compiled via Playwright's test runner. Easier path: write it as a Playwright
  spec file under `tests/scripts/` so it inherits the `webServer`. Actual
  decision: standalone script using `playwright` (not `@playwright/test`) so it
  doesn't pollute test runs.
- Reads scheme list from `data/colorSchemes.yaml` so it stays in sync if a scheme
  is added/removed.
- Skips `prefers-reduced-motion` animations via `page.emulateMedia({ reducedMotion: 'reduce' })`.
- Hides the cookie banner / scheme switcher dropdown if either is open.
- Idempotent: deletes raw output dir before each run.

### Composite rules

- **Pair composite** (per scheme): `light` left, `dark` right, 16px white gutter,
  1px `#e5e5e5` border around each panel. Final size: 2576×800 (1280+16+1280).
- **Triptych** (hero): three panels of equal width, no gutter, **light** version
  for `screenshot.png` and **dark** version for `screenshot-dark.png`. Selected
  schemes: **Ocean / Default / Warm** — covers cool→neutral→warm to telegraph
  variety without overwhelming. Final size: 3840×800 → downscaled to 1500×312
  for `screenshot.png` to respect Hugo Themes guidance (1500×1000 max).

### Blog post update

The post already structures content per-scheme with a heading, alt-text image,
and a 2-row color table. Only changes:

1. Add one paragraph after the live-switcher callout explaining "below, each
   scheme is shown light + dark side by side".
2. Rewrite alt text per image: `"<Scheme> color scheme — light (left) and dark (right) side by side"`.
3. Keep `featured_image: '/img/blog/color-scheme-ocean.png'` (now a composite).

### README update

Two surgical edits, no restructuring.

**Live demo & Preview** (currently a 2-cell table of the personal-site light/dark
shots): keep the table, swap both `<img src="...">` URLs to the new
`images/screenshot.png` (light triptych) and `images/screenshot-dark.png` (dark
triptych). Update the surrounding sentence to say "shown across three of the
theme's seven built-in color schemes (Ocean, Default, Warm)".

**#### Color schemes section**: directly under the schemes table, add:

> 👉 See all 7 schemes side-by-side (light + dark), with code samples and a live
> switcher demo, in the **[Color schemes blog post](https://adritian-demo.vercel.app/blog/color-schemes/)**.

## Theme preview strategy (the layered "where does each thing live" answer)

| Surface | Image / content | Audience |
|---------|-----------------|----------|
| `images/screenshot.png` (Hugo Themes site main) | Light triptych: Ocean / Default / Warm | Drive-by discoverer scrolling Hugo Themes — sees variety in one glance |
| `images/tn.png` (Hugo Themes thumbnail) | Unchanged | Search results — brand thumb, no need to over-decorate |
| README "Live demo & Preview" table | Light triptych + dark triptych | Visitor landing on GitHub repo |
| README `#### Color schemes` section | Link to blog post | Reader who reaches the deep section and wants the full story |
| Blog post (`color-schemes.md`) | 7 light+dark composites + code + embedded live switcher | Decision-maker considering adoption |
| Demo site itself | Live switcher in header & footer (already shipped) | Anyone evaluating the theme interactively |

## Out of scope

- Updating the personal site (`adrianmoreno.info`) screenshots referenced from
  GitHub user-images. Those are external and stay as-is.
- Generating per-scheme thumbnails for the Hugo Themes thumbnail file.
- Animated previews (GIF/WebP). Considered, rejected — most theme directories
  strip animation; static is more portable.
- Refactoring the blog post structure. Only minimal text edits.
- Updating the existing `images/blog-default.jpeg` / `blog-sidebar.jpeg` shots
  (separate concern).

## Risks & open questions

- **`sharp` install on contributor machines.** It uses prebuilt binaries; should
  Just Work on macOS/Linux/Windows. If a contributor has trouble, the composites
  are committed PNGs — they only need `sharp` if they regenerate.
- **Triptych readability at 1500×312.** Three 500-wide panels of a 1280-wide hero
  means ~2.5× downscale. The hero typography is large enough that it should still
  read; will verify visually before committing.
- **Blog post `featured_image`.** Currently a 1280×~800 single shot; will become
  a 2576×800 composite. Check that the blog list / OG card crops it sensibly. If
  not, fall back to using one of the raw `color-scheme-ocean-light.png` files for
  the featured_image.

## Build sequence

1. Add `sharp` devDep + `screenshots:colors` script in `package.json`. Add raw
   dir to `.gitignore`.
2. Write `scripts/capture-color-schemes.ts`.
3. Run it. Inspect 14 raw shots + 7 composites + 2 triptychs.
4. Verify triptych legibility at 1500-wide. Adjust panel selection or
   downscale ratio if needed.
5. Move triptychs into `images/`, composites into `exampleSite/static/img/blog/`.
6. Edit `exampleSite/content/blog/color-schemes.md` (alt text + intro).
7. Edit `README.md` (Live demo table images + Color schemes section link).
8. Local Hugo serve sanity check: blog post renders, README preview on GitHub
   markdown preview reads sensibly.
9. Commit.

## Success criteria

- A first-time visitor on Hugo Themes sees three different color schemes in the
  preview image without clicking through.
- A README reader sees the same triptych at the top and a link to the blog post
  in the schemes section.
- The blog post shows each scheme as a clean light+dark side-by-side composite,
  no broken images.
- Re-running `npm run screenshots:colors` regenerates everything reproducibly.
