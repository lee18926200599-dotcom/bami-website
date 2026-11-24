const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const site = 'https://www.8bami.com';
const ogImage = `${site}/images/og-image.jpg`;
const excludedFromSeo = new Set(['product-detail.html', 'solution-detail.html', 'news-detail.html', 'thanks.html']);
const legacyEnglish = new Set([
  'index-en.html',
  'products-en.html',
  'solutions-en.html',
  'cases-en.html',
  'about-en.html',
  'news-en.html',
  'support-en.html',
  'contact-en.html'
]);

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function pagePath(file) {
  return file === 'index.html' ? '/' : `/${file}`;
}

function canonicalPath(file) {
  if (file.endsWith('-en.html')) {
    const chineseFile = file.replace('-en.html', '.html');
    return `${pagePath(chineseFile)}?lang=en`;
  }
  return pagePath(file);
}

function localizedPath(file, lang) {
  const base = pagePath(file);
  if (lang === 'zh') return base;
  return `${base}${base.includes('?') ? '&' : '?'}lang=${lang}`;
}

function titleFrom(html, preferEnglish) {
  const match = html.match(/<title\b([^>]*)>([\s\S]*?)<\/title>/i);
  if (!match) return '八米科技 BAMI Technology';
  const attr = preferEnglish ? match[1].match(/data-en="([^"]+)"/) : match[1].match(/data-zh="([^"]+)"/);
  return escapeHtml(attr ? attr[1] : match[2].replace(/<[^>]+>/g, '').trim());
}

function descriptionFrom(html) {
  const match = html.match(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']/i);
  return match ? escapeHtml(match[1].replace(/\s+/g, ' ').trim()) : '';
}

function replaceOrAppendMeta(html, name, content) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`<meta\\s+name=["']${escapedName}["'][^>]*>`, 'i');
  const tag = `<meta name="${name}" content="${content}">`;
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace(/<\/head>/i, `    ${tag}\n</head>`);
}

function removeManagedSeo(html) {
  return html.replace(/^[ \t]*<!-- SEO managed by scripts\/apply-seo\.js -->\r?\n?/gim, '')
    .replace(/^[ \t]*<link\b[^>]*data-seo-managed[^>]*>\r?\n?/gim, '')
    .replace(/^[ \t]*<meta\b[^>]*data-seo-managed[^>]*>\r?\n?/gim, '')
    .replace(/^[ \t]*<script\b[^>]*data-seo-schema[^>]*>[\s\S]*?<\/script>\r?\n?/gim, '');
}

const articleMeta = {
  'news-detail-23.html': ['2021-07-20', '八米科技与中国邮政达成战略合作，BAMI TMS全面接入快运业务，实现全国快运网络统一调度与可视化管控。'],
  'news-detail-24.html': ['2023-11-28', '八米科技与日本通运签署战略合作协议，共建中日跨境物流数智化平台，优化运输路线与仓储布局。'],
  'news-detail-25.html': ['2022-09-05', '八米智能集运系统帮助跨境电商企业平均降低40%物流成本，最高降幅达到55%，提升全球履约效率。'],
  'news-detail-26.html': ['2024-01-18', '八米科技荣获2023年度最佳供应链数智化解决方案提供商，AI数字员工与全链路供应链方案获得行业认可。'],
  'news-detail-27.html': ['2023-03-15', '八米WMS 3.0支持智能仓储机器人与AGV无缝对接，实现3D数字孪生仓库、智能波次与软硬一体化管理。'],
  'news-detail-28.html': ['2022-12-10', '贝恩医疗TMS项目成功验收，配送准时率从85%提升至98%，运输成本降低25%，树医疗物流数智化标杆。'],
  'news-detail-29.html': ['2023-08-20', '八米AI数字员工2.0融合大语言模型，提升智能客服、订单处理与业务执行能力，开启企业智能化新时代。'],
  'news-detail-30.html': ['2024-10-15', '八米科技与桂鑫钢铁集团达成战略合作，共建钢铁行业智慧物流新标杆，推动大宗物流与供应链数智化。'],
  'news-detail-31.html': ['2025-06-12', '晟晖集团携手八米科技打造AI数智化再生资源平台，实现回收、入库、加工与销售全流程可视化运营。'],
  'news-detail-32.html': ['2025-12-10', '八米科技与嘉拓智能签约TMS项目，建设一体化全球运输管理平台，赋能新能源装备制造供应链升级。'],
  'news-detail-33.html': ['2025-12-10', '八米科技获科技型中小企业认证并入选广东省科技型中小企业库，科技创新与合规实力获得权威认可。'],
  'news-detail-34.html': ['2026-03-01', '八米科技与菲律宾APOLLOTECH达成战略合作，以4PL统仓共配方案服务东南亚快消零售供应链升级。'],
  'news-detail-35.html': ['2026-06-18', '八米科技为某越南零售集团交付4PL统仓共配项目，连接多个配送中心、320家门店和线上订单，降低28%物流成本。'],
  'news-detail-36.html': ['2026-08-12', '八米科技为某泰国数字物流企业部署TMS+WMS，优化曼谷都市圈仓库与车辆协同，配送准时率达到99.2%。'],
  'news-detail-37.html': ['2026-11-11', '八米科技与某印尼零售集团启动OMS+WMS项目，覆盖雅加达及12个城市的480家门店和全渠道订单履约。'],
  'news-detail.html': ['2026-03-01', '八米科技与菲律宾APOLLOTECH达成战略合作，以4PL统仓共配方案服务东南亚快消零售供应链升级。']
};

