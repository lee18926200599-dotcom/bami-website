#!/usr/bin/env node
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const files = fs.readdirSync(root).filter((name) => name.endsWith('.html')).sort();
const issues = [];

function sha256(value) {
  const normalized = String(value).replace(/\r\n?/g, '\n');
  return `sha256-${crypto.createHash('sha256').update(normalized, 'utf8').digest('base64')}`;
}

for (const file of files) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  const cspMeta = html.match(/<meta\b[^>]*http-equiv=["']Content-Security-Policy["'][^>]*>/i);
  const cspMatch = cspMeta && cspMeta[0].match(/\bcontent=(["'])([\s\S]*?)\1/i);
  if (!cspMatch) {
    issues.push({ file, issue: 'missing CSP' });
    continue;
  }

  const csp = cspMatch[2];
  const scriptDirective = (csp.match(/(?:^|;\s*)script-src\s+([^;]+)/i) || [])[1] || '';
  if (/'unsafe-inline'/i.test(scriptDirective)) issues.push({ file, issue: 'script-src allows unsafe-inline' });
  if (/'unsafe-eval'/i.test(scriptDirective)) issues.push({ file, issue: 'script-src allows unsafe-eval' });

  const scriptPattern = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = scriptPattern.exec(html))) {
    if (/\bsrc\s*=/i.test(match[1]) || !match[2].trim()) continue;
    const hash = sha256(match[2]);
    if (!csp.includes(`'${hash}'`)) issues.push({ file, issue: `inline script missing CSP hash ${hash}` });
  }

  const handlerPattern = /\son[a-z0-9_]+\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
  while ((match = handlerPattern.exec(html))) {
    const hash = sha256(match[1] !== undefined ? match[1] : match[2]);
    if (!csp.includes(`'${hash}'`)) issues.push({ file, issue: `inline handler missing CSP hash ${hash}` });
  }

  if (/http:\/\/(?:[a-z0-9-]+\.)*8bami\.com/i.test(html)) {
    issues.push({ file, issue: 'BAMI link still uses HTTP' });
  }
  if (/href=["']javascript:/i.test(html)) {
    issues.push({ file, issue: 'javascript: URL found' });
  }

  const blankPattern = /<a\b[^>]*target=["']_blank["'][^>]*>/gi;
  while ((match = blankPattern.exec(html))) {
    const rel = (match[0].match(/\brel=["']([^"']*)["']/i) || [])[1] || '';
    if (!rel.split(/\s+/).includes('noopener')) {
      issues.push({ file, issue: 'target=_blank missing rel=noopener' });
    }
  }

  if (html.includes('cdnjs.cloudflare.com/ajax/libs/font-awesome') &&
      !/<link\b[^>]*cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome[^>]*integrity=/i.test(html)) {
    issues.push({ file, issue: 'Font Awesome stylesheet missing SRI' });
  }
}

const result = {
  pages: files.length,
  issues: issues.length,
  byPages: [...new Set(issues.map((item) => item.file))].length,
  details: issues.slice(0, 100)
};

console.log(JSON.stringify(result, null, 2));
if (issues.length) process.exit(1);
