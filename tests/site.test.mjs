import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createSiteServer} from '../scripts/serve.mjs';
import {normalizeText} from '../js/main.js';
import {staticPageLinks} from '../scripts/lib.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const site = JSON.parse(await fs.readFile(path.join(root, 'data/site.json'), 'utf8'));
const labGroups = JSON.parse(await fs.readFile(path.join(root, 'data/lab-groups.json'), 'utf8'));
test('Vietnamese searches ignore accents and case',()=>assert.equal(normalizeText('ĐẤT & Bê tông'),'dat & be tong'));
test('main home images remain below the performance budget',async()=>{
  const sizes=await Promise.all(['assets/image/hero-banner.webp','anh_truc_dien_cong_ty.webp','image/anhdaidien_png.png'].map(async file=>(await fs.stat(path.join(root,file))).size));assert.ok(sizes.reduce((a,b)=>a+b,0)<600000);
});
test('local preview reproduces clean URLs, aliases, case sensitivity and PDF ranges',async t=>{
  const server=await createSiteServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  t.after(async()=>{server.closeAllConnections();await new Promise(resolve=>server.close(resolve));});
  const base=`http://127.0.0.1:${server.address().port}`;
  const slash=await fetch(base+'/dich-vu/',{redirect:'manual'});assert.equal(slash.status,308);assert.equal(slash.headers.get('location'),'/dich-vu');
  const page=await fetch(base+'/dich-vu');assert.equal(page.status,200);assert.ok((await page.text()).includes('href="/dich-vu/thiet-ke-thi-cong.html"'));assert.ok(page.headers.get('content-security-policy').includes("object-src 'self'"));
  const html=await fetch(base+'/dich-vu/thiet-ke-thi-cong.html',{redirect:'manual'});assert.equal(html.headers.get('location'),'/dich-vu/thiet-ke-thi-cong');
  const alias=await fetch(base+'/tin-tuc/article-template',{redirect:'manual'});assert.equal(alias.headers.get('location'),'/tin-tuc/dao-tao-an-toan-thi-cong');
  const robots=await fetch(base+'/robots.txt');assert.equal(robots.status,200);assert.ok((await robots.text()).includes('https://dstcc.com.vn/sitemap.xml'));
  assert.equal((await fetch(base+'/Robots.txt')).status,404);assert.equal((await fetch(base+'/src/pages/index.html')).status,404);assert.equal((await fetch(base+'/khong-co-trang-nay')).status,404);
  for (const url of [site.declaration.url, '/dich-vu/cong_bo/Don_Cong_bo_Chuan_CHinh_Thuc.pdf']) {
    const pdf=await fetch(base+url,{headers:{Range:'bytes=0-15'}});assert.equal(pdf.status,206);assert.equal((await pdf.arrayBuffer()).byteLength,16);assert.equal(pdf.headers.get('content-type'),'application/pdf');
  }
});

test('static page links preserve query strings, fragments and canonical metadata',()=>{
  const files=new Map([['/dich-vu/thi-nghiem-las-xd','/dich-vu/thi-nghiem-las-xd.html']]);
  const input='<link rel="canonical" href="https://dstcc.com.vn/dich-vu/thi-nghiem-las-xd"><a href="/dich-vu/thi-nghiem-las-xd?q=be%20tong&amp;type=1#lab-categories">Tra cứu</a><a href="/dich-vu">Lĩnh vực</a><a href="https://example.com/dich-vu/thi-nghiem-las-xd">Ngoài</a>';
  assert.equal(staticPageLinks(input,files),input.replace('href="/dich-vu/thi-nghiem-las-xd?','href="/dich-vu/thi-nghiem-las-xd.html?'));
});

