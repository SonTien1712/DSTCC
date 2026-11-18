import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {escapeHtml as e, render, routeFor, staticPageLinks} from './lib.mjs';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => fs.readFile(path.join(root, file), 'utf8');
const site = JSON.parse(await read('data/site.json'));
const labGroups = JSON.parse(await read('data/lab-groups.json'));
const pages = JSON.parse(await read('data/pages.json'));
const projects = JSON.parse(await read('data/Projects.json'));
const news = JSON.parse(await read('data/new.json')).filter(item => item.published);
const header = await read('templates/header.html');
const footer = await read('templates/footer.html');
const imageManifest = JSON.parse(await read('data/images.json'));
const declaration = site.declaration;
const declarationSize = (await fs.stat(path.join(root, declaration.source))).size;
const declarationDate = new Intl.DateTimeFormat('vi-VN', {day:'2-digit',month:'2-digit',year:'numeric',timeZone:'UTC'}).format(new Date(declaration.date));
const groupIds = labGroups.map(group => group.id);
if (new Set(groupIds).size !== groupIds.length || groupIds.some(id => !/^[a-z0-9-]+$/.test(id))) {
  throw new Error('Lab group IDs must be unique URL-safe values');
}
const cssVersions = new Map();
async function cssHref(file) {
  if (!cssVersions.has(file)) cssVersions.set(file, createHash('sha256').update(await read(file)).digest('hex').slice(0, 10));
  return `/${file}?v=${cssVersions.get(file)}`;
}
const bootstrapCss = await cssHref('assets/vendor/bootstrap/bootstrap.min.css');
const iconsCss = await cssHref('assets/vendor/bootstrap-icons/bootstrap-icons.css');
const output = path.resolve(root, 'dist');
if (path.relative(root, output) !== 'dist') throw new Error('Invalid output directory');
if ((await fs.lstat(output).catch(()=>null))?.isSymbolicLink()) throw new Error('Output must not be a symbolic link');
await fs.rm(output, {recursive:true, force:true});
await fs.mkdir(output, {recursive:true});

const groupLabel = { 'thi-nghiem':'Thí nghiệm & Kiểm định', 'tu-van':'Tư vấn Giám sát', 'khao-sat':'Khảo sát & Thiết kế' };
const projectRoute = p => `/du-an/${p.slug}`;
function projectCards(items, heading='h2') {
  return items.map(p => `<div class="col-md-6 col-lg-4 project-item" data-category="${e(p.group)}"><article class="portfolio-card h-100"><div class="project-visual" aria-hidden="true"><i class="bi bi-building"></i></div><div class="p-4"><span class="badge text-bg-light mb-3">${e(p.category)}</span><${heading} class="h4"><a href="${projectRoute(p)}">${e(p.title)}</a></${heading}><p class="text-muted small">${e(p.location)} · ${e(p.year)}</p><a class="read-more" href="${projectRoute(p)}">Xem thông tin <span class="visually-hidden">${e(p.title)}</span><i class="bi bi-arrow-right" aria-hidden="true"></i></a></div></article></div>`).join('\n');
}
function newsCards(items) {
  return items.map(n => `<div class="col-md-6 col-lg-4 news-item" data-category="${e(n.category)}" data-search="${e(n.title+' '+n.excerpt)}"><article class="portfolio-card h-100"><div class="news-visual" aria-hidden="true"><i class="bi bi-newspaper"></i></div><div class="p-4"><p class="small text-muted"><time datetime="${e(n.date)}">${e(n.dateLabel)}</time> · ${e(n.category)}</p><h2 class="h4"><a href="${e(n.url)}">${e(n.title)}</a></h2><p>${e(n.excerpt)}</p><a class="read-more" href="${e(n.url)}">Đọc bài viết <span class="visually-hidden">${e(n.title)}</span></a></div></article></div>`).join('\n');
}
const common = Object.fromEntries(Object.entries(site).filter(([,value])=>typeof value==='string').map(([key,value])=>[key,e(value)]));
Object.assign(common, {facebook:e(site.social.facebook),youtube:e(site.social.youtube),year:String(new Date().getUTCFullYear())});
Object.assign(common, {
  declarationUrl: e(declaration.url),
  declarationNumber: e(declaration.number),
  declarationDate: e(declarationDate),
  declarationSize: e((declarationSize / 1000000).toLocaleString('vi-VN', {maximumFractionDigits:1}) + ' MB'),
  declarationAuthority: e(declaration.authority || 'Sở Xây dựng TP. Đà Nẵng'),
  declarationAuthorityUrl: e(declaration.authorityUrl || '')
});

function renderStandards(raw) {
  return String(raw).split(';').map(item => item.trim()).filter(Boolean).map(code => `<span class="std-pill">${e(code)}</span>`).join('');
}

