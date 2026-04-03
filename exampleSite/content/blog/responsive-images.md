---
title: 'Responsive Images'
date: 2025-03-15T10:00:00+00:00
draft: false
type: 'blog'
tags:
  - adritian
  - guide
  - images
description: 'Learn how to use the responsive-image shortcode to serve optimized, responsive images with WebP srcset and lazy loading.'
---

The Adritian theme includes a `responsive-image` shortcode that generates optimized `<picture>` elements with WebP conversion, multiple srcset widths, and lazy loading.

### Basic usage

Place your images in the `assets/` directory and reference them with the shortcode:

{{< responsive-image src="images/experience/internet-affairs.png" alt="Sample responsive image" >}}

The shortcode above produces a `<picture>` element with:

- **WebP srcset** at 400w, 800w, and 1200w (up to the original image width)
- **Original format srcset** at the same widths
- **Lazy loading** via `loading="lazy"` and `decoding="async"`
- **CLS prevention** via `width` and `height` attributes

### Custom sizes hint

Use the `sizes` parameter to give the browser a layout hint for which srcset entry to pick:

{{< responsive-image src="images/works/carlos-muza-hpjSkU2UYSU-unsplash.jpg" alt="Dashboard analytics" sizes="(max-width: 768px) 100vw, 600px" >}}

### Adding CSS classes

Use the `class` parameter to style the image:

{{< responsive-image src="images/works/radity-finance.jpg" alt="Radity Finance project" class="rounded shadow" sizes="(max-width: 768px) 100vw, 600px" >}}

### Static and external images

Images in `static/` or external URLs fall back to a plain `<img>` with lazy loading (no srcset processing):

```markdown
{{</* responsive-image src="/img/blog/my-photo.jpg" alt="Static image" */>}}
```

### Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `src` | Image path relative to `assets/`, page-bundle resource, or static/external URL | required |
| `alt` | Alt text | `""` |
| `class` | CSS class(es) for the `<img>` element | -- |
| `sizes` | The `sizes` attribute for the browser layout hint | `"100vw"` |

For best results, place images in `assets/` (e.g. `assets/images/blog/`) so Hugo Pipes can generate optimized variants.
