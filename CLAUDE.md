# Claude Code Configuration - Personal Blog

This is Zee's personal Jekyll blog configured for GitHub Pages deployment.

## Project Overview
- **Framework**: Jekyll with Minima theme
- **Language**: Ruby/Liquid templating
- **Deployment**: GitHub Pages
- **URL**: https://zeecares.github.io (after repository rename)

## Development Commands

### Easy Bilingual Blog Management (NEW!)
```bash
# Create new blog post (defaults to English)
./blog.sh new "My Post Title"
./blog.sh new "My Post Title" --lang en
./blog.sh new "我的博客" --lang zh

# Create draft post
./blog.sh draft "Work in Progress" --lang en
./blog.sh draft "进行中的工作" --lang zh

# Edit existing post (searches by keyword)
./blog.sh edit "metaphor"

# Create translation template
./blog.sh translate "metaphor" zh    # Translate to Chinese
./blog.sh translate "joy" en         # Translate to English

# Publish draft to live blog
./blog.sh publish-draft "work"

# List posts (optionally filter by language)
./blog.sh list
./blog.sh list --lang en
./blog.sh list-all --lang zh

# Start local server
./blog.sh serve

# Deploy to GitHub (commit + push)
./blog.sh deploy

# Show help
./blog.sh help
```

### Traditional Jekyll Commands
```bash
# Install dependencies
bundle install

# Serve locally (with live reload)
bundle exec jekyll serve --livereload

# Build for production
bundle exec jekyll build

# Update gems
bundle update

# Check for security vulnerabilities
bundle audit
```

## Project Structure
- `_config.yml` - Site configuration
- `_posts/` - Published blog posts (YYYY-MM-DD-title.md format)
- `_drafts/` - Draft posts (not published) - NEW!
- `_templates/` - Post templates (default, photo, link) - NEW!
- `_layouts/` - HTML templates
- `_includes/` - Reusable HTML components
- `_sass/` - Custom styles
- `assets/` - Static files (CSS, images)
- `pic/` - Blog post images
- `blog.sh` - Blog management script - NEW!

## Content Management

### Quick Bilingual Workflow (Recommended)
1. **Create new post**: `./blog.sh new "Post Title" --lang en`
2. **Write content** (opens in your editor automatically)
3. **Translate if needed**: `./blog.sh translate "keyword" zh`
4. **Deploy**: `./blog.sh deploy`

### Draft Workflow
1. **Create draft**: `./blog.sh draft "Work in Progress" --lang en`
2. **Edit anytime**: `./blog.sh edit "work"`
3. **Publish when ready**: `./blog.sh publish-draft "work"`
4. **Deploy**: `./blog.sh deploy`

### Translation Workflow
1. **Write original post** in your preferred language
2. **Generate translation template**: `./blog.sh translate "keyword" [target-lang]`
3. **Edit and complete translation** (opens both files side-by-side)
4. **Update language pairs** in `_data/languages.yml` if needed

### Manual Post Creation (Traditional)
- Place in `_posts/` directory
- Use format: `YYYY-MM-DD-title.md`
- Include front matter:
```yaml
---
layout: post
title: "Your Post Title"
date: YYYY-MM-DD
---
```

### Adding Images
- Store in `pic/` directory
- Reference in posts: `![alt text](/pic/image.png)`

### Post Templates
- **Default**: Standard blog post (`default.md`, `default-en.md`, `default-zh.md`)
- **Photo**: Image-focused post (`photo.md`)
- **Link**: Link sharing with commentary (`link.md`)

### Bilingual Features
- **Language Switcher**: Toggle between English and Chinese on homepage
- **Auto-Translation Templates**: Generate paired language posts
- **Language Indicators**: Posts show their language and translation status
- **Smart Filtering**: Homepage filters posts by selected language
- **Translation Links**: Easy navigation between language versions

## Theme Customization
- Main styles: `_sass/minima/custom-styles.scss`
- Variables: `_sass/minima/custom-variables.scss`
- Custom head elements: `_includes/custom-head.html`

## Configuration Notes
- Site uses Minima theme with custom modifications
- Google Analytics enabled (UA-167900064-1)
- Social links configured for multiple platforms
- SEO plugin enabled

## Security
- Update dependencies regularly with `bundle update`
- Monitor GitHub security alerts
- Current vulnerabilities: 15 (check Dependabot alerts)

## Deployment
- Auto-deploys from master branch via GitHub Pages
- No manual deployment needed
- Changes go live within minutes of push

## Common Tasks
- **New post**: Create file in `_posts/` with proper naming
- **Update theme**: Modify files in `_sass/minima/`
- **Add pages**: Create `.md` files in root directory
- **Update config**: Edit `_config.yml` and restart local server