const articleImages = {
  'news-detail-35.html': `${site}/images/news/2026-regional/vietnam-cover.webp`,
  'news-detail-36.html': `${site}/images/news/2026-regional/thailand-cover.webp`,
  'news-detail-37.html': `${site}/images/news/2026-regional/indonesia-cover.webp`
};

const productSchema = {
  'product-ai.html': ['BAMI AI Digital Workforce', 'AI数字员工'],
  'product-wms.html': ['BAMI WMS', '仓储管理系统'],
  'product-tms.html': ['BAMI TMS', '运输管理系统'],
  'product-oms.html': ['BAMI OMS', '订单管理系统']
};

const files = fs.readdirSync(root).filter((file) => file.endsWith('.html')).sort();

for (const file of files) {
  const fullPath = path.join(root, file);
  let html = fs.readFileSync(fullPath, 'utf8');
  html = html
    .replace(/https:\/\/lee18926200599-dotcom\.github\.io\/bami-website/g, site)
    .replace(/https:\/\/lee18926200599-dotcom\.github\.io\/bami-website\/images\/og-image\.jpg/g, ogImage)
    .replace(/<meta\s+name=["']viewport["'][^>]*>/i, '<meta name="viewport" content="width=device-width, initial-scale=1.0">');
  html = removeManagedSeo(html);

  const isEnglishPage = file.endsWith('-en.html') || /<body[^>]+data-page-lang=["']en["']/i.test(html);
  const isExcluded = excludedFromSeo.has(file);
  const canonical = `${site}${canonicalPath(file)}`;
  const title = titleFrom(html, isEnglishPage);
  const pageImage = articleImages[file] || ogImage;
  let description = descriptionFrom(html);

  if (articleMeta[file]) description = escapeHtml(articleMeta[file][1]);
  if (file === 'cases.html') description = escapeHtml('查看八米科技在新能源、医疗器械、快消零售与电商云仓等行业的成功案例，了解TMS、WMS、OMS和4PL方案带来的可量化业务价值。');
  if (file === 'cases-en.html') description = escapeHtml('Explore BAMI Technology success stories across new energy, medical devices, FMCG and e-commerce warehousing.');

  html = replaceOrAppendMeta(html, 'description', description || title);
  html = replaceOrAppendMeta(html, 'robots', isExcluded ? 'noindex, follow' : 'index, follow');

  const canonicalTag = `\n    <!-- SEO managed by scripts/apply-seo.js -->\n    <link rel="canonical" href="${canonical}">`;
  if (/<link\s+rel=["']canonical["'][^>]*>/i.test(html)) {
    html = html.replace(/<link\s+rel=["']canonical["'][^>]*>/i, canonicalTag.trim());
  } else {
    html = html.replace(/<\/head>/i, `${canonicalTag}\n</head>`);
  }

  const commonMeta = [
    `<meta property="og:type" content="${articleMeta[file] ? 'article' : 'website'}">`,
    `<meta property="og:url" content="${canonical}">`,
    `<meta property="og:title" content="${title}">`,
    `<meta property="og:description" content="${description || title}">`,
    `<meta property="og:image" content="${pageImage}">`,
    `<meta property="og:site_name" content="BAMI Technology">`,
    `<meta property="og:locale" content="${isEnglishPage ? 'en_US' : 'zh_CN'}">`,
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${title}">`,
    `<meta name="twitter:description" content="${description || title}">`,
    `<meta name="twitter:image" content="${pageImage}">`
  ];
  html = html.replace(/^[ \t]*<meta\s+(?:property|name)=["'](?:og|twitter):[^>]*>\r?\n?/gim, '');
  html = html.replace(/<\/head>/i, `    ${commonMeta.join('\n    ')}\n</head>`);

  if (!isEnglishPage && !isExcluded) {
    const alternates = [
      `<link rel="alternate" hreflang="zh-CN" href="${site}${localizedPath(file, 'zh')}" data-seo-managed>`,
      `<link rel="alternate" hreflang="en" href="${site}${localizedPath(file, 'en')}" data-seo-managed>`,
      `<link rel="alternate" hreflang="vi" href="${site}${localizedPath(file, 'vi')}" data-seo-managed>`,
      `<link rel="alternate" hreflang="th" href="${site}${localizedPath(file, 'th')}" data-seo-managed>`,
      `<link rel="alternate" hreflang="id" href="${site}${localizedPath(file, 'id')}" data-seo-managed>`,
      `<link rel="alternate" hreflang="x-default" href="${site}${localizedPath(file, 'zh')}" data-seo-managed>`
    ];
    html = html.replace(/<\/head>/i, `    ${alternates.join('\n    ')}\n</head>`);
  }

  if (articleMeta[file]) {
    const [datePublished] = articleMeta[file];
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: titleFrom(html, false),
      description: articleMeta[file][1],
      datePublished,
      dateModified: datePublished,
      image: [pageImage],
      mainEntityOfPage: canonical,
      author: { '@type': 'Organization', name: '八米科技' },
      publisher: {
        '@type': 'Organization',
        name: '八米科技',
        logo: { '@type': 'ImageObject', url: `${site}/images/logo.png` }
      }
    };
    html = html.replace(/<\/head>/i, `    <script type="application/ld+json" data-seo-schema>${JSON.stringify(schema)}</script>\n</head>`);
  }

  if (productSchema[file]) {
    const [name, alternateName] = productSchema[file];
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name,
      alternateName,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      url: canonical,
      description: descriptionFrom(html),
      provider: {
        '@type': 'Organization',
        name: '八米科技',
        url: site
      }
    };
    html = html.replace(/<\/head>/i, `    <script type="application/ld+json" data-seo-schema>${JSON.stringify(schema)}</script>\n</head>`);
  }

  if (file !== 'index.html' && !isExcluded) {
    const breadcrumb = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: '首页', item: `${site}/` },
        { '@type': 'ListItem', position: 2, name: title.replace(/ - (八米科技|BAMI Tech)$/, ''), item: canonical }
      ]
    };
    html = html.replace(/<\/head>/i, `    <script type="application/ld+json" data-seo-schema>${JSON.stringify(breadcrumb)}</script>\n</head>`);
  }

  fs.writeFileSync(fullPath, html);
}

// Keep structured data on the homepage aligned with the production domain and supported languages.
let index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
index = index.replace(/"availableLanguage":\s*\[[^\]]+\]/, '"availableLanguage": ["Chinese", "English", "Vietnamese", "Thai", "Indonesian"]');
index = index.replace(/<script type="application\/ld\+json">\s*\{\s*"@context": "https:\/\/schema\.org",\s*"@type": "WebSite"[\s\S]*?<\/script>/m, '');
fs.writeFileSync(path.join(root, 'index.html'), index);

fs.writeFileSync(path.join(root, 'robots.txt'), [
  'User-agent: *',
  'Allow: /',
  'Disallow: /admin/',
  'Disallow: /api/',
  'Disallow: /tmp/',
  'Disallow: /product-detail.html',
  'Disallow: /solution-detail.html',
  'Disallow: /thanks.html',
  '',
  '# Chinese search engines',
  'User-agent: Baiduspider',
  'Allow: /',
  'Crawl-delay: 1',
  '',
  '# Google',
  'User-agent: Googlebot',
  'Allow: /',
  '',
  `Sitemap: ${site}/sitemap.xml`,
  ''
].join('\n'));

const sitemapFiles = files.filter((file) => !file.endsWith('-en.html') && !excludedFromSeo.has(file));
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">'
];
for (const file of sitemapFiles) {
  const loc = `${site}${pagePath(file)}`;
  sitemap.push('  <url>');
  sitemap.push(`    <loc>${loc}</loc>`);
  sitemap.push('    <lastmod>2026-11-22</lastmod>');
  for (const lang of ['zh-CN', 'en', 'vi', 'th', 'id']) {
    const code = lang === 'zh-CN' ? 'zh' : lang;
    sitemap.push(`    <xhtml:link rel="alternate" hreflang="${lang}" href="${site}${localizedPath(file, code)}"/>`);
  }
  sitemap.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${loc}"/>`);
  sitemap.push('  </url>');
}
sitemap.push('</urlset>', '');
fs.writeFileSync(path.join(root, 'sitemap.xml'), sitemap.join('\n'));

console.log(`SEO applied to ${files.length} HTML pages; sitemap entries: ${sitemapFiles.length}`);
