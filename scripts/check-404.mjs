// Regression check for the custom 404 page (#85).
// Usage: run the site build first, then `node scripts/check-404.mjs`.
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const dist = new URL('../dist/', import.meta.url);

const read = (name) => {
  const file = fileURLToPath(new URL(name, dist));
  assert.ok(existsSync(file), `dist/${name} is missing (run the build first)`);
  return readFileSync(file, 'utf8');
};

const html = read('404.html');
const sitemap = read('sitemap.xml');

assert.ok(html.includes('lang="ja"'), '404 page must be served as Japanese (lang="ja")');
assert.ok(html.includes('ページが見つかりません'), '404 page must contain the Japanese heading');
assert.ok(
  html.includes('name="robots" content="noindex"'),
  '404 page must have a robots noindex meta tag'
);
assert.ok(!html.includes('rel="canonical"'), '404 page must not declare a canonical URL');
assert.ok(!html.includes('adsbygoogle'), '404 page must not load the AdSense script');
assert.ok(
  !html.includes('google-adsense-account'),
  '404 page must not include the AdSense account meta tag'
);

for (const href of ['/', '/#games', '/contact/']) {
  assert.ok(html.includes(`href="${href}"`), `404 page must link to ${href}`);
}

assert.ok(
  sitemap.includes('<loc>https://okakaclub.com/</loc>'),
  'sitemap must still list the top page'
);
assert.ok(!sitemap.includes('/404'), 'sitemap must not list the 404 page');

console.log('check-404: OK');
