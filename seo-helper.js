// SEO Helper - Auto Canonical URL Generator
(function() {
  'use strict';
  
  // بررسی اینکه آیا canonical tag قبلاً وجود دارد
  const existingCanonical = document.querySelector('link[rel="canonical"]');
  
  if (!existingCanonical) {
    // ساخت URL اصلی بدون پارامترها
    const canonicalUrl = window.location.href.split('?')[0].split('#')[0];
    
    // ساخت تگ canonical
    const canonicalLink = document.createElement('link');
    canonicalLink.rel = 'canonical';
    canonicalLink.href = canonicalUrl;
    
    // اضافه کردن به head
    document.head.appendChild(canonicalLink);
    
    console.log('✅ Canonical tag added:', canonicalUrl);
  }
})();