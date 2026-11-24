const { chromium } = require('@playwright/test');
const targetLang = process.env.BAMI_TARGET_LANG || 'vi';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2
  });
  await context.addInitScript((lang) => {
    try { localStorage.setItem('bami_lang', lang); } catch (_) {}
  }, targetLang);
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.route('**/*', (route) => {
    const url = route.request().url();
    return url.startsWith('http://127.0.0.1:8000') || url.startsWith('data:')
      ? route.continue()
      : route.abort();
  });

  const pages = ['index.html', 'about.html', 'product-tms.html', 'solutions.html', 'cases.html', 'contact.html', 'news-detail-34.html', 'privacy.html'];
  const results = [];

  for (const target of pages) {
    await page.goto(`http://127.0.0.1:8000/${target}`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction((lang) => window.BAMI_LANG && window.BAMI_LANG.get() === lang, targetLang, { timeout: 10000 });
    results.push(await page.evaluate((target) => ({
      target,
      lang: document.documentElement.lang,
      chineseLeft: /[\u3400-\u9fff]/.test(document.body.innerText.replace(/中/g, '')),
      chineseMatches: [...new Set(document.body.innerText.split(/\n+/).filter((line) => /[\u3400-\u9fff]/.test(line) && line.trim() !== '中'))].slice(0, 20),
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
      viewport: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      overflowElements: [...document.querySelectorAll('body *')]
        .map((element) => ({ tag: element.tagName, cls: element.className, right: Math.round(element.getBoundingClientRect().right), width: Math.round(element.getBoundingClientRect().width) }))
        .filter((item) => item.right > document.documentElement.clientWidth + 3 || item.width > document.documentElement.clientWidth + 3)
        .slice(0, 15)
    }), target));
  }

  await page.goto('http://127.0.0.1:8000/index.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(200);
  const menuButton = page.locator('#menuBtn');
  if (await menuButton.count()) await menuButton.click();
  await page.waitForTimeout(150);
  await page.screenshot({ path: '/tmp/bami-vi-mobile.png', fullPage: false });
  const mobileLanguageSelects = await page.locator('.bami-language-select').count();

  await browser.close();
  console.log(JSON.stringify({ results, mobileLanguageSelects, errors }, null, 2));
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
