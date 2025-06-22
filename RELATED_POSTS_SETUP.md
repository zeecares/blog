# Related Posts Feature Implementation

This document describes the implementation of a related posts feature for your bilingual Jekyll blog.

## Files Created/Modified

### New Files

1. **`_includes/related-posts.html`** - Main related posts component
2. **`_sass/minima/related-posts.scss`** - Styling for related posts
3. **`RELATED_POSTS_SETUP.md`** - This documentation file

### Modified Files

1. **`_layouts/post.html`** - Added related posts include
2. **`_data/ui.yml`** - Added translation strings
3. **`_sass/minima/custom-styles.scss`** - Imported related posts styles
4. **Sample posts** - Added tags and categories for demonstration

## Features

### Core Functionality

- **Language-aware**: Only shows related posts in the same language as the current post
- **Smart matching**: Uses tags first, then categories, then recent posts as fallback
- **Responsive design**: Adapts to mobile, tablet, and desktop screens
- **Dark mode support**: Fully compatible with existing dark mode implementation
- **Accessibility**: Includes proper focus states and reduced motion support

### Related Post Discovery Logic

1. **Primary**: Posts with matching tags in the same language
2. **Secondary**: Posts with matching categories in the same language  
3. **Fallback**: Recent posts in the same language (if no tag/category matches)
4. **Limit**: Maximum 5 related posts displayed
5. **Minimum**: Shows fallback message if no posts found

### UI Components

- **Grid layout**: 1 column on mobile, 2 on tablet, 3 on desktop
- **Post cards**: Clean, minimal design matching minima theme
- **Meta information**: Date, language indicator, tags
- **Hover effects**: Subtle animations and visual feedback
- **Fallback section**: Helpful links when no related posts found

## Usage

### Adding Tags and Categories to Posts

To make the related posts feature most effective, add tags and categories to your post front matter:

```yaml
---
title: "Your Post Title"
date: 2023-11-02
lang: en  # or zh
layout: post
categories: [technology, philosophy]
tags: [software-development, quality, testing]
---
```

### Example Front Matter

**English Post:**
```yaml
---
title: "Thoughts on Quality"
date: 2023-11-02
lang: en
layout: post
categories: [philosophy, technology]
tags: [quality, qa, software-development, feng-shui, philosophy]
---
```

**Chinese Post:**
```yaml
---
title: "关于质量的思考"
date: 2023-11-02
lang: zh
layout: post
categories: [哲学, 技术]
tags: [质量, 质量保证, 软件开发, 风水, 哲学]
---
```

## Configuration

You can customize the related posts feature by adding configuration options to your `_config.yml`:

```yaml
# Related posts configuration
related_posts:
  enabled: true           # Enable/disable the entire feature
  max_posts: 5           # Maximum number of related posts to show
  fallback_enabled: true # Show fallback section when no related posts found
```

### Configuration Options

- **`enabled`** (default: `true`): Set to `false` to completely disable related posts
- **`max_posts`** (default: `5`): Maximum number of related posts to display
- **`fallback_enabled`** (default: `true`): Whether to show fallback content when no related posts are found

## Customization

### Styling

The related posts component uses CSS custom properties (variables) that automatically adapt to your dark mode implementation. Key variables used:

- `--bg-color` - Background colors
- `--text-color` - Primary text
- `--accent-color` - Secondary text/meta info
- `--link-color` - Links and highlights
- `--border-color` - Borders and dividers
- `--shadow-color` - Drop shadows

### Layout

You can modify the grid layout by editing `_sass/minima/related-posts.scss`:

```scss
.related-posts-grid {
  grid-template-columns: 1fr; // Mobile: 1 column
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr); // Tablet: 2 columns
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr); // Desktop: 3 columns
  }
}
```

### Translation Strings

Add or modify translation strings in `_data/ui.yml`:

```yaml
en:
  related_posts: "Related Posts"
  more_posts: "More Posts"
  no_related_posts: "No related posts found. Explore more content below."
  browse_all_posts: "Browse All Posts"
  view_posts_in: "View Posts in"

zh:
  related_posts: "相关文章"
  more_posts: "更多文章"
  no_related_posts: "没有找到相关文章。请浏览下面的更多内容。"
  browse_all_posts: "浏览所有文章"
  view_posts_in: "查看"
```

### Algorithm Tuning

You can modify the related posts algorithm in `_includes/related-posts.html`:

- Change the maximum number of related posts (currently 5)
- Adjust tag/category matching logic
- Modify the fallback behavior
- Add content similarity matching

## Testing

To test the related posts feature:

1. **Add tags/categories** to several posts in both languages
2. **Build the site**: `bundle exec jekyll build`
3. **Serve locally**: `bundle exec jekyll serve`
4. **Visit post pages** to see related posts in action

## Browser Support

- **Modern browsers**: Full support with animations and grid layout
- **Older browsers**: Graceful degradation with flexbox fallback
- **Print styles**: Clean, minimal layout for printing
- **Accessibility**: Screen reader friendly with proper ARIA labels

## Performance

- **CSS**: Minimal impact, uses existing theme variables
- **JavaScript**: None required, pure Jekyll/Liquid implementation
- **Build time**: Minimal impact on site generation time
- **Runtime**: No client-side processing needed

## Troubleshooting

### No related posts showing
- Check that posts have the `lang` front matter variable
- Ensure posts have tags or categories
- Verify the include is properly added to `post.html`

### Styling issues
- Ensure `related-posts.scss` is imported in `custom-styles.scss`
- Check that CSS custom properties are defined in your theme
- Verify dark mode variables are properly set

### Build errors
- Check Liquid syntax in `related-posts.html`
- Ensure all translation strings exist in `ui.yml`
- Verify Jekyll version compatibility

## Future Enhancements

Potential improvements you could implement:

1. **Content similarity**: Analyze post content for better matching
2. **Click tracking**: Track which related posts are clicked
3. **Caching**: Cache related posts for better performance
4. **Manual overrides**: Allow manual specification of related posts
5. **Social signals**: Use engagement metrics for relevance scoring

## Integration Complete

The related posts feature is now fully integrated into your blog. Every post will automatically show relevant related posts based on tags, categories, and language, with a clean, responsive design that matches your existing minima theme and supports dark mode.