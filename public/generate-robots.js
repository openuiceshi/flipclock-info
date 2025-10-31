// generate-robots.js
// 用法：SITE_URL=https://flipclock.info node generate-robots.js

const fs = require('fs');
const path = require('path');

const SITE_URL = process.env.SITE_URL || 'https://flipclock.info';

// 规则配置（按需修改）
const RULES = [
  { userAgent: '*', allow: ['/'], disallow: [] }
];

function buildRobotsTxt(siteUrl, rules) {
  const lines = [];

  for (const r of rules) {
    lines.push(`User-agent: ${r.userAgent || '*'}`);
    (r.allow || []).forEach(a => lines.push(`Allow: ${a}`));
    (r.disallow || []).forEach(d => lines.push(`Disallow: ${d}`));
    lines.push(''); // 空行分段
  }

  const sitemapUrl = siteUrl.replace(/\/+$/, '') + '/sitemap.xml';
  lines.push(`Sitemap: ${sitemapUrl}`);
  lines.push(''); // 末尾换行

  return lines.join('\n');
}

function main() {
  const outDir = path.resolve(process.cwd(), 'public');
  const outFile = path.join(outDir, 'robots.txt');

  fs.mkdirSync(outDir, { recursive: true });

  const content = buildRobotsTxt(SITE_URL, RULES);
  fs.writeFileSync(outFile, content, 'utf8');

  console.log(`robots.txt written to: ${outFile}`);
  console.log(`Robots URL: ${SITE_URL.replace(/\/+$/, '')}/robots.txt`);
}

main();
