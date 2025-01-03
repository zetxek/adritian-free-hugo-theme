# Upgrading across versions

This documentation is meant to help you upgrade across versions, when potentially breaking changes are introduced.

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
