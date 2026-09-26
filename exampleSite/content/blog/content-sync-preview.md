---
title: 'Cross-Repo Content Sync: Preview Your Changes Before They Merge'
date: 2026-04-29T10:00:00+00:00
draft: false
type: 'blog'
tags:
  - adritian
  - ci-cd
  - workflows
description: 'How the Adritian theme automatically syncs exampleSite content to the demo repo when a PR is opened, so every change gets a live preview.'
---

When contributing content changes to the Adritian theme — a new blog post, updated homepage copy, or a new shortcode example — you can now see exactly how it will look on the live demo site **before the PR is merged**.

## What Changed

Previously, when a PR was opened against the theme repository, the CI workflow would update the demo site's `go.mod` to point to the PR branch. This meant you could preview **theme code changes** (layout tweaks, CSS updates, new partials) on the Vercel preview URL, but **content changes** from `exampleSite` would not be reflected.

If you added a new blog post to `exampleSite/content/blog/`, it simply wouldn't appear in the demo preview.

Now, both the internal PR workflow and the external PR workflow (for fork contributions) sync the full `exampleSite` content to the demo repository.

## What Gets Synced

When you open a PR, the following files and directories from `exampleSite` are copied to the demo repo:

| Path | Purpose |
|-----------|---------|
| `content/` | Blog posts, pages, portfolio items, testimonials |
| `assets/` | Images and resources referenced by shortcodes |
| `data/` | Data files used by content |
| `static/` | Static files served directly |
| `i18n/` | Translation override files |
| `hugo.toml` | Site configuration (URL adjusted to the preview domain) |

The sync uses `rsync -a --delete` so that **removals** are also reflected — if you delete content in your PR, it will be removed from the preview too.

## How It Works

### Internal PRs

For PRs from branches in the main repository, the `Preview demo site` workflow runs automatically. It:

1. Checks out both the theme repo (at the PR branch) and the demo repo
2. Updates the demo's `go.mod` to reference the PR branch
3. Syncs all `exampleSite` content directories
4. Creates a preview PR in the demo repo
5. Vercel deploys the PR and provides a preview URL

### External PRs (Forks)

For PRs from forks, the `PR demo site (on external PR)` workflow runs when the `safe to test` label is added. It follows the same content sync process, using `pull_request_target` to securely access the demo repo token.

## Why This Matters

This closes a gap that made it hard to review content changes. Before this feature, a reviewer would have to:

1. Check out the PR branch locally
2. Run Hugo locally
3. Browse the content manually

Now, the reviewer just clicks the Vercel preview URL from the demo repo PR and sees exactly what the content will look like.

## Try It Out

If you're contributing to the theme, add some content to `exampleSite/` in your PR and check the preview URL. You'll see your changes live, along with the theme updates.

This post itself was added as a test to verify the sync works. If you're reading this on the demo site, **it worked!**