test('workspace-root preview opens the declaration linked by generated HTML', async t => {
  const server = await createSiteServer(root, {cleanUrls:false});
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(async () => {
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  });
  const base = `http://127.0.0.1:${server.address().port}`;
  const page = await fetch(base + '/dich-vu/phong-thi-nghiem-las-xd.html');
  assert.equal(page.status, 200);
  assert.ok((await page.text()).includes(`href="${site.declaration.url}"`));
  const pdf = await fetch(base + site.declaration.url, {headers:{Range:'bytes=0-15'}});
  assert.equal(pdf.status, 206);
  assert.equal(pdf.headers.get('content-type'), 'application/pdf');
  const signature = await pdf.text();
  assert.ok(signature.startsWith('%PDF-'), 'the document link must return PDF bytes');
  assert.deepEqual(
    await fs.readFile(path.join(root, site.declaration.url.slice(1))),
    await fs.readFile(path.join(root, site.declaration.source))
  );
});

test('primary navigation works without rewrites and exposes the agreed pages',async t=>{
  const server=await createSiteServer(undefined,{cleanUrls:false});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  t.after(async()=>{server.closeAllConnections();await new Promise(resolve=>server.close(resolve));});
  const base=`http://127.0.0.1:${server.address().port}`;
  const home=await (await fetch(base+'/')).text();
  const menu=home.match(/<nav\b[^>]*id="mainNav"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
  assert.ok(menu,'primary navigation exists');
  const links=[...menu.matchAll(/href="([^"]+)"/g)].map(match=>match[1]);
  assert.deepEqual(links, ['/', '/dich-vu/thi-nghiem-las-xd.html', '/dich-vu/phong-thi-nghiem-las-xd.html', '/lien-he']);
  assert.ok(!menu.includes(' hidden'));
  assert.equal((await fetch(base+'/dich-vu/thiet-ke-thi-cong')).status,404,'fixture must not hide the original failure with rewrites');
  for(const href of links){
    const response=await fetch(base+href,{redirect:'manual'});
    assert.equal(response.status,200,href);
    const html=await response.text();
    assert.match(html,/<main\b/);assert.match(html,/<h1\b/);
  }
});

test('only the four public pages are indexed and the selected declaration is packaged', async () => {
  const sitemap = await fs.readFile(path.join(root, 'dist/sitemap.xml'), 'utf8');
  const routes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1].replace(site.url, '')).sort();
  assert.deepEqual(routes, ['/', '/dich-vu/phong-thi-nghiem-las-xd', '/dich-vu/thi-nghiem-las-xd', '/lien-he']);
  const legacy = await fs.readFile(path.join(root, 'dist/gioi-thieu/index.html'), 'utf8');
  assert.ok(legacy.includes('content="noindex, follow"'));
  const declaration = await fs.readFile(path.join(root, 'dist/dich-vu/phong-thi-nghiem-las-xd.html'), 'utf8');
  assert.ok(declaration.includes('01/CB-DSTCC'));
  assert.ok(declaration.includes('24/03/2026'));
  assert.ok(declaration.includes(site.labAddress));
  assert.ok(!declaration.includes('0400722377'));
  const source = await fs.readFile(path.join(root, site.declaration.source));
  for (const file of [site.declaration.url.slice(1), site.declaration.source, 'dich-vu/cong_bo/Don_Cong_bo_Chuan_CHinh_Thuc.pdf']) {
    assert.deepEqual(await fs.readFile(path.join(root, 'dist', file)), source);
  }
});

test('every published capability has a contact option and a working home anchor', async () => {
  const home = await fs.readFile(path.join(root, 'dist/index.html'), 'utf8');
  const lab = await fs.readFile(path.join(root, 'dist/dich-vu/thi-nghiem-las-xd.html'), 'utf8');
  const contact = await fs.readFile(path.join(root, 'dist/lien-he/index.html'), 'utf8');
  for (const group of labGroups) {
    assert.ok(home.includes(`/dich-vu/thi-nghiem-las-xd.html#${group.id}`), group.id);
    assert.ok(lab.includes(`id="${group.id}"`), group.id);
    assert.ok(lab.includes(`/lien-he?service=${group.id}`), group.id);
    assert.ok(contact.includes(`value="${group.id}"`), group.id);
  }
  for (const html of [home, lab, contact]) {
    assert.ok(!html.includes('footer-tax'));
    assert.ok(!html.includes('ISO 9001'));
    assert.ok(!html.includes('200+'));
  }
});