function renderGroupMedia(group) {
  const slotId = e(group.imageSlotId || `SLOT-${group.id}`);
  const slotHint = e(group.imageSlotHint || 'Điểm chờ bổ sung ảnh thiết bị / nhân sự');
  if (group.image) {
    return `<figure class="capability-media" data-image-slot="${slotId}" hidden><!-- ${slotHint} --><img src="${e(group.image)}" alt="${e(group.imageAlt || group.name)}"><figcaption><span>${e(group.imageAlt || group.name)}</span></figcaption></figure>`;
  }
  return `<div class="capability-media capability-media-slot" data-image-slot="${slotId}" hidden><!-- ${slotHint} --></div>`;
}

function labCards() {
  return labGroups.map((group, index) => {
    const code = e(group.code || String(index + 1).padStart(2, '0'));
    const icon = e(group.icon || 'bi-layers');
    return `<article class="capability-card test-card${group.featured ? ' is-featured' : ''}" id="${e(group.id)}" data-tags="${e(group.keywords)}">
    <div class="capability-card-top">
      <div class="capability-card-meta">
        <span class="capability-index">${code}</span>
        <span class="capability-icon" aria-hidden="true"><i class="bi ${icon}"></i></span>
        ${group.featured ? '<span class="capability-badge">Nhóm chủ lực</span>' : ''}
      </div>
      <span class="capability-count">${group.tests.length} phép thử tiêu biểu</span>
    </div>
    <div class="capability-card-header">
      <h2>${e(group.name)}</h2>
      <p>${e(group.description)}</p>
    </div>
    ${renderGroupMedia(group)}
    <ul class="capability-tests">${group.tests.map(test => `<li><span class="test-name">${e(test.name)}</span><span class="test-stds">${renderStandards(test.standard)}</span></li>`).join('')}</ul>
    <div class="equipment-box"><span class="equipment-label"><i class="bi bi-tools" aria-hidden="true"></i> Thiết bị theo hồ sơ</span><p>${e(group.equipment)}</p></div>
    <a class="capability-link" href="/lien-he?service=${encodeURIComponent(group.id)}"><span>Yêu cầu tư vấn nhóm này</span><span class="capability-link-arrow" aria-hidden="true">↗</span><span class="visually-hidden"> ${e(group.name)}</span></a>
  </article>`;
  }).join('\n');
}

const capabilityPreview = labGroups.map((group, index) => {
  const code = e(group.code || String(index + 1).padStart(2, '0'));
  const icon = e(group.icon || 'bi-layers');
  const sampleStds = [...new Set(group.tests.flatMap(t => t.standard.split(';').map(s => s.trim())))].slice(0, 3);
  return `<a class="capability-preview${group.featured ? ' is-featured' : ''}" href="/dich-vu/thi-nghiem-las-xd#${e(group.id)}">
  <div class="capability-preview-top">
    <span class="capability-index">${code}</span>
    <span class="capability-icon" aria-hidden="true"><i class="bi ${icon}"></i></span>
    ${group.featured ? '<span class="capability-badge">Chủ lực</span>' : `<span class="capability-count">${group.tests.length} chỉ tiêu</span>`}
  </div>
  <h3>${e(group.name)}</h3>
  <p>${e(group.description)}</p>
  <div class="capability-preview-stds">${sampleStds.map(s => `<span>${e(s)}</span>`).join('')}</div>
  <div class="capability-preview-foot"><span>Xem phép thử &amp; thiết bị</span><span aria-hidden="true">↗</span></div>
</a>`;
}).join('\n');

const capabilityQuickNav = labGroups.map((group, index) => {
  const code = e(group.code || String(index + 1).padStart(2, '0'));
  return `<a class="quick-group-pill" href="#${e(group.id)}"><span>${code}</span>${e(group.name)}</a>`;
}).join('\n');

// Content remains in HTML fragments; shared layout and metadata are generated here.
const allPages = [...pages];
for (const p of projects) allPages.push({file:`du-an/${p.slug}.html`,title:`${p.title} | DSTCC`,description:`${p.title} tại ${p.location}, năm ${p.year}. Lĩnh vực: ${p.category}. Thông tin dự án trong danh mục DSTCC.`,nav:'Projects',project:p,noindex:true});
// Flat pages must be reachable on static hosts without extensionless URL rewrites.
const pageFiles = new Map(allPages.filter(page => page.file !== 'index.html' && !page.file.endsWith('/index.html')).map(page => [routeFor(page.file), `/${page.file}`]));

