# GitHub Copilot Agents for Adritian Hugo Theme

This document provides guidance for AI agents working on the
adritian-free-hugo-theme Theme repository.

## Repository Overview

This repository contains a reusable Hugo theme module authored by Adrián Moreno Peña (@zetxek), originally created as a fork for https://www.adrianmoreno.info.

Now it is a reusable theme, that can be used anywhere. It provides layouts, shortcodes, and partials to build websites such as personal sites, portfolios, blogs, or simple professional sites. It is designed to be flexible and customizable, allowing users to create unique and engaging web experiences.

**Technology Stack:**

- Hugo (extended version 0.92.0+)
- Node.js & npm
- Go modules
- PostCSS & Autoprefixer

## Development Environment

### Prerequisites

- Go (latest version)
- Node.js and npm
- Hugo Extended (version 0.92.0 or later, as specified in hugo.toml)

### Setup Commands

```bash
# Install dependencies
npm install

# Run the development server
make site

# Build the site
make build

# Clean cache and restart
make clean
```

## Project Structure

- `/layouts/` - Hugo layout templates
- `/assets/` - CSS, JavaScript, and other static assets
- `/archetypes/` - Content templates for different types of  content (blog posts, client work, experience, projects and testimonials)
- `/static/` - Static files
- `/i18n/` - Internationalization files
- `hugo.toml` - Main Hugo configuration
- `package.json` - Node.js dependencies and build scripts

## Key Features

This theme supports several types of content, that can be displayed by using customizable shortcodes.

## Development Guidelines

### Making Changes

1. **Local Development**: When developing this theme locally, you can link it to a Hugo site (like [adritian-demo](https://github.com/zetxek/adritian-demo)) using a `replace` directive in the site's `go.mod` file:

   ```go
   replace github.com/zetxek/adritian-free-hugo-theme => ../adritian-free-hugo-theme
   ```

2. **Testing**: Always test changes with an actual site (such as the one in `exampleSite`) to ensure layouts and components work correctly.

3. **Code Style**:
   - Follow existing code patterns and conventions
   - Use meaningful commit messages
   - Keep changes minimal and focused


## Common Tasks for Agents

### Adding New Layouts

- Review existing layouts in `/layouts/` for patterns
- Ensure consistency with the base theme and follow best practices in hugo templating
- Test new layouts with relevant content types
- Execute e2e tests

### Modifying Styles

- CSS/SCSS files are in `/assets/`
- PostCSS is configured via `postcss.config.js`
- Changes should be compatible with the theme's responsive design

### Creating New Archetypes

- Add new content type templates in `/archetypes/`
- Follow the naming convention: `{type}.md`
- Include appropriate front matter defaults

### Updating Dependencies

- Hugo modules: Update `hugo.toml` and run `hugo mod get -u`
- Node packages: Update `package.json` and run `npm install`
- Always test after dependency updates

## Important Notes

### What NOT to Change

- Do not modify or override core Hugo functionality unless absolutely necessary
- Avoid breaking changes that would affect existing sites using this theme
- Do not commit `node_modules/`, `public/`, or `resources/` directories

### Git Workflow

- Follow the git flow described in [CONTRIBUTING.md](./CONTRIBUTING.md)
- Create descriptive pull request titles
- Reference related issues in commits and PRs

## Testing Your Changes

Since this is a theme module, testing requires:

1. **Link to a test site**: Use the adritian-demo repository or create a test site
2. **Verify layouts render correctly**: Check all content types
3. **Test responsive design**: Ensure mobile and desktop views work
4. **Validate navigation**: Menu, breadcrumbs, and links should function properly
5. **Verify multiple languages**: verify that strings have translations

## Resources

- **Starter Template**: [adritian-demo](https://github.com/zetxek/adritian-demo)
- **Hugo Documentation**: [gohugo.io](https://gohugo.io/)
- **Contributing Guide**: [CONTRIBUTING.md](./CONTRIBUTING.md)

## Getting Help

- Check existing issues: [GitHub Issues](https://github.com/zetxek/adritian-free-hugo-theme/issues)
- Review pull requests for examples
- Read the Hugo documentation for theme development patterns