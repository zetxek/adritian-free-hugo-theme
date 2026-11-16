+++
title = 'How to Add Custom Icons to the Adritian Theme'
date = 2025-02-28T08:05:05+01:00
draft = false
featured = true
weight = 100
[images]
  featured_image= '/img/blog/new-icon-3.png'
+++

{{< toc >}}

This guide will walk you through adding custom icons to your Adritian Hugo theme. Whether you need new social media icons, brand logos, or custom symbols, follow these steps to integrate them seamlessly.

## Prerequisites

Before you begin, make sure you have:
- Access to your Hugo site's source files
- Basic understanding of file management
- A web browser to access Fontello

## Overview

The Adritian theme uses a custom icon font generated with [Fontello](https://fontello.bableck.dev/). This is a fork of the original fontello, with additional font options.

To add new icons, you'll need to:

1. Export the current icon configuration
2. Add new icons using Fontello
3. Download and integrate the updated font files
4. Update your site configuration

## Step 1: Export Current Configuration

1. Navigate to your theme's font directory: `static/fonts/`
2. Locate the `config.json` file (see [the downstream version](https://github.com/zetxek/adritian-free-hugo-theme/blob/main/static/fonts/config.json))
3. Keep this file ready - you'll upload it to Fontello

## Step 2: Import Configuration to Fontello

1. Go to [Fontello](https://fontello.bableck.dev/)
2. Click the **import** button (wrench icon)
3. Upload your `config.json` file
4. Fontello will load your current icon set

## Step 3: Add New Icons

![Adding new icons in Fontello](/img/blog/new-icon-3.png)

1. **Browse available icons** in Fontello's library
2. **Click on icons** you want to add (they'll be highlighted)
3. **Configure icon names** by clicking the pencil icon next to each selected icon
4. **Set icon codes** if needed (Fontello usually assigns these automatically)

## Step 4: Download Updated Font

1. Click the **Download webfont** button in Fontello
2. Save the generated ZIP file to your computer
3. Extract the ZIP file contents

## Step 5 (option 1): Update Theme Files Manually

1. **Copy font files** from the downloaded ZIP to `static/fonts/`:
   - Copy `.woff`, `.woff2`, `.ttf`, and `.eot` files
   
2. **Update CSS file**:
   - Open the CSS file from the ZIP
   - **Important**: Replace all instances of `/font` with `/fonts`
   - Copy the updated CSS to your theme's CSS file

3. **Replace config.json**:
   - Copy the new `config.json` from the ZIP to `static/fonts/`

## Step 5 (option 2): Update Theme Files with npm script

You can use the theme helper (https://www.npmjs.com/package/@zetxek/adritian-theme-helper) to update the theme files.

You can read the theme helper font script here: https://www.npmjs.com/package/@zetxek/adritian-theme-helper#user-content-update-font-script

With the following command you can update the theme files with the new icons automatically:
```bash
ts-node scripts/update-font.ts <source> <destination>
```

## Step 6: Using the New Icon

Reference your new icons in your content, as for the [pre-provided icons](/blog/icons/).

## Example Usage

```html
<!-- In your templates -->
<i class="icon-your-new-icon-name"></i>
<!-- In markdown with HTML -->
<i class="icon-your-new-icon-name"></i> Custom Icon Text
<!-- In a markdown file -->
{ {< link icon="icon-your-new-icon-name" url="https://example.com" >} }
```
Note: for the markdown file, no spaces between the curly braces - added so it gets displayed here properly.

## Troubleshooting

### Icons Not Displaying
- **Check file paths**: Ensure fonts are in `static/fonts/`
- **Verify CSS paths**: Make sure `/font` is changed to `/fonts`
- **Clear browser cache**: Force refresh with Ctrl+F5 (or Cmd+Shift+R on Mac)

### Icons Show as Squares
- **Font files missing**: Verify all font files were copied correctly
- **CSS not loaded**: Check that your CSS includes the new icon definitions

### Build Errors
- **Invalid CSS**: Check for syntax errors in your CSS file
- **Missing files**: Ensure all required font files are present

## Best Practices

- **Keep backups**: Save your old `config.json` before making changes
- **Test locally**: Always test icon changes on your local development site first
- **Consistent naming**: Use clear, descriptive names for your custom icons
- **Optimize selection**: Only include icons you actually need to keep font file sizes small
- **Do not modify the theme, override the files in your own project**: Instead of modifying the theme, override the files in your own site project. That will ensure you can update the theme without losing your changes.
- **If your icon choice is a popular one, consider contributing it to the theme**: If you think your icon choice is a popular one, consider contributing it to the theme. That will help other users and make the theme more complete.

## Additional Resources

- [Fontello Documentation](https://github.com/fontello/fontello/wiki/Help)
- [Adritian Theme Icons](/blog/icons/) - View all available icons

---

**Need help?** If you encounter issues following this guide, check the [theme's GitHub repository](https://github.com/zetxek/adritian-free-hugo-theme) for support and examples. If you still need help, you can open a new issue in the [theme's GitHub repository](https://github.com/zetxek/adritian-free-hugo-theme/issues).


