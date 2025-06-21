---
layout: page
title: About
title_zh: 关于
permalink: /about/
---

<div class="about-content">
  <div class="lang-content" data-lang="en">
    <p>Born in Dalian by Bohai Bay, enlightened by Wang Xiaobo's Times Trilogy, physically in Dublin, Ireland.</p>
    <p>Dedicated to living in the present moment, constantly updating my understanding of <em>Be Here Now</em>.</p>
    <p>Occasionally playing music.</p>
  </div>
  
  <div class="lang-content" data-lang="zh">
    <p>生于渤海湾大连，启智慧于王小波时代三部曲，肉身在爱尔兰都柏林</p>
    <p>致力于活在当下，并不断更新自我对<em>Be Here Now</em>的定义</p>
    <p>偶尔乱弹琴</p>
  </div>
</div>

<script>
// About page language switching
document.addEventListener('DOMContentLoaded', function() {
  const currentLang = localStorage.getItem('blog-language') || 'en';
  updateAboutPage(currentLang);
  
  // Listen for language changes
  window.addEventListener('storage', function(e) {
    if (e.key === 'blog-language') {
      updateAboutPage(e.newValue);
    }
  });
});

function updateAboutPage(lang) {
  const contents = document.querySelectorAll('.lang-content');
  contents.forEach(content => {
    if (content.getAttribute('data-lang') === lang) {
      content.style.display = 'block';
    } else {
      content.style.display = 'none';
    }
  });
  
  // Update page title spans
  const titleEn = document.querySelector('.title-en');
  const titleZh = document.querySelector('.title-zh');
  
  if (titleEn && titleZh) {
    if (lang === 'zh') {
      titleEn.style.display = 'none';
      titleZh.style.display = 'inline';
    } else {
      titleEn.style.display = 'inline';
      titleZh.style.display = 'none';
    }
  }
  
  // Update document title
  if (lang === 'zh') {
    document.title = '关于 | 子易赛博の空间';
  } else {
    document.title = 'About | Zee\'s Cyber Space';
  }
}
</script>

<style>
.lang-content {
  display: none;
}

.lang-content[data-lang="en"] {
  display: block; /* Default to English */
}
</style>
