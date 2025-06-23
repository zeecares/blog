// Modern Header Controls - Minimal Language and Theme Toggle
(function() {
  'use strict';

  let currentLang = localStorage.getItem('blog-language') || 'en';
  let currentTheme = localStorage.getItem('blog-theme') || 'auto';

  // Initialize on page load
  document.addEventListener('DOMContentLoaded', function() {
    // Always default to English first, then apply user preference
    setLanguage('en', true);
    if (currentLang !== 'en') {
      setLanguage(currentLang, true);
    }
    initializeTheme();
  });

  // Theme initialization
  function initializeTheme() {
    if (currentTheme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(prefersDark ? 'dark' : 'light', false);
      updateThemeIcon();
    } else {
      applyTheme(currentTheme, false);
      updateThemeIcon();
    }
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
      if (currentTheme === 'auto') {
        applyTheme(e.matches ? 'dark' : 'light', false);
      }
    });
  }

  // Simple theme toggle - just light/dark
  window.toggleTheme = function() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('blog-theme', currentTheme);
    applyTheme(currentTheme, true);
    updateThemeIcon();
  };

  function applyTheme(theme, animate = true) {
    if (animate) {
      document.documentElement.style.transition = 'background-color 0.2s ease, color 0.2s ease';
    }
    
    document.documentElement.setAttribute('data-theme', theme);
    
    if (animate) {
      setTimeout(() => {
        document.documentElement.style.transition = '';
      }, 200);
    }
  }

  function updateThemeIcon() {
    const themeIcon = document.getElementById('theme-icon');
    const themeButton = document.getElementById('theme-toggle');
    
    if (!themeIcon || !themeButton) return;
    
    if (currentTheme === 'dark') {
      themeIcon.textContent = '☀';
      themeButton.title = 'Switch to light mode';
    } else {
      themeIcon.textContent = '🌙';
      themeButton.title = 'Switch to dark mode';
    }
  }

  // Simple language toggle - just EN/ZH
  window.toggleLanguage = function() {
    const newLang = currentLang === 'en' ? 'zh' : 'en';
    setLanguage(newLang, true);
  };

  window.setLanguage = function(lang, updateUI = true) {
    currentLang = lang;
    localStorage.setItem('blog-language', lang);
    
    if (updateUI) {
      updateLanguageDisplay();
      filterContentByLanguage(lang);
      updatePageContent(lang);
      
      // Dispatch language change event
      window.dispatchEvent(new CustomEvent('languageChanged', { 
        detail: { language: lang } 
      }));
    }
  };

  function updateLanguageDisplay() {
    const langToggle = document.getElementById('current-lang');
    if (langToggle) {
      langToggle.textContent = currentLang.toUpperCase();
    }
  }

  function filterContentByLanguage(lang) {
    // Apply language class to body for CSS-based filtering
    document.body.className = document.body.className.replace(/\blang-\w+\b/g, '');
    document.body.classList.add(`lang-${lang}`);
    
    // Count visible posts for feedback
    const posts = document.querySelectorAll('.post-list li');
    let visibleCount = 0;
    
    posts.forEach(post => {
      const postLang = post.getAttribute('data-lang') || 'zh';
      if (postLang === lang) {
        visibleCount++;
      }
    });
    
    // Remove existing no-posts message
    const existingMsg = document.getElementById('no-posts-message');
    if (existingMsg) {
      existingMsg.remove();
    }
    
    // Show message if no posts in selected language
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
      siteTitle.textContent = lang === 'zh' ? '子易赛博の空间' : "Zee's Cyber Space";
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
      pageHeading.style.display = 'none';
    }
  }

})();