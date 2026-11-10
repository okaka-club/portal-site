import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const origin = 'https://okakaclub.com';
const entities = value => value.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt);/gi, (all, key) => {
  if (key[0] !== '#') return {amp:'&',quot:'"',apos:"'",lt:'<',gt:'>'}[key.toLowerCase()];
  const code = key[1].toLowerCase() === 'x' ? parseInt(key.slice(2),16) : Number(key.slice(1));
  return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : all;
});
async function walk(dir) {
  const files = [];
  for (const entry of await readdir(dir, {withFileTypes:true})) {
    const file = path.join(dir,entry.name);
    if (entry.isDirectory()) files.push(...await walk(file));
    else if (entry.isFile()) files.push(file);
  }
  return files;
}
// Deliberately limited to generated HTML attributes, not a general HTML parser.
const cleanMarkup = html => html.replace(/<!--[\s\S]*?-->/g,'').replace(/<script\b([^>]*)>[\s\S]*?<\/script\s*>/gi,'<script $1></script>');
function attributes(html) {
  const result = [];
  const markup = cleanMarkup(html);
  for (const tag of markup.matchAll(/<[a-z][^\s/>]*(?:[^>"']|"[^"]*"|'[^']*')*>/gi)) {
    for (const attr of tag[0].matchAll(/\s([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/gi)) {
      if (/^(href|src|id)$/i.test(attr[1])) result.push([attr[1].toLowerCase(), entities(attr[2] ?? attr[3] ?? attr[4] ?? '')]);
    }
  }
  return result;
}
export async function checkLinks(directory) {
  const root = path.resolve(directory), files = await walk(root);
  const pages = files.filter(file => file.endsWith('.html')).length;
  if (!pages) throw new Error('HTML がありません。先に npm run build を実行してください');
  const ids = new Map(), refs = [];
  const urlFor = file => new URL('/'+path.relative(root,file).split(path.sep).join('/').replace(/(^|\/)index\.html$/,'$1'),origin);
  const cssRefs = (text,file) => {
    for (const match of text.replace(/\/\*[\s\S]*?\*\//g,'').matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^\s)]*))\s*\)/gi)) refs.push({file,value:match[1]??match[2]??match[3]});
  };
  for (const file of files) {
    if (file.endsWith('.html')) {
      const html = await readFile(file,'utf8'), attrs = attributes(html);
      ids.set(file,new Set(attrs.filter(([name])=>name==='id').map(([,value])=>value)));
      for (const [name,value] of attrs) if(name!=='id') refs.push({file,value});
      for (const style of cleanMarkup(html).matchAll(/<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi)) cssRefs(style[1],file);
    } else if(file.endsWith('.css')) cssRefs(await readFile(file,'utf8'),file);
    else if(/^sitemap.*\.xml$/.test(path.basename(file))) {
      for(const match of (await readFile(file,'utf8')).replace(/<!--[\s\S]*?-->/g,'').matchAll(/<loc\b[^>]*>([\s\S]*?)<\/loc>/gi)) refs.push({file,value:entities(match[1].trim().replace(/^<!\[CDATA\[([\s\S]*)\]\]>$/, '$1')),sitemap:true});
    }
  }
  const errors = []; let checked = 0;
  for(const {file,value,sitemap} of refs) {
    if(!value.trim()) continue;
    try {
      const url = sitemap ? new URL(value) : new URL(value,urlFor(file));
      if(sitemap && url.origin!==origin) throw new Error('サイトマップの origin が不一致');
      if(!['http:','https:'].includes(url.protocol) || url.hostname!==new URL(origin).hostname || url.port) continue; // Never request an external URL.
      checked++;
      if(/%2f|%5c/i.test(url.pathname)) throw new Error('エンコードされたパス区切り');
      let target = path.resolve(root,'.'+decodeURIComponent(url.pathname));
      if(target!==root && !target.startsWith(root+path.sep)) throw new Error('出力先の外を参照');
      const info = await stat(target);
      if(url.pathname.endsWith('/') && !info.isDirectory()) throw new Error('ファイルへの末尾スラッシュ');
      if(info.isDirectory()) target=path.join(target,'index.html');
      if(!(await stat(target)).isFile()) throw new Error('ファイルではありません');
      if(url.hash && ids.has(target)) {
        const fragment=decodeURIComponent(url.hash.slice(1));
        if(!ids.get(target).has(fragment)) throw new Error(`アンカー #${fragment} がありません`);
      }
    } catch(error) { errors.push(`${path.relative(root,file)}: ${value} → ${error.code==='ENOENT'?'参照先がありません':error.message}`); }
  }
  return {pages,checked,errors:[...new Set(errors)]};
}
if(process.argv[1] && import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const result=await checkLinks(process.argv[2]??'dist');
    result.errors.forEach(error=>console.error(error));
    console.log(`内部リンク検証: ${result.pages} ページ / ${result.checked} 参照 / 問題 ${result.errors.length} 件`);
    process.exitCode=result.errors.length?1:0;
  } catch(error) {console.error(error.message);process.exitCode=1;}
}
