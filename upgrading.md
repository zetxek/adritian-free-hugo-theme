# Upgrading across versions

This documentation is meant to help you upgrade across versions, when potentially breaking changes are introduced.

## v1.2.x to v1.3.x

In `v1.3.x`, the [support for internationalization was added](https://github.com/zetxek/adritian-free-hugo-theme/pull/78).
This means that some of the content previously managed in the `homepage.yaml` file is now managed in `i18n/{language}.yaml`.

For example:
- the main page title was managed in `homepage.yml`:`showcase.title`, now it's managed in `i18n/{language}.yaml`:`logo_text1`
- the page logo was managed in `hugo.toml`:`params.logo` (`text1` and `text2`), now it's managed in `i18n/{language}.yaml`:`logo_text1` and `logo_text2`.

The reason for the change is to allow overriding almost any string in the theme in different content translations. 