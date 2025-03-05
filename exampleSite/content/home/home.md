+++
title =  "Home"
type = "home"
draft = false
+++


{{< showcase-section
    title="Showcase section"
    subtitle="Subtitle - coming from <code>home.md</code>"
    buttonText="Email"
    description="<strong>Strong</strong> and normal text. This comes from <a href='https://github.com/zetxek/adritian-demo/blob/main/content/home/home.md?plain=1'><code>home.md</code></a>, using the <code>showcase-section</code> shortcode.<br/>Below you can see the social links, provided by the <code>platform-links</code> shortcode."
    image="images/showcase/showcase.png"
    image2x="images/showcase/showcase@2x.png"
 >}}

{{< platform-links >}}
    {{< link icon="square-facebook" url="https://facebook.com/yourpage" >}}
    {{< link icon="square-twitter" url="https://twitter.com/yourpage" >}}
    {{< link icon="linkedin" url="https://www.linkedin.com/in/adrianmoreno/" >}}
    {{< link icon="square-github" url="https://github.com/zetxek" >}}
    {{< link icon="x-twitter" url="https://twitter.com/zetxek" >}}
    {{< link icon="dribbble" url="#" >}}
    {{< link icon="behance" url="#" >}}
    {{< link icon="youtube" url="#" >}}
    {{< link icon="instagram" url="https://www.instagram.com/zetxek/" >}}
    {{< link icon="square-facebook" url="https://www.facebook.com/zetxek/" >}}
    {{< link icon="codepen" url="#" >}}
    {{< link icon="yelp" url="https://www.yelp.com/" >}}
    {{< link icon="bluesky" url="https://www.bluesky.com/" >}}
    {{< link icon="threads" url="https://www.threads.net/" >}}
    {{< link icon="face-smile" url="https://www.adrianmoreno.info/" >}}
    {{< link icon="user" url="https://www.adrianmoreno.info/" >}}
    {{< link icon="quote-left" url="https://www.adrianmoreno.info/" >}}
    {{< link icon="cloud-arrow-down" url="https://www.adrianmoreno.info/" >}}
    {{< link icon="square-xing" url="https://www.adrianmoreno.info/" >}}

{{< /platform-links >}}

{{< /showcase-section >}}

{{< about-section
    title="About me"
    content="This content is using the <code>about-section</code> shortcode. <br/>You can write <code>HTML</code>, as long as you <em>wrap it</em> accordingly. "
    button_icon="icon-user"
    button_text="You can edit the text, link and icon"
    button_url="https://www.google.com"
    image="images/about/user-picture.png"
    image2x="images/about/user-picture@2x.png"

 >}}

{{< education-list
    title="Formal Education (education-list)" >}}

{{< experience-section
    title="My job experience (title)"
    intro_title="Intro (intro_title)"
    intro_description="Description (intro_description).<br>You can use HTML,with <strong>strong</strong> formatting, or lists <ul><li>one</li><li>two</li></ul>" 
    button1_url="https://example.com"
    button1_text="Visit Example"
    button1_icon="icon-globe"
    button2_text="All experience"
    button2_url="/experience"
    button3_text="Button #3"
    button3_url="/experience"
>}}

## Experience (as list)

{{< experience-list >}}

{{< client-and-work-section
    title="A selection of my work" >}} 

{{< testimonial-section
    title="What they say about me" >}}

{{< contact-section
    title="Reach out" 
    contact_form_name="Your name?"
    contact_form_email="Your e-mail"
    contact_form_message="Your text"
    contact_button="Send message"
    contact_phone_title="My phone"
    contact_phone_number="<a href='tel:+555666777'>555 666 777</a>"
    contact_email_title="My mail"
    contact_email_email="demo@demosite.com"
    contact_address_title="My location"
    contact_address_address="🇩🇰 Denmark"
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

## Extra content
Additional content added after the `section` blocks. Here you could freestyle, add other shortcodes, ...  Or just let the content empty, and rely on the shortcode sections alone.
