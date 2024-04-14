# Adritian Free Hugo Theme
###### Adritian Hugo Theme for Personal Websites or Professional minimalistic landing pages

This free Hugo theme is a fork of [Raditian Theme](https://github.com/radity/raditian-free-hugo-theme) - a great Hugo theme created by Radity. It's called __Adritian__ because I, the author, am called Adrián - and if you shuffle Raditian and Adrián letters you get... Adritian 😅

The templates are based on Bootstrap (so they're responsive and mobile-first), and the main changes I have made have been upgrades on the web performance and accessibility of the template.

Some of the best usages for the theme are for minimalistic websites, single-page applications, and personal portfolios. It has a contact form you can customize to your mail address without setting up a backend (https://formspree.io).


🚀 Improvements on this version:

- removal of jQuery
- upgrade of Bootstrap from v4 to v5
- Hugo assets pipeline support
- some (basic) i18n features
- added more pages/templates
- upgrade loading performance (100 score in [Google Page Speed Insights](https://pagespeed.web.dev))

You can see it live at [www.adrianmoreno.info](https://www.adrianmoreno.info) (my personal website), as well as in this screenshot for reference:

![adrianmorenoinfo](https://user-images.githubusercontent.com/240085/230632835-74349170-d610-4731-8fac-62c413e6b3f5.png)

You can see the source code for [my website](https://www.adrianmoreno.info) [in github too](https://github.com/zetxek/adrianmoreno.info), as well as the [demo site for the theme, adritian-demo](https://github.com/zetxek/adritian-demo) (a simpler version of the website).

## Download

- Clone the repo: `git clone https://github.com/zetxek/adritian-free-hugo-theme.git`.
- [Download from Github](https://github.com/zetxek/adritian-free-hugo-theme/archive/main.zip).

## Installation

#### Install Hugo

To use `adritian-free-hugo-theme` you need to install Hugo by following https://gohugo.io/getting-started/installing/.

#### Setting up

As a pre-requirement you will need Hugo set up and running. You can follow [the official guide for it](https://gohugo.io/categories/installation/).

Note: the theme has **not** been migrated to Hugo Modules yet. To install it, you need to set it up by copying the theme files (either as a sub-module, or by copying the files). You can follow these [older instructions](https://gohugobrasil.netlify.app/themes/installing-and-using-themes/), or the next ones as help:

- Create a new Hugo site (this will create a new folder): `hugo new site <your website's name>`
- Enter the newly created folder: `cd <your website's name>/`
- Install PostCSS: execute `npm i -D postcss postcss-cli autoprefixer` from the top-level site folder [check [Hugo's official docs](https://gohugo.io/hugo-pipes/postcss/)].
- Clone the adritian-free-hugo-theme: `git clone https://github.com/zetxek/adritian-free-hugo-theme.git themes/adritian-free-hugo-theme`.
- Replace the `config.toml` file in the project's root directory with themes/adritian-free-hugo-theme/exampleSite/config.toml: `cp themes/adritian-free-hugo-theme/exampleSite/config.toml hugo.toml` (*executed from the website root folder*)
- Start Hugo with `hugo server -D`
- 🎉 The theme is alive on http://localhost:1313/

The output for the last command will be something like
```
adritian-demo git:(master) ✗ hugo server -D
port 1313 already in use, attempting to use an available port
Watching for changes in /Users/adrianmorenopena/Projects/adritian-demo/{archetypes,assets,content,data,i18n,layouts,static,themes}
Watching for config changes in /Users/adrianmorenopena/Projects/adritian-demo/hugo.toml
Start building sites …
hugo v0.122.0-b9a03bd59d5f71a529acb3e33f995e0ef332b3aa+extended darwin/arm64 BuildDate=2024-01-26T15:54:24Z VendorInfo=brew

WARN  found no layout file for "html" for kind "taxonomy": You should create a template file which matches Hugo Layouts Lookup Rules for this combination.

                   | EN
-------------------+------
  Pages            |   5
  Paginator pages  |   0
  Non-page files   |   0
  Static files     | 114
  Processed images |   4
  Aliases          |   0
  Sitemaps         |   1
  Cleaned          |   0

Built in 617 ms
Environment: "development"
Serving pages from memory
Running in Fast Render Mode. For full rebuilds on change: hugo server --disableFastRender
Web Server is available at http://localhost:53031/ (bind address 127.0.0.1)
Press Ctrl+C to stop

```

#### Additional configuration

- _(optional, if you want to use the contact form)_ edit the line 212 in your `homepage.yml` file, to customize your mail address. Sign up in [formspree](https://formspree.io) to redirect mails to your own.


## Troubleshooting

This theme is a version of the one found on my website [adriamoreno.info](https://www.adrianmoreno.info). If you run into trouble, [you can check the code on my website](https://github.com/zetxek/adrianmoreno.info) for reference.

If you have improvements for the theme, you are very welcome to make a PR if you are able 💕. Otherwise - see below for how to get help (and maybe help others with the same problem).

## Getting help

The project is offered "as is", and it's a hobby project. Support is given whenever life allows - you can create an issue [create an issue](https://github.com/zetxek/adritian-free-hugo-theme/issues) so anyone else could also help, or the author.

## License

- Copyright 2020 Radity (https://radity.com/), 2022 Adrián Moreno Peña (https://www.adrianmoreno.info)
- Licensed under MIT (https://github.com/zetxek/adritian-free-hugo-theme/blob/master/LICENSE)
