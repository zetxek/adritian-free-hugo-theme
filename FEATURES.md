# New Features Documentation

This document describes the new features added to the Adritian Hugo theme to make it more competitive with other popular Hugo themes.

## Features Overview

### 1. Related Posts

**What it does:** Automatically displays related blog posts at the end of each post based on shared tags and publication dates.

**How to use:** No configuration needed - it works automatically for all blog posts.

**Customization:** The related content algorithm can be adjusted in `hugo.toml` under the `[related]` section.

### 2. Social Sharing Buttons

**What it does:** Adds sharing buttons for Twitter/X, LinkedIn, Facebook, and Email to all blog posts.

**How to use:** Enabled by default. To customize:

```toml
[params.sharing]
  enabled = true        # Set to false to disable
  twitter = true        # Show/hide individual platforms
  linkedin = true
  facebook = true
  email = true
```

### 3. Table of Contents (TOC)

**What it does:** Auto-generates a table of contents from post headings for easy navigation.

**How to use:** Add to post frontmatter:

```yaml
---
toc: true
tocSticky: true  # Optional: makes TOC sticky on desktop
---
```

**Requirements:** Only appears if post has more than 400 words.

### 4. Comments Integration

**What it does:** Supports three popular comment systems: Disqus, Giscus, and Utterances.

**How to use:**

#### Option 1: Disqus
```toml
disqusShortname = "your-shortname"

[params.comments]
  enabled = true
  provider = "disqus"
```

#### Option 2: Giscus (GitHub Discussions)
```toml
[params.comments]
  enabled = true
  provider = "giscus"
  
  [params.comments.giscus]
    repo = "username/repo"
    repoId = "R_xxxxx"
    category = "General"
    categoryId = "DIC_xxxxx"
```

#### Option 3: Utterances (GitHub Issues)
```toml
[params.comments]
  enabled = true
  provider = "utterances"
  
  [params.comments.utterances]
    repo = "username/repo"
    issueTerm = "pathname"
    theme = "preferred-color-scheme"
```

### 5. Enhanced Reading Metadata

**What it does:** Displays additional metadata for blog posts:
- Estimated reading time
- Last modified date (if specified)
- Word count

**How to use:** Automatic for reading time and word count. For last modified:

```yaml
---
title: "My Post"
date: 2025-01-15
lastmod: 2025-02-20  # Add this field
---
```

## Styling

All new features include:
- Full dark mode support
- Responsive design for mobile/tablet/desktop
- Consistent styling with the theme
- Accessibility features (ARIA labels, semantic HTML)

## Translations

All features support the theme's multilingual capabilities with translations for:
- English (en)
- Spanish (es)
- French (fr)
- German (de)
- Dutch (nl)
- Danish (da)
- Italian (it)
- Portuguese (pt)
- Swedish (sv)
- Norwegian (no)
- Polish (pl)

Additional languages can be added by creating translation files in `i18n/`.

## Demo

See all features in action at the demo blog post:
`/blog/new-features-demo/` in the example site.
