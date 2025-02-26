+++
title =  "Accueil"
type = "home"
draft = false
+++


{{< showcase-section
    title="Section en vedette"
    subtitle="Sous-titre - provenant de <code>home.md</code>"
    buttonText="E-mail"
    description="Texte en <strong>gras</strong> et normal. Ceci provient de <code>home.md</code>. Non fourni ? utilise i18n par défaut (pour l'instant, pour offrir la compatibilité avec les versions >1.7.0)"
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
    title="À propos de moi"
    content="Utilisation des délimiteurs HTML <code><></code>"
    about_button="Texte du bouton"
    button_icon="info"
    button_text="Vous pouvez modifier ceci"
    button_url="https://www.google.com"
    image="images/about/user-picture.png"
    image2x="images/about/user-picture@2x.png"
 >}}

{{< education-list
    title="Formation académique" >}}

{{< experience-section
    title="Mon expérience professionnelle (section)"
    intro_title="Introduction"
    intro_description="Description.<br>Vous pouvez utiliser HTML, avec du texte en <strong>gras</strong>, ou des listes <ul><li>un</li><li>deux</li></ul>" 
    button1_url="https://example.com"
    button1_text="Visiter l'exemple"
    button1_icon="icon-globe"
    button2_text="Autre bouton (2)"
    button3_text="Bouton #3"
    button3_url="/experience"
    social_links="aaa"
>}}
## Expérience (liste)

{{< experience-list >}}
 

{{< client-and-work-section
    title="Une sélection de mes travaux" >}} 

{{< testimonial-section
    title="Ce qu'ils disent de moi" >}}

{{< contact-section
    title="Contact" 
    contact_form_name="Votre nom ?"
    contact_form_email="Votre e-mail"
    contact_form_message="Votre message"
    contact_button="Envoyer le message"
    contact_phone_title="Mon téléphone"
    contact_phone_number="<a href='tel:+555 666 777'>555 666 777</a>"
    contact_email_title="Mon e-mail"
    contact_email_email="demo@demosite.com"
    contact_address_title="Ma localisation"
    contact_address_address="🇩🇰 Danemark" >}}

{{< newsletter-section 
    newsletter_title="Restez informé"
    newsletter_placeholder="Entrez votre e-mail"
    newsletter_button="S'abonner"
    newsletter_success_message="Merci de votre inscription !"
    newsletter_error_message="Une erreur s'est produite, veuillez réessayer."
    newsletter_note="Nous respectons votre vie privée et ne partagerons pas vos données."
>}}

Additional content added after the `section` blocks:

```
sections = [
  "showcase",
  "about",
  "education",
  "experience",
  "client-and-work",
  "testimonial",
  "contact",
  "newsletter",
]
```