---
title: "Books"
date: 2024-01-01
draft: false
description: "Section that renames its own URL via front matter, to exercise breadcrumb ancestor links."
url: /books/
---

This section demonstrates a Hugo section that renames its own URL via the `url` front matter
field. The content still lives under `content/book/`, but this list page renders at `/books/`.

Breadcrumbs on pages inside this section must link back to `/books/`, not to `/book`
(the raw content-folder path), since `/book` is not a page that exists on this site.
