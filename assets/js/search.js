// Search functionality for bilingual Jekyll blog
(function() {
  'use strict';

  let searchData = [];
  let currentLang = localStorage.getItem('blog-language') || 'en';
  
  // UI text translations
  const uiText = {
    en: {
      search_posts: "Search Posts",
      search_placeholder: "Search posts...",
      search_results: "Search Results",
      search_results_for: "Search results for",
      no_results: "No results found",
      no_results_message: "Try different keywords or check the language setting",
      results_count: "result(s) found",
      current_lang_only: "Search in current language only",
      search_welcome_text: "Enter keywords to search through all posts on this blog."
    },
    zh: {
      search_posts: "搜索文章",
      search_placeholder: "搜索文章...",
      search_results: "搜索结果",
      search_results_for: "搜索结果",
      no_results: "未找到结果",
      no_results_message: "尝试不同的关键词或检查语言设置",
      results_count: "个结果",
      current_lang_only: "仅搜索当前语言",
      search_welcome_text: "输入关键词搜索博客中的所有文章。"
    }
  };

  // Initialize search when page loads
  document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
    loadSearchData();
    updateLanguage();
    
    // Listen for language changes
    document.addEventListener('languageChanged', function() {
      currentLang = localStorage.getItem('blog-language') || 'en';
      updateLanguage();
      // Re-run search if there are results
      const searchInput = document.getElementById('search-input');
      if (searchInput && searchInput.value.trim()) {
        performSearch(searchInput.value.trim());
      }
    });
  });

  function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const currentLangOnlyCheckbox = document.getElementById('current-lang-only');

    if (!searchInput || !searchButton) return;

    // Set up event listeners
    searchInput.addEventListener('input', debounce(function() {
      const query = this.value.trim();
      if (query.length >= 2) {
        performSearch(query);
      } else if (query.length === 0) {
        showWelcomeMessage();
      }
    }, 300));

    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        const query = this.value.trim();
        if (query.length >= 2) {
          performSearch(query);
        }
      }
    });

    searchButton.addEventListener('click', function() {
      const query = searchInput.value.trim();
      if (query.length >= 2) {
        performSearch(query);
      }
    });

    if (currentLangOnlyCheckbox) {
      currentLangOnlyCheckbox.addEventListener('change', function() {
        const query = searchInput.value.trim();
        if (query.length >= 2) {
          performSearch(query);
        }
      });
    }

    // Focus search input on page load
    searchInput.focus();
  }

  function loadSearchData() {
    fetch('/search.json')
      .then(response => response.json())
      .then(data => {
        searchData = data.posts || [];
      })
      .catch(error => {
        console.error('Error loading search data:', error);
      });
  }

  function performSearch(query) {
    if (!query || query.length < 2) {
      showWelcomeMessage();
      return;
    }

    const currentLangOnly = document.getElementById('current-lang-only')?.checked ?? true;
    const results = searchPosts(query, currentLangOnly);
    displayResults(results, query);
  }

  function searchPosts(query, currentLangOnly = true) {
    const searchTerms = query.toLowerCase().split(/\s+/);
    const results = [];

    searchData.forEach(post => {
      // Filter by language if currentLangOnly is true
      if (currentLangOnly && post.lang !== currentLang) {
        return;
      }

      const searchableContent = [
        post.title || '',
        post.content || '',
        post.excerpt || '',
        (post.categories || []).join(' '),
        (post.tags || []).join(' ')
      ].join(' ').toLowerCase();

      let score = 0;
      let matchCount = 0;

      searchTerms.forEach(term => {
        const titleMatch = (post.title || '').toLowerCase().includes(term);
        const contentMatch = searchableContent.includes(term);

        if (titleMatch) {
          score += 10; // Higher weight for title matches
          matchCount++;
        } else if (contentMatch) {
          score += 1;
          matchCount++;
        }
      });

      // Only include posts that match all search terms
      if (matchCount === searchTerms.length) {
        results.push({
          ...post,
          score: score
        });
      }
    });

    // Sort by score (highest first), then by date (newest first)
    return results.sort((a, b) => {
      if (a.score !== b.score) {
        return b.score - a.score;
      }
      return new Date(b.date) - new Date(a.date);
    });
  }

  function displayResults(results, query) {
    const resultsContainer = document.getElementById('search-results');
    if (!resultsContainer) return;

    const ui = uiText[currentLang] || uiText.en;

    if (results.length === 0) {
      resultsContainer.innerHTML = `
        <div class="search-no-results">
          <h3>${ui.no_results}</h3>
          <p>${ui.no_results_message}</p>
        </div>
      `;
      return;
    }

    let html = `
      <div class="search-results-header">
        <h3>${ui.search_results_for} "${escapeHtml(query)}"</h3>
        <p class="results-count">${results.length} ${ui.results_count}</p>
      </div>
      <div class="search-results-list">
    `;

    results.forEach(post => {
      const date = new Date(post.date).toLocaleDateString(currentLang === 'zh' ? 'zh-CN' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      const excerpt = highlightSearchTerms(
        (post.excerpt || post.content || '').substring(0, 200) + '...',
        query
      );

      const title = highlightSearchTerms(post.title || '', query);

      html += `
        <article class="search-result-item">
          <header class="search-result-header">
            <h4 class="search-result-title">
              <a href="${post.url}" class="search-result-link">${title}</a>
              <span class="lang-indicator">${post.lang.toUpperCase()}</span>
            </h4>
            <time class="search-result-date" datetime="${post.date}">${date}</time>
          </header>
          <div class="search-result-excerpt">
            ${excerpt}
          </div>
        </article>
      `;
    });

    html += '</div>';
    resultsContainer.innerHTML = html;
  }

  function showWelcomeMessage() {
    const resultsContainer = document.getElementById('search-results');
    const ui = uiText[currentLang] || uiText.en;
    
    if (resultsContainer) {
      resultsContainer.innerHTML = `
        <div id="search-welcome" class="search-welcome">
          <h3 id="search-welcome-title">${ui.search_posts}</h3>
          <p id="search-welcome-text">${ui.search_welcome_text}</p>
        </div>
      `;
    }
  }

  function highlightSearchTerms(text, query) {
    if (!query || !text) return text;

    const searchTerms = query.toLowerCase().split(/\s+/);
    let highlightedText = text;

    searchTerms.forEach(term => {
      const regex = new RegExp(`(${escapeRegex(term)})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
    });

    return highlightedText;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func.apply(this, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  function updateLanguage() {
    const ui = uiText[currentLang] || uiText.en;
    
    // Update search input placeholder
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.placeholder = ui.search_placeholder;
    }

    // Update current language filter text
    const currentLangText = document.getElementById('current-lang-text');
    if (currentLangText) {
      currentLangText.textContent = ui.current_lang_only;
    }

    // Update welcome message if visible
    const welcomeTitle = document.getElementById('search-welcome-title');
    const welcomeText = document.getElementById('search-welcome-text');
    if (welcomeTitle && welcomeText) {
      welcomeTitle.textContent = ui.search_posts;
      welcomeText.textContent = ui.search_welcome_text;
    }
  }

  // Export for potential external use
  window.searchBlog = {
    performSearch: performSearch,
    updateLanguage: updateLanguage
  };

})();