// generate-sitemap.js
// 用法：node generate-sitemap.js
// 可选环境变量：SITE_URL（如 https://flipclock.info）

const fs = require('fs');
const path = require('path');

// ===== 基础配置（按需修改） =====
const SITE_URL = process.env.SITE_URL || 'https://flipclock.info';

// 站点路由（只列出你希望被收录的路径）
const ROUTES = [
  '/',             // 首页：Flip Clock
];

// 可选：为不同路由设置独立优先级/更新频率
const routeMeta = {
  '/': { changefreq: 'weekly', priority: 1.0 },
  '/digital-clock': { changefreq: 'weekly', priority: 0.9 }
};

// ===== 生成 XML =====
function xmlEscape(s) {
  return s.replaceAll('&', '&amp;')
          .replaceAll('<', '&lt;')
          .replaceAll('>', '&gt;')
          .replaceAll('"', '&quot;')
          .replaceAll("'", '&apos;');
}

function buildSitemapXml(siteUrl, routes) {
  const now = new Date().toISOString().split('T')[0]; // 形如 "2025-10-31"
  const urlset = routes.map(route => {
    const meta = routeMeta[route] || { changefreq: 'weekly', priority: 0.8 };
    const loc = siteUrl.replace(/\/+$/, '') + route; // 合并域名与路径
    return `
  <url>
    <loc>${xmlEscape(loc)}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${meta.changefreq}</changefreq>
    <priority>${meta.priority.toFixed(1)}</priority>
  </url>`;
  }).join('');

return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>
`;
}

async function main() {
  const outDir = process.cwd(); // 目标目录
  const outFile = path.join(outDir, 'sitemap.xml');

  // 确保目录存在
  fs.mkdirSync(outDir, { recursive: true });

  const xml = buildSitemapXml(SITE_URL, ROUTES);
  fs.writeFileSync(outFile, xml, 'utf8');

  console.log(`Sitemap written to: ${outFile}`);
  console.log(`Submit to GSC: ${SITE_URL.replace(/\/+$/, '')}/sitemap.xml`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
