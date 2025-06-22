// Simple search functionality for Jekyll blog
(function() {
  let searchData = [];
  let searchInput = document.getElementById('search-input');
  let searchButton = document.getElementById('search-button');
  let searchResults = document.getElementById('search-results');
  let currentLangOnly = document.getElementById('current-lang-only');
  
  // Load search data
  fetch('/search.json')
    .then(response => response.json())
    .then(data => {
      searchData = data;
    })
    .catch(error => console.error('Error loading search data:', error));
  
  // Get current language from localStorage or default to 'en'
  function getCurrentLanguage() {
    return localStorage.getItem('language') || 'en';
  }
  
  // Perform search
  function performSearch(query) {
    if (!query.trim()) {
      showWelcome();
      return;
    }
    
    const currentLang = getCurrentLanguage();
    const langFilter = currentLangOnly.checked;
    
    const results = searchData.filter(post => {
      // Language filter
      if (langFilter && post.lang !== currentLang) {
        return false;
      }
      
      // Text search
      const searchableText = (post.title + ' ' + post.content).toLowerCase();
      return searchableText.includes(query.toLowerCase());
    });
    
    displayResults(results, query);
  }
  
  // Display search results
  function displayResults(results, query) {
    if (results.length === 0) {
      searchResults.innerHTML = `
        <div class="search-no-results">
          <h3>No results found</h3>
          <p>Try different keywords or check the language setting</p>
        </div>
      `;
      return;
    }
    
    const resultsHtml = `
      <div class="search-results-header">
        <h3>Search Results</h3>
        <p class="results-count">${results.length} result(s) found for "${query}"</p>
      </div>
      <div class="search-results-list">
        ${results.map(post => `
          <article class="search-result-item">
            <div class="search-result-header">
              <h4 class="search-result-title">
                <a href="${post.url}" class="search-result-link">${post.title}</a>
                <span class="lang-indicator">${post.lang.toUpperCase()}</span>
              </h4>
              <p class="search-result-date">${post.date}</p>
            </div>
            <div class="search-result-excerpt">
              ${post.content.substring(0, 200)}...
            </div>
          </article>
        `).join('')}
      </div>
    `;
    
    searchResults.innerHTML = resultsHtml;
  }
  
  // Show welcome message
  function showWelcome() {
    const currentLang = getCurrentLanguage();
    const welcomeTitle = currentLang === 'en' ? 'Search Posts' : '搜索文章';
    const welcomeText = currentLang === 'en' ? 
      'Enter keywords to search through all posts on this blog.' : 
      '输入关键词搜索博客中的所有文章。';
    
    searchResults.innerHTML = `
      <div class="search-welcome">
        <h3>${welcomeTitle}</h3>
        <p>${welcomeText}</p>
      </div>
    `;
  }
  
  // Event listeners
  if (searchInput && searchButton) {
    searchInput.addEventListener('input', function() {
      performSearch(this.value);
    });
    
    searchButton.addEventListener('click', function() {
      performSearch(searchInput.value);
    });
    
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        performSearch(this.value);
      }
    });
    
    currentLangOnly.addEventListener('change', function() {
      performSearch(searchInput.value);
    });
    
    // Update language text when page loads
    function updateLanguageText() {
      const currentLang = getCurrentLanguage();
      const langText = document.getElementById('current-lang-text');
      if (langText) {
        langText.textContent = currentLang === 'en' ? 
          'Search in current language only' : 
          '仅搜索当前语言';
      }
      showWelcome();
    }
    
    updateLanguageText();
  }
})();