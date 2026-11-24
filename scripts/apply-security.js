#!/usr/bin/env node
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const htmlFiles = fs.readdirSync(root)
  .filter((name) => name.endsWith('.html'))
  .sort();

const cdnFontAwesome = 'https://cdnjs.cloudflare.com';
const cdnFontAwesomeCss = `${cdnFontAwesome}/ajax/libs/font-awesome/6.4.0/css/all.min.css`;
const cdnFontAwesomeSri = 'sha384-iw3OoTErCYJJB9mCa8LNS2hbsQ7M3C0EpIsO/H5+EGAkPGc6rk+V8i04oW/K5xq0';

function sha256(value) {
  const normalized = String(value).replace(/\r\n?/g, '\n');
  return `sha256-${crypto.createHash('sha256').update(normalized, 'utf8').digest('base64')}`;
}

function inlineScriptHashes(html) {
  const hashes = new Set();
  const pattern = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = pattern.exec(html))) {
    if (/\bsrc\s*=/i.test(match[1])) continue;
    if (!match[2].trim()) continue;
    hashes.add(sha256(match[2]));
  }
  return [...hashes].sort();
}

function inlineHandlerHashes(html) {
  const hashes = new Set();
  const pattern = /\son[a-z0-9_]+\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
  let match;
  while ((match = pattern.exec(html))) {
    hashes.add(sha256(match[1] !== undefined ? match[1] : match[2]));
  }
  return [...hashes].sort();
}

function addNoopener(html) {
  return html.replace(/<a\b[^>]*\btarget\s*=\s*["']_blank["'][^>]*>/gi, (tag) => {
    if (/\brel\s*=/i.test(tag)) {
      return tag.replace(/\brel\s*=\s*(["'])(.*?)\1/i, (full, quote, value) => {
        const tokens = value.split(/\s+/).filter(Boolean);
        if (!tokens.includes('noopener')) tokens.push('noopener');
        return `rel=${quote}${[...new Set(tokens)].join(' ')}${quote}`;
      });
    }
    return tag.replace(/\s*>$/, ' rel="noopener">');
  });
}

function buildCsp(fileName, html) {
  const isContact = fileName === 'contact.html' || fileName === 'contact-en.html';
  const usesFontAwesome = fileName === 'product-detail.html' || fileName === 'solution-detail.html';
  const scriptHashes = [...new Set([
    ...inlineScriptHashes(html),
    ...inlineHandlerHashes(html)
  ])].sort();

  const styleSources = ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'];
  const fontSources = ["'self'", 'https://fonts.gstatic.com'];
  const connectSources = ["'self'", 'https://ipwho.is', 'https://ipinfo.io'];
  const formSources = ["'self'"];

  if (usesFontAwesome) {
    styleSources.push(cdnFontAwesome);
    fontSources.push(cdnFontAwesome);
  }
  if (isContact) {
    connectSources.push('https://formspree.io');
    formSources.push('https://formspree.io');
  }

  const directives = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-hashes'${scriptHashes.map((hash) => ` '${hash}'`).join('')}`,
    `style-src ${[...new Set(styleSources)].join(' ')}`,
    `font-src ${[...new Set(fontSources)].join(' ')}`,
    "img-src 'self' data:",
    `connect-src ${[...new Set(connectSources)].join(' ')}`,
    isContact ? 'frame-src https://www.google.com https://maps.google.com' : "frame-src 'none'",
    "media-src 'self'",
    "object-src 'none'",
    "worker-src 'none'",
    "manifest-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'none'",
    `form-action ${[...new Set(formSources)].join(' ')}`
  ];

  return directives.join('; ') + ';';
}

let updated = 0;
for (const fileName of htmlFiles) {
  const filePath = path.join(root, fileName);
  let html = fs.readFileSync(filePath, 'utf8');

  html = html.replace(/http:\/\/((?:[a-z0-9-]+\.)*8bami\.com)\b/gi, 'https://$1');
  html = addNoopener(html);
  html = html.replace(
    /<meta\b[^>]*http-equiv\s*=\s*["']X-XSS-Protection["'][^>]*>\s*/gi,
    ''
  );

  if (html.includes(cdnFontAwesomeCss)) {
    html = html.replace(
      new RegExp(`<link\\b[^>]*href=["']${cdnFontAwesomeCss.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]*>`, 'gi'),
      `<link rel="stylesheet" href="${cdnFontAwesomeCss}" integrity="${cdnFontAwesomeSri}" crossorigin="anonymous">`
    );
  }

  const csp = buildCsp(fileName, html);
  const cspMeta = `<meta http-equiv="Content-Security-Policy" content="${csp}">`;
  const existingCsp = /<meta\b[^>]*http-equiv\s*=\s*["']Content-Security-Policy["'][^>]*>/i;

  if (existingCsp.test(html)) {
    html = html.replace(existingCsp, cspMeta);
  } else {
    const charset = /<meta\b[^>]*charset\s*=\s*["'][^"']+["'][^>]*>/i;
    if (!charset.test(html)) throw new Error(`${fileName}: charset meta not found`);
    html = html.replace(charset, (tag) => `${tag}\n    ${cspMeta}`);
  }

  fs.writeFileSync(filePath, html);
  updated += 1;
}

console.log(`Security policy applied to ${updated} HTML pages.`);
