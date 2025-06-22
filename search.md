---
layout: page
title: Search
title_zh: 搜索
permalink: /search/
---

<div class="search-container">
  <div class="search-form">
    <input type="text" id="search-input" placeholder="Search posts..." />
    <button id="search-button" type="button" aria-label="Search">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="M21 21l-4.35-4.35"></path>
      </svg>
    </button>
  </div>
  
  <div class="search-filters">
    <label class="filter-label">
      <input type="checkbox" id="current-lang-only" checked />
      <span id="current-lang-text">Search in current language only</span>
    </label>
  </div>
  
  <div id="search-results" class="search-results">
    <div id="search-welcome" class="search-welcome">
      <h3 id="search-welcome-title">Search Posts</h3>
      <p id="search-welcome-text">Enter keywords to search through all posts on this blog.</p>
    </div>
  </div>
</div>

<script src="{{ '/assets/js/search.js' | relative_url }}"></script>