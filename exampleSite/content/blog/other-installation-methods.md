---
title: 'Other installation methods'
date: 2025-02-11T14:38:33+02:00
draft: false
type: 'blog'
tags: 
  - adritian
  - guide
---

This is a guide that extends the default instructions offered in [the theme readme](https://github.com/zetxek/adritian-free-hugo-theme/blob/main/README.md). 

#### Manual configuration 
If you prefer to manually set your site, you need to replace the contents of your config file (`hugo.toml`) file by these: 

<details>
<summary>hugo.toml configuration</summary>

```
baseURL = "<your website url>"
languageCode = "en"

[module]
[module.hugoVersion]
# We use hugo.Deps to list dependencies, which was added in Hugo 0.92.0
min = "0.92.0"

[[module.imports]]
path="github.com/zetxek/adritian-free-hugo-theme"

## Base mounts - so your site's assets are available
  [[module.mounts]]
    source = "archetypes"
    target = "archetypes"

  [[module.mounts]]
    source = "assets"
    target = "assets"

  [[module.mounts]]
    source = "i18n"
    target = "i18n"

  [[module.mounts]]
    source = "layouts" 
    target = "layouts"

  [[module.mounts]]
    source = "static"
    target = "static"

# The following mounts are required for the theme to be able to load bootstrap
# Remember also to copy the theme's `package.json` to your site, and run `npm install`
[[module.mounts]]
  source = "node_modules/bootstrap/scss"
  target = "assets/scss/bootstrap"

[[module.mounts]]
  source = "node_modules/bootstrap/dist/js"
  target = "assets/js/bootstrap"

[[module.mounts]]
  source = "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"
  target = "assets/js/vendor/bootstrap.bundle.min.js"

## Optional, if you want print improvements (to PDF/printed)
[[module.mounts]]
source = "node_modules/bootstrap-print-css/css/bootstrap-print.css"
target = "assets/css/bootstrap-print.css"

[params]

  title = 'Your website title'
  description = 'Your website description'
  sections = ["showcase", "about", "education", "experience", "client-and-work", "testimonial", "contact", "newsletter"]

  # If you want to display an image logo in the header, you can add it here
  # logo = '/img/hugo.svg'
  homepageExperienceCount = 6

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
      enabled = false
  [params.analytics.googleTagManager]
      code = "GTM-XXXXX"
      enabled = false

[build]
  [build.buildStats]
    disableClasses = false
    disableIDs = false
    disableTags = false
    enable = true

[params.languages.selector.disable]
  footer = false

[languages]
  [languages.en]
    disabled = false
    languageCode = 'en'
    languageDirection = 'ltr'
    languageName = 'English'
    title = ''
    weight = 0

    [languages.en.menus]
      [[languages.en.menus.header]]
        name = 'About'
        URL = '#about'
        weight = 2
      [[languages.en.menus.header]]
        name = 'Portfolio'
        URL = '#portfolio'
        weight = 3
      #  [[languages.en.menus.header]]
      #  name = "Experience"
      #  URL = "#experience"
      #  weight = 4

      [[languages.en.menus.header]]
        name = "Blog"
        URL = "/blog"
        weight = 5

      [[languages.en.menus.header]]
        name = "Contact"
        URL = "#contact"
        weight = 6

      [[languages.en.menus.footer]]
        name = "About"
        URL = "#about"
        weight = 2

      [[languages.en.menus.footer]]
        name = "Portfolio"
        URL = "#portfolio"
        weight = 3

      [[languages.en.menus.footer]]
        name = "Contact"
        URL = "#contact"
        weight = 4


  [languages.es]
    disabled = false
    languageCode = 'es'
    languageDirection = 'ltr'
    languageName = 'Español'
    title = ''
    weight = 0
      [[languages.es.menus.header]]
        name = 'Sobre mi'
        URL = '/es/#about'
        weight = 2
      [[languages.es.menus.header]]
        name = 'Portfolio'
        URL = '/es/#portfolio'
        weight = 3

      #  [[languages.es.menus.header]]
      #  name = "Experiencia"
      #  URL = "/es/#experience"
      #  weight = 4

      [[languages.es.menus.header]]
        name = "Blog"
        URL = "/es/blog"
        weight = 5

      [[languages.es.menus.header]]
        name = "Contacto"
        URL = "/es/#contact"
        weight = 6

      [[languages.es.menus.footer]]
        name = "Sobre mi"
        URL = "/es/#about"
        weight = 2

      [[languages.es.menus.footer]]
        name = "Portfolio"
        URL = "/es/#portfolio"
        weight = 3

      [[languages.es.menus.footer]]
        name = "Contact"
        URL = "/es/#contact"
        weight = 4

  [languages.fr]
    disabled = false
    languageCode = 'fr'
    languageDirection = 'ltr'
    languageName = 'Français'
    title = ''
    weight = 0

    [languages.fr.menus]
      [[languages.fr.menus.header]]
        name = 'About'
        URL = '#about'
        weight = 2
      [[languages.fr.menus.header]]
        name = 'Portfolio'
        URL = '#portfolio'
        weight = 3
      #  [[languages.fr.menus.header]]
      #  name = "Experience"
      #  URL = "#experience"
      #  weight = 4

      [[languages.fr.menus.header]]
        name = "Blog"
        URL = "/blog"
        weight = 5

      [[languages.fr.menus.header]]
        name = "Contact"
        URL = "#contact"
        weight = 6

      [[languages.fr.menus.footer]]
        name = "About"
        URL = "#about"
        weight = 2

      [[languages.fr.menus.footer]]
        name = "Portfolio"
        URL = "#portfolio"
        weight = 3

      [[languages.fr.menus.footer]]
        name = "Contact"
        URL = "#contact"
        weight = 4

# Plugins
[params.plugins]

  # CSS Plugins
  [[params.plugins.css]]
  URL = "css/custom.css"
  [[params.plugins.css]]
  URL = "css/adritian-icons.css"
  ## Optional, if you want print improvements (to PDF/printed)
  [[params.plugins.css]]
  URL = "css/bootstrap-print.css"
  
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

[params.blog]
layout = "default" # options: default, sidebar
sidebarWidth = "25" # percentage width of the sidebar
showCategories = true
showRecentPosts = true
recentPostCount = 5
listStyle = "summary" # options: simple, summary
```

1. Get the module: `hugo mod get -u`
1. Execute `hugo mod npm pack` - this will generate a `package.json` file in the root folder of your site, with the dependencies for the theme.
1. Execute `npm install` - this will install the dependencies for the theme (including bootstrap)
1. (Optional, to override the defaults) Create a file `data/homepage.yml` with the contents of the [`exampleSite/data/homepage.yml`](https://github.com/zetxek/adritian-free-hugo-theme/blob/main/exampleSite/data/homepage.yml) file, and customize to your needs (__note: this file is not included in your theme if you use hugo modules, download it manually from the repository__)


</details>

### Traditional Installation (as git submodule)

If you prefer not to use Hugo Modules, you can still install the theme as a git submodule.
The guide is very similar to [official "Quick Start"](https://gohugo.io/getting-started/quick-start/#create-a-site), just changing the theme URL in the `git submodule add` command: 

<details>
<summary>Old instructions for git submodules</summary>

- Create a new Hugo site (this will create a new folder): `hugo new site <your website's name>`
- Enter the newly created folder: `cd <your website's name>/`
- Initialize hugo modules: `hugo mod init github.com/<your_user>/<your_project>`
- Install PostCSS: execute `npm i -D postcss postcss-cli autoprefixer` from the top-level site folder [check [Hugo's official docs](https://gohugo.io/hugo-pipes/postcss/)].
- Add adritian-free-hugo-theme as a module dependency, by adding
  ```
  [module]
  [[module.imports]]
    path = 'github.com/zetxek/adritian-free-hugo-theme'
  ```
  To your `hugo.toml` file, and executing `hugo mod get -u`
  
- Replace the `hugo.toml` file in the project's root directory with the contents of [themes/adritian-free-hugo-theme/exampleSite/config.toml](https://github.com/zetxek/adritian-free-hugo-theme/blob/main/exampleSite/hugo.toml). If you are using the git submodules, you can execute `cp themes/adritian-free-hugo-theme/exampleSite/hugo.toml hugo.toml` (*executed from the website root folder*), otherwise just copy and paste the contents.
- Create the file `data/homepage.yml`, with the initial contents of the [`exampleSite/data/homepage.yml`](https://github.com/zetxek/adritian-free-hugo-theme/blob/main/exampleSite/data/homepage.yml). This will serve as your starting point to customize your home content ✍️
- Start Hugo with `hugo server -D`
- 🎉 The theme is alive on http://localhost:1313/


_Optional, and only for git submodule or when you download the whole repo:_
if you want to preview the theme with the example content before deciding if it's what you are looking for, you can run the theme with the example content:
```
cd themes/adritian-free-hugo-theme/exampleSite
hugo server --themesDir ../..
```

Note: The `exampleSite` is not downloaded when installing the Hugo module. That's why this works only as git submodule or full repo download. 
</details>


---

After this, you can start adding your own content to the site, and customize the configuration.

If everything has gone well asn you have the right configuration, the output for the `serve` command will be something like this:
<details>
<summary>Example output for the serve command</summary>

```
adritian-demo git:(master) ✗ hugo server -D
Watching for changes in /Users/adrianmorenopena/tmp/theme-test/themes/adritian-free-hugo-theme/{archetypes,assets,data,exampleSite,i18n,layouts,static}
Watching for config changes in /Users/adrianmorenopena/tmp/theme-test/themes/adritian-free-hugo-theme/exampleSite/hugo.toml
Start building sites …
hugo v0.136.2+extended darwin/arm64 BuildDate=2024-10-17T14:30:05Z VendorInfo=brew


                   | EN | ES | FR
-------------------+----+----+-----
  Pages            | 24 | 10 |  8
  Paginator pages  |  0 |  0 |  0
  Non-page files   |  0 |  0 |  0
  Static files     | 90 | 90 | 90
  Processed images | 24 |  0 |  0
  Aliases          |  1 |  0 |  0
  Cleaned          |  0 |  0 |  0

Built in 1788 ms
Environment: "development"
Serving pages from disk
Running in Fast Render Mode. For full rebuilds on change: hugo server --disableFastRender
Web Server is available at http://localhost:1313/ (bind address 127.0.0.1)
Press Ctrl+C to stop
```
</details>