function images(html) {
  return html.replace(/<img\b[^>]*>/g, tag => {
    const src = tag.match(/\bsrc="([^"]+)"/)?.[1];
    const info = imageManifest[src];
    if (!info) throw new Error(`Image is missing from manifest: ${src}`);
    tag = tag.replace(/\s(?:width|height|loading|decoding|srcset|sizes|fetchpriority)="[^"]*"/g,'');
    const hero = tag.includes('hero-bg-img');
    const logo = src.includes('anhdaidien_png');
    const attrs = ` width="${info.width}" height="${info.height}" decoding="async" loading="${hero||logo?'eager':'lazy'}"${hero?' fetchpriority="high"':''}`;
    const responsive = info.variants && !logo ? ` srcset="${info.variants.map(v=>`${v.src} ${v.width}w`).join(', ')}" sizes="${hero?'100vw':'(max-width: 767px) 100vw, 640px'}"` : '';
    return tag.replace(/\s*\/?>$/, attrs+responsive+'>');
  });
}

function projectDetail(p) {
  return `<header class="inner-hero"><div class="container"><p class="mb-3"><a class="text-white" href="/du-an">← Danh mục dự án</a></p><h1>${e(p.title)}</h1></div></header><section class="section-pad"><div class="container"><div class="row g-4 g-lg-5"><div class="col-lg-8"><h2 class="section-title">Thông tin dự án</h2><dl class="project-facts mt-4"><div><dt>Địa điểm</dt><dd>${e(p.location)}</dd></div><div><dt>Năm</dt><dd>${e(p.year)}</dd></div><div><dt>Lĩnh vực</dt><dd>${e(p.category)}</dd></div></dl><p class="text-muted">Hình ảnh và hồ sơ chi tiết của công trình đang được cập nhật. Vui lòng liên hệ DSTCC để trao đổi thêm về phạm vi công việc.</p></div><aside class="col-lg-4"><div class="contact-panel"><h2 class="h3">Trao đổi về dự án</h2><p>Gửi yêu cầu để được tư vấn về thí nghiệm, kiểm định và xây dựng.</p><a class="btn-hero-primary" href="/lien-he?project=${encodeURIComponent(p.title)}">Liên hệ tư vấn</a></div></aside></div></div></section>`;
}

