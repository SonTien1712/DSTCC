import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {exactFile} from './serve.mjs';
import {routeFor} from './lib.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const output=path.join(root,'dist');const site=JSON.parse(await fs.readFile(path.join(root,'data/site.json'),'utf8'));
async function walk(dir){return(await Promise.all((await fs.readdir(dir,{withFileTypes:true})).map(item=>item.isDirectory()?walk(path.join(dir,item.name)):path.join(dir,item.name)))).flat();}
const files=await walk(output);const pages=files.filter(file=>file.endsWith('.html'));const errors=[];
const attrs=tag=>Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(m=>[m[1],m[2]]));
const pageIds=new Map();
for(const file of pages){const text=await fs.readFile(file,'utf8');const ids=[...text.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);pageIds.set(file,new Set(ids));if(ids.length!==new Set(ids).size)errors.push(`${path.relative(output,file)}: duplicate id`);}
let refs=0;
async function check(value,base,label){
  if(!value||value.startsWith('data:')||value.startsWith('mailto:')||value.startsWith('tel:'))return;
  const url=new URL(value.replace(/&amp;/g,'&'),base);
  if(url.origin!==site.url)return;
  const relative=decodeURIComponent(url.pathname).slice(1);let target=await exactFile(output,relative||'index.html');
  if(!target&&!path.extname(relative))target=await exactFile(output,relative+'.html')||await exactFile(output,path.join(relative,'index.html'));
  refs++;
  if(!target){errors.push(`${label}: missing ${url.pathname}`);return;}
  if(url.hash&&target.endsWith('.html')&&!pageIds.get(target)?.has(decodeURIComponent(url.hash.slice(1))))errors.push(`${label}: missing anchor ${url.hash}`);
}
for(const file of pages){
  const relative=path.relative(output,file).replaceAll(path.sep,'/');const text=await fs.readFile(file,'utf8');const base=site.url+routeFor(relative);
  if((text.match(/<h1\b/g)||[]).length!==1)errors.push(`${relative}: expected one h1`);
  if((text.match(/<main\b/g)||[]).length!==1)errors.push(`${relative}: expected one main`);
  if(/placehold\.co|YOUR_WEB3FORMS|0401770xxx|dstcc\.vn/.test(text))errors.push(`${relative}: stale placeholder/domain`);
  const canonical=text.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if(!canonical?.startsWith(site.url+'/'))errors.push(`${relative}: canonical domain`);
  const stack=[];const voids=new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
  for(const match of text.matchAll(/<(\/?)([a-zA-Z][\w:-]*)\b[^>]*>/g)){
    const [tag,closing,rawName]=match;const name=rawName.toLowerCase();const a=attrs(tag);
    if(closing){if(stack.at(-1)!==name)errors.push(`${relative}: closing ${name}, expected ${stack.at(-1)}`);else stack.pop();continue;}
    if(!voids.has(name)&&!tag.endsWith('/>'))stack.push(name);
    for(const key of ['href','src','data'])if(a[key])await check(a[key],base,relative);
    if(a.srcset)for(const entry of a.srcset.split(','))await check(entry.trim().split(/\s+/)[0],base,relative);
    if(a.style)for(const url of a.style.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g))await check(url[1],base,relative);
    if(name==='img'&&(!a.width||!a.height||!('alt'in a)))errors.push(`${relative}: image dimensions/alt`);
    if(name==='meta'&&['og:image','twitter:image'].includes(a.property||a.name))await check(a.content,base,relative);
    if(a['aria-controls']&&!pageIds.get(file).has(a['aria-controls']))errors.push(`${relative}: aria-controls target`);
    if(name==='input'||name==='textarea'||name==='select'){
      if(['hidden','submit'].includes(a.type))continue;
      if(!a['aria-label']&&!text.includes(`for="${a.id}"`))errors.push(`${relative}: field label ${a.name||a.id}`);
    }
    if(name==='script'&&!a.src&&a.type!=='application/ld+json')errors.push(`${relative}: executable inline script`);
  }
  if(stack.length)errors.push(`${relative}: unclosed ${stack.join(', ')}`);
  for(const match of text.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g))try{JSON.parse(match[1]);}catch{errors.push(`${relative}: invalid JSON-LD`);}
}
for(const file of files.filter(file=>file.endsWith('.css'))){
  const base=site.url+'/'+path.relative(output,file).replaceAll(path.sep,'/');const text=await fs.readFile(file,'utf8');
  for(const match of text.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g))await check(match[1],base,path.relative(output,file));
}
for(const file of files.filter(file=>file.endsWith('.js'))){const result=spawnSync(process.execPath,['--check',file],{encoding:'utf8'});if(result.error||result.status!==0)errors.push(`${path.relative(output,file)}: ${result.error?.message||result.stderr}`);}
const robots=await fs.readFile(path.join(output,'robots.txt'),'utf8');if(!robots.includes(`${site.url}/sitemap.xml`))errors.push('robots sitemap');
const sitemap=await fs.readFile(path.join(output,'sitemap.xml'),'utf8');for(const match of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g))await check(match[1],site.url,'sitemap');
if(errors.length){console.error([...new Set(errors)].join('\n'));process.exitCode=1;}else console.log(`PASS: ${pages.length} pages, ${refs} local references, labels, HTML structure, metadata, JSON-LD and JavaScript syntax.`);
