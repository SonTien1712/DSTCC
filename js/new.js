/* ============================================================
   news.js — DSTCC Website v3
   Renders news cards from news.json.
   To add a new article: edit assets/data/news.json only.
   ============================================================ */

(function () {
    const FALLBACK_NEWS = [
        { id: 1, title: "Đào tạo định kỳ siết chặt an toàn thi công", excerpt: "Đảm bảo an toàn tuyệt đối tại các dự án mũi nhọn, nâng cao ý thức toàn đội ngũ.", dateLabel: "09 Tháng 3, 2026", fallback: "https://placehold.co/400x220/003f7f/ffffff?text=An+toàn+thi+công", url: "#" },
        { id: 2, title: "Phương pháp thi công cáp chủ PPWS", excerpt: "Kỹ thuật tiên tiến áp dụng trong xây dựng cầu dây văng hiện đại.", dateLabel: "15 Tháng 10, 2025", fallback: "https://placehold.co/400x220/002554/ffffff?text=Cáp+PPWS", url: "#" },
        { id: 3, title: "Contech 2025 và dấu ấn DSTCC", excerpt: "Triển lãm thiết bị máy móc và công nghệ thi công lớn nhất miền Bắc.", dateLabel: "06 Tháng 5, 2025", fallback: "https://placehold.co/400x220/1a5276/ffffff?text=Contech+2025", url: "#" }
    ];

    const container = document.getElementById('news-grid');
    if (!container) return;

    function renderNews(items) {
        container.innerHTML = items.map(n => {
            const imgSrc = n.image || n.fallback;
            return `
            <div class="col-lg-4 reveal">
                <article class="classic-card" itemscope itemtype="https://schema.org/NewsArticle">
                    <img src="${imgSrc}" alt="${n.title}"
                         loading="lazy" width="400" height="220"
                         onerror="this.src='${n.fallback}'"
                         itemprop="image">
                    <div class="classic-card-body">
                        <div class="classic-card-date">
                            <i class="bi bi-calendar3" aria-hidden="true"></i>
                            <time datetime="${n.date || ''}" itemprop="datePublished">${n.dateLabel}</time>
                        </div>
                        <h3 class="classic-card-title" itemprop="headline">
                            <a href="${n.url}" style="color:inherit;">${n.title}</a>
                        </h3>
                        <p class="text-muted small mb-3" itemprop="description">${n.excerpt}</p>
                        <a href="${n.url}" class="read-more" aria-label="Đọc tiếp: ${n.title}">
                            Đọc tiếp <i class="bi bi-arrow-right" aria-hidden="true"></i>
                        </a>
                    </div>
                </article>
            </div>`;
        }).join('');

        // Re-observe new .reveal elements
        if (window.__revealObserver) {
            container.querySelectorAll('.reveal').forEach(el => window.__revealObserver.observe(el));
        }
    }

    fetch('assets/data/news.json')
        .then(r => { if (!r.ok) throw new Error(); return r.json(); })
        .then(data => renderNews(data))
        .catch(() => renderNews(FALLBACK_NEWS));
})();