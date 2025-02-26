---
title: 'Theme shortcodes'
date: 2025-02-14T14:38:33+02:00
draft: false
type: 'blog'
tags: 
  - adritian
  - guide
---

Shortcodes are a convenient [functionality of Hugo](https://gohugo.io/content-management/shortcodes/), allowing you to embed templates or layouts within other content.

Some of the example built-in shortcodes are Instagram posts, YouTube videos, QR codes, etc. You can find [the full list in the official docs](https://gohugo.io/content-management/shortcodes/#embedded).

The theme provides custom shortcodes to allow you to customize your landing page as you want:

- `education-list`: Displays a list of educational qualifications.
- `experience-list`: Shows a list of professional experiences.
- `platform-links`: Embeds links to various platforms with icons.
- `newsletter-section`: Adds a section for newsletter subscription.
- `link`: Creates a hyperlink with an icon.
- `experience-section`: Inserts a detailed experience section.
- `contact-section`: Adds a contact information section, with a customizable form and information.
- `client-and-work-section`: Displays a section for clients and work.
- `about-section`: About section, with image, buttons for call to action and image.
- `testimonial-section`: Adds references from customers, colleagues, etc.

The shortcodes can be customized with different arguments:

- `education-list`:
  - `title`: The title of the education section.
  - `items`: A list of educational qualifications.

- `experience-list`:
  - `title`: The title of the experience section.
  - `items`: A list of professional experiences.

- `platform-links`:
  - `platforms`: A list of platforms with their respective links and icons.

- `newsletter-section`:
  - `title`: The title of the newsletter section.
  - `description`: A short description for the newsletter section.
  - `button_text`: The text for the subscription button.

- `link`:
  - `url`: The URL for the hyperlink.
  - `icon`: The icon to display with the link.
  - `text`: The text for the link.

- `experience-section`:
  - `title`: The title of the experience section.
  - `experiences`: A detailed list of experiences.

- `contact-section`:
  - `title`: The title of the contact section.
  - `form`: Configuration for the contact form.
  - `info`: Contact information details.

- `client-and-work-section`:
  - `title`: The title of the client and work section.
  - `clients`: A list of clients.
  - `works`: A list of works.

- `about-section`:
  - `title`: The title of the about section.
  - `image`: The image to display.
  - `buttons`: Call to action buttons.

- `testimonial-section`:
  - `title`: The title of the testimonial section.
  - `testimonials`: A list of testimonials.

You can see them in effect in:
- [the homepage](/) [`(see source)`](https://raw.githubusercontent.com/zetxek/adritian-demo/refs/heads/main/content/home.md).
- [the CV page](/cv) [`(see source)`](https://raw.githubusercontent.com/zetxek/adritian-demo/refs/heads/main/content/cv.md).