for (const page of allPages) {
  const route = routeFor(page.file);
  const canonical = site.url + (page.canonical || route);
  const nav = {};
  for (const name of ['Home','About','Services','Documents','Projects','News','Contact']) {
    nav[`active${name}`] = page.nav===name?' active':'';
    const navPaths={Home:'/',About:'/gioi-thieu',Services:'/dich-vu/thi-nghiem-las-xd',Documents:'/dich-vu/phong-thi-nghiem-las-xd',Projects:'/du-an',News:'/tin-tuc',Contact:'/lien-he'};
    nav[`current${name}`] = page.nav===name?` aria-current="${route===navPaths[name]?'page':'location'}"`:'';
  }
  let content = page.project ? projectDetail(page.project) : await read(`src/pages/${page.file}`);
  const placeholders = {
    labCards: labCards(),
    labGroupCount: String(labGroups.length),
    capabilityPreview,
    capabilityQuickNav,
    labGroupOptions: labGroups.map(group => `<option value="${e(group.id)}">${e(group.name)}</option>`).join('\n'),
    ...common,contactAction:site.web3formsAccessKey?'https://api.web3forms.com/submit':`mailto:${e(site.email)}`,
    contactEnctype:site.web3formsAccessKey?'multipart/form-data':'text/plain',
    contactButton:site.web3formsAccessKey?'Gửi yêu cầu tư vấn':'Soạn email yêu cầu',
    contactIntro:site.web3formsAccessKey?'Điền thông tin để gửi yêu cầu tới DSTCC.':'Điền thông tin bên dưới. Website sẽ soạn email để bạn kiểm tra, đính kèm hồ sơ và tự gửi bằng ứng dụng email.',
    projectFilters:Object.entries(groupLabel).map(([id,label])=>`<button type="button" class="filter-btn" data-filter="${id}" aria-pressed="false">${e(label)}</button>`).join('\n'),
    projectCards:projectCards(projects),projectPreview:projectCards(projects.slice(0,3),'h3'),newsCards:newsCards(news),
    newsCategories:[...new Set(news.map(n=>n.category))].map(c=>`<option value="${e(c)}">${e(c)}</option>`).join(''),
    projectCount:String(projects.length),newsCount:String(news.length)
  };
  content=images(render(content,placeholders));
  const styles=['tokens','layout','components','sections','mobile',...(page.styles||[]),'site'];
  const styleLinks = await Promise.all(styles.map(async name=>`<link rel="stylesheet" href="${await cssHref(`assets/css/${name}.css`)}">`));
  const description=e(page.description);
  const business={ '@context':'https://schema.org','@type':'ProfessionalService',name:site.name,url:site.url,logo:`${site.url}/image/anhdaidien_png.png`,telephone:site.phone,email:site.email,address:{'@type':'PostalAddress',streetAddress:site.address,addressLocality:'Đà Nẵng',addressCountry:'VN'},sameAs:Object.values(site.social)};
  const extraSchema=page.article ? `<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':'NewsArticle',headline:page.title.replace(' | DSTCC',''),description:page.description,datePublished:page.article.date,author:{'@type':'Organization',name:'DSTCC'},publisher:{'@type':'Organization',name:site.name},mainEntityOfPage:canonical}).replace(/</g,'\\u003c')}</script>` : '';
  const html=staticPageLinks(`<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${e(page.title)}</title><meta name="description" content="${description}">
<meta name="robots" content="${page.noindex?'noindex, follow':'index, follow'}"><link rel="canonical" href="${e(canonical)}">
<meta name="theme-color" content="#003f7f"><link rel="icon" href="/image/favicon.png" type="image/png">
<meta property="og:type" content="${page.article?'article':'website'}"><meta property="og:site_name" content="DSTCC"><meta property="og:locale" content="vi_VN">
<meta property="og:url" content="${e(canonical)}"><meta property="og:title" content="${e(page.title)}"><meta property="og:description" content="${description}">
<meta property="og:image" content="${site.url}/assets/image/og-thumbnail.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="509"><meta property="og:image:alt" content="DSTCC — Thí nghiệm và tư vấn xây dựng Đà Nẵng">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${e(page.title)}"><meta name="twitter:description" content="${description}"><meta name="twitter:image" content="${site.url}/assets/image/og-thumbnail.jpg">
<link rel="stylesheet" href="${bootstrapCss}"><link rel="stylesheet" href="${iconsCss}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800&amp;family=Inter:wght@300;400;500;600&amp;display=swap">
${styleLinks.join('\n')}
<script type="application/ld+json">${JSON.stringify(business).replace(/</g,'\\u003c')}</script>${extraSchema}
<script src="/js/main.js" type="module"></script>${(page.scripts||[]).map(name=>`<script src="/js/${name}.js" type="module"></script>`).join('')}
</head>
<body data-analytics-id="${e(site.analyticsId)}">
${render(header,{...common,...nav})}
<main id="main-content" tabindex="-1">${content}</main>
${render(footer,{...common,...nav})}
</body>
</html>\n`, pageFiles).replace(/\r\n?/g, '\n').replace(/[ \t]+$/gm, '');
  await fs.mkdir(path.dirname(path.join(root,page.file)),{recursive:true});
  await fs.writeFile(path.join(root,page.file),html);
  await fs.mkdir(path.dirname(path.join(output,page.file)),{recursive:true});
  await fs.writeFile(path.join(output,page.file),html);
}

for (const directory of ['assets','image','js']) await fs.cp(path.join(root,directory),path.join(output,directory),{recursive:true});
for (const name of ['anh_truc_dien_cong_ty.webp','anh_may_han_lun_vet_banh_xe.jpg']) await fs.copyFile(path.join(root,name),path.join(output,name));
for (const info of Object.values(imageManifest)) for (const variant of info.variants || []) {
  if (!variant.src.slice(1).includes('/')) await fs.copyFile(path.join(root,variant.src.slice(1)),path.join(output,variant.src.slice(1)));
}
// Keep previously shared PDF URLs available with the selected declaration.
const publicPdf = declaration.url.slice(1);
// Generated root HTML is also previewed through Live Server from the workspace.
if (publicPdf !== declaration.source) {
  await fs.mkdir(path.dirname(path.join(root, publicPdf)), {recursive:true});
  await fs.copyFile(path.join(root, declaration.source), path.join(root, publicPdf));
}
const pdfPaths = [publicPdf, declaration.source, 'dich-vu/cong_bo/Don_Cong_bo_Chuan_CHinh_Thuc.pdf'];
for (const pdf of new Set(pdfPaths)) {
  await fs.mkdir(path.dirname(path.join(output, pdf)), {recursive:true});
  await fs.copyFile(path.join(root, declaration.source), path.join(output, pdf));
}
const sitemap=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${allPages.filter(p=>!p.noindex).map(p=>`  <url><loc>${e(site.url+routeFor(p.file))}</loc></url>`).join('\n')}\n</urlset>\n`;
const robots=`User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`;
for (const [name,value] of [['sitemap.xml',sitemap],['robots.txt',robots]]) {
  await fs.writeFile(path.join(root,name),value);await fs.writeFile(path.join(output,name),value);
}
console.log(`Built ${allPages.length} pages for ${site.url}; output: ${output}`);
