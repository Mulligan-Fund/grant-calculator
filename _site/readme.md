# Grant Calculator
### Built with support by Peak Grantmakers, New America, Mulligan Fund, All Tomorrow's Parties

### Setup/Install
Setup Jekyll Locally (Ruby)
```
gem install jekyll bundler
git pull <thisrepo>
bundle exec jekyll serve
```


Deploy to staging
```
Note: Currently just gh-pages
```

Deploy to Production
```
Note: Currently just gh-pages
Ensure that CNAME is set for gh-pages (settings)
```


### Configuration
##### _config.yml
Primary configuration file. Vanilla save for following parameters.
```
future: false
```

##### data/grantseeker.yml
hiring.yml contains the open (and closed) positions on the hiring page data configuration.
The position descriptions can be markdown, following [this stackoverflow](https://stackoverflow.com/questions/29681237/render-markdown-from-a-yaml-multiline-string-in-a-jekyll-data-file)
```
- label: What Kind of Grant is This? #Date to submit by
  type: Dropdown
  content: Support, New Project, Drop
  default: What kind of support?
```


##### post/yyyy-mm-dd-filename.markdown
Blog posts are not fully implemented, but the framework is there to quickly establish and deploy. Blogposts can be added to `_posts` and can be simply added to a future design rendering through the same template.
```
---
layout: post (corresponds to _layouts/post.html)
title:  "Post Title"
date:   2017-09-28 21:21:24 -0400 # Date it publishes
categories: Advice
img: /img/post/whatever_main_image.png
---
Content of blogpost _in_ *markdown*
```


### Structure
- `_data` - Contains data yml files
- `_includes` - Partials eg. header, footer, etc.
- `_layouts` - Page (see Index)
- `_pages` - Folder for custom pages
- `_posts` - Folder for blog posts, eg. 20171001_title.md
- `_sass` - Pre-compiled sass files
- `_site` - Compiled static site
- `_css` - Compiled static css
- `fonts` - Statically served fonts
- `img` - Statically served images
- `js` - Statically served Javascript

### Main files
- `index.html` - Primary index file
- `readme.md` - That's me.
