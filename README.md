# Adritian Free Hugo Theme
###### Adritian Hugo Theme for Personal Websites or Professional minimalistic landing pages

[![Vercel Deploy](https://deploy-badge.vercel.app/vercel/adritian-demo?name=demo)
](https://adritian-demo.vercel.app/)

See it live at **[adritian-demo.vercel.app](https://adritian-demo.vercel.app/)** (simple demo site, vanilla installation) or **[adrianmoreno.info](https://www.adrianmoreno.info)** (my personal site, running on this theme)

This free Hugo theme is a fork of [Raditian Theme](https://github.com/radity/raditian-free-hugo-theme) - a great Hugo theme originally created by [Radity](https://github.com/radity). It's called __Adritian__ because I, the author, am called Adrián - and if you shuffle Raditian and Adrián letters you get... Adritian 😅

It focuses on accessibility, high performance and usability. It's extendable by adding your own styles or content types, with a solid foundation.

The templates are based on Bootstrap (so they're responsive and mobile-first), and the main changes I have made have been upgrades on the web performance and accessibility of the template.

Some of the best applications for the theme are for minimalistic websites, single-page applications, and personal portfolios. It has a contact form you can customize to your mail address without setting up a backend (https://formspree.io).


🚀 What can you expect:

- 🏎️ fast, minimalistic code (no jQuery)
- 🖼️ Bootstrap framework v5 available as Scss (customizable via variables)
- 🚃 Hugo assets pipeline support
- 📚 Multi-language (i18n) support
- 🛠️ Support for custom content types (experience, blog)
- 💯 100% score in Lighthouse [Google Page Speed Insights](https://pagespeed.web.dev) for Performance, Best Practices, Accessibility and SEO
- 🌚 Dark theme support (based on system/browser settings)

Also, the theme has been deployed and tested with Vercel. You can also find out of the box:
- Support for [Vercel Speed Insights](https://vercel.com/docs/speed-insights/quickstart) (via the parameter `vercelPageInsights` in `hugo.toml`, disabled by default)
- Support for [Vercel Analytics](https://vercel.com/docs/analytics/quickstart) (via the parameter `vercelAnalytics` in `hugo.toml`, disabled by default)

  <img width="1536" alt="SCR-20240814-ihfs" src="https://github.com/user-attachments/assets/38553a02-48d0-48f4-a69a-ed4f7e32e092">


## Live demo & Preview

You can see it live at [www.adrianmoreno.info](https://www.adrianmoreno.info) (my personal website), as well as in these screenshots of the homepage, in the dark and light variations of the theme:

<table>
	<tbody>
	<tr>
		<td>
			<img src="https://user-images.githubusercontent.com/240085/230632835-74349170-d610-4731-8fac-62c413e6b3f5.png" alt="Light version of the Hugo theme Adritian"/>
</td>
		<td>
			<img src="./images/screenshot-dark-fullscroll.jpeg" alt="Dark version of the Hugo theme Adritian"/>
</td>
	</tr>
	</tbody>
</table>

The dark theme is selected automatically based on browser settings, and there's a color switcher available in the footer.

You have two reference implementations of the theme:
1. A full-featured site, [my personal website](https://www.adrianmoreno.info) [in github too](https://github.com/zetxek/adrianmoreno.info)
2. A simpler [demo site for the theme, adritian-demo](https://adritian-demo.vercel.app/) ([and its code](https://github.com/zetxek/adritian-demo)).

## Download

- Clone the repo: `git clone https://github.com/zetxek/adritian-free-hugo-theme.git`.
[Download from ](https://github.com/zetxek/adritian-free-hugo-theme/archive/main.zip)GitHub.

## Installation

#### Install Hugo

To use `adritian-free-hugo-theme` you need to install Hugo by following https://gohugo.io/getting-started/installing/.

#### Setting up
As a pre-requirement, you will need Hugo set up and running. You can follow [the official guide for it](https://gohugo.io/categories/installation/).

The theme has been tested with the version `0.136` of Hugo. If you get errors regarding missing functionalities, check if you have the last version of Hugo available.

Note: the theme has **not** been migrated to Hugo Modules yet. To install it, you need to set it up by copying the theme files to your website project (either as a sub-module [recommend] or by copying the files). You can follow these [older instructions](https://gohugobrasil.netlify.app/themes/installing-and-using-themes/) or the next ones as help:

- Create a new Hugo site (this will create a new folder): `hugo new site <your website's name>`
- Enter the newly created folder: `cd <your website's name>/`
- Install PostCSS: execute `npm i -D postcss postcss-cli autoprefixer` from the top-level site folder [check [Hugo's official docs](https://gohugo.io/hugo-pipes/postcss/)].
- Clone the adritian-free-hugo-theme: `git clone https://github.com/zetxek/adritian-free-hugo-theme.git themes/adritian-free-hugo-theme`.
- Replace the `hugo.toml` file in the project's root directory with themes/adritian-free-hugo-theme/exampleSite/config.toml: `cp themes/adritian-free-hugo-theme/exampleSite/hugo.toml hugo.toml` (*executed from the website root folder*)
- Start Hugo with `hugo server -D`
- 🎉 The theme is alive on http://localhost:1313/

_Optional:_
if you want to preview the theme with the example content before deciding if it's what you are looking for, you can run the theme with the example content:
```
cd themes/adritian-free-hugo-theme/exampleSite
hugo server --themesDir ../..
```


The output for the `serve` command will be something like
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

#### Multi-language support

https://github.com/user-attachments/assets/030e765a-275f-4141-88e0-b854ebe551da

The theme implements the [internationalization (i18n) system by Hugo](https://gohugo.io/content-management/multilingual/), to enable multilingual sites.

See the content in `i18n` to edit the translations, and the configuration `hugo.toml` to define your active languages. The example site has 3 enabled languages (`en` for English, `es` for Spanish and `fr` for French).

You can add additional languages, or disable the provided ones (by setting `disabled` to `true` on the languages you don't need).

The introduction of i18n support was done in the version `v1.3.0` and it has breaking changes due to the way in which the content was managed. You can read about the upgrade path in upgrading.md.



#### Additional configuration

##### Contact form
_(optional, if you want to use the contact form)_ edit line 212 in your `homepage.yml` file, to customize your mail address. Sign up in [formspree](https://formspree.io) to redirect mails to your own.

##### Blog

Two layouts are available for the blog:
- `default` (full-width for posts)
- `sidebar` (sidebar with recent posts and categories)

| Default Layout | Sidebar Layout |
|---------------|----------------|
| ![Default blog layout with full width content](./images/blog-default.jpeg) | ![Blog layout with sidebar showing recent posts](./images/blog-sidebar.jpeg) |
| Full width posts | Posts with left sidebar |
| Clean, focused reading experience | Shows recent posts and categories |
| Maximizes content area | 25% width sidebar by default |
| Best for image-heavy posts | Helps with site navigation |

<img width="1271" alt="image" src="https://github.com/user-attachments/assets/1821a3b7-f572-4958-8c4f-bd1687cc8f71">


To use the blog, you can use the content type "blog", and render it in the URL `/blog`.
You can add a menu link to it in `hugo.toml`.

The posts will be markdown files stored in the `content/blog` folder.

The layout can be configured in the `hugo.toml` file, under the `[params.blog]` section.

##### Experience

This functionality and content is especially suited for personal professional sites, showcasing the work experience: 

<img width="1444" alt="SCR-20240624-uaoi" src="https://github.com/zetxek/adritian-free-hugo-theme/assets/240085/9ea86d6a-62c6-4c4f-96ba-8450fa24dd68">

It can be used to render job experience, projects or clients. Each experience/project has a duration, job title, company name, location and description/excerpt as well as a longer text. 

The experience is managed through a specific content type (see `content/experience` for an example).
You can use `hugo new experience/experience-name.md` (replacing `experience-name` by the name of the job experience).
This will create the content in the `content/experience` folder, following the `experience` archetype.

The following fields are used from the file's Front Matter: `title`, `jobTitle`, `company`, `location`, `duration`. 
You can find a sample experience file content here:

```
---
date: 2007-12-01T00:00:00+01:00
draft: false
title: "Job #1"
jobTitle: "Junior Intern"
company: "Internet Affairs Inc. "
location: "Stavanger, Norway"
duration: "2022-2024"

---
### Fixing the world, one byte at a time

The beginning of a great career. 
```

The experience is displayed in several locations:

1. Homepage, with a limited number of experiences (controlled by the config parameter `homepageExperienceCount` in the file `hugo.toml`). The summary is displayed. 
2. Experience page, in `/experience`, with a list of all experiences (no limit). The summary is displayed for each item.
3. Individual experience page, where all details are displayed

## Troubleshooting

This theme is a version of the one found on my website [adrianmoreno.info](https://www.adrianmoreno.info). If you run into trouble, [you can check the code on my website](https://github.com/zetxek/adrianmoreno.info) for reference.

If you have improvements for the theme, you are very welcome to make a PR if you are able 💕. Otherwise - see below for how to get help (and maybe help others with the same problem).

## Getting help

The project is offered "as is", and it's a hobby project that powers my personal website. Support is given whenever life allows - you can create an issue [create an issue](https://github.com/zetxek/adritian-free-hugo-theme/issues) so anyone else could also help, or the author.

## Showcase

Have you used the theme in your website? Send a PR to add it to the list for inspiration! (Extra points if the repo is open source :-)

- [demo site](https://adritian.vercel.app)
- [adrian moreno's personal site](https://www.adrianmoreno.info)
- https://davidcorto.es/ (https://github.com/dcorto/dcorto.github.io) *⭐ theme contributor*
- https://cwb.dk/ (https://github.com/C0DK/C0DK.github.io)
- https://shaun.gg/ (https://github.com/shauncampbell/shaun_dot_gg)
- https://trevorpiltch.com/ (https://github.com/trevorpiltch/trevorpiltch.github.io)
- https://vega-2135.github.io/ (https://github.com/vega-2135/vega-2135.github.io)
- https://talinashrotriya.com/ (https://github.com/Talina06/talina06.github.io)
- https://loseardes77.github.io/hugo-portfolio/ (https://github.com/LOSEARDES77/hugo-portfolio)
- https://chandanpasunoori.com/ (https://github.com/chandanpasunoori/www.chandanpasunoori.com)
- https://sathvikracha.com/ (https://github.com/sathvikracha/sathvikracha.com)
- https://jlruan.me/ (https://github.com/jlruan/jlruan.github.io)
- https://chenyugu.com/ (https://github.com/ChyenGCY/ChyenGCY.github.io)
- https://benjaminkoltermann.me/ (https://github.com/p4ck3t0/websites)
- https://kaiasaoka.github.io/ (https://KaiAsaoka/KaiAsaoka.github.io.old)
- https://guillaumebabik.github.io/ (https://github.com/guillaumebabik/guillaumebabik.github.io)
- https://oldgo.fael.my.id/danielweb/ (https://github.com/burnblazter/danielweb)
- https://www.davidfreitag.com/ (https://github.com/dkfreitag/davidfreitag-com)
- add your website here!

## Contributors ![GitHub contributors](https://img.shields.io/github/contributors/zetxek/adritian-free-hugo-theme)

<!-- readme: collaborators,contributors -start -->
<table>
	<tbody>
		<tr>
            <td align="center">
                <a href="https://github.com/zetxek">
                    <img src="https://avatars.githubusercontent.com/u/240085?v=4" width="100;" alt="zetxek"/>
                    <br />
                    <sub><b>Adrián Moreno Peña</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/selmanceker">
                    <img src="https://avatars.githubusercontent.com/u/32300911?v=4" width="100;" alt="selmanceker"/>
                    <br />
                    <sub><b>selmanceker</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/AtocM">
                    <img src="https://avatars.githubusercontent.com/u/8729791?v=4" width="100;" alt="AtocM"/>
                    <br />
                    <sub><b>Murat Öcal</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/fhinok">
                    <img src="https://avatars.githubusercontent.com/u/22161574?v=4" width="100;" alt="fhinok"/>
                    <br />
                    <sub><b>Sämi Will</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/martinsam">
                    <img src="https://avatars.githubusercontent.com/u/34697?v=4" width="100;" alt="martinsam"/>
                    <br />
                    <sub><b>Samuel Martin</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/dcorto">
                    <img src="https://avatars.githubusercontent.com/u/5486937?v=4" width="100;" alt="dcorto"/>
                    <br />
                    <sub><b>D. Corto</b></sub>
                </a>
            </td>
		</tr>
		<tr>
            <td align="center">
                <a href="https://github.com/oaksakal">
                    <img src="https://avatars.githubusercontent.com/u/453038?v=4" width="100;" alt="oaksakal"/>
                    <br />
                    <sub><b>Ozgur Aksakal</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/Ceesaxp">
                    <img src="https://avatars.githubusercontent.com/u/67934?v=4" width="100;" alt="Ceesaxp"/>
                    <br />
                    <sub><b>Andrei Popov</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/brandynmauro">
                    <img src="https://avatars.githubusercontent.com/u/34288491?v=4" width="100;" alt="brandynmauro"/>
                    <br />
                    <sub><b>Brandyn</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/ericreid">
                    <img src="https://avatars.githubusercontent.com/u/16538?v=4" width="100;" alt="ericreid"/>
                    <br />
                    <sub><b>Eric Reid</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/BangKarlsen">
                    <img src="https://avatars.githubusercontent.com/u/1835444?v=4" width="100;" alt="BangKarlsen"/>
                    <br />
                    <sub><b>Jesper Højgaard</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/LeahWilleke">
                    <img src="https://avatars.githubusercontent.com/u/60404112?v=4" width="100;" alt="LeahWilleke"/>
                    <br />
                    <sub><b>LeahWilleke</b></sub>
                </a>
            </td>
		</tr>
		<tr>
            <td align="center">
                <a href="https://github.com/lukasulc">
                    <img src="https://avatars.githubusercontent.com/u/68392977?v=4" width="100;" alt="lukasulc"/>
                    <br />
                    <sub><b>Luka Šulc</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/evolutionise">
                    <img src="https://avatars.githubusercontent.com/u/6320469?v=4" width="100;" alt="evolutionise"/>
                    <br />
                    <sub><b>Alix</b></sub>
                </a>
            </td>
		</tr>
	<tbody>
</table>
<!-- readme: collaborators,contributors -end -->

## License

- Copyright 2020 Radity (https://radity.com/), 2022 Adrián Moreno Peña (https://www.adrianmoreno.info)
- Licensed under MIT (https://github.com/zetxek/adritian-free-hugo-theme/blob/master/LICENSE)
