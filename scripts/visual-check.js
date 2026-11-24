const { chromium } = require('@playwright/test');
const targetLang = process.env.BAMI_TARGET_LANG || 'vi';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1100 } });
  const page = await context.newPage();
  await page.route('**/*', (route) => {
    const url = route.request().url();
    return url.startsWith('http://127.0.0.1:8000') || url.startsWith('data:')
      ? route.continue()
      : route.abort();
  });

  await page.goto('http://127.0.0.1:8000/index.html', { waitUntil: 'domcontentloaded' });
  await page.locator('.bami-language-select').first().selectOption(targetLang);
  await page.waitForFunction((lang) => window.BAMI_LANG && window.BAMI_LANG.get() === lang, targetLang);
  await page.waitForTimeout(1800);
  await page.screenshot({ path: '/tmp/bami-vi-index.png', fullPage: true });

  const selected = await page.evaluate(() => ({
    lang: document.documentElement.lang,
    stored: localStorage.getItem('bami_lang'),
    title: document.title,
    languageSelects: [...document.querySelectorAll('.bami-language-select')].map((select) => ({
      value: select.value,
      options: [...select.options].map((option) => option.textContent.trim())
    })),
    heading: document.querySelector('h1')?.innerText
  }));

  await page.locator('.bami-language-select').first().selectOption('zh');
  await page.waitForFunction(() => window.BAMI_LANG && window.BAMI_LANG.get() === 'zh');
  await page.waitForTimeout(250);
  const zh = await page.evaluate(() => ({
    lang: document.documentElement.lang,
    title: document.title,
    heading: document.querySelector('h1')?.innerText
  }));

  await page.locator('.bami-language-select').first().selectOption('en');
  await page.waitForFunction(() => window.BAMI_LANG && window.BAMI_LANG.get() === 'en');
  await page.waitForTimeout(250);
  const en = await page.evaluate(() => ({
    lang: document.documentElement.lang,
    title: document.title,
    heading: document.querySelector('h1')?.innerText
  }));

  await page.locator('.bami-language-select').first().selectOption(targetLang);
  await page.waitForFunction((lang) => window.BAMI_LANG && window.BAMI_LANG.get() === lang, targetLang);
  await page.waitForTimeout(250);
  await page.goto('http://127.0.0.1:8000/news-detail-34.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(250);
  await page.screenshot({ path: '/tmp/bami-vi-news.png', fullPage: true });
  const article = await page.evaluate(() => ({
    stored: localStorage.getItem('bami_lang'),
    lang: document.documentElement.lang,
    title: document.title,
    heading: document.querySelector('h1')?.innerText,
    firstParagraph: document.querySelector('.article-content p')?.innerText,
    chineseLeft: /[\u3400-\u9fff]/.test(document.body.innerText)
  }));

  await browser.close();
  console.log(JSON.stringify({ selectedLang: targetLang, selected, zh, en, article }, null, 2));
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
