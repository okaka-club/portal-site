import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {checkLinks} from './check-links.mjs';
async function fixture(t,files) {
  const root=await mkdtemp(path.join(tmpdir(),'portal-links-'));
  t.after(()=>rm(root,{recursive:true,force:true}));
  for(const [file,content] of Object.entries(files)) {await mkdir(path.dirname(path.join(root,file)),{recursive:true});await writeFile(path.join(root,file),content);}
  return root;
}
test('valid local links, assets, anchors and sitemap; external URLs are ignored',async t=>{
  const root=await fixture(t,{
    'index.html': `<div id="games"></div><a href="/#games">Home</a><a href="#games">Same</a><a href="/about/?a=1&amp;b=2#%E6%97%A5%E6%9C%AC">About</a><img src="/logo.png"><link href="/assets/site.css"><a href="https://okakaclub.com/about/">About</a><a href="https://example.invalid/">External</a><a href="mailto:x@example.invalid">Mail</a><img src="data:image/png;base64,AAA"><!-- <img src="/ignored"> --><script>const x='<img src="/ignored">';</script>`,
    'about/index.html': `<h1 id='日本'>About</h1><a href='../#games'>Home</a>`,
    'logo.png':'','assets/site.css':'@font-face{src:url(../fonts/test.woff2)}','fonts/test.woff2':'',
    'sitemap.xml':'<urlset><url><loc>https://okakaclub.com/about/</loc></url></urlset>'
  });
  const result=await checkLinks(root);assert.deepEqual(result.errors,[]);assert.equal(result.pages,2);assert.equal(result.checked,9);
});
test('broken page, image, local/cross-page anchor, font and sitemap fail',async t=>{
  const root=await fixture(t,{
    'index.html':'<a href="/missing/">X</a><img src="/typo.png"><a href="/about/#missing">X</a><a href="#missing">X</a>',
    'about/index.html':'<h1 id="present">About</h1>',
    'site.css':'@font-face{src:url(/fonts/missing.woff2)}',
    'sitemap-index.xml':'<sitemapindex><sitemap><loc>https://okakaclub.com/sitemap-0.xml</loc></sitemap></sitemapindex>',
    'sitemap-0.xml':'<urlset><url><loc>https://okakaclub.com/gone/</loc></url></urlset>'
  });
  const errors=(await checkLinks(root)).errors;
  assert.equal(errors.length,6);
  for(const value of ['/missing/','/typo.png','/about/#missing','index.html: #missing','/fonts/missing.woff2','/gone/']) assert.ok(errors.some(error=>error.includes(value)),value);
  const cli=spawnSync(process.execPath,[fileURLToPath(new URL('./check-links.mjs',import.meta.url)),root],{encoding:'utf8'});assert.equal(cli.status,1);assert.match(cli.stdout,/問題 6 件/);
});
test('empty build fails',async t=>{await assert.rejects(checkLinks(await fixture(t,{})),/HTML がありません/);});
test('invalid encoding and encoded traversal fail safely',async t=>{
  const root=await fixture(t,{'index.html':'<a href="/%ZZ">Bad</a><a href="/..%2f..%2foutside">Escape</a>'});assert.equal((await checkLinks(root)).errors.length,2);
});

test('quoted attributes do not create phantom ids or hide references',async t=>{
  const root=await fixture(t,{'index.html':'<div title="id=phantom > text" data-x="src=/fake"></div><a href="#phantom">Bad</a><img title="a > b" src="/missing.png">'});
  const errors=(await checkLinks(root)).errors;
  assert.equal(errors.length,2);assert.ok(errors.some(x=>x.includes('#phantom')));assert.ok(errors.some(x=>x.includes('/missing.png')));
});
test('index suffix pages, inline style, script src and CDATA sitemap',async t=>{
  const root=await fixture(t,{
    'myindex.html': '<h1 id=x>Hi</h1><a href="#x">Same</a><style>p{background:url("/logo.png")}</style><!-- <style>p{background:url(/missing)}</style> --><script src="/app.js"></script>',
    'logo.png':'','app.js':'',
    'sitemap.xml':'<urlset><!-- <loc>https://okakaclub.com/missing/</loc> --><url><loc><![CDATA[https://okakaclub.com/myindex.html]]></loc></url></urlset>'
  });assert.deepEqual((await checkLinks(root)).errors,[]);
});
test('wrong sitemap origin, relative loc, encoded separator and file slash fail',async t=>{
  const root=await fixture(t,{
    'index.html':'<img src="/logo.png/"><a href="http://okakaclub.com/missing">Bad</a><a href="/a%2Fb">Bad</a>', 'logo.png':'','a/b':'',
    'sitemap.xml':'<urlset><loc>https://localhost/index.html</loc><loc>/index.html</loc></urlset>'
  });assert.equal((await checkLinks(root)).errors.length,5);
});
