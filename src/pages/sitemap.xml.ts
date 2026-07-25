const siteUrl = 'https://okakaclub.com';
const pageModules = import.meta.glob('./**/*.astro');

const pagePaths = Object.keys(pageModules)
  .filter((path) => !path.includes('['))
  .map((path) =>
    path
      .replace(/^\./, '')
      .replace(/\/index\.astro$/, '/')
      .replace(/\.astro$/, '/')
  )
  .sort();

const escapeXml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

export const prerender = true;

export function GET() {
  const urls = pagePaths
    .map((path) => `  <url>\n    <loc>${escapeXml(new URL(path, siteUrl).href)}</loc>\n  </url>`)
    .join('\n');

  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    '</urlset>',
    '',
  ].join('\n');

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
