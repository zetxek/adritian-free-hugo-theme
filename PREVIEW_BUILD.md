# Site Preview Build - PR #437

This document describes the preview build of the Adritian Hugo theme using changes from PR #437.

## Overview

PR #437 adds missing OpenGraph and Twitter Cards template partials that were referenced in `head.html` but not included in the theme, causing build failures in v1.9.1.

## Changes Included

The following template files from PR #437 (branch `copilot/fix-bug-since-v190`) are included in this preview:

1. **`layouts/partials/opengraph.html`** - Open Graph meta tags
   - og:title, og:description, og:image, og:type
   - Article-specific metadata (article:section, article:published_time, article:modified_time, article:tag)
   - Locale and site information

2. **`layouts/partials/twitter_cards.html`** - Twitter Card meta tags
   - twitter:card (summary_large_image or summary)
   - twitter:image, twitter:title, twitter:description
   - twitter:site (from site params)

3. **`layouts/partials/_funcs/get-page-images.html`** - Helper function
   - Extracts images from page params, resources, or site-level fallbacks
   - Supports multiple image sources with fallback chain
   - Handles both internal and external URLs

## Build Instructions

### Prerequisites

- Hugo Extended v0.136+ (v0.147.2 recommended)
- Node.js (for npm dependencies)

### Steps to Build

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the example site:**
   ```bash
   npm run build
   ```

   This will:
   - Generate favicon.ico from source PNG
   - Build the site with Hugo
   - Output to `exampleSite/public/`

3. **Serve locally (optional):**
   ```bash
   npm run serve
   ```
   
   The site will be available at `http://localhost:1313`

## Verification

The built site includes the new OpenGraph and Twitter Cards meta tags in the HTML:

```html
<!-- OpenGraph tags -->
<meta property="og:url" content="...">
<meta property="og:site_name" content="...">
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="...">
<meta property="og:type" content="website"> <!-- or "article" for blog posts -->

<!-- Article-specific tags (for blog posts) -->
<meta property="article:section" content="blog">
<meta property="article:published_time" content="...">

<!-- Twitter Cards -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="...">
<meta name="twitter:title" content="...">
<meta name="twitter:description" content="...">
<meta name="twitter:site" content="@zetxek">
```

## Preview Screenshot

![Site Preview](https://github.com/user-attachments/assets/9c390d87-5fab-443b-92ab-f9082176b5d7)

The preview shows the complete example site with all sections working correctly:
- Showcase section
- About section
- Education section
- Experience section (both card and list layouts)
- Portfolio/Client work section
- Testimonials section
- Contact section
- Newsletter section

## Technical Notes

### ESM Compatibility Fix

The favicon generation script was updated to support ES modules:
- Renamed from `generate-favicon-ico.js` to `generate-favicon-ico.mjs`
- Updated imports to use ES module syntax
- Compatible with `png-to-ico` v3.0.1 which uses ESM exports

### Hugo Module Configuration

The example site uses a local theme replacement in `exampleSite/go.mod`:
```go
replace github.com/zetxek/adritian-free-hugo-theme => ..
```

This allows the preview to use the exact theme version from the PR branch.

## Related Files

- PR #437: https://github.com/zetxek/adritian-free-hugo-theme/pull/437
- Source issue: https://github.com/zetxek/adrianmoreno.info/pull/396
- Build output: `exampleSite/public/`
- Hugo config: `exampleSite/hugo.toml`
