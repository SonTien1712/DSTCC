// ============================================================
//   PAGE-SPECIFIC SCRIPTS — thi-nghiem-las-xd.html
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    // ---- 1. STICKY NAVBAR ----
    (function () {
        const nav = document.getElementById('mainNav');
        if (!nav) return;
        window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 60), { passive: true });
    })();

    // ---- 2. COUNTER ANIMATION ----
    (function () {
        const counters = document.querySelectorAll('[data-count]');
        const opts = { threshold: .3 };
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (!e.isIntersecting) return;
                const el = e.target;
                const target = +el.dataset.count;
                const suffix = el.textContent.includes('+') ? '+' : '';
                let start = 0;
                const step = Math.ceil(target / 40);
                const timer = setInterval(() => {
                    start += step;
                    if (start >= target) { start = target; clearInterval(timer); }
                    el.textContent = start + suffix;
                }, 40);
                io.unobserve(el);
            });
        }, opts);
        counters.forEach(c => io.observe(c));
    })();

    // ---- 3. SCROLL REVEAL ----
    (function () {
        const els = document.querySelectorAll('.reveal');
        const io = new IntersectionObserver((entries) => {
            entries.forEach((e, i) => {
                if (!e.isIntersecting) return;
                setTimeout(() => e.target.classList.add('visible'), i * 70);
                io.unobserve(e.target);
            });
        }, { threshold: .06 });
        els.forEach(el => io.observe(el));
    })();

    // ---- 4. SEARCH & FILTER WITH CLEAR BUTTON ----
    (function () {
        const searchInput = document.getElementById('labSearch');
        const clearBtn = document.getElementById('clearSearch');
        const resultCount = document.getElementById('resultCount');
        const searchHint = document.getElementById('searchHint');
        const noResults = document.getElementById('noResults');
        const cards = document.querySelectorAll('.test-card');
        const tagBtns = document.querySelectorAll('.search-tag');

        if (!searchInput) return;

        let activeTag = 'all';

        function normalize(str) {
            return str.toLowerCase()
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                .replace(/đ/g, 'd').replace(/Đ/g, 'D');
        }

        function filterCards() {
            const q = normalize(searchInput.value.trim());
            let visible = 0;

            if (clearBtn) {
                clearBtn.style.display = searchInput.value.trim() ? 'block' : 'none';
            }

            cards.forEach(card => {
                const tags = card.dataset.tags || '';
                const title = card.querySelector('.test-card-title')?.textContent || '';
                const items = Array.from(card.querySelectorAll('.test-item-name')).map(el => el.textContent).join(' ');
                const fullText = normalize(tags + ' ' + title + ' ' + items);

                const tagMatch = activeTag === 'all' || normalize(tags).includes(normalize(activeTag));
                const qMatch = !q || fullText.includes(q);

                if (tagMatch && qMatch) {
                    card.classList.remove('hidden');
                    visible++;
                } else {
                    card.classList.add('hidden');
                }
            });

            resultCount.textContent = visible;
            searchHint.innerHTML = q || activeTag !== 'all'
                ? `Tìm thấy <strong>${visible}</strong> nhóm phép thử`
                : `Hiển thị <strong>${visible}</strong> nhóm phép thử`;
            noResults.style.display = visible === 0 ? 'block' : 'none';
        }

        searchInput.addEventListener('input', filterCards);

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                searchInput.value = '';
                filterCards();
                searchInput.focus(); // keep focus on input
            });
        }

        tagBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                tagBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                activeTag = this.dataset.tag;
                searchInput.value = '';
                filterCards();
                // Smooth scroll to grid
                document.getElementById('lab-categories').scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });

        filterCards(); // init
    })();
});
