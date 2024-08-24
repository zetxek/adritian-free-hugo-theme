---
date: '{{ .Date }}' # date in which the content is created - defaults to "today"
title: '{{ replace .File.ContentBaseName `-` ` ` | title }}'
draft: false # set to "true" if you want to hide the content 
jobTitle: "" # job description/title. Fill-in
company: "" # name of the company you worked for. Fill-in
location: "" # place/city/country for the experience. Fill-in.
duration: "" # from-to, for example "2022-2024". Fill-in.

## For the content, you can use a title and a job description.
## For example:
# ### Fixing the world, one byte at a time
# The beginning of a great career. 
# 
---
