---
title: 'Theme shortcodes'
date: 2025-02-14T14:38:33+02:00
draft: false
type: 'blog'
tags: 
  - adritian
  - guide
---

Shortcodes are a convenient [functionality of Hugo](https://gohugo.io/content-management/shortcodes/), allowing you to embed templates or layouts within other content.

Some of the example built-in shortcodes are Instagram posts, YouTube videos, QR codes, etc. You can find [the full list in the official docs](https://gohugo.io/content-management/shortcodes/#embedded).

The theme provides custom shortcodes to allow you to customize your landing page as you want:

- `toc`: Generates a styled table of contents from page headings.
- `education-list`: Displays a list of educational qualifications.
- `experience-list`: Shows a list of professional experiences.
- `platform-links`: Embeds links to various platforms with icons.
- `newsletter-section`: Adds a section for newsletter subscription.
- `link`: Creates a hyperlink with an icon.
- `experience-section`: Inserts a detailed experience section.
- `contact-section`: Adds a contact information section, with a customizable form and information.
- `client-and-work-section`: Displays a section for clients and work.
- `about-section`: About section, with image, buttons for call to action and image.
- `testimonial-section`: Adds references from customers, colleagues, etc.
- `showcase`: two-column block with a full-width image to the left, and a text snippet to the right. Great for a call to action or introduction of the person (assuming it's a personal website).
- `text-section`: utility shortcode used to render text in some parts of the theme where it would otherwise be full-width, appearing "too floaty". See [the github issue #260 for context](https://github.com/zetxek/adritian-free-hugo-theme/issues/260).
- `spacer`: Adds vertical spacing before the next element.

The shortcodes can be customized with different arguments:

- `toc`: Automatically generates a table of contents from the page's headings (H2, H3, etc.)
  - `heading`: Custom heading text for the table of contents. Defaults to "Table of Contents".
  - `showHeading`: Boolean value to show or hide the heading. Defaults to true.
  - `class`: Custom CSS class for styling. Defaults to "table-of-contents".
  - **Features**:
    - Only displays if the page contains headings
    - Supports nested heading levels with proper indentation
    - Responsive design with dark mode support
    - Smooth scrolling to sections
    - Clean, modern styling with hover effects
  - **Usage Examples**:
    - `{{</* toc */>}}`: Basic table of contents with default settings
    - `{{</* toc heading="Contents" */>}}`: Custom heading
    - `{{</* toc showHeading=false */>}}`: Hide the heading
    - `{{</* toc class="sidebar-toc" */>}}`: Custom CSS class
    - `{{</* toc heading="Article Contents" class="custom-toc" */>}}`: Multiple parameters

- `education-list`:
  - `title`: The title of the education section.
  - `items`: A list of educational qualifications, they're provided by the `education` content type pages. From each, the `year`, `university`, and `degree` will be used.  
  - `sectionId`: Optional. Overrides the default HTML id for the section. If not provided, the default id is used.

- `experience-list`:
  - `title`: The title of the experience section (optional). When provided, an h2 heading is added above the list.
  - `padding`: Controls whether the section has padding. Set to "true" by default.
  - `items`: A list of professional experiences, coming from the `experience` content type. For each of them, the `companyLogo`, `duration`, `jobTitle`, `location`, and `Content` are used.
  - **Note**: On mobile devices, a separator line is automatically added between experience entries for better readability.
  - `sectionId`: Optional. Overrides the default HTML id for the section. If not provided, the default id is used.

- `platform-links`:
  - `platforms`: A container to place social links inside. Usually you'll want to use it with a list of `link` nested (see below) 
  - `sectionId`: Optional. Overrides the default HTML id for the section. If not provided, the default id is used.

- `link`: links to social platforms (facebook, linkedin, etc)
  - `url`: The URL for the hyperlink.
  - `icon`: The icon to display with the link.
  - `sectionId`: Optional. Overrides the default HTML id for the section. If not provided, the default id is used.

- `newsletter-section`:
  - **Form Configuration**:
    - `form_action`: The URL where the newsletter form data will be submitted. Falls back to site data configuration (typically set in data/homepage.yaml).
    - `form_method`: The HTTP method for form submission (typically "POST" or "GET"). Falls back to site data configuration.
  - **Section Content**:
    - `newsletter_title`: Sets the main heading/title for the newsletter section. Falls back to i18n value "newsletter_title".
    - `newsletter_placeholder`: Placeholder text displayed in the email input field. Falls back to i18n value "newsletter_placeholder".
    - `newsletter_button`: Text displayed on the subscription button. Falls back to i18n value "newsletter_button".
  - **Response Messages**:
    - `newsletter_success_message`: Message displayed to users after successful subscription. Falls back to i18n value "newsletter_success_message".
    - `newsletter_error_message`: Message displayed to users if subscription fails. Falls back to i18n value "newsletter_error_message".
    - `newsletter_note`: Small text/disclaimer shown below the form (typically mentions privacy policy). Falls back to i18n value "newsletter_note".
  - `sectionId`: Optional. Overrides the default HTML id for the section. If not provided, the default id is used.

- `experience-section`:
  - `title`: The title of the experience section.
  - `experiences`: A detailed list of experiences, coming from the `experience` content type pages.
  - `sectionId`: Optional. Overrides the default HTML id for the section. If not provided, the default id is used.

- `contact-section`:
  - `title`: Sets the main heading/title for the contact section. Falls back to the i18n value "contact_title" if not provided.
  - **Form Configuration**:
    - `form_action`: The URL where the form data will be submitted. Commonly used with services like Formspree. Falls back to site data configuration.
    - `form_method`: The HTTP method for form submission (typically "POST" or "GET"). Falls back to site data configuration.
  - **Form Field Placeholders**:
    - `contact_form_name`: Placeholder text for the name input field. Falls back to i18n value.
    - `contact_form_email`: Placeholder text for the email input field. Falls back to i18n value.
    - `contact_form_phone`: Placeholder text for the phone input field. Falls back to i18n value.
    - `contact_form_message`: Placeholder text for the message textarea. Falls back to i18n value.
    - `contact_form_rows`: Number of rows for the message textarea. Defaults to 2 if not specified.
    - `contact_button`: Text for the form submission button. Falls back to i18n value.
  - **Contact Information**:
    - `contact_phone_title`: Heading for the phone contact section. Falls back to i18n value.
    - `contact_phone_number`: Phone number to display. Falls back to i18n value.
    - `contact_email_title`: Heading for the email contact section. Falls back to i18n value.
    - `contact_email_email`: Email address to display. Falls back to i18n value.
    - `contact_address_title`: Heading for the address section. Falls back to i18n value.
    - `contact_address_address`: Physical address or location information. Falls back to i18n value.
  - `sectionId`: Optional. Overrides the default HTML id for the section. If not provided, the default id is used.

- `client-and-work-section`: this shortcode doesn't use as many arguments - as much of the content comes from other content pages.
  - `title`: The title of the client and work section.
  - `clients`: A list of clients, coming from the `client` content type (each with `title`, `link`, `logo`)
  - `projects`: A list of projects, coming from the `project` content type (each with `title`, `content`, `button.URL`, `button.btnText`, `button.icon`, `image`).
  - `sectionId`: Optional. Overrides the default HTML id for the section. If not provided, the default id is used.

- `about-section`:
  - Content Arguments
    - `title` - Sets the heading text for the about section. Falls back to the i18n value `about_title` if not provided.

    - `content` - HTML content for the about section body. Falls back to the i18n value `about_content` if not provided.

    - `imgSrc` - Specifies the path to the image displayed in the about section. Falls back to the image defined in site data if not provided.

    - `imgWidth` - Specifies the width for the image.

    - `imgHeight` - Specifies the height for the image.

    - `imgScale` - Specifies the scale used for the image (for example, `0.5` if the high resolution image is double the size of the smaller one). Only considered if neither `imgWidth` nor `imgHeight` is used.

    - `headingLevel` - Controls the HTML heading tag used for the section title. Accepts `"1"` through `"6"`. Defaults to `"2"` (`<h2>`), which is correct when the page already has an `<h1>` (e.g. a preceding `showcase-section`). Set to `"1"` if this is the first or only heading on the page to maintain a valid heading hierarchy.

    - `v_align` - Controls the vertical alignment of the text content relative to the image. Accepts `"center"` (default), `"top"`, or `"bottom"`.
    - `text_align` - **Deprecated**: Use `v_align` instead. Maintains backwards compatibility.
    - `h_align` - Controls the horizontal alignment of the text content. Accepts `"left"` (default), `"center"`, or `"right"`.

    **Alignment Examples**:
    - `v_align="center" h_align="left"` - Text vertically centered, left-aligned (default)
    - `v_align="top" h_align="center"` - Text at top, horizontally centered
    - `v_align="bottom" h_align="right"` - Text at bottom, right-aligned

    - Button Arguments
      - `button_icon` - Icon class to display before the button text. Falls back to site data.
      - `button_url` - Target URL for the button. Falls back to site data.
      - `button_text` - Text label for the button. Falls back to the i18n value `about_button`. Leave empty to hide the button.

  - `sectionId`: Optional. Overrides the default HTML id for the section. If not provided, the default id (`about`) is used.

  - `testimonial-section`:
    - `title`: The title of the testimonial section.
    - `testimonials`: A list of testimonials, provided by the `testimonial` content type pages. The partial dynamically pulls content from pages with type "testimonial". Each testimonial page should include:
      - `Content`: The main testimonial text (the actual quote)
      - Meta Information:
        - `name`: The name of the person giving the testimonial
        - `position`: The job title or role of the person giving the testimonial
        - `image.src`: Path to the image of the testimonial author
    - `sectionId`: Optional. Overrides the default HTML id for the section. If not provided, the default id is used.

- `showcase`: 
  - **Content Arguments**:
    - `title`: Sets the main heading/title for the showcase section. Falls back to the i18n value "showcase_title".
    - `subtitle`: Sets the subtitle text that appears below the main heading. Falls back to the i18n value "showcase_subtitle".
    - `description`: Contains the HTML content or description text for the showcase section. Falls back to the i18n value "showcase_description".
  - **Button Configuration**:
    - `button_text`: Text label to display on the button. If not provided or set to false, the button will not be displayed.
    - `button_icon`: Icon class to display before the button text. Falls back to the icon from site data.
    - `button_url`: Target URL for the button. Falls back to the URL from site data.
  - **Image Configuration**:
    - `imgSrc`: Specifies the path to the image displayed in the showcase section. Falls back to the image defined in site data.
    - `imgWidth` - Specifies the width for the image.
    - `imgHeight` - Specifies the height for the image.
    - `imgScale` - Specifies the scale used for the image (for example, `0.5` if the high resolution image is double the size of the smaller one) This is only considered if neither imgWidth nor imgHeight is used.
    - `imgShape` - Optional. Clips the image to a predefined shape. Accepted values: `circle` (circular crop, `aspect-ratio: 1:1`) or `rounded` (softly rounded corners). Omit to keep the default rectangular display. Can also be set via `data/homepage.yaml` under `showcase.image.shape`.
  - **Social Media**:
    - `social_links`: Array of social media platform links to display at the bottom of the showcase. Each item should have a URL and icon property.
  - **Responsive Behavior**:
    - The showcase uses a two-column layout on desktop devices (≥768px) and stacks columns vertically on mobile devices, with the image appearing above the text content.
  - **Inner Content**:
    - The shortcode can also accept inner content that will be rendered in a separate div with class "inner-content".
  - `sectionId`: Optional. Overrides the default HTML id for the section. If not provided, the default id is used.

- `text-section`: 
  - **Content Arguments**:
    - `title`: Sets the main heading/title for the text section (optional).
    - `subtitle`: Sets the subtitle text that appears below the main heading (optional).
  - **Layout Options**:
    - `padding`: Controls whether the section has padding. Set to "true" by default.
    - `centered`: When set to "true", adds flexbox classes to center the content both horizontally and vertically. Set to "false" by default.
  - **Inner Content**:
    - The shortcode accepts markdown-formatted inner content that will be rendered in the text section.
  - `sectionId`: Optional. Overrides the default HTML id for the section. If not provided, the default id is used.

- `spacer`: 
  - **Size Options**:
    - `size`: Controls the amount of vertical spacing. Accepts "small", "medium" (default), "large", or "xlarge".
  - **Usage Examples**:
    - `{{</* spacer */>}}`: Adds medium spacing (default)
    - `{{</* spacer size="small" */>}}`: Adds minimal spacing
    - `{{</* spacer size="large" */>}}`: Adds substantial spacing
    - `{{</* spacer size="xlarge" */>}}`: Adds maximum spacing
  - `sectionId`: Optional. Overrides the default HTML id for the section. If not provided, the default id is used.

You can see them in effect in:
- [the homepage](/) [`(see source)`](https://raw.githubusercontent.com/zetxek/adritian-demo/refs/heads/main/content/home.md).
- [the CV page](/cv) [`(see source)`](https://raw.githubusercontent.com/zetxek/adritian-demo/refs/heads/main/content/cv.md).
