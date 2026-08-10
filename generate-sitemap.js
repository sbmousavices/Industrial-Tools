const fs = require('fs');
const path = require('path');

// ⚙️ تنظیمات - این مقادیر را مطابق نیاز خود تغییر دهید
const CONFIG = {
  baseUrl: 'https://sbmousavices.github.io/Industrial-Tools',
  outputDir: __dirname, // محل ذخیره sitemap.xml
  scanDirs: [__dirname], // پوشه‌هایی که باید اسکن شوند
  excludePatterns: ['/node_modules/', '/.git/', '/sitemap.xml'],
  extensions: ['.html', '.pdf'],
  defaultPriority: {
    '.html': '0.8',
    '.pdf': '0.7'
  },
  defaultChangefreq: {
    '.html': 'weekly',
    '.pdf': 'monthly'
  }
};

// 🔍 یافتن بازگشتی فایل‌ها
function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    // رد کردن پوشه‌های مستثنی
    if (stat.isDirectory()) {
      const relativePath = filePath.replace(__dirname, '');
      if (!CONFIG.excludePatterns.some(p => relativePath.includes(p))) {
        findFiles(filePath, fileList);
      }
    } 
    // افزودن فایل‌های معتبر
    else if (CONFIG.extensions.some(ext => file.toLowerCase().endsWith(ext))) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

// 📝 تولید XML
function generateSitemap(files) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    const relativePath = file.replace(__dirname, '').replace(/\\/g, '/');
    const url = `${CONFIG.baseUrl}${relativePath}`;
    const stat = fs.statSync(file);
    const lastmod = stat.mtime.toISOString().split('T')[0];
    
    xml += '  <url>\n';
    xml += `    <loc>${url}</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += `    <changefreq>${CONFIG.defaultChangefreq[ext] || 'monthly'}</changefreq>\n`;
    xml += `    <priority>${CONFIG.defaultPriority[ext] || '0.5'}</priority>\n`;
    xml += '  </url>\n';
  }
  
  xml += '</urlset>';
  return xml;
}

// 🚀 اجرای اصلی
try {
  console.log('🔍 Scanning files...');
  const files = [];
  CONFIG.scanDirs.forEach(dir => findFiles(dir, files));
  
  console.log(`✅ Found ${files.length} files`);
  
  const sitemap = generateSitemap(files);
  const outputPath = path.join(CONFIG.outputDir, 'sitemap.xml');
  
  fs.writeFileSync(outputPath, sitemap, 'utf8');
  console.log(`📄 Sitemap generated: ${outputPath}`);
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}