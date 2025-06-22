// Modern inline search functionality inspired by GitHub/Vercel
(function() {
  let searchData = [];
  let searchInput = document.getElementById('inline-search-input');
  let searchResults = document.getElementById('inline-search-results');
  let searchTimeout;
  
  // Load search data
  fetch('/search.json')
    .then(response => response.json())
    .then(data => {
      searchData = data;
    })
    .catch(error => console.error('Error loading search data:', error));
  
  // Get current language
  function getCurrentLanguage() {
    return localStorage.getItem('language') || 'en';
  }
  
  // Debounced search function
  function debounceSearch(query) {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => performSearch(query), 200);
  }
  
  // Perform search
  function performSearch(query) {
    if (!query.trim()) {
      hideResults();
      return;
    }
    
    const currentLang = getCurrentLanguage();
    const results = searchData.filter(post => {
      // Filter by current language
      if (post.lang !== currentLang) {
        return false;
      }
      
      // Text search
      const searchableText = (post.title + ' ' + post.content).toLowerCase();
      return searchableText.includes(query.toLowerCase());
    }).slice(0, 5); // Limit to 5 results for dropdown
    
    displayResults(results, query);
  }
  
  // Display search results
  function displayResults(results, query) {
    if (results.length === 0) {
      const currentLang = getCurrentLanguage();
      searchResults.innerHTML = `
        <div class="no-results">
          ${currentLang === 'en' ? 'No results found' : '未找到结果'}
        </div>
      `;
    } else {
      searchResults.innerHTML = results.map(post => `
        <div class="search-result" onclick="window.location.href='${post.url}'">
          <div class="result-title">${highlightQuery(post.title, query)}<span class="result-lang">${post.lang.toUpperCase()}</span></div>
          <div class="result-excerpt">${highlightQuery(post.content.substring(0, 80), query)}...</div>
        </div>
      `).join('');
    }
    
    showResults();
  }
  
  // Highlight search query in text
  function highlightQuery(text, query) {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<strong>$1</strong>');
  }
  
  // Show search results dropdown
  function showResults() {
    searchResults.style.display = 'block';
  }
  
  // Hide search results dropdown
  function hideResults() {
    searchResults.style.display = 'none';
  }
  
  // Event listeners
  if (searchInput && searchResults) {
    searchInput.addEventListener('input', function() {
      debounceSearch(this.value);
    });
    
    searchInput.addEventListener('focus', function() {
      if (this.value.trim()) {
        performSearch(this.value);
      }
    });
    
    // Hide results when clicking outside
    document.addEventListener('click', function(e) {
      if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
        hideResults();
      }
    });
    
    // Handle keyboard navigation
    searchInput.addEventListener('keydown', function(e) {
      const results = searchResults.querySelectorAll('.search-result');
      const currentActive = searchResults.querySelector('.search-result.active');
      let activeIndex = -1;
      
      if (currentActive) {
        activeIndex = Array.from(results).indexOf(currentActive);
      }
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (currentActive) currentActive.classList.remove('active');
        activeIndex = (activeIndex + 1) % results.length;
        if (results[activeIndex]) results[activeIndex].classList.add('active');
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (currentActive) currentActive.classList.remove('active');
        activeIndex = activeIndex <= 0 ? results.length - 1 : activeIndex - 1;
        if (results[activeIndex]) results[activeIndex].classList.add('active');
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (currentActive) {
          currentActive.click();
        }
      } else if (e.key === 'Escape') {
        hideResults();
        this.blur();
      }
    });
    
    // Add hover effects
    searchResults.addEventListener('mouseover', function(e) {
      if (e.target.classList.contains('search-result')) {
        // Remove active class from all results
        const allResults = searchResults.querySelectorAll('.search-result');
        allResults.forEach(result => result.classList.remove('active'));
        // Add active class to hovered result
        e.target.classList.add('active');
      }
    });
  }
  
  // Update search placeholder based on language
  function updateSearchPlaceholder() {
    if (searchInput) {
      const currentLang = getCurrentLanguage();
      searchInput.placeholder = currentLang === 'en' ? 'Search...' : '搜索...';
    }
  }
  
  // Update placeholder on page load and language change
  updateSearchPlaceholder();
  
  // Listen for language changes
  window.addEventListener('languageChanged', updateSearchPlaceholder);
})();

// Add styles for search result highlighting and active states
const style = document.createElement('style');
style.textContent = `
  .search-result.active {
    background: #f3f4f6 !important;
  }
  
  [data-theme="dark"] .search-result.active {
    background: #374151 !important;
  }
  
  .search-result strong {
    background: rgba(59, 130, 246, 0.2);
    padding: 1px 2px;
    border-radius: 2px;
  }
  
  [data-theme="dark"] .search-result strong {
    background: rgba(96, 165, 250, 0.3);
  }
`;
document.head.appendChild(style);