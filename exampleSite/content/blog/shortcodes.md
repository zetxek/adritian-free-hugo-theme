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
- `showcase`: 

The shortcodes can be customized with different arguments:

- `education-list`:
  - `title`: The title of the education section.
  - `items`: A list of educational qualifications, they're provided by the `education` content type pages. From each, the `year`, `university`, and `degree` will be used.  

- `experience-list`:
  - `title`: The title of the experience section.
  - `items`: A list of professional experiences, coming from the `experience` content type. For each of them, the `companyLogo`, `duration`, `jobTitle`, `location`, and `Content` are used.

- `platform-links`:
  - `platforms`: A container to place social links inside. Usually you'll want to use it with a list of `link` nested (see below) 

- `link`: links to social platforms (facebook, linkedin, etc)
  - `url`: The URL for the hyperlink.
  - `icon`: The icon to display with the link.
   
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

- `experience-section`:
  - `title`: The title of the experience section.
  - `experiences`: A detailed list of experiences, coming from the `experience` content type pages.

- `contact-section`:
  - `title`: Sets the main heading/title for the contact section. Falls back to the i18n value "contact_title" if not provided.
  - **Form Configuration**:
    - `form_action`: The URL where the form data will be submitted. Commonly used with services like Formspree. Falls back to site data configuration.
    - `form_method`: The HTTP method for form submission (typically "POST" or "GET"). Falls back to site data configuration.
  - **Form Field Placeholders**:
    - `contact_form_name`: Placeholder text for the name input field. Falls back to i18n value.
    - `contact_form_email`: Placeholder text for the email input field. Falls back to i18n value.
    - `contact_form_message`: Placeholder text for the message textarea. Falls back to i18n value.
    - `contact_button`: Text for the form submission button. Falls back to i18n value.
  - **Contact Information**:
    - `contact_phone_title`: Heading for the phone contact section. Falls back to i18n value.
    - `contact_phone_number`: Phone number to display. Falls back to i18n value.
    - `contact_email_title`: Heading for the email contact section. Falls back to i18n value.
    - `contact_email_email`: Email address to display. Falls back to i18n value.
    - `contact_address_title`: Heading for the address section. Falls back to i18n value.
    - `contact_address_address`: Physical address or location information. Falls back to i18n value.


- `client-and-work-section`: this shortcode doesn't use as many arguments - as much of the content comes from other content pages.
  - `title`: The title of the client and work section.
  - `clients`: A list of clients, coming from the `client` content type (each with `title`, `link`, `logo.x`, `logo_.2x`)
  - `projects`: A list of projects, coming from the `project` content type (each with `title`, `content`, `button.URL`, `button.btnText`, `button.icon`, `image.x`, `image._2x`).

- `about-section`:
  - Content Arguments
    - `intro_title` - Sets the main heading/title for the about section. Falls back to the title from site data if not provided.

    - `intro_description` - Contains the HTML content or description text for the about section. Falls back to the content from site data if not provided.

    - `image` - Specifies the path to the image displayed in the about section. Falls back to the image defined in site data if not provided.

    - Primary Button Arguments
      - `button1_enable` - Boolean value to show or hide the primary button. Defaults to the value from site data.

      - `button1_icon` - icon class to display before the button text. Falls back to the icon from site data.

      - `button1_url` - Target URL for the primary button. Falls back to the URL from site data.

      - `button1_text` - Text label to display on the primary button. Falls back to the text from site data.

    - Secondary Button Arguments
      - `button2_enable` - Boolean value to show or hide the secondary button. Defaults to the value from site data.

      - `button2_icon` - FontAwesome or icon class to display before the button text. Falls back to the icon from site data.

      - `button2_url` - Target URL for the secondary button. Falls back to the URL from site data.

      - `button2_text` - Text label to display on the secondary button. Falls back to the text from site data.

  - `testimonial-section`:
    - `title`: The title of the testimonial section.
    - `testimonials`: A list of testimonials, provided by the `testimonial` content type pages. The partial dynamically pulls content from pages with type "testimonial". Each testimonial page should include:
      - `Content`: The main testimonial text (the actual quote)
      - Meta Information:
        - `name`: The name of the person giving the testimonial
        - `position`: The job title or role of the person giving the testimonial
        - `image.x`: Path to regular resolution image of the testimonial author
        - `image._2x`: Path to high resolution (2x) image of the testimonial author for retina displays



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
    - `image`: Specifies the path to the regular resolution image displayed in the showcase section. Falls back to the image defined in site data.
    - `image2x`: Specifies the path to the high resolution (2x) image for retina displays. Falls back to the image defined in site data.
  - **Social Media**:
    - `social_links`: Array of social media platform links to display at the bottom of the showcase. Each item should have a URL and icon property.
  - **Inner Content**:
    - The shortcode can also accept inner content that will be rendered in a separate div with class "inner-content".

You can see them in effect in:
- [the homepage](/) [`(see source)`](https://raw.githubusercontent.com/zetxek/adritian-demo/refs/heads/main/content/home.md).
- [the CV page](/cv) [`(see source)`](https://raw.githubusercontent.com/zetxek/adritian-demo/refs/heads/main/content/cv.md).
