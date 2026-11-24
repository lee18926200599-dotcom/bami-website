const fs = require('fs');
const path = require('path');
const { chromium } = require('@playwright/test');

const root = path.resolve(__dirname, '..');
const baseUrl = process.env.BAMI_BASE_URL || 'http://127.0.0.1:8000';
const targetLang = process.env.BAMI_TARGET_LANG || 'vi';
const files = fs.readdirSync(root).filter((name) => name.endsWith('.html')).sort();
const targets = process.env.BAMI_TARGETS
  ? process.env.BAMI_TARGETS.split(',').map((target) => target.trim()).filter(Boolean)
  : [
      ...files,
      // The detail templates render their content from query-string data.
      'product-detail.html?id=ai',
      'product-detail.html?id=wms',
      'product-detail.html?id=tms',
      'product-detail.html?id=oms',
      'solution-detail.html?id=retail',
      'solution-detail.html?id=pharma',
      'solution-detail.html?id=crossborder',
      'solution-detail.html?id=manufacturing',
      'solution-detail.html?id=logistics'
    ];

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const reports = [];

  for (const target of targets) {
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.route('**/*', (route) => {
      const url = route.request().url();
      if (url.startsWith(baseUrl) || url.startsWith('data:')) return route.continue();
      return route.abort();
    });
    await page.goto(`${baseUrl}/${target}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(120);

    const languageSelect = page.locator('.bami-language-select').first();
    if (await languageSelect.count()) {
      await languageSelect.selectOption(targetLang);
      await page.waitForFunction((lang) => window.BAMI_LANG && window.BAMI_LANG.get() === lang, targetLang);
      await page.waitForTimeout(100);
    }

    const report = await page.evaluate((targetLang) => {
      const isCjk = (value) => /[\u3400-\u9fff]/.test(value || '');
      const visibleTexts = [];
      const attributes = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (!isCjk(node.nodeValue)) continue;
        if (node.parentElement && node.parentElement.closest('.lang-btn, .bami-language-select')) continue;
        if (node.parentElement && /SCRIPT|STYLE|NOSCRIPT/i.test(node.parentElement.tagName)) continue;
        visibleTexts.push(node.nodeValue.trim());
      }
      document.querySelectorAll('[title], [alt], [placeholder], [aria-label], [content]').forEach((el) => {
        for (const name of ['title', 'alt', 'placeholder', 'aria-label', 'content']) {
          const value = el.getAttribute(name);
          if (isCjk(value)) attributes.push(`${el.tagName.toLowerCase()}[${name}]=${value.trim()}`);
        }
      });
      return {
        lang: window.BAMI_LANG ? window.BAMI_LANG.get() : null,
        title: document.title,
        titleHasChinese: isCjk(document.title),
        langMatches: document.documentElement.lang === ({ zh: 'zh-CN', en: 'en', vi: 'vi', th: 'th', id: 'id' }[targetLang] || targetLang),
        thaiText: (document.body.innerText.match(/[\u0e00-\u0e7f]/g) || []).length,
        languageSelects: document.querySelectorAll('.bami-language-select').length,
        hasTargetOption: [...document.querySelectorAll('.bami-language-select option')].some((option) => option.value === targetLang),
        visibleTexts: [...new Set(visibleTexts)],
        attributes: [...new Set(attributes)]
      };
    }, targetLang);

    reports.push({ target, errors, ...report });
    await page.close();
  }

  await browser.close();
  const remaining = reports.reduce((sum, report) => sum + report.visibleTexts.length + report.attributes.length + (report.titleHasChinese ? 1 : 0), 0);
  const pagesWithoutSelect = reports.filter((report) => !report.languageSelects || !report.hasTargetOption).map((report) => report.target);
  const pagesWithWrongLang = reports.filter((report) => !report.langMatches).map((report) => report.target);
  fs.writeFileSync(path.join(root, 'scripts', `${targetLang}-check-report.json`), JSON.stringify({ remaining, reports }, null, 2));
  console.log(JSON.stringify({
    targetLang,
    pages: reports.length,
    remaining,
    pagesWithRemaining: reports.filter((report) => report.visibleTexts.length || report.attributes.length || report.titleHasChinese).length,
    pagesWithoutSelect,
    pagesWithWrongLang,
    errors: reports.filter((report) => report.errors.length).map((report) => ({ target: report.target, errors: report.errors }))
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
