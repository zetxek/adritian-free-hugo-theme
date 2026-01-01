---
title: 'Search improvements: multilingual, reliable, and configurable'
date: 2026-01-01T09:00:00+00:00
draft: false
type: 'blog'
tags:
  - search
  - adritian
  - guide
---

The search functionality in the theme is powered by Fuse.js and runs entirely in the browser. This post explains how it works, how the search index is built, and how to customize it for multilingual and subdirectory deployments.

## How search works

Search is client-side:

1. Hugo generates a JSON index (`index.json`) that contains the title, plain content, tags, categories, and other metadata for each page.
2. The search page loads `fuse.js` and downloads the JSON index.
3. Fuse.js performs a fast in-browser search and renders the results.

Because the index is a normal Hugo output, it follows your `baseURL` and language configuration automatically.

## The search page

To enable search, add a content file that uses the `search` layout. Example:

```
---
title: "Search"
layout: "search"
---
```

This page renders a search form and the results container. The form action uses `relLangURL`, so it works for language prefixes and subdirectory deployments.

## Language-aware index URLs

The search results container includes a `data-index-url` attribute. It points to the language-specific `index.json` (for example, `/es/index.json` for Spanish). The search script reads this attribute so it always fetches the correct index for the active language.

If you need to override the index path, you can set the attribute in the template (or in a custom layout) without editing the JavaScript.

## Opt out of search

You can exclude any page from the search index with front matter:

```
search: false
```

The search page itself is excluded from results by default, so queries like "Search" do not return the search page.

## Section and taxonomy data

Each index entry includes:

- `section` and `sectionLabel` (helpful for filtering or grouping)
- `taxonomies` (a map of all taxonomies available on the site)

This makes it easy to build filters or group results by section/taxonomy in a custom UI.

## Troubleshooting

- Ensure `home` outputs include JSON: `home = ["HTML", "RSS", "JSON"]`
- Make sure the search page exists and uses the `search` layout
- If you use multiple languages, confirm each language builds its own `index.json`

If you need a reference implementation, see the demo search page at https://adritian-demo.vercel.app/search/ and this post at https://adritian-demo.vercel.app/blog/search-improvements/.
