const { chromium } = require('@playwright/test');

const baseUrl = 'http://127.0.0.1:8000/index.html';

async function runCase(browser, name, options) {
  const context = await browser.newContext({
    userAgent: options.userAgent || 'Mozilla/5.0 Test Browser'
  });
  if (options.storage) {
    await context.addInitScript((storage) => {
      Object.entries(storage).forEach(([key, value]) => localStorage.setItem(key, value));
    }, options.storage);
  }

  const page = await context.newPage();
  let geoCalls = 0;
  await page.route('**/*', (route) => {
    const url = route.request().url();
    if (url.startsWith('http://127.0.0.1:8000') || url.startsWith('data:')) {
      return route.continue();
    }
    if (url.startsWith('https://ipwho.is')) {
      geoCalls += 1;
      if (!options.country) return route.abort();
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        headers: { 'access-control-allow-origin': '*' },
        body: JSON.stringify({ success: true, country_code: options.country })
      });
    }
    if (url.startsWith('https://ipinfo.io')) {
      geoCalls += 1;
      if (!options.fallbackCountry) return route.abort();
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        headers: { 'access-control-allow-origin': '*' },
        body: JSON.stringify({ country: options.fallbackCountry })
      });
    }
    return route.abort();
  });

  await page.goto(baseUrl + (options.query || ''), { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(
    (expected) => window.BAMI_LANG && window.BAMI_LANG.get() === expected,
    options.expected,
    { timeout: 10000 }
  );
  await page.waitForTimeout(100);
  const result = await page.evaluate(() => ({
    language: window.BAMI_LANG.get(),
    preference: localStorage.getItem('bami_lang_preference'),
    stored: localStorage.getItem('bami_lang'),
    pending: document.documentElement.classList.contains('bami-locale-pending'),
    canonical: document.querySelector('link[rel="canonical"]')?.href
  }));
  await context.close();
  return { name, expected: options.expected, geoCalls, ...result };
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (const [name, country, expected] of [
    ['China', 'CN', 'zh'],
    ['Hong Kong', 'HK', 'zh'],
    ['Taiwan', 'TW', 'zh'],
    ['Macao', 'MO', 'zh'],
    ['Vietnam', 'VN', 'vi'],
    ['Thailand', 'TH', 'th'],
    ['Indonesia', 'ID', 'id'],
    ['Japan', 'JP', 'en'],
    ['Malaysia', 'MY', 'en'],
    ['United States', 'US', 'en']
  ]) {
    results.push(await runCase(browser, name, { country, expected }));
  }

  results.push(await runCase(browser, 'Geo API failure', { expected: 'en' }));
  results.push(await runCase(browser, 'Fallback geo API', { fallbackCountry: 'VN', expected: 'vi' }));
  results.push(await runCase(browser, 'User preference wins', {
    country: 'CN',
    expected: 'id',
    storage: { bami_lang: 'id', 'bami-lang': 'id', bami_lang_preference: '1' }
  }));
  results.push(await runCase(browser, 'Legacy preference migration', {
    country: 'CN',
    expected: 'vi',
    storage: { bami_lang: 'vi', 'bami-lang': 'vi' }
  }));
  results.push(await runCase(browser, 'URL language wins', {
    country: 'CN',
    expected: 'th',
    query: '?lang=th'
  }));
  results.push(await runCase(browser, 'Googlebot keeps canonical Chinese', {
    country: 'US',
    expected: 'zh',
    userAgent: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
  }));

  await browser.close();
  console.log(JSON.stringify(results, null, 2));
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
