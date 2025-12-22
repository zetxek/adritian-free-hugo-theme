# Changelog

This documentation tracks changes across versions, including new features, improvements, and breaking changes.

## v1.8.0

### RTL (Right-to-Left) Language Support

The theme now includes comprehensive RTL (Right-to-Left) language support for Arabic and Hebrew languages.

**New Features:**
- Full RTL styling for all theme components (navigation, forms, tables, breadcrumbs, etc.)
- Automatic RTL direction detection based on language configuration
- Image mirroring support with `rtl-mirror` class for directional images
- `rtl-no-mirror` class to prevent specific images from being mirrored
- RTL-aware styling for code blocks (which remain LTR), blockquotes, testimonials, and skills sections
- Comprehensive E2E test coverage for RTL functionality

**How to use:**

Add RTL languages to your `hugo.toml` configuration:

```toml
[languages.ar]
disabled = false
languageCode = 'ar'
languageDirection = 'rtl'
languageName = 'العربية'

[languages.he]
disabled = false
languageCode = 'he'
languageDirection = 'rtl'
languageName = 'עברית'
```

The theme will automatically apply RTL styling when `languageDirection = 'rtl'` is set. No additional configuration is required.

**Image mirroring:**

- Images with the class `rtl-mirror` will be automatically mirrored in RTL mode (useful for directional images like arrows, hands pointing, etc.)
- Images with the class `rtl-no-mirror` will not be mirrored even in RTL mode
- Showcase profile images are automatically mirrored in RTL mode

**Translation files:**

Arabic and Hebrew translation files are included in the `i18n` folder (`ar.yaml` and `he.yaml`). You can customize these translations as needed.

## v1.7.19

Adding a new page transition effect.
The new effect is applied to all pages, and is triggered when navigating through the site. It can be disabled in the `config.toml` file, under the `params.pageTransition` section.

By default, the effect is enabled.

## v1.7.12

__Introducing 🔎Search__
To be able to use the search functionality, you need to:

1.  add a new `module.mount` in your `hugo.toml` file (in the same place where you reference bootstrap files):

```
  ## Search & sanitization
  [[module.mounts]]
    source = "node_modules/fuse.js/dist/fuse.min.js"
    target = "static/js/fuse.min.js"
  [[module.mounts]]
    source = "node_modules/dompurify/dist/purify.min.js"
    target = "static/js/purify.min.js"
```

2. add the following to your `hugo.toml` file:

```
  home = ["HTML", "RSS", "JSON"]
```
Under the `outputs` area.

3. add a new page to your site, `content/search.md`:

```
---
title: "Search Results"
sitemap:
  priority : 0.1
layout: "search"
---
```

