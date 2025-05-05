+++
title =  "Footer"
type = "footer"
draft = false
+++


{{< contact-section
    title="Reach out"
    name_placeholder="Your name?"
    email_placeholder="Your e-mail"
    message_placeholder="Your text"
    button_text="Send message"
    phone_placeholder="Your phone"
    phone_heading="My phone"
    phone="+45 555 666 777"
    email_heading="My mail"
    email="demo@demosite.com"
    location_heading="My location"
    location="🇩🇰 Denmark"
    form_action="https://formspree.io/f/mail@example.com"
    form_method="POST"
>}}

{{< newsletter-section 
    newsletter_title="Stay updated"
    newsletter_placeholder="Enter your email"
    newsletter_button="Subscribe"
    newsletter_success_message="Thank you for subscribing!"
    newsletter_error_message="Something went wrong, please try again."
    newsletter_note="We respect your privacy and won't share your data."
    form_action="/"
    form_method="POST"
>}}


{{< text-section
title="Extra footer content"
centered="true"
>}}
Additional content added after the `section` blocks. 

Here you could freestyle, add other shortcodes, ...  Or just let the content empty, and rely on the shortcode sections alone.

To make the text nicely wrapped in the footer, the shortcode `text-section` is used.
{{< /text-section >}}
