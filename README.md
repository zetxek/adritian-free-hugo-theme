# Adritian Free Hugo Theme
A modern, fast and extensible Hugo theme for personal websites and professional landing pages - with blog and portfolio support

[![Vercel Deploy](https://deploy-badge.vercel.app/vercel/adritian-demo?name=demo)
](https://adritian-demo.vercel.app/) [![Test example site](https://github.com/zetxek/adritian-free-hugo-theme/actions/workflows/test-example-site.yml/badge.svg)](https://github.com/zetxek/adritian-free-hugo-theme/actions/workflows/test-example-site.yml)

## 🚀 Key Features

- 🏎️ Fast, minimalistic code (no jQuery or other javascript frameworks)
- 🖼️ Bootstrap v5 (`v5.3.3`) CSS framework with Scss customization
- 📚 Multi-language (i18n) support
- 🛠️ Custom content types (work experience, education, projects/work showcase, testimonials, blog)
- 🧰 Multiple shortcodes to customize your landing page in any way you want
- 💯 Perfect Lighthouse scores (Performance, Accessibility, SEO)
- 🌚 Automatic dark/light theme switching, with manual override
- 🖨️ Print-friendly CV template 
- ⚡ Vercel-ready with Analytics & Speed Insights support

The theme focuses on accessibility, high performance, and usability (it's very easy to get started). It's extendable by adding your own styles or content types, and it has a solid foundation on which to build.

Some of the best applications for the theme are for minimalistic websites, single-page applications, and personal portfolios. It has a contact form you can customize to your mail address without setting up a backend.

## Live demo & Preview

You can see it live at [www.adrianmoreno.info](https://www.adrianmoreno.info) (my personal website), as well as in these screenshots of the homepage, in the dark and light variations of the theme:

<table>
	<tbody>
	<tr>
		<td>
			<img src="https://user-images.githubusercontent.com/240085/230632835-74349170-d610-4731-8fac-62c413e6b3f5.png" alt="Light version of the Hugo theme Adritian"/>
</td>
		<td>
			<img src="https://raw.githubusercontent.com/zetxek/adritian-free-hugo-theme/main/images/screenshot-dark-fullscroll.jpeg" alt="Dark version of the Hugo theme Adritian"/>
</td>
	</tr>
	</tbody>
</table>

The dark color variation is selected automatically based on browser settings, and a color switcher is available in the footer and the mobile menu for visitors to override.

Other relevant repositories related to this theme are:

1. [adritian-theme-helper](https://github.com/zetxek/adritian-theme-helper): npm package helper, used to bootstrap the theme. It helps initialize a site with the right content and configuration files.
1. A full-featured site, [my personal website](https://www.adrianmoreno.info) [in github too](https://github.com/zetxek/adrianmoreno.info), so you can see how the theme can look real-life (including deployment scripts).
1. A simpler [demo site for the theme, adritian-demo](https://adritian-demo.vercel.app/) ([and its code](https://github.com/zetxek/adritian-demo)), where the demo content comes from.
1. The same demo site, in a [git submodules integration](https://github.com/zetxek/adritian-git-submodule-demo).

💡 For more inspiration, check this document's [showcase section](#showcase).

✨ This theme is entirely free and open source. We welcome your ideas, feedback, and contributions! If you find it useful, please give it a GitHub star to show your support.

## Quickstart

#### Install Hugo

This is a theme for the website generator Hugo. To use it, you must install Hugo by following [the official guide](https://gohugo.io/getting-started/installing/).

**We recommend installing the theme as a [Hugo module](https://gohugo.io/hugo-modules/) (recommended, and explained below).**

Other alternative is to use [git submodules](https://gohugo.io/getting-started/quick-start/#create-a-site), or to [download the theme as a zip file](https://github.com/zetxek/adritian-free-hugo-theme/releases), and copy the files to your site`*`. But that will make your site "stuck in time" and more difficult to upgrade. **This is not recommended or supported directly**.

> **On the release files:** `*` from the version `v1.5.4` the theme available as a zip file in the [releases page](https://github.com/zetxek/adritian-free-hugo-theme/releases) contains the `node_modules` folder, so you don't need to install it separately. This is a convenience for edge cases that might have problems installing the theme as a module or downloading many files.__

### As a Hugo Module (recommended)

> **Note:** Before proceeding, **Ensure you have Go and Hugo installed** and that you have created a new Hugo project.
As a pre-requirement, you will need Hugo set up and running. You can follow [the official guide for it](https://gohugo.io/categories/installation/).

The theme has been tested with Hugo version `0.136`. If you get errors regarding missing functionalities, check if you have the latest version of Hugo available.

Note: the theme supports both Hugo modules and git submodules. To install the theme in the most maintainable way, you should use Hugo modules. If you prefer git submodules you can follow these [older instructions](https://gohugobrasil.netlify.app/themes/installing-and-using-themes/) or the next ones as help:

<details>
<summary>Step-by-step instructions to setup the theme as a hugo module</summary>

1. Create a new Hugo site (this will create a new folder): `hugo new site <your website's name>`
1. Enter the newly created folder: `cd <your website's name>/`
1. Initialize the Hugo Module system in your site if you haven't already: `hugo mod init github.com/username/your-site` (_you don't need to host your website on GitHub, you can add anything as a name_)
1. Install the theme as a module: `hugo mod get -u github.com/zetxek/adritian-free-hugo-theme`
1. Add the following to your `hugo.toml`, to set the theme as active: 

```
[module]
[[module.imports]]
path = "github.com/zetxek/adritian-free-hugo-theme"
```

1. Prepare the `package.json` file: `hugo mod npm pack`
1. Install the dependencies: `npm install`. This will include Bootstrap (needed for styling) and the helper script [adritian-theme-helper](https://github.com/zetxek/adritian-theme-helper). 
1. Run the initial content downloader: `./node_modules/@zetxek/adritian-theme-helper/dist/scripts/download-content.js`. This will download the demo content from the [adritian-demo](https://github.com/zetxek/adritian-demo) repository and copy it to your site, for a quick start (including translations, images, configuration and content)
</details>


### Running the site

The initial configuration allows you to have a base to edit and adapt to your site, and see the available functionalities.
**Make sure to edit `baseURL`, `title` and `description`**. You can edit the header links, as well as the languages to your needs.

After you have installed the `npm` packages and setup the initial contents, you can

1. Start Hugo with `hugo server`...
1. 🎉 The theme is alive on http://localhost:1313/

For next steps and guidance on where to customize your content, [check the demo site](https://adritian-demo.vercel.app/). 
For other installation methods (as submodule, or manual configuration) you can check the demo site help page. 

### Additional features and configuration

The theme is extensible and customizable in multiple areas, and it can be tricky to figure what to exactly edit. This is a guide (that is complemented by the [demo site](https://adritian-demo.vercel.app/)).

<img width="1395" alt="image" src="https://github.com/user-attachments/assets/270c4445-5354-441a-ab23-21d91762e33c" />

#### Multi-language support

https://github.com/user-attachments/assets/030e765a-275f-4141-88e0-b854ebe551da

The theme implements the [internationalization (i18n) system by Hugo](https://gohugo.io/content-management/multilingual/), to enable multilingual sites.

See the content in the  `i18n` folder to edit the translations, and the configuration `hugo.toml` to define your active languages. The example site has 3 enabled languages (`en` for English, `es` for Spanish and `fr` for French).

You can add additional languages, or disable the provided ones (by setting `disabled` to `true` on the languages you don't need).

Most of the content is expected to be translated via the content system of Hugo:

- [by file name](https://gohugo.io/content-management/multilingual/#translation-by-file-name)
- [by content directory](https://gohugo.io/content-management/multilingual/#translation-by-content-directory) 

Note: The introduction of i18n support was done in the version `v1.3.0` and it has breaking changes due to the way in which the content was managed. You can read about the upgrade path in [UPGRADING.md](UPGRADING.md). In the version `v1.7.0` the usage of Hugo's content management was expanded, to use less `i18n` strings and more file name/content directory based translations.

#### Editing the theme content

You can check the repository [adritian-demo](https://github.com/zetxek/adritian-demo) for a reference implementation, as well as the [theme website](https://adritian-demo.vercel.app/) (https://adritian-demo.vercel.app/), to get a visual guide on how to edit the content. 

Following the initial setup instructions you will get a "ready-to-use" version of the site, with sample content for you to edit and customize.

#### Shortcodes

The theme has multiple shortcodes available for use in the content, so you can customize your homepage (or any other page) as you want. You can read about them in the [shortcodes page](https://adritian-demo.vercel.app/blog/shortcodes). From the version `v1.7.0` this is the preferred way to setup your theme content and translations - as that's the most flexible system.

You can see the shortcodes in use in the demo site's pages, like

- [home page](https://adritian-demo.vercel.app/) [`(source)`](https://raw.githubusercontent.com/zetxek/adritian-demo/refs/heads/main/content/home/home.md)
- [CV page](https://adritian-demo.vercel.app/cv) [`(source)`](https://raw.githubusercontent.com/zetxek/adritian-demo/refs/heads/main/content/cv.md)

#### Contact form
_(optional, if you want to use the contact form)_ edit the key `contact` in your `homepage.yml` file, to customize your mail address. Sign up in [formspree](https://formspree.io) to redirect mails to your own.

It can be rendered in any page via the `contact-section` shortcode.

#### Blog

Two layouts are available for the blog:
- `default` (full-width for posts)
- `sidebar` (sidebar with recent posts and categories)

| Default Layout | Sidebar Layout |
|---------------|----------------|
| ![Default blog layout with full width content](https://github.com/zetxek/adritian-free-hugo-theme/raw/main/images/blog-default.jpeg) | ![Blog layout with sidebar showing recent posts](https://github.com/zetxek/adritian-free-hugo-theme/raw/main/images/blog-sidebar.jpeg) |
| Full width posts | Posts with left sidebar |
| Clean, focused reading experience | Shows recent posts and categories |
| Maximizes content area | 25% width sidebar by default |
| Best for image-heavy posts | Helps with site navigation |

<img width="1271" alt="image" src="https://github.com/user-attachments/assets/1821a3b7-f572-4958-8c4f-bd1687cc8f71">


To use the blog, you can use the content type "blog", and render it in the URL `/blog`.
You can add a menu link to it in `hugo.toml`.

The posts will be markdown files stored in the `content/blog` folder.

The layout can be configured in the `hugo.toml` file, under the `[params.blog]` section.

#### (Job) Experience

This functionality and content is especially suited for personal professional sites, showcasing the work experience: 

<img width="1444" alt="SCR-20240624-uaoi" src="https://github.com/zetxek/adritian-free-hugo-theme/assets/240085/9ea86d6a-62c6-4c4f-96ba-8450fa24dd68">

It can be used to render job experience, projects and/or clients. Each experience/project has a duration, job title, company name, location and description/excerpt as well as a longer text. 

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

The experience can be displayed in several locations:

<table>
	<tbody>
		<tr>
            <td align="center">
		    <img alt="SCR-20250228-kgmq-2" src="https://github.com/user-attachments/assets/7e974632-824c-494c-9dbc-67bb96992517" />

                1. <a href="https://adritian-demo.vercel.app/#experience-single">🔗</a> By using the shortcode <code>experience-section</code>: in a page (such as your homepage), with a limited number of experiences (controlled by the config parameter <code>homepageExperienceCount</code> in the file <code>hugo.toml</code>). The summary is displayed, as well as a introduction text and optional links.
            </td>
            <td align="center">
<img alt="SCR-20250228-kgpu" src="https://github.com/user-attachments/assets/ad53f815-2bd4-4723-a9a1-28be2c01461a" />

                2. <a href="https://adritian-demo.vercel.app/experience">🔗</a> Automatically, in the <strong>Experience page</strong>, in <code>/experience</code>, with a list of all experiences (no limit). The summary is displayed for each item, as well as a introduction text and optional links.
            </td>
            <td align="center" width="33%">
<img alt="SCR-20250228-kgse" src="https://github.com/user-attachments/assets/97a20b98-df5c-4e07-9b2e-d7aba75ec81b" />

     
                3. <a href="https://adritian-demo.vercel.app/experience/job-1/">🔗</a>Individual experience page (such as <code>/experience/job-1</code>), where all details are displayed, and links to the other descriptions are available to navigate.
            </td>	    
		</tr>
	</tbody>
</table>


## Troubleshooting

This theme is a version of the one found on my website [adrianmoreno.info](https://www.adrianmoreno.info). If you run into trouble, [you can check the code on my website](https://github.com/zetxek/adrianmoreno.info) for reference.

If you have improvements for the theme, you are very welcome to make a PR if you are able 💕. Otherwise - see below for how to get help (and maybe help others with the same problem).

### Common issues 

- The site fails to build. Look for the last line of the stacktrace - if you find mentions to missing files, such as in
```
Error: error building site: TOCSS: failed to transform "/scss/adritian.scss" (text/x-scss): ".../.cache/hugo_cache/modules/filecache/modules/pkg/mod/github.com/zetxek/adritian-free-hugo-theme@v1.5.6/assets/scss/adritian.scss:1:1": File to import not found or unreadable: bootstrap/bootstrap.
```
Make sure that you have the dependencies installed. Check the troubleshooting steps in the [following issue](https://github.com/zetxek/adritian-free-hugo-theme/issues/194#issuecomment-2634193132).

- The site renders in a weird-looking way, or you miss content. Check that the content of your site's config file (`hugo.toml`) contain what is mentioned [in the guide](https://github.com/zetxek/adritian-free-hugo-theme?tab=readme-ov-file#as-a-hugo-module-recommended), especially the `mount` sections. 

### Getting help

The project is offered "as is", and it's a side project that powers my personal website. Support is given whenever life allows, and it's not offered in private e-mails: please use the public issue trackers in GitHub so others benefit from the conversation.

- 🐛 For bugs or errors (either in the code or documentation): create an issue [create an issue](https://github.com/zetxek/adritian-free-hugo-theme/issues).
- 💡 For ideas, discussion or open conversations: create a topic in the [discussion board for the theme](https://github.com/zetxek/adritian-free-hugo-theme/discussions).

Are you confused about the difference? Discussions allow a more open chat about the topics, so they fit well unstructured conversations, such as brainstorming on ideas or requests on "how could I...?", where the issues fit better more straightforward threads ("this is broken and should work like this").

## Showcase

Have you used the theme on your website? Send a PR to add it to the list for inspiration! (Extra points if the repo is open source :-)

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

➕ add your website here [by editing the theme README](https://github.com/zetxek/adritian-free-hugo-theme/edit/main/README.md).
🔎 find other websites using the theme [searching in github](https://github.com/search?q=%22theme+%3D+%5C%22adritian-free-hugo-theme%5C%22%22&type=code).

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
                <a href="https://github.com/mnordhaus">
                    <img src="https://avatars.githubusercontent.com/u/1510804?v=4" width="100;" alt="mnordhaus"/>
                    <br />
                    <sub><b>mnordhaus</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/dcorto">
                    <img src="https://avatars.githubusercontent.com/u/5486937?v=4" width="100;" alt="dcorto"/>
                    <br />
                    <sub><b>D. Corto</b></sub>
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
		</tr>
		<tr>
            <td align="center">
                <a href="https://github.com/martinsam">
                    <img src="https://avatars.githubusercontent.com/u/34697?v=4" width="100;" alt="martinsam"/>
                    <br />
                    <sub><b>Samuel Martin</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/oaksakal">
                    <img src="https://avatars.githubusercontent.com/u/453038?v=4" width="100;" alt="oaksakal"/>
                    <br />
                    <sub><b>Ozgur Aksakal</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/raulalmeidatarazona">
                    <img src="https://avatars.githubusercontent.com/u/61455658?v=4" width="100;" alt="raulalmeidatarazona"/>
                    <br />
                    <sub><b>Raul Almeida</b></sub>
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
		</tr>
		<tr>
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
