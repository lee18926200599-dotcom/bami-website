const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const site = 'https://www.8bami.com';
const files = fs.readdirSync(root).filter((file) => file.endsWith('.html')).sort();
const issues = [];
const rows = [];

function content(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function one(html, regex) {
  const match = html.match(regex);
  return match ? match[1].trim() : null;
}

const titleMap = new Map();
for (const file of files) {
  const html = content(file);
  const title = one(html, /<title\b[^>]*>([\s\S]*?)<\/title>/i);
  const description = one(html, /<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
  const canonical = one(html, /<link\s+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  const robots = one(html, /<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i);
  const isExcluded = /noindex/i.test(robots || '');
  const h1s = (html.match(/<h1\b/gi) || []).length;
  const alternates = (html.match(/rel=["']alternate["'][^>]*hreflang=/gi) || []).length;
  const schemas = [...html.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  let schemaOk = true;
  for (const schema of schemas) {
    try {
      JSON.parse(schema[1]);
    } catch (_) {
      schemaOk = false;
    }
  }

  if (!title) issues.push(`${file}: missing title`);
  if (!description) issues.push(`${file}: missing meta description`);
  if (!canonical || !canonical.startsWith(site)) issues.push(`${file}: canonical is not on ${site}`);
  if (h1s !== 1) issues.push(`${file}: expected one h1, found ${h1s}`);
  if (!schemaOk) issues.push(`${file}: invalid JSON-LD`);
  if (title && !isExcluded) {
    if (titleMap.has(title)) issues.push(`${file}: duplicate title with ${titleMap.get(title)}`);
    titleMap.set(title, file);
  }

  if (!isExcluded && alternates !== 6 && !file.endsWith('-en.html')) {
    issues.push(`${file}: expected 6 hreflang links, found ${alternates}`);
  }

  rows.push({
    file,
    title,
    descriptionLength: description ? description.length : 0,
    canonical,
    robots,
    h1s,
    alternates,
    schemas: schemas.length,
    isExcluded
  });
}

const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const sitemapLocs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const expectedSitemap = rows
  .filter((row) => !row.isExcluded && !row.file.endsWith('-en.html'))
  .map((row) => `${site}${row.file === 'index.html' ? '/' : `/${row.file}`}`);
for (const url of expectedSitemap) {
  if (!sitemapLocs.includes(url)) issues.push(`sitemap missing ${url}`);
}
for (const url of sitemapLocs) {
  if (!url.startsWith(site)) issues.push(`sitemap uses non-production URL ${url}`);
  if (!expectedSitemap.includes(url)) issues.push(`sitemap includes unexpected URL ${url}`);
}

const broken = [];
for (const file of files) {
  const html = content(file);
  for (const match of html.matchAll(/(?:href|src)=["']([^"']+)["']/gi)) {
    const href = match[1];
    if (!href || /^(#|https?:|mailto:|tel:|javascript:|data:|\/\/)/i.test(href)) continue;
    const target = href.split('#')[0].split('?')[0];
    if (target && !fs.existsSync(path.join(root, path.dirname(file), target))) {
      broken.push(`${file} -> ${href}`);
    }
  }
}
if (broken.length) issues.push(`broken internal links: ${broken.length}`);

const contact = content('contact.html');
if (!/action=["']https:\/\/formspree\.io\//i.test(contact)) issues.push('contact.html: missing Formspree action');
if (!/name=["']privacy_consent["']/i.test(contact)) issues.push('contact.html: missing privacy consent');
if (/\+65 6123 4567|\+852 2123 4567|\+49 89 1234 5678/.test(contact)) issues.push('contact.html: placeholder phone numbers remain');

const report = {
  generatedAt: new Date().toISOString(),
  pages: rows.length,
  indexablePages: rows.filter((row) => !row.isExcluded).length,
  sitemapUrls: sitemapLocs.length,
  brokenInternalLinks: broken.length,
  issues,
  rows
};

fs.writeFileSync(path.join(__dirname, 'seo-audit-result.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify({
  pages: report.pages,
  indexablePages: report.indexablePages,
  sitemapUrls: report.sitemapUrls,
  brokenInternalLinks: report.brokenInternalLinks,
  issues
}, null, 2));
