export function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}

export function render(template, values) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (!(key in values)) throw new Error(`Missing template value: ${key}`);
    return values[key];
  });
}

export function routeFor(file) {
  if (file === 'index.html') return '/';
  return `/${file.replace(/(?:\/index)?\.html$/, '')}`;
}

export function staticPageLinks(html, pageFiles) {
  return html.replace(/(<a\b[^>]*\shref=")(\/[^\"]*)(")/gi, (tag, prefix, href, quote) => {
    const [, pathname, suffix] = href.match(/^([^?#]+)(.*)$/);
    const file = pageFiles.get(pathname);
    return file ? `${prefix}${file}${suffix}${quote}` : tag;
  });
}

export function normalizeText(value) {
  return value.toLocaleLowerCase('vi').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
}
