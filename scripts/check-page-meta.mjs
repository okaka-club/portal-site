// Regression check for issue #86: page metadata in the built site.
// Usage: npm run build && node scripts/check-page-meta.mjs [distDir]
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';

const distDir = process.argv[2] ?? 'dist';
const SUFFIX = ' | おかかくらぶ';
const HOME_DESCRIPTION = 'おかかくらぶのミニゲーム・診断サービス一覧';
const EXPECTED_ROUTES = [
  '/',
  '/about/',
  '/contact/',
  '/games/maru-batsu-shindan/',
  '/games/soritia/',
  '/games/yuru-jinro/',
  '/privacy/',
  '/terms/',
];

function findIndexFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...findIndexFiles(full));
    else if (entry.name === 'index.html') out.push(full);
  }
  return out;
}

function decode(value) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

function metaContent(html, attr, key) {
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const attrs = {};
    for (const m of tag.matchAll(/([\w:-]+)\s*=\s*"([^"]*)"/g)) {
      attrs[m[1].toLowerCase()] = decode(m[2]);
    }
    if (attrs[attr] === key) return attrs.content;
  }
  return undefined;
}

function routeOf(file) {
  const rel = relative(distDir, dirname(file)).split(sep).join('/');
  return rel === '' ? '/' : '/' + rel + '/';
}

const errors = [];

if (!existsSync(distDir)) {
  console.error('Build output not found: ' + distDir + ' (run the build first)');
  process.exit(1);
}

const pages = findIndexFiles(distDir)
  .map((file) => ({ file, route: routeOf(file), html: readFileSync(file, 'utf8') }))
  .sort((a, b) => a.route.localeCompare(b.route));

if (pages.length !== EXPECTED_ROUTES.length) {
  errors.push(
    'expected ' + EXPECTED_ROUTES.length + ' index.html pages, found ' + pages.length + ': ' +
      pages.map((p) => p.route).join(', ')
  );
}

for (const route of EXPECTED_ROUTES) {
  if (!pages.some((p) => p.route === route)) errors.push('missing page: ' + route);
}

const seen = new Map();

for (const { route, html } of pages) {
  const description = metaContent(html, 'name', 'description');
  const ogDescription = metaContent(html, 'property', 'og:description');
  const twDescription = metaContent(html, 'name', 'twitter:description');

  if (!description || description.trim() === '') {
    errors.push(route + ': missing meta description');
  } else {
    if (seen.has(description)) {
      errors.push(route + ': description duplicates ' + seen.get(description) + ': ' + description);
    } else {
      seen.set(description, route);
    }
    if (ogDescription !== description) errors.push(route + ': og:description does not match description');
    if (twDescription !== description) errors.push(route + ': twitter:description does not match description');
  }

  if (route === '/') {
    if (description !== HOME_DESCRIPTION) {
      errors.push('/: home description changed from default: ' + description);
    }
    continue;
  }

  if (description === HOME_DESCRIPTION) {
    errors.push(route + ': inherits the default homepage description');
  }

  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const titles = {
    '<title>': titleMatch ? decode(titleMatch[1].trim()) : undefined,
    'og:title': metaContent(html, 'property', 'og:title'),
    'twitter:title': metaContent(html, 'name', 'twitter:title'),
  };

  for (const [label, value] of Object.entries(titles)) {
    if (!value) errors.push(route + ': missing ' + label);
    else if (!value.endsWith(SUFFIX)) {
      errors.push(route + ': ' + label + ' does not end with "' + SUFFIX + '": ' + value);
    }
  }
}

if (errors.length > 0) {
  console.error('Page metadata check failed:\n' + errors.map((e) => '  - ' + e).join('\n'));
  process.exit(1);
}

console.log('Page metadata check passed for ' + pages.length + ' pages.');
