import {normalizeText} from './main.js';

const search = document.getElementById('labSearch');
const cards = [...document.querySelectorAll('.test-card')];

if (search && cards.length) {
  const searchSection = document.querySelector('.capability-search-section');
  const updateSearchOffset = () => {
    const height = getComputedStyle(searchSection).position === 'sticky' ? searchSection.offsetHeight : 0;
    document.documentElement.style.setProperty('--capability-search-height', `${height}px`);
  };
  if (searchSection) {
    if ('ResizeObserver' in window) new ResizeObserver(updateSearchOffset).observe(searchSection);
    window.addEventListener('resize', updateSearchOffset, {passive:true});
    updateSearchOffset();
  }
  const count = document.getElementById('resultCount');
  const empty = document.getElementById('noResults');
  const clear = document.getElementById('clearSearch');
  const entries = cards.map(card => ({
    card,
    text: normalizeText(`${card.textContent} ${card.dataset.tags || ''}`)
  }));

  const update = () => {
    const query = normalizeText(search.value.trim());
    const words = query.split(/\s+/).filter(Boolean);
    const compactQuery = query.replace(/[^a-z0-9]/g, '');
    let visible = 0;
    for (const {card, text} of entries) {
      const matches = words.every(word => text.includes(word)) || Boolean(compactQuery && text.replace(/[^a-z0-9]/g, '').includes(compactQuery));
      card.hidden = !matches;
      if (matches) visible++;
    }
    count.textContent = String(visible);
    empty.hidden = visible !== 0;
    clear.hidden = !search.value;
  };

  search.addEventListener('input', update);
  clear.addEventListener('click', () => {
    search.value = '';
    update();
    search.focus();
  });
  for (const link of document.querySelectorAll('.quick-group-pill')) {
    link.addEventListener('click', () => {
      const target = document.getElementById(link.hash.slice(1));
      if (target?.hidden) {
        search.value = '';
        update();
      }
    });
  }
  update();
}
