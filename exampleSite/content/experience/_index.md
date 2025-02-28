---
title: Experience
button1_text: Linkedin
---

This is where you can highlight a bit over your experience. Years of total experience, specialization, etc.

The content in this intro comes from the `content/experience/_index.md` file.
These kind of content, the "index pages", are called "branch bundles". You can read more about [**sections and bundles** in Hugo's docs](https://gohugo.io/content-management/sections/#template-selection).

The content for each experience item (that you can click on the left) is defined in the `content/experience` folder, with one content item per experience, as in `job-1.md`, `job-2.md`, etc.

The content (text and URL) for the buttons below (where you can add links) comes from two different files, depending on where you see this content:
1. in the "experience" page (`/experience`): this is passed from the content file, in `/content/experience/_index.md`
2. in the home page (or another page), using shortcodes.

In both cases, the arguments that can be passed are:
- button1: 
    - button1_text
    - button1_ url
    - button1_icon