---
date: '{{ .Date }}' # date in which the content is created - defaults to "today"
title: '{{ replace .File.ContentBaseName `-` ` ` | title }}'
draft: false # set to "true" if you want to hide the content 
logo_x: "" # example: "images/clients/asgardia.png"
link: "https://www.adrianmoreno.info" # optional URL to link the logo to; also the "Visit website" button on the project page
# Optional, used by the /projects/ pages:
kind: "" # groups the /projects/ list, e.g. "open-source", "professional", "side-project"
repo: "" # source code URL, shown as a "Source code" button
role: "" # e.g. "Author and maintainer"
status: "" # e.g. "active", "archived"
related: [] # extra URLs listed at the bottom of the project page

params:
    button:
        icon: ""
        btnText: ""
        URL: ""
    image:  
        src: ""
## The content is used for the description of the project
---