You can now test the search by visiting `/search` in your site. It should load a page [similar to what is displayed in GitHub](https://github.com/zetxek/adritian-free-hugo-theme/pull/272). If that's not the case, please [open a ticket in the theme issue tracker](https://github.com/zetxek/adritian-free-hugo-theme/issues).

## v1.7.8

This version introduces the `footer` content type to customize the content at the bottom of the page, allowing for sections (such as `contact-section` or `newsletter-section`) as well as content. 

A new shortcode (`text-section`) is introduced, to enable nicely wrapped text in some places such as the homepage or the footer.

## v1.7.4

The "home" item in the navigation (footer and header) is managed now in the configuration file (`hugo.toml`), instead of a hardcoded item (which couldn't be hidden).

See the PR [#249 for the content change](https://github.com/zetxek/adritian-free-hugo-theme/pull/249), in case you want to add the home item back (or edit its name/title or translations).

## v1.7.3

The theme has got rid of the `2x` strategy for responsive images. 
They are now generated automatically from the large resolution picture.

This means that the partials using `2x` accept only one image now. There's a new attribute, `scale`, that defines how much larger the high-res image is compared to the smaller one.
See the [PR #244 for more context](https://github.com/zetxek/adritian-free-hugo-theme/pull/244), and the [#198 PR in the demo repo for the content changes only](https://github.com/zetxek/adritian-demo/pull/198). 

## v1.7.0

This version introduces a brand new way of managing pages, and leveraging the existing the styles in different contexts, so they can be used in other pages than the homepage.

The main changes are:

- deprecation of `homepage.yml`. Stopped using some of its values (such as `.Site.Data.homepage.newsletter.enable`, given that the shortcodes can be rendered in any page, not only the home)
- introduction of numerous shortcodes, to replicate the same experience (in any page)

Aside from that:
- "education" comes now from its own content type
- fixed bugs where some buttons couldn't be hidden by not passing content
- deprecated dynamic content in `i18n` files - in favour of storing it in markdown files. For example, your page headings or descriptions won't be stored in these files anymore.

As usual, I have "dog-fed" the theme into my own website first. You can [see the PR showing the change](https://github.com/zetxek/adrianmoreno.info/pull/291) it took to migrate. The most significant file (that you can "copy-paste") is [home.md](https://github.com/zetxek/adrianmoreno.info/pull/291/files#diff-34cdd7812bb042723b4068c4df80283586271078662d619aa33f88e8e62d6fd2
).

You can also find a detailed PR for the demo site with [all the shortcodes in action](https://github.com/zetxek/adritian-demo/pull/182).


Note: I have tried to keep backwards compatibility up to a point. But **I recommend considering migrating your site to shortcodes**, if you want to keep updated with the upstream version. Support for `homepage.yml` will be less prioritary, and retired at some point, because of the complexity in mantaining multiple ways of passing content to the theme.

🛑 Alternatively, fix your theme to the last version `v1.6.1`, to prevent upgrading (losing the new features and improvements).

## v1.6.0

This version introduces the usage of [@zetxek/adritian-theme-helper](https://www.npmjs.com/package/adritian-theme-helper) to help initialize a site with the theme. This is not of much use to existing setups - but good to know.

Additionally, there are a number of [changes in HTML structure](https://github.com/zetxek/adritian-free-hugo-theme/pull/217/files) to ensure that the content is valid, including class renaming and change of element types.

Some of the changes are listed here in a an attempt to help you edit your custom CSS in case you depended on it:

- Prevent `p.lead` usage, preferring `div.lead` instead. This is done to prevent nested `<p>` elements or broken paragraphs, using a wrapping `div` instead.
- Fixed nested `main` elements in the `/blog` page, using instead `<main><div#main-content>`. 
- Prevented duplicated usage of the `#experience` id, by renaming it to `#experience-single` in `layouts/partials/experience.html` and `#experience-list` in `layouts/shortcodes/experience-list.html`.
- Removed wrapping `<p>` element in `layouts/partials/testimonial.html`.

I hope this doesn't cause too much trouble in your existing sites - and allows for a smooth transition to `v1.6.0` 🤞

## v1.5.12

The options to control how the language and theme selectors are displayed in the header and footer have been refactored, to enable control over each placement individually (footer and header).

There are 3 placements that can be controlled. For the color selector, it's always available; for the languae selector, it's available if the site is multilingual.

The configuration syntax is as follows:
```
[params.languages.selector.disable]
footer = false
header = false
mobileHeader = false

[params.colorTheme.selector.disable]
footer = false
header = false
mobileHeader = false
```

The default value is assumed to be `false` for all placements, meaning that the selector is displayed in all placements by default.

## v1.5.7

In order to have the (optional) print improvements for the CV, you need to add the following to your `config.toml` file:

In the mounts section:
```
[[module.mounts]]
source = "node_modules/bootstrap-print-css/css/bootstrap-print.css"
target = "assets/css/bootstrap-print.css"
```

In the `params` section, under the `plugins` section, add the following:

```
  [[params.plugins.css]]
  URL = "css/bootstrap-print.css"
```

Note: this will add about 1.1Kb to the total size of the CSS loaded.

## v1.5.3

A new parameter, `showJobCard`, has been added to the `experience` section in the `config.toml` file.
This allows you to hide the job card on the experience page.
See the [related PR #271](https://github.com/zetxek/adritian-free-hugo-theme/pull/182) for more information.

## v1.5.2

Added a new (optional) parameter, "logo", to display an image in the header.
See the [related PR #179](https://github.com/zetxek/adritian-free-hugo-theme/pull/179) for more information.

## v1.5.1

The theme uses bootstrap as a dependency, installed from npm.
This requires some steps in the site:

1. copy the theme `package.json` to your site, and run `npm install`
2. add the following section to the `hugo.toml` configuration to your site:

```
  [[module.mounts]]
    source = "node_modules/bootstrap/scss"
    target = "assets/scss/bootstrap"

  [[module.mounts]]
    source = "node_modules/bootstrap/dist/js"
    target = "assets/js/bootstrap"

  [[module.mounts]]
    source = "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"
    target = "assets/js/vendor/bootstrap.bundle.min.js"
```


## v1.5.0

The theme has been updated to support Hugo modules.
This is now the recommended way to install the theme, as it allows for easier updates and contributions.

See https://github.com/zetxek/adrianmoreno.info/pull/270 for an example of how to update an existing site to switch from git submodule to Hugo module.

Some key steps:
- initialize the module in your site: `hugo mod init github.com/username/your-site`
- add the module to your `hugo.toml` file: `[[module.imports]] path = "github.com/zetxek/adritian-free-hugo-theme"`
- get the module: `hugo mod get -u`

To use a specific version of the theme, you can add the version to the module import: `[[module.imports]] path = "github.com/zetxek/adritian-free-hugo-theme@v2.0.0"`
To use an unpublished version of the theme, you can add the git reference to the `go.mod` file: `require github.com/zetxek/adritian-free-hugo-theme <any-git-reference>`, and then execute `hugo mod get -u`.


**Note**: if you use vercel to host your site, you will need to make sure that `go` is installed in the vercel build environment.
You can do this by adding the following to your `vercel.json` file: `"installCommand": "dnf -y install golang",`.

## v1.4.13

### Analytics section re-organized

In the [PR #121](https://github.com/zetxek/adritian-free-hugo-theme/pull/121), we moved the analytics config to a new section in the configuration for better extensibility and clarity.

Before:
```
  vercelPageInsights = false
  vercelAnalytics = false

  [params.google_analytics]
      code = "UA-XXXXX-Y"
      enabled = false
  [params.google_tag_manager]
      code = "GTM-XXXXX"
      enabled = false
```

After:
```
  [params.analytics]
  ## Analytics parameters.
  ### Supported so far: Vercel (Page Insights, Analytics)
  ### And Google (Tag Manager, Analytics)

  # controls vercel page insights - disabled by default
  # to enable, just set to true
  vercelPageInsights = false
  vercelAnalytics = false
  
  # google analytics and tag manager. to enable, set "enabled" to true
  # and add the tracking code (UA-something for analytics, GTM-something for tag manager)
  [params.analytics.googleAnalytics]
      code = "UA-XXXXX-Y"
      enabled = true
  [params.analytics.googleTagManager]
      code = "GTM-XXXXX"
      enabled = false
```

See the theme's [`exampleSite` hugo.toml](https://github.com/zetxek/adritian-free-hugo-theme/blob/main/exampleSite/hugo.toml) file for an example configuration.

### "Experience buttons" can be hidden

A new configuration option has been added to the experience buttons. 

Before:
```
experience:
  button:
    enable: true
    icon: "icon-linkedin"
    ## the url and text are localized, fill them in the i18n file
    ## keys: experience_button, experience_button_url
```

After:
```
experience:
  enable: true
  button:
    enable: true
    icon: "icon-linkedin"
    ## the url and text are localized, fill them in the i18n file
    ## keys: experience_button, experience_button_url
```

## v1.4.9

### Change 1: new translations keys

Added for the color switcher in the footer
- theme color switcher (`toggle_theme`) and themes (`theme_light`, `theme_dark`, `theme_auto`).

### Change 2: css files refactor

This version continues to align with Bootstrap extension capabilities.
You will need to change the import of CSS files in your `config.toml` file, in the `Plugins` section.

**Before:**
```
  # CSS Plugins
  [[params.plugins.css]]
  URL = "css/main.css"
  [[params.plugins.css]]
  URL = "css/custom.css"
  [[params.plugins.css]]
  URL = "css/adritian-icons.css"

  # JS Plugins
  [[params.plugins.js]]
  URL = "js/rad-animations.js"
  [[params.plugins.js]]
  URL = "js/sticky-header.js"
  [[params.plugins.js]]
  URL = "js/library/fontfaceobserver.js"

  # SCSS Plugins
  [[params.plugins.scss]]
  URL = "scss/adritian.scss"
```

**After:**

See that the `main.css` file is gone from CSS:
```
  # CSS Plugins
  [[params.plugins.css]]
  URL = "css/custom.css"
  [[params.plugins.css]]
  URL = "css/adritian-icons.css"

  # JS Plugins
  [[params.plugins.js]]
  URL = "js/rad-animations.js"
  [[params.plugins.js]]
  URL = "js/sticky-header.js"
  [[params.plugins.js]]
  URL = "js/library/fontfaceobserver.js"

  # SCSS Plugins
  [[params.plugins.scss]]
  URL = "scss/adritian.scss"
```

Also, added new parameters in `config.toml`:

```
# theme/color style 
[params.colorTheme]

## the following configuration would disable automatic theme selection
#  [params.colorTheme.auto]
#    disable = true
#  [params.colorTheme.forced]
#    theme = "dark"

## the following parameter will disable theme override in the footer
#  [params.colorTheme.selector.disable]
#  footer = true


## by default we allow override AND automatic selection
```

## v1.4.5

This version has aligned more the custom CSS with Bootstrap's extension capabilities.
You will need to change the import of CSS files in your `config.toml` file, in the `Plugins` section.

**Before:**

```
  # CSS Plugins
  [[params.plugins.css]]
  URL = "css/main.css"
  [[params.plugins.css]]
  URL = "css/adritian.css"
  [[params.plugins.css]]
  URL = "css/adritian-icons.css"
  [[params.plugins.css]]
  URL = "css/custom.css"

  (...)
  
  # SCSS Plugins
  [[params.plugins.scss]]
  URL = "scss/menu.scss"
  [[params.plugins.scss]]
  URL = "scss/bootstrap/bootstrap.scss"
```

**After:**
(note that `adritian.css` gets moved to the `scss` section, and it's not needed to import `bootstrap.scss` or `menu.scss` manually - as they are not included in `adritian.scss`)
```
  # CSS Plugins
  [[params.plugins.css]]
  URL = "css/main.css"
  [[params.plugins.css]]
  URL = "css/custom.css"
  [[params.plugins.css]]
  URL = "css/adritian-icons.css"

  # JS Plugins
  [[params.plugins.js]]
  URL = "js/rad-animations.js"
  [[params.plugins.js]]
  URL = "js/sticky-header.js"
  [[params.plugins.js]]
  URL = "js/library/fontfaceobserver.js"

  # SCSS Plugins
  [[params.plugins.scss]]
  URL = "scss/adritian.scss"
```

## v1.4.0

This version switches from the legacy, "embedded" Boostrap based on v4.3.1 (from the [original codebase](https://github.com/radity/raditian-free-hugo-theme/blob/daa341d4156986787611a01d075ca94233ff4d3b/static/css/main.css)) to the Scss-based version, [v5.3.3](https://getbootstrap.com/docs/5.3) (ast per december'24).

This requires some small adjustments in the `config.toml` file.

### Add build stats
Add the following:
```
[build]
  [build.buildStats]
    disableClasses = false
    disableIDs = false
    disableTags = false
    enable = true
```

### Add new `adritian.css` file

Add the following, under the `params.plugins.css` section:

```
  [[params.plugins.css]]
  URL = "css/adritian.css"
```

### ⚠️ Setup boostrap as Scss

Add the following, under the `params.plugins.scss` section:

```
  [[params.plugins.scss]]
  URL = "scss/bootstrap/bootstrap.scss"
```

See the contents of the [PR #94 in the demo site](https://github.com/zetxek/adritian-demo/pull/94/files) as an example.

## v1.3.4

In `config.toml`, replace
```
  [[params.plugins.css]]
  URL = "css/rad-icons.css"
```
by 
```
  [[params.plugins.css]]
  URL = "css/adritian-icons.css"
```

In your config/content files, replace:
- `icon-linkedin-fill` by `icon-linkedin`
- `icon-smile-fill` by `icon-user`
- `icon-arrow-right` by `icon-circle-arrow-right`
- `icon-mail-fill` by `icon-email`


## v1.2.x to v1.3.x

In `v1.3.x`, the [support for internationalization was added](https://github.com/zetxek/adritian-free-hugo-theme/pull/78).
This means that some of the content previously managed in the `homepage.yaml` file is now managed in `i18n/{language}.yaml`.

For example:
- the main page title was managed in `homepage.yml`:`showcase.title`, now it's managed in `i18n/{language}.yaml`:`logo_text1`
- the page logo was managed in `hugo.toml`:`params.logo` (`text1` and `text2`), now it's managed in `i18n/{language}.yaml`:`logo_text1` and `logo_text2`.

The reason for the change is to allow overriding almost any string in the theme in different content translations. 
