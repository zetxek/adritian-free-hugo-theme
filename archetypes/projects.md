---
date: '{{ .Date }}' # date in which the content is created - defaults to "today"
title: '{{ replace .File.ContentBaseName `-` ` ` | title }}'
draft: false # set to "true" if you want to hide the content 
logo_x: "" # example: "images/clients/asgardia.png"
logo_2x: ""  # example: "images/clients/asgardia@2x.png"
link: "https://www.adrianmoreno.info" # optional URL to link the logo to

params:
    button:
        icon: ""
        btnText: ""
        URL: ""
    image:  
        x: ""
        _2x: ""
## The content is used for the description of the project
---
