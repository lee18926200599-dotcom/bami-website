#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const outputRoot = path.join(root, 'js', 'lang-packs');
const languages = {
  vi: { catalog: 'js/lang-vi-content.js', global: 'BAMI_VI_EXTRA' },
  th: { catalog: 'js/lang-th-content.js', global: 'BAMI_TH_CATALOG' },
  id: { catalog: 'js/lang-id-content.js', global: 'BAMI_ID_CATALOG' }
};

const newsContext = { window: {} };
vm.runInNewContext(
  fs.readFileSync(path.join(root, 'js/lang-news-content.js'), 'utf8'),
  newsContext,
  { filename: 'js/lang-news-content.js' }
);
const newsTranslations = newsContext.window.BAMI_NEWS_TRANSLATIONS || {};

function pageKey(fileName) {
  return path.basename(fileName, '.html').replace(/[^a-z0-9_-]/gi, '-').toLowerCase();
}

function referencedScripts(html) {
  const scripts = [];
  const pattern = /<script\b[^>]*\bsrc=["']([^"']+\.js(?:\?[^"']*)?)["'][^>]*>/gi;
  let match;
  while ((match = pattern.exec(html))) {
    const source = match[1].split('?')[0];
    if (source.startsWith('js/') && !source.startsWith('js/lang-') && source !== 'js/geo-boot.js') {
      scripts.push(source);
    }
  }
  return [...new Set(scripts)];
}

function filterPairs(pairs, sourceText, includeDynamicTitles) {
  return pairs.filter((pair) => (
    Array.isArray(pair) &&
    typeof pair[0] === 'string' &&
    (
      sourceText.includes(pair[0]) ||
      (
        includeDynamicTitles &&
        pair[0].endsWith(' - 八米科技') &&
        sourceText.includes(pair[0].slice(0, -' - 八米科技'.length))
      )
    )
  ));
}

fs.rmSync(outputRoot, { recursive: true, force: true });

const htmlFiles = fs.readdirSync(root).filter((name) => name.endsWith('.html')).sort();
const stats = {};

for (const [lang, config] of Object.entries(languages)) {
  const context = { window: {} };
  vm.runInNewContext(
    fs.readFileSync(path.join(root, config.catalog), 'utf8'),
    context,
    { filename: config.catalog }
  );
  const catalog = context.window[config.global] || [];
  const news = newsTranslations[lang] || [];
  const languageOutput = path.join(outputRoot, lang);
  fs.mkdirSync(languageOutput, { recursive: true });

  let totalBytes = 0;
  let largest = { file: '', bytes: 0 };
  for (const fileName of htmlFiles) {
    const html = fs.readFileSync(path.join(root, fileName), 'utf8');
    const scriptText = referencedScripts(html)
      .map((source) => fs.readFileSync(path.join(root, source), 'utf8'))
      .join('\n');
    const sourceText = `${html}\n${scriptText}`;
    const includeDynamicTitles = fileName === 'product-detail.html' || fileName === 'solution-detail.html';
    const filteredCatalog = filterPairs(catalog, sourceText, includeDynamicTitles);
    const filteredNews = filterPairs(news, sourceText, includeDynamicTitles);
    const bundle = [
      '// Generated page-specific language catalog.',
      `window.${config.global} = ${JSON.stringify(filteredCatalog)};`,
      `window.BAMI_NEWS_TRANSLATIONS = Object.assign({}, window.BAMI_NEWS_TRANSLATIONS || {}, ${JSON.stringify({ [lang]: filteredNews })});`,
      ''
    ].join('\n');
    const key = pageKey(fileName);
    const outputFile = path.join(languageOutput, `${key}.js`);
    fs.writeFileSync(outputFile, bundle);
    const bytes = Buffer.byteLength(bundle);
    totalBytes += bytes;
    if (bytes > largest.bytes) largest = { file: `${lang}/${key}.js`, bytes };
  }
  stats[lang] = {
    pages: htmlFiles.length,
    totalKiB: Number((totalBytes / 1024).toFixed(1)),
    largestKiB: Number((largest.bytes / 1024).toFixed(1)),
    largest: largest.file
  };
}

console.log(JSON.stringify(stats, null, 2));
