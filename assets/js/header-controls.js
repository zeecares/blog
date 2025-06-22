// Header Controls JavaScript - Language and Theme functionality
(function() {
  'use strict';

  // Language switching functionality
  let currentLang = localStorage.getItem('blog-language') || 'en';

  // Theme management with system preference detection
  let currentTheme = localStorage.getItem('blog-theme') || 'auto';

  // Initialize language and theme on page load
  document.addEventListener('DOMContentLoaded', function() {
    setLanguage(currentLang, false);
    initializeTheme();
  });

  // Theme initialization
  function initializeTheme() {
    if (currentTheme === 'auto') {
      // Use system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(prefersDark ? 'dark' : 'light', false);
      updateThemeIcon('auto');
    } else {
      applyTheme(currentTheme, false);
      updateThemeIcon(currentTheme);
    }
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
      if (currentTheme === 'auto') {
        applyTheme(e.matches ? 'dark' : 'light', false);
      }
    });
  }

  // Theme toggle functionality
  window.toggleTheme = function() {
    const themes = ['auto', 'light', 'dark'];
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    currentTheme = themes[nextIndex];
    
    localStorage.setItem('blog-theme', currentTheme);
    
    if (currentTheme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(prefersDark ? 'dark' : 'light', true);
    } else {
      applyTheme(currentTheme, true);
    }
    
    updateThemeIcon(currentTheme);
  };

  // Apply theme to document
  function applyTheme(theme, animate = true) {
    if (animate) {
      document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    }
    
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
    
    if (animate) {
      setTimeout(() => {
        document.documentElement.style.transition = '';
      }, 300);
    }
  }

  // Update theme icon
  function updateThemeIcon(theme) {
    const themeIcon = document.getElementById('theme-icon');
    const themeButton = document.getElementById('theme-toggle');
    
    if (!themeIcon || !themeButton) return;
    
    switch (theme) {
      case 'auto':
        themeIcon.textContent = '🌓';
        themeButton.title = 'Theme: Auto (follows system)';
        break;
      case 'light':
        themeIcon.textContent = '☀️';
        themeButton.title = 'Theme: Light';
        break;
      case 'dark':
        themeIcon.textContent = '🌙';
        themeButton.title = 'Theme: Dark';
        break;
    }
  }

  window.toggleLanguage = function() {
    const dropdown = document.getElementById('lang-dropdown');
    if (dropdown) {
      dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    }
  };

  window.setLanguage = function(lang, reload = true) {
    currentLang = lang;
    localStorage.setItem('blog-language', lang);
    
    // Update button display
    const currentLangSpan = document.getElementById('current-lang');
    if (currentLangSpan) {
      if (lang === 'en') {
        currentLangSpan.textContent = '🌐 EN';
        document.documentElement.lang = 'en';
      } else {
        currentLangSpan.textContent = '🌐 中文';
        document.documentElement.lang = 'zh';
      }
    }
    
    // Hide dropdown
    const dropdown = document.getElementById('lang-dropdown');
    if (dropdown) {
      dropdown.style.display = 'none';
    }
    
    // Filter content based on language
    filterContentByLanguage(lang);
    
    // Update page title and description
    updatePageContent(lang);
  };

  function filterContentByLanguage(lang) {
    // Filter posts on homepage - only show posts in selected language
    const posts = document.querySelectorAll('.post-list li');
    let visibleCount = 0;
    
    posts.forEach(post => {
      const postLang = post.getAttribute('data-lang') || 'zh'; // Default to Chinese for existing posts
      if (postLang === lang) {
        post.style.display = 'block';
        visibleCount++;
      } else {
        post.style.display = 'none';
      }
    });
    
    // Show message if no posts in selected language
    const existingMsg = document.getElementById('no-posts-message');
    if (existingMsg) {
      existingMsg.remove();
    }
    
    if (visibleCount === 0) {
      const msg = document.createElement('div');
      msg.id = 'no-posts-message';
      msg.className = 'no-posts-message';
      msg.innerHTML = lang === 'en' ? 
        'No posts available in English yet. <a href="#" onclick="setLanguage(\'zh\')">Switch to Chinese</a>' :
        '暂无中文文章。<a href="#" onclick="setLanguage(\'en\')">切换到英文</a>';
      
      const postList = document.querySelector('.post-list');
      if (postList) {
        postList.after(msg);
      }
    }
  }

  function updatePageContent(lang) {
    // Update site title
    const siteTitle = document.querySelector('.site-title');
    if (siteTitle) {
      if (lang === 'zh') {
        siteTitle.textContent = '子易赛博の空间';
      } else {
        siteTitle.textContent = "Zee's Cyber Space";
      }
    }
    
    // Update navigation links
    const navLinks = document.querySelectorAll('.page-link');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === '/about/' || href === '/about') {
        link.textContent = lang === 'zh' ? '关于' : 'About';
      }
    });
    
    // Update page heading if exists
    const pageHeading = document.querySelector('.page-heading');
    if (pageHeading && window.location.pathname === '/') {
      // Don't show any page heading on homepage
      pageHeading.style.display = 'none';
    }
  }

  // Close dropdown when clicking outside
  document.addEventListener('click', function(event) {
    const switcher = document.querySelector('.language-switcher');
    if (switcher && !switcher.contains(event.target)) {
      const dropdown = document.getElementById('lang-dropdown');
      if (dropdown) {
        dropdown.style.display = 'none';
      }
    }
  });

})();