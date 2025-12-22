---
title: 'Create your own version of the site'
date: 2025-02-11T14:38:33+02:00
draft: false
type: 'blog'
featured: true
weight: 10
tags: 
  - adritian
  - guide
images:
  featured_image: '/img/blog/A minimalistic representation of creating a personal website, focusing on clean lines, subtle geometric shapes, and a modern web development aesthetic.png'
---

This article is a guide to help you create your own version of the site using [Adritian](https://github.com/zetxek/adritian-free-hugo-theme). It will cover the main steps to get started with the theme, and how to customize it to your needs.

### Creating a site

This theme is for the content management system [Hugo](https://gohugo.io/), so that will be a pre-requirement.
Make sure that you install the `extended` version of Hugo, as the theme uses SCSS for styling, as well as image optimization.

A very good place to start is the Quick start guide: [https://gohugo.io/getting-started/quick-start/](https://gohugo.io/getting-started/quick-start/)

_💡Tip:__ keep your repository clean and tidy by creating a [relevant `.gitignore` file](https://github.com/github/gitignore/blob/main/community/Golang/Hugo.gitignore) since the beginning:

```
# Generated files by hugo
/public/
/resources/_gen/
/assets/jsconfig.json
hugo_stats.json

# Executable may be added to repository
hugo.exe
hugo.darwin
hugo.linux

# Temporary lock file while building
/.hugo_build.lock
```



### Adding the theme

Once you have a site created, you can add the theme to your site by following the instructions in the [README](https://github.com/zetxek/adritian-free-hugo-theme?tab=readme-ov-file#as-a-hugo-module-recommended). While there are multiple ways to add the theme, the recommended way is to use the Hugo Modules, the ones listed here.

<details>
<summary>Instructions to setup the theme as a hugo module</summary>

1. Create a new Hugo site (this will create a new folder): `hugo new site <your website's name>`
1. Enter the newly created folder: `cd <your website's name>/`
1. Initialize the Hugo Module system in your site if you haven't already: `hugo mod init github.com/username/your-site` (_you don't need to host your website on GitHub, you can add anything as a name_)
1. Replace the contents of your config file (`hugo.toml`) file by these: 


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
</details>

This configuration allows you to have a base to edit and adapt to your site, and see the available functionalities.
Make sure to edit `baseURL`, `title` and `description`. You can edit the header links, as well as the languages to your needs.

1. Get the module: `hugo mod get -u`
1. Execute `hugo mod npm pack` - this will generate a `package.json` file in the root folder of your site, with the dependencies for the theme.
1. Execute `npm install` - this will install the dependencies for the theme (including bootstrap)
1. (Optional, to override the defaults) Create a file `data/homepage.yml` with the contents of the [`exampleSite/data/homepage.yml`](https://github.com/zetxek/adritian-free-hugo-theme/blob/main/exampleSite/data/homepage.yml) file, and customize to your needs.
1. Start Hugo with `hugo server`...
1. 🎉 The theme is alive on http://localhost:1313/ (if everything went well)

</details>


### Editing the theme content

Currently the theme content is spread over multiple folders and files. We are working on simplifying this - but for now [this guide](https://adritian-demo.vercel.app/) should help you get started.

Some of the key files are:


- `config.toml`: Main configuration for your Hugo site. Here you can set the site title, description, and theme specific settings such as:
    - menu structure (footer and header)
    - analytics (vercel, google)
    - blog settings (layout, sidebar contents, etc)
    - As well as some **required settings** for the theme to work properly (`module.mounts`, `params.plugins.css`)

- `data/homepage.yml`: homepage structure, content and sections - including social links, and the hero section.
- `assets/`: Where you can store static assets such as images, CSS, and JavaScript files (you can add custom CSS and JS files with the `params.plugins.css` in `config.toml`).
- `content/`: This is where your content files will live. The theme-specific ones are:
    - `content/blog/`: For blog posts.
    - `content/portfolio/`: For portfolio items.
    - `content/project/`: For projects.
    - `content/testimonial/`: For testimonials.
    - `content/education/`: For education items.
    - `content/experience/`: For experience items.
    - `content/client-and-work/`: For client and work items.

### Customizing the theme 

Hugo allows you to customize the theme in many ways. You can override the theme's layouts, styles, and content.
For that, you just need to locate the file you would like to change, copy it to your site's corresponding folder (`layouts`, `assets`, ...), and edit it.

**Note**: if you do this you will not benefit from theme updates, and that could lead to bugs. You can keep an eye on the [CHANGELOG.md](https://github.com/zetxek/adritian-free-hugo-theme/blob/main/CHANGELOG.md) file.

### Improving the theme

Maybe some of the customizations you do are worth a share. If you think that your changes could be useful for others, feel free to open a pull request in the [GitHub repository](https://github.com/zetxek/adritian-free-hugo-theme/pulls) - collaborations are very welcome, especially if the contributions come from real-world use cases.

### Publishing the site

Once you have your site ready, you can publish it to the web. There are many ways to do this, but the recommended one is to use a service like [Vercel](https://vercel.com/) or [Github Pages](https://pages.github.com/). Both services offer free hosting for static sites, and they can be connected to your GitHub repository for automatic deployments.

For that, you will need to have a CI/CD action that builds your site and deploys it to the service. You can find an example of a GitHub action in the demo site repository: [https://github.com/zetxek/adritian-demo/blob/main/.github/workflows/hugo.yml](https://github.com/zetxek/adritian-demo/blob/main/.github/workflows/hugo.yml)