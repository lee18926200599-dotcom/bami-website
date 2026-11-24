# BAMI Website SEO Audit

Updated: 2026-11-22

## Current status

The site now passes the repository SEO audit for:

- Production canonical URLs on `https://www.8bami.com`
- Unique titles and descriptions on indexable pages
- One H1 per page
- Hreflang alternates for Chinese, English, Vietnamese, Thai and Indonesian
- Valid sitemap XML with 32 indexable URLs
- Google and Baidu crawler rules
- Open Graph and Twitter card metadata
- Organization, WebSite, NewsArticle, SoftwareApplication and BreadcrumbList structured data
- No broken internal links
- Noindex rules for query templates, duplicate news content and the thank-you page
- Mobile viewport without user zoom restrictions
- Privacy Policy linked from the footer and inquiry form
- Inquiry form submits to Formspree and pushes a `generate_lead` dataLayer event

Run `node scripts/audit-seo.js` to repeat the static audit.

Latest automated results:

- 44 HTML pages and 53 tested routes/states
- 0 broken internal links
- 0 Vietnamese, Thai or Indonesian pages with residual Chinese copy
- 0 browser JavaScript errors in the locale regression run
- 0 horizontal-overflow issues in the tested 390px mobile views
- Local SEO audit: 0 blocking issues under repository checks

## Implemented technical fixes

1. Replaced the GitHub Pages URL in canonical, Open Graph, schema and sitemap data with `https://www.8bami.com`.
2. Added language URLs using `?lang=en`, `?lang=vi`, `?lang=th` and `?lang=id`, with matching canonical and Hreflang values.
3. Added correct article descriptions and dates, and removed mismatched placeholder descriptions.
4. Marked duplicate/query templates as `noindex, follow`.
5. Added a 1200x630 social sharing image at `images/og-image.jpg`.
6. Made Vietnamese, Thai and Indonesian language packs load on demand instead of loading translations on every page.
7. Optimized the largest homepage news images to WebP; the initial homepage transfer dropped from about 3.5 MB to about 0.6 MB in local testing.
8. Replaced placeholder overseas phone numbers with a central-contact instruction until verified local numbers are available.
9. Corrected broken English news-card links that previously sent multiple cards to the same article.
10. Added privacy consent to the inquiry form and actual form delivery instead of the previous simulated success alert.

## Required before Google Ads launch

These items require deployment access, account access or final business input:

1. Deploy these files to the production root at `https://www.8bami.com`.
2. Redirect `http://`, the non-www hostname and `/index.html` to the preferred HTTPS canonical URL.
3. Confirm and test the Formspree endpoint `xreywwro`, including recipient inbox, spam filtering and success emails.
4. Add the GA4 Measurement ID and Google Ads Conversion ID/Conversion Label. The site already emits:
   `window.dataLayer.push({ event: 'generate_lead', ... })`.
5. Configure Google Ads conversion tracking for the `generate_lead` event and test it with Google Tag Assistant.
6. If advertising in the EEA/UK, add Consent Mode v2 and a compliant cookie consent interface before loading advertising or analytics tags.
7. Verify the domain in Google Search Console, submit `https://www.8bami.com/sitemap.xml`, and inspect the homepage, four product pages, solution pages and main news pages.
8. Confirm that all displayed branch addresses, email addresses and service claims are current and verifiable.

## Organic search note

The current multilingual implementation uses language-specific query URLs and browser-rendered translations. Hreflang and canonical signals are present, which is suitable for ads landing pages and initial multilingual indexing.

For the strongest long-term organic visibility in Southeast Asia, the recommended next phase is to pre-render dedicated localized pages such as `/th/product-tms.html`, `/vi/product-tms.html` and `/id/product-tms.html`, rather than relying only on client-side translation. This is an optimization, not a Google Ads launch blocker.
