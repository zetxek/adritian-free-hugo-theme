---
title: 'New Theme Features Demo'
date: 2025-02-20T10:00:00+00:00
draft: false
type: 'blog'
toc: true
tocSticky: true
tags: 
  - adritian
  - guide
  - advanced
description: 'Discover the new features added to the Adritian theme including related posts, social sharing, table of contents, and comments support.'
---

This post demonstrates the new features that have been added to the Adritian Hugo theme to make it more feature-complete and competitive with other popular Hugo themes.

## Overview of New Features

The Adritian theme now includes several enhancements that are commonly found in modern Hugo themes for personal websites and portfolios.

### Related Posts

At the end of each blog post, you'll now see a section showing related posts based on shared tags and publish dates. This helps visitors discover more relevant content on your site.

### Social Sharing Buttons

Share your content easily on social media platforms! The theme now includes built-in sharing buttons for:

- Twitter/X
- LinkedIn
- Facebook
- Email

These buttons are automatically styled to match the theme's design and work seamlessly in both light and dark modes.

## Table of Contents

This post has a table of contents enabled using the `toc: true` frontmatter parameter. The TOC helps readers navigate longer articles and can be made sticky on larger screens with `tocSticky: true`.

### How to Enable TOC

Simply add these parameters to your post's frontmatter:

```yaml
---
toc: true
tocSticky: true  # optional, makes TOC sticky on desktop
---
```

The table of contents automatically generates from your post headings and only appears when the post has more than 400 words.

## Enhanced Reading Experience

### Reading Time Display

Posts now show an estimated reading time alongside the word count, helping readers know how long an article will take to read.

### Last Modified Date

If you update your post's frontmatter with a `lastmod` date, it will be displayed in the post metadata, showing readers when the content was last updated.

## Comments Integration

The theme now supports popular comment systems:

- **Disqus** - Traditional comment system
- **Giscus** - GitHub Discussions-powered comments
- **Utterances** - GitHub Issues-powered comments

### Configuring Comments

Add this to your `hugo.toml` to enable comments:

```toml
[params.comments]
  enabled = true
  provider = "giscus"  # or "disqus" or "utterances"
  
  [params.comments.giscus]
    repo = "username/repo"
    repoId = "your-repo-id"
    category = "General"
    categoryId = "your-category-id"
```

## Social Sharing Configuration

Social sharing is enabled by default, but you can customize which platforms appear:

```toml
[params.sharing]
  enabled = true
  twitter = true
  linkedin = true
  facebook = true
  email = true
```

## Improved Taxonomy Support

The theme's tag and category displays have been enhanced with better styling and support for both light and dark modes.

## Multilingual Support

All new features include translations for:

- English (en)
- Spanish (es)
- French (fr)

You can easily add more languages by creating corresponding translation files in the `i18n/` directory.

## Conclusion

These new features make the Adritian theme more competitive with other popular Hugo themes while maintaining its focus on performance, accessibility, and clean design.

Try out the features by checking the related posts below, sharing this article, or exploring the table of contents!
