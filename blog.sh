#!/bin/bash

# Blog Management Script for Jekyll
# Usage: ./blog.sh [command] [options]

set -e

BLOG_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
POSTS_DIR="$BLOG_DIR/_posts"
DRAFTS_DIR="$BLOG_DIR/_drafts"
TEMPLATES_DIR="$BLOG_DIR/_templates"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}ℹ ${1}${NC}"
}

log_success() {
    echo -e "${GREEN}✓ ${1}${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠ ${1}${NC}"
}

log_error() {
    echo -e "${RED}✗ ${1}${NC}"
}

# Ensure directories exist
setup_dirs() {
    mkdir -p "$DRAFTS_DIR"
    mkdir -p "$TEMPLATES_DIR"
}

# Generate filename from title
generate_filename() {
    local title="$1"
    local date=$(date +%Y-%m-%d)
    local slug=$(echo "$title" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g')
    echo "${date}-${slug}.md"
}

# Create new post
new_post() {
    local title="$1"
    local is_draft="$2"
    local language="$3"
    
    if [ -z "$title" ]; then
        log_error "Please provide a post title"
        echo "Usage: ./blog.sh new \"Post Title\" [--lang en|zh] [--draft]"
        exit 1
    fi
    
    setup_dirs
    
    # Default language is English
    if [ -z "$language" ]; then
        language="en"
    fi
    
    local filename=$(generate_filename "$title")
    # Add language tag to filename
    filename="${filename%.md}.${language}.md"
    
    local target_dir="$POSTS_DIR"
    
    if [ "$is_draft" = "true" ]; then
        target_dir="$DRAFTS_DIR"
        log_info "Creating draft post in $language..."
    else
        log_info "Creating new post in $language..."
    fi
    
    local filepath="$target_dir/$filename"
    
    if [ -f "$filepath" ]; then
        log_error "Post already exists: $filename"
        exit 1
    fi
    
    # Use language-specific template if exists
    local template_file="$TEMPLATES_DIR/default-${language}.md"
    if [ ! -f "$template_file" ]; then
        template_file="$TEMPLATES_DIR/default.md"
    fi
    
    if [ -f "$template_file" ]; then
        cp "$template_file" "$filepath"
        # Replace template variables
        sed -i.bak "s/{{TITLE}}/$title/g" "$filepath"
        sed -i.bak "s/{{DATE}}/$(date +%Y-%m-%d)/g" "$filepath"
        sed -i.bak "s/{{LANG}}/$language/g" "$filepath"
        rm "$filepath.bak"
    else
        cat > "$filepath" << EOF
---
layout: post
title: "$title"
date: $(date +%Y-%m-%d)
lang: $language
---

Write your post content here...
EOF
    fi
    
    log_success "Created: $filename"
    log_info "Opening in default editor..."
    
    # Open in editor (tries common editors)
    if command -v code >/dev/null 2>&1; then
        code "$filepath"
    elif command -v nano >/dev/null 2>&1; then
        nano "$filepath"
    elif command -v vim >/dev/null 2>&1; then
        vim "$filepath"
    else
        log_warning "No editor found. Edit manually: $filepath"
    fi
}

# Edit existing post
edit_post() {
    local search_term="$1"
    
    if [ -z "$search_term" ]; then
        log_error "Please provide a search term"
        echo "Usage: ./blog.sh edit \"keyword or filename\""
        exit 1
    fi
    
    # Search in both posts and drafts
    local matches=$(find "$POSTS_DIR" "$DRAFTS_DIR" -name "*.md" -type f 2>/dev/null | grep -i "$search_term" | head -5)
    
    if [ -z "$matches" ]; then
        log_error "No posts found matching: $search_term"
        exit 1
    fi
    
    local match_count=$(echo "$matches" | wc -l)
    
    if [ "$match_count" -eq 1 ]; then
        local file="$matches"
        log_info "Opening: $(basename "$file")"
        
        # Open in editor
        if command -v code >/dev/null 2>&1; then
            code "$file"
        elif command -v nano >/dev/null 2>&1; then
            nano "$file"
        elif command -v vim >/dev/null 2>&1; then
            vim "$file"
        else
            log_warning "No editor found. Edit manually: $file"
        fi
    else
        log_info "Multiple matches found:"
        echo "$matches" | while read -r file; do
            echo "  - $(basename "$file")"
        done
        log_warning "Please be more specific with your search term"
    fi
}

# Publish draft (move from _drafts to _posts)
publish_draft() {
    local search_term="$1"
    
    if [ -z "$search_term" ]; then
        log_error "Please provide a draft to publish"
        echo "Usage: ./blog.sh publish-draft \"keyword or filename\""
        exit 1
    fi
    
    local draft=$(find "$DRAFTS_DIR" -name "*.md" -type f 2>/dev/null | grep -i "$search_term" | head -1)
    
    if [ -z "$draft" ]; then
        log_error "No draft found matching: $search_term"
        exit 1
    fi
    
    local filename=$(basename "$draft")
    local new_filename=$(generate_filename "$(grep '^title:' "$draft" | sed 's/title: *"\?\([^"]*\)"\?/\1/')")
    local new_path="$POSTS_DIR/$new_filename"
    
    # Update date in front matter
    sed -i.bak "s/^date: .*/date: $(date +%Y-%m-%d)/" "$draft"
    rm "$draft.bak"
    
    mv "$draft" "$new_path"
    
    log_success "Published draft: $filename → $new_filename"
}

# Start local development server
serve() {
    log_info "Starting Jekyll development server..."
    if command -v bundle >/dev/null 2>&1; then
        bundle exec jekyll serve --livereload
    else
        jekyll serve --livereload
    fi
}

# Commit and push changes
deploy() {
    log_info "Deploying blog..."
    
    cd "$BLOG_DIR"
    
    if ! git diff --quiet || ! git diff --cached --quiet; then
        git add .
        
        local commit_msg="Update blog posts

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
        
        git commit -m "$commit_msg"
        git push
        
        log_success "Blog deployed successfully!"
        log_info "Your changes will be live at https://zeecares.github.io in a few minutes"
    else
        log_warning "No changes to deploy"
    fi
}

# List posts
list_posts() {
    local show_drafts="$1"
    
    log_info "Published posts:"
    if [ -d "$POSTS_DIR" ]; then
        ls -1 "$POSTS_DIR"/*.md 2>/dev/null | while read -r file; do
            local title=$(grep '^title:' "$file" | sed 's/title: *"\?\([^"]*\)"\?/\1/')
            echo "  - $(basename "$file" .md): $title"
        done
    fi
    
    if [ "$show_drafts" = "true" ] && [ -d "$DRAFTS_DIR" ]; then
        echo
        log_info "Draft posts:"
        ls -1 "$DRAFTS_DIR"/*.md 2>/dev/null | while read -r file; do
            local title=$(grep '^title:' "$file" | sed 's/title: *"\?\([^"]*\)"\?/\1/')
            echo "  - $(basename "$file" .md): $title"
        done || log_warning "No drafts found"
    fi
}

# Auto-translate existing post
translate_post() {
    local search_term="$1"
    local target_lang="$2"
    
    if [ -z "$search_term" ]; then
        log_error "Please provide a post to translate"
        echo "Usage: ./blog.sh translate \"keyword\" [en|zh]"
        exit 1
    fi
    
    # Default to English if no target language specified
    if [ -z "$target_lang" ]; then
        target_lang="en"
    fi
    
    # Find the source post
    local source_post=$(find "$POSTS_DIR" "$DRAFTS_DIR" -name "*.md" -type f 2>/dev/null | grep -i "$search_term" | head -1)
    
    if [ -z "$source_post" ]; then
        log_error "No post found matching: $search_term"
        exit 1
    fi
    
    # Determine source language from filename or content
    local source_lang="zh"
    if [[ "$source_post" =~ \.en\.md$ ]]; then
        source_lang="en"
    elif [[ "$source_post" =~ \.zh\.md$ ]]; then
        source_lang="zh"
    fi
    
    # Skip if trying to translate to same language
    if [ "$source_lang" = "$target_lang" ]; then
        log_error "Source and target languages are the same"
        exit 1
    fi
    
    # Generate target filename
    local source_filename=$(basename "$source_post")
    local target_filename="${source_filename%.$source_lang.md}.$target_lang.md"
    local target_path="$(dirname "$source_post")/$target_filename"
    
    if [ -f "$target_path" ]; then
        log_warning "Translation already exists: $target_filename"
        echo "Do you want to overwrite it? (y/N)"
        read -r response
        if [[ ! "$response" =~ ^[Yy]$ ]]; then
            exit 0
        fi
    fi
    
    log_info "Translating from $source_lang to $target_lang..."
    log_info "Source: $(basename "$source_post")"
    log_info "Target: $target_filename"
    
    # Extract title and content from source
    local source_title=$(grep '^title:' "$source_post" | sed 's/title: *"\?\([^"]*\)"\?/\1/')
    local source_date=$(grep '^date:' "$source_post" | sed 's/date: *//')
    
    # Create translation with proper front matter
    cat > "$target_path" << EOF
---
layout: post
title: "[TO BE TRANSLATED] $source_title"
date: $source_date
lang: $target_lang
translated: true
---

[Content will be translated automatically using Claude Code]

<!-- Original post: $(basename "$source_post") -->
<!-- Translation needed from $source_lang to $target_lang -->
EOF
    
    # Update language pairs mapping
    local source_base="${source_filename%.md}"
    local target_base="${target_filename%.md}"
    
    # Add to language pairs (this would need manual updating for now)
    log_info "Created translation template: $target_filename"
    log_warning "Please update _data/languages.yml to link these posts:"
    echo "  \"$source_base\": \"$target_base\""
    echo "  \"$target_base\": \"$source_base\""
    
    log_success "Translation template created successfully!"
    log_info "Opening for editing..."
    
    # Open in editor
    if command -v code >/dev/null 2>&1; then
        code "$target_path" "$source_post"
    elif command -v nano >/dev/null 2>&1; then
        nano "$target_path"
    elif command -v vim >/dev/null 2>&1; then
        vim "$target_path"
    else
        log_warning "No editor found. Edit manually: $target_path"
    fi
}

# Show help
show_help() {
    cat << EOF
Blog Management Script (Bilingual Edition)

Usage: ./blog.sh [command] [options]

Commands:
  new "Title" [--lang en|zh] [--draft]  Create a new blog post
  draft "Title" [--lang en|zh]          Create a new draft post  
  edit "keyword"                        Edit existing post (searches by keyword)
  translate "keyword" [en|zh]           Create translation template for existing post
  publish-draft "keyword"               Move draft to published posts
  list [--lang en|zh]                   List published posts (optionally filter by language)
  list-all [--lang en|zh]              List all posts including drafts
  serve                                 Start local development server
  deploy                               Commit and push changes to GitHub
  help                                 Show this help message

Language Support:
  - Default language: English (en)
  - Supported: English (en), Chinese (zh)
  - Posts are automatically tagged with language
  - Translation templates can be generated

Examples:
  ./blog.sh new "My Amazing Post"                    # Creates English post
  ./blog.sh new "我的博客" --lang zh                  # Creates Chinese post
  ./blog.sh draft "Work in Progress" --lang en       # Creates English draft
  ./blog.sh translate "metaphor" zh                  # Translate to Chinese
  ./blog.sh list --lang zh                           # List Chinese posts only
  ./blog.sh deploy

EOF
}

# Parse arguments for new command
parse_new_args() {
    local title="$1"
    shift
    local is_draft="false"
    local language="en"
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --lang)
                language="$2"
                shift 2
                ;;
            --draft)
                is_draft="true"
                shift
                ;;
            *)
                log_error "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    new_post "$title" "$is_draft" "$language"
}

# Parse arguments for draft command
parse_draft_args() {
    local title="$1"
    shift
    local language="en"
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --lang)
                language="$2"
                shift 2
                ;;
            *)
                log_error "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    new_post "$title" "true" "$language"
}

# Main script logic
case "${1:-help}" in
    "new")
        shift
        parse_new_args "$@"
        ;;
    "draft")
        shift
        parse_draft_args "$@"
        ;;
    "edit")
        edit_post "$2"
        ;;
    "translate")
        translate_post "$2" "$3"
        ;;
    "publish-draft")
        publish_draft "$2"
        ;;
    "list")
        list_posts "false"
        ;;
    "list-all")
        list_posts "true"
        ;;
    "serve")
        serve
        ;;
    "deploy")
        deploy
        ;;
    "help"|*)
        show_help
        ;;
esac