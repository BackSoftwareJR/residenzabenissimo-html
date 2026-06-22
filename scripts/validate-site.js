'use strict';

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const indexPath = path.join(root, 'index.html');
const cssPath = path.join(root, 'ux-system.css');

function fail(message) {
  console.error(`validate-site: ${message}`);
  process.exit(1);
}

const indexHtml = fs.readFileSync(indexPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');

if (!indexHtml.includes('id="come-iniziare"')) {
  fail('missing steps section (#come-iniziare)');
}

if (!indexHtml.includes('class="steps-cta"')) {
  fail('missing centered steps CTA container');
}

const stepsCtaMatch = indexHtml.match(/<div class="steps-cta">[\s\S]*?<\/div>/);
if (!stepsCtaMatch || !stepsCtaMatch[0].includes('Prenota una visita')) {
  fail('steps CTA must contain "Prenota una visita"');
}

if (stepsCtaMatch[0].includes('fade-in-up')) {
  fail('steps CTA must remain visible (no fade-in-up on .steps-cta)');
}

if (!css.includes('.steps-cta .btn-call')) {
  fail('missing .steps-cta .btn-call styles in ux-system.css');
}

if (!/\.steps-cta\s+\.btn-call\s*\{[\s\S]*background:\s*#fff\s*!important/.test(css)) {
  fail('.steps-cta .btn-call must force a white background for contrast');
}

if (!/\.steps-cta\s+\.btn-call\s*\{[\s\S]*color:\s*var\(--color-primary-dark\)\s*!important/.test(css)) {
  fail('.steps-cta .btn-call must force readable text color');
}

if (!/\.steps-cta\s*\{[\s\S]*justify-content:\s*center/.test(css)) {
  fail('.steps-cta must center the CTA');
}

console.log('validate-site: ok');
