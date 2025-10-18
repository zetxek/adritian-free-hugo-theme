# Adritian Free Hugo Theme
A modern, fast and extensible Hugo theme for personal websites and professional landing pages - with blog and portfolio support

[![Vercel Deploy](https://deploy-badge.vercel.app/vercel/adritian-demo?name=demo)
](https://adritian-demo.vercel.app/) [![Test example site](https://github.com/zetxek/adritian-free-hugo-theme/actions/workflows/test-example-site.yml/badge.svg)](https://github.com/zetxek/adritian-free-hugo-theme/actions/workflows/test-example-site.yml)

## 🚀 Key Features

- 🏎️ Fast, minimalistic code (no jQuery or other javascript frameworks)
- 🖼️ Bootstrap v5 (`v5.3.7`) CSS framework with Scss customization
- 📚 Multi-language (i18n) support
- 🛠️ Custom content types (work experience, education, projects/work showcase, testimonials, blog)
- 🧰 Multiple shortcodes to customize your landing page in any way you want
- 🔎 Lightning fast search (powered by [fuse.js](https://www.fusejs.io/))
- 💯 Perfect Lighthouse scores (Performance, Accessibility, SEO)
- 🌚 Automatic dark/light theme switching, with manual override
- 🖨️ Print-friendly CV template 
- 🔧 Technical Skills showcase with visual skill bars and categories
- ⚡ Vercel-ready with Analytics & Speed Insights support
- 🖼️ Menus with icon support
- 🔗 **Related posts** - Automatically display related content based on tags
- 📤 **Social sharing buttons** - Built-in sharing for Twitter/X, LinkedIn, Facebook, and Email
- 📑 **Table of Contents** - Auto-generated, sticky TOC for blog posts
- 💬 **Comments integration** - Support for Disqus, Giscus, and Utterances
- ⏱️ **Reading time display** - Estimated reading time for blog posts
- 🏷️ **Enhanced taxonomy support** - Improved tags and categories display

The theme focuses on accessibility, high performance, and usability (it's very easy to get started). It's extendable by adding your own styles or content types, and it has a solid foundation on which to build.

Some of the best applications for the theme are for minimalistic websites, single-page applications, and personal portfolios. It has a contact form you can customize to your mail address without setting up a backend.

> [!TIP]
> Do you like the theme? 🌟 Star the repo on GitHub to help make it more visible

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

**We recommend installing the theme as a [Hugo module](https://gohugo.io/hugo-modules/) (recommended, and explained below).** This is the most powerful way to install the theme, will allow you to combine it with other modules, and is probably the easiest way to update across theme versions.

Another alternative is to use [git submodules](https://gohugo.io/getting-started/quick-start/#create-a-site) or to [download the theme as a zip file](https://github.com/zetxek/adritian-free-hugo-theme/releases) and copy the files to your site`*`. But that will make your site "stuck in time" and more difficult to upgrade. **This is not recommended or supported directly**.

> **On the release files:** `*` from the version `v1.5.4` the theme available as a zip file in the [releases page](https://github.com/zetxek/adritian-free-hugo-theme/releases) contains the `node_modules` folder, so you don't need to install it separately. This is a convenience for edge cases that might have problems installing the theme as a module or downloading many files.__

### As a Hugo Module (recommended)

> **Note:** Before proceeding, **Ensure you have Go and Hugo installed** and that you have created a new Hugo project.
As a pre-requirement, you will need Hugo set up and running. You can follow [the official guide for it](https://gohugo.io/categories/installation/).

The theme has been tested with Hugo version `0.136` (extended version). If you get errors regarding missing functionalities, check if you have the latest version of Hugo available.

**Note:** as mentioned, the theme supports both Hugo modules and git submodules. You should use Hugo modules to install the theme in the most maintainable way. If you prefer git submodules you can follow these [older instructions](https://gohugobrasil.netlify.app/themes/installing-and-using-themes/) or the next ones as help:

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

6. Prepare the `package.json` file: `hugo mod npm pack`
7. Install the dependencies: `npm install`. This will include Bootstrap (needed for styling) and the helper script [adritian-theme-helper](https://github.com/zetxek/adritian-theme-helper). 
8. Run the initial content downloader: `./node_modules/@zetxek/adritian-theme-helper/dist/scripts/download-content.js`. This will download the demo content from the [adritian-demo](https://github.com/zetxek/adritian-demo) repository and copy it to your site, for a quick start (including translations, images, configuration and content)
</details>


### Running the site

The initial configuration allows you to have a base to edit and adapt to your site, and see the available functionalities.
**Make sure to edit `baseURL`, `title` and `description`**. You can edit the header links, as well as the languages to your needs.

After you have installed the `npm` packages and setup the initial contents, you can

1. Start Hugo with `hugo server`...
1. 🎉 The theme is alive on http://localhost:1313/

For next steps and guidance on where to customize your content, [check the demo site](https://adritian-demo.vercel.app/). 
You can check the demo site help page for other installation methods (such as submodules or manual configuration). 

### Additional features and configuration

The theme is extensible and customizable in multiple areas, and it can be tricky to figure out exactly what to edit. This is a guide (that is complemented by the [demo site](https://adritian-demo.vercel.app/)).

<img width="1395" alt="image" src="https://github.com/user-attachments/assets/270c4445-5354-441a-ab23-21d91762e33c" />

#### Multi-language support

https://github.com/user-attachments/assets/030e765a-275f-4141-88e0-b854ebe551da

The theme implements the [internationalization (i18n) system by Hugo](https://gohugo.io/content-management/multilingual/), to enable multilingual sites.

See the content in the  `i18n` folder to edit the translations, and the configuration `hugo.toml` to define your active languages. The theme includes translations for:

- **English** (`en`)
- **Spanish** (`es`)
- **French** (`fr`)
- **German** (`de`)
- **Dutch** (`nl`)
- **Danish** (`da`)
- **Italian** (`it`)
- **Portuguese** (`pt`)
- **Swedish** (`sv`)
- **Norwegian** (`no`)
- **Polish** (`pl`)

The example site has 3 enabled languages by default (`en`, `es`, and `fr`). You can enable additional languages by adding them to your `hugo.toml` configuration, or disable the provided ones (by setting `disabled` to `true` on the languages you don't need).

Most of the content is expected to be translated via the content system of Hugo:

- [by file name](https://gohugo.io/content-management/multilingual/#translation-by-file-name)
- [by content directory](https://gohugo.io/content-management/multilingual/#translation-by-content-directory) 

Note: The introduction of i18n support was done in the version `v1.3.0` and it has breaking changes due to the way in which the content was managed. You can read about the upgrade path in [UPGRADING.md](UPGRADING.md). In the version `v1.7.0` the usage of Hugo's content management was expanded, to use less `i18n` strings and more file name/content directory based translations.

#### Editing the theme content

You can check the repository [adritian-demo](https://github.com/zetxek/adritian-demo) for a reference implementation, as well as the [theme website](https://adritian-demo.vercel.app/) (https://adritian-demo.vercel.app/), to get a visual guide on how to edit the content. 

Following the initial setup instructions you will get a "ready-to-use" version of the site, with sample content for you to edit and customize.

#### Technical Skills Showcase

The theme includes a dedicated Technical Skills showcase section that allows you to visually display your skills with progress bars and categorization:

- Create a `/skills` section in your site with customizable skill categories
- Each skill can include name, proficiency level, years of experience, and description
- Visual skill bars automatically use your theme's primary color
- Full dark mode support with appropriate contrast
- Responsive design for all device sizes
- Accessible through navigation menu with multilingual support

To use this feature, create a `skills/_index.md` file with structured front matter for your skill categories and individual skills. The theme will automatically generate a visually appealing skills showcase page.

#### Shortcodes

The theme has multiple shortcodes available for use in the content, so you can customize your homepage (or any other page) as you want. You can read about them in the [shortcodes page](https://adritian-demo.vercel.app/blog/shortcodes). Since version `v1.7.0,` this is the preferred way to set up your theme content and translations, as that's the most flexible system.

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

The layout can be configured in the `hugo.toml` file, under the `[params.blog]` section:

```toml
[params.blog]
layout = "sidebar-right"     # options: default (no sidebar), sidebar, sidebar-right
sidebarWidth = "25"          # percentage width of the sidebar (when using sidebar layouts)
narrowContent = true         # if true, limits content width to 720px for better readability (default: true)
showCategories = true        # show categories in the sidebar
showRecentPosts = true       # show recent posts in the sidebar
recentPostCount = 5          # number of recent posts to display
listStyle = "summary"        # options: simple, summary
```

**Configuration options:**
- `layout`: Choose between `default` (no sidebar), `sidebar` (left sidebar), or `sidebar-right` (right sidebar)
- `sidebarWidth`: Set the percentage width of the sidebar (e.g., "25" for 25%)
- `narrowContent`: When set to `true` (default), limits the blog content width to 720px for optimal readability. Set to `false` for full-width content
- `showCategories`: Display category links in the sidebar
- `showRecentPosts`: Display recent posts in the sidebar
- `recentPostCount`: Number of recent posts to show in the sidebar
- `listStyle`: Choose between `simple` (title and date only) or `summary` (includes excerpt)

##### Blog Post Features

**Related Posts**

The theme automatically shows related posts at the end of each blog post based on shared tags and publish dates. This is powered by Hugo's built-in related content feature.

**Table of Contents**

Enable a table of contents for any blog post by adding these parameters to your post's frontmatter:

```yaml
---
toc: true
tocSticky: true  # optional, makes TOC sticky on desktop
---
```

The TOC automatically generates from your post headings and only appears when the post has more than 400 words.

**Social Sharing**

Social sharing buttons are enabled by default for all blog posts. You can customize which platforms appear in your `hugo.toml`:

```toml
[params.sharing]
  enabled = true
  twitter = true
  linkedin = true
  facebook = true
  email = true
```

**Comments**

The theme supports popular comment systems. Configure in your `hugo.toml`:

```toml
[params.comments]
  enabled = true
  provider = "giscus"  # options: "disqus", "giscus", "utterances"
  
  # For Giscus (GitHub Discussions)
  [params.comments.giscus]
    repo = "username/repo"
    repoId = "your-repo-id"
    category = "General"
    categoryId = "your-category-id"
  
  # For Utterances (GitHub Issues)
  [params.comments.utterances]
    repo = "username/repo"
    issueTerm = "pathname"
    theme = "preferred-color-scheme"
```

For Disqus, set your `disqusShortname` in the site configuration.

**Reading Time & Metadata**

Blog posts automatically display:
- Estimated reading time
- Word count
- Publication date
- Last modified date (if `lastmod` is set in frontmatter)

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

The experience can be displayed in several locations and different styles:

| Shortcode usage | Experience page | Single experience item | Print-friendly list |
|---------------|----------------|----------------|----------------|
| ![Experience list with shortcode](https://github.com/user-attachments/assets/7e974632-824c-494c-9dbc-67bb96992517) | ![Experience page](https://github.com/user-attachments/assets/ad53f815-2bd4-4723-a9a1-28be2c01461a) | ![Single experience page](https://github.com/user-attachments/assets/97a20b98-df5c-4e07-9b2e-d7aba75ec81b) | ![CV Experience](https://github.com/user-attachments/assets/7d2d7e4b-a23c-4be7-9617-da7232ea11a7) |
| Experience list rendered via shortcode | Experience list in /experience | Experience item in in single page | Full-width print-friendly experience 
| [🔗](https://adritian-demo.vercel.app/#experience-single) By using the shortcode `experience-section`: in a page (such as your homepage), with a limited number of experiences (controlled by the config parameter `homepageExperienceCount` in the file `hugo.toml`). The summary is displayed, as well as an introduction text and optional links | [🔗](https://adritian-demo.vercel.app/experience) Automatically, in the **Experience page**, in `/experience`, with a list of all experiences (no limit). The summary is displayed for each item, as well as a introduction text and optional links. | [🔗](https://adritian-demo.vercel.app/experience/job-1/) Individual experience page (such as `/experience/job-1`), where all details are displayed, and links to the other descriptions are available to navigate. | [🔗](https://adritian-demo.vercel.app/cv) Using the shortcode `experience-list` you can generate a list of experience that is not interactive - good for print-friendly layouts.

## Troubleshooting

This theme is a version of the one found on my website [adrianmoreno.info](https://www.adrianmoreno.info). If you run into trouble, [you can check the code on my website](https://github.com/zetxek/adrianmoreno.info) for reference.

If you have improvements for the theme, you are very welcome to make a PR if you are able 💕. Otherwise - see below for how to get help (and maybe help others with the same problem).

## Testing

The theme includes comprehensive E2E tests using Playwright to ensure all features work correctly.

### Running Tests

```bash
# Run all tests
npm test

# Run E2E tests only
npm run test:e2e

# Run new features tests specifically
npm run test:e2e:new-features

# Run tests in UI mode (interactive)
npm run test:e2e:ui
```

### Test Coverage

The test suite includes **27 comprehensive tests** for the new blog features:
- Related Posts functionality
- Social Sharing buttons (Twitter, LinkedIn, Facebook, Email)
- Table of Contents generation and navigation
- Enhanced reading metadata (reading time, word count, dates)
- Dark mode compatibility
- Responsive design
- Accessibility features
- Multilingual support
- Performance validation

See `tests/README.md` for detailed testing documentation.

### Common issues 

- The site fails to build. Look for the last line of the stacktrace - if you find mentions to missing files, such as in
```
Error: error building site: TOCSS: failed to transform "/scss/adritian.scss" (text/x-scss): ".../.cache/hugo_cache/modules/filecache/modules/pkg/mod/github.com/zetxek/adritian-free-hugo-theme@v1.5.6/assets/scss/adritian.scss:1:1": File to import not found or unreadable: bootstrap/bootstrap.
```
Make sure that you have the dependencies installed. Check the troubleshooting steps in the [following issue](https://github.com/zetxek/adritian-free-hugo-theme/issues/194#issuecomment-2634193132).

- The site renders in a weird-looking way, or you miss content. Check that the co
