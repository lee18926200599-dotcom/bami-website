#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'dist');
if (path.dirname(output) !== root || path.basename(output) !== 'dist') {
  throw new Error('Refusing unexpected deployment output path');
}

fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });

const htmlFiles = fs.readdirSync(root)
  .filter((name) => name.endsWith('.html'))
  .sort();

for (const file of htmlFiles) {
  fs.copyFileSync(path.join(root, file), path.join(output, file));
}
for (const directory of ['css', 'js', 'images']) {
  fs.cpSync(path.join(root, directory), path.join(output, directory), {
    recursive: true,
    dereference: false,
    filter: (source) => path.basename(source) !== '.DS_Store'
  });
}
for (const file of ['robots.txt', 'sitemap.xml']) {
  fs.copyFileSync(path.join(root, file), path.join(output, file));
}

const forbidden = [
  '.git',
  '.DS_Store',
  '.env',
  'AGENTS.md',
  'CODEX_HANDOFF.md',
  'SEO-AUDIT.md',
  'IMAGE-CREDITS.md',
  'scripts',
  'output',
  '网站交接目录',
  '网站交接目录.zip'
];

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

const deployedFiles = walk(output);
const leaked = deployedFiles.filter((file) => {
  const relative = path.relative(output, file);
  return forbidden.some((name) => relative === name || relative.startsWith(`${name}${path.sep}`));
});
if (leaked.length) {
  throw new Error(`Unsafe deployment files detected: ${leaked.join(', ')}`);
}

const bytes = deployedFiles.reduce((total, file) => total + fs.statSync(file).size, 0);
console.log(JSON.stringify({
  output,
  htmlPages: htmlFiles.length,
  files: deployedFiles.length,
  megabytes: Number((bytes / 1024 / 1024).toFixed(2)),
  forbiddenFiles: 0
}, null, 2));
