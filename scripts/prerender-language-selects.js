#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const styleId = 'bami-language-select-styles';
const performanceStyleId = 'bami-performance-styles';
const style = [
  '<style id="bami-language-select-styles">',
  '.bami-language-select{appearance:none;-webkit-appearance:none;min-width:112px;height:36px;padding:0 34px 0 14px;border:1px solid rgba(255,107,53,.35);border-radius:20px;background-color:#1A2235;background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\' viewBox=\'0 0 12 8\'%3E%3Cpath d=\'M1 1.5 6 6.5 11 1.5\' fill=\'none\' stroke=\'%23FF8A5C\' stroke-width=\'1.8\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 13px center;background-size:12px 8px;color:#fff;font:600 13px/1 -apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;cursor:pointer;outline:none;transition:border-color .2s,box-shadow .2s;}',
  '.bami-language-select:hover,.bami-language-select:focus{border-color:#FF6B35;box-shadow:0 0 0 3px rgba(255,107,53,.12);}',
  '.bami-language-select option{background:#1A2235;color:#fff;}',
  '.mobile-menu-footer .bami-language-select{margin:0 auto;min-width:132px;}',
  '.bami-fallback-language-select{position:fixed;right:16px;bottom:16px;z-index:10000;}',
  '</style>'
].join('');
const performanceStyle = [
  `<style id="${performanceStyleId}">`,
  '.footer,.section,.article-section,.cta-section,.product-detail,.solution-section,.news-section,.cases-section,.shareholder-section,.timeline-section,.tms-section,.process-section,.scenario-section,.modules-section,.about-section,.founder-section,.clients-section,.culture-section,.contact-section,.highlights-section,.value-section,.pain-intro,.pain-points,.solution-features,.benefits-section,.team-section,.org-section,.certificates-section,.quality-section,.steps-section,.feedback-section,.support-section,.features-section{content-visibility:auto;contain-intrinsic-size:auto 700px;}',
  '</style>'
].join('');

const options = [
  ['zh', '中文', 'zh-CN', 'Chinese'],
  ['en', 'English', 'en', 'English'],
  ['vi', 'Tiếng Việt', 'vi', 'Vietnamese'],
  ['th', 'ไทย', 'th', 'Thai'],
  ['id', 'Bahasa Indonesia', 'id', 'Indonesian']
];

function selectMarkup(initialLang) {
  return [
    '<select class="bami-language-select" aria-label="Select language / Chọn ngôn ngữ">',
    ...options.map(([code, label, htmlLang, ariaLabel]) => (
      `<option value="${code}" lang="${htmlLang}" aria-label="${ariaLabel}"${code === initialLang ? ' selected' : ''}>${label}</option>`
    )),
    '</select>'
  ].join('');
}

let holders = 0;
let pages = 0;

for (const fileName of fs.readdirSync(root).filter((name) => name.endsWith('.html')).sort()) {
  const filePath = path.join(root, fileName);
  let html = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  const initialLang = fileName.includes('-en') ? 'en' : 'zh';
  const holderPattern = /(<div\b[^>]*\bclass=["'][^"']*\blang-(?:switch|switcher)\b[^"']*["'][^>]*>)([\s\S]*?)(<\/div>)/gi;

  html = html.replace(holderPattern, (full, open, inner, close) => {
    if (inner.includes('bami-language-select')) return full;
    holders += 1;
    changed = true;
    return `${open}${selectMarkup(initialLang)}${close}`;
  });

  if (!html.includes(`id="${styleId}"`)) {
    html = html.replace(/<\/head>/i, `    ${style}\n</head>`);
    changed = true;
  }
  if (!html.includes(`id="${performanceStyleId}"`)) {
    html = html.replace(/<\/head>/i, `    ${performanceStyle}\n</head>`);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, html);
    pages += 1;
  }
}

console.log({ pages, languageSwitchersPrerendered: holders });
