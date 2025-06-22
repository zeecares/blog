---
# SEO-Optimized Post Template
# Copy this template for new posts with enhanced SEO

title: "Your Post Title Here"
date: 2023-11-02
lang: en # or zh for Chinese posts
layout: post

# SEO Enhancement Fields (Optional but Recommended)
description: "Custom meta description for this post (150-160 characters ideal)"
image: "/pic/your-featured-image.jpg" # Social media featured image
keywords: [keyword1, keyword2, keyword3] # SEO keywords
categories: [category1, category2] # Post categories
tags: [tag1, tag2, tag3] # Post tags

# Author (falls back to site.author if not specified)
author: Zee

# For redirects from old URLs (optional)
# redirect_from:
#   - /old-url-1/
#   - /old-url-2/

# For posts that are translations
# Make sure to update _data/languages.yml with the pairing
# Example: if this is 2023-11-02-example.en.md, 
# create 2023-11-02-example.zh.md as the Chinese version

# Custom excerpt (optional - auto-generated if not provided)
excerpt: "This is a custom excerpt that will be used in meta descriptions and social media sharing."
---

Your post content goes here...

## SEO Best Practices for Content

### 1. Use Heading Structure
- Use H1 for the main title (automatically generated from front matter)
- Use H2 for main sections
- Use H3 for subsections
- Don't skip heading levels

### 2. Optimize Images
```markdown
![Alt text describing the image](/pic/image-name.jpg)
```

### 3. Internal Linking
Link to other posts on your blog:
- [Link to another post]({% post_url 2023-01-01-another-post %})
- [Link to about page](/about/)

### 4. External Linking
When linking externally, consider using:
```markdown
[External link](https://example.com){:target="_blank" rel="noopener"}
```

### 5. Meta Description Tips
If you don't specify a custom description in front matter:
- The first 160 characters of your post will be used
- Make sure your opening paragraph is compelling
- Include your target keywords naturally

### 6. Image SEO
- Use descriptive file names: `seo-best-practices.jpg` instead of `IMG_001.jpg`
- Always include alt text
- Optimize image size (compress before uploading)
- Use featured images for social sharing

### 7. Keyword Usage
- Include keywords naturally in your content
- Use keywords in headings when appropriate
- Don't stuff keywords - focus on readability
- Use related terms and synonyms

This template ensures your posts are optimized for:
- Search engines (Google, Bing, etc.)
- Social media sharing (Facebook, Twitter, LinkedIn)
- Better user experience
- Improved internal linking structure