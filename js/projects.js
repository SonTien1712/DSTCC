/* ============================================================
   projects.js — DSTCC Website v3
   Renders project cards from projects.json with filter support.
   To add a new project: edit assets/data/projects.json only.
   ============================================================ */

(function () {
    // --- Inline fallback data (used if fetch fails / opened as file://) ---
    const FALLBACK_PROJECTS = [
        { id: 1, title: "Đường cao tốc Đà Nẵng – Quảng Ngãi", category: "Thí nghiệm & Kiểm định", location: "Đà Nẵng – Quảng Ngãi", year: "2018", image: "https://placehold.co/600x400/003f7f/ffffff?text=Cao+tốc+ĐN–QN" },
        { id: 2, title: "Cầu Cà Đú 1 – Quảng Ngãi", category: "Tư vấn giám sát", location: "Quảng Ngãi", year: "2020", image: "https://placehold.co/600x400/002b5e/ffffff?text=Cầu+Cà+Đú+1" },
        { id: 3, title: "Cầu Năm Ống – Quảng Trị", category: "Kiểm định kết cấu", location: "Quảng Trị", year: "2021", image: "https://placehold.co/600x400/1a5276/ffffff?text=Cầu+Năm+Ống" },
        { id: 4, title: "Đường ven biển Cát Tiến – Diêm Vân", category: "Thí nghiệm & Kiểm định", location: "Bình Định", year: "2022", image: "https://placehold.co/600x400/154360/ffffff?text=Ven+biển" },
        { id: 5, title: "Cầu Biện – Đà Nẵng", category: "Tư vấn giám sát", location: "Đà Nẵng", year: "2023", image: "https://placehold.co/600x400/0e3456/ffffff?text=Cầu+Biện" },
        { id: 6, title: "Đường ven biển Liên Chiểu – Đà Nẵng", category: "Khảo sát địa chất", location: "Đà Nẵng", year: "2024", image: "https://placehold.co/600x400/f5a800/333333?text=Liên+Chiểu" }
    ];

    const grid = document.getElementById('projects-grid');
    const loader = document.getElementById('projects-loader');
    if (!grid) return;

    let allProjects = FALLBACK_PROJECTS;

    // --- Render function ---
    function renderProjects(filter) {
        const filtered = (filter === 'all')
            ? allProjects
            : allProjects.filter(p => p.category === filter);

        if (!filtered.length) {
            grid.innerHTML = `<div class="col-12 text-center py-5 text-muted">Không có dự án nào trong danh mục này.</div>`;
        } else {
            grid.innerHTML = filtered.map(p => `
                <div class="col-xl-4 col-lg-4 col-md-6">
                    <div class="project-card">
                        <img src="${p.image}"
                             alt="${p.title}"
                             loading="lazy"
                             width="600" height="400"
                             onerror="this.src='https://placehold.co/600x400/003f7f/ffffff?text=${encodeURIComponent(p.title)}'">
                        <div class="project-info">
                            <span class="project-cat">${p.category}</span>
                            <h4>${p.title}</h4>
                            <div class="project-meta">
                                <i class="bi bi-geo-alt-fill" aria-hidden="true"></i>${p.location}
                                <span aria-hidden="true" style="opacity:.5">·</span>
                                <i class="bi bi-calendar3" aria-hidden="true"></i>${p.year}
                            </div>
                        </div>
                    </div>
                </div>`).join('');
        }

        if (loader) loader.style.display = 'none';
        grid.style.display = 'flex';
        grid.style.flexWrap = 'wrap';
    }

    // --- Filter button interactions ---
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderProjects(this.dataset.filter);
        });
    });

    // --- Fetch from JSON, fallback to inline data ---
    fetch('assets/data/projects.json')
        .then(r => { if (!r.ok) throw new Error('fetch failed'); return r.json(); })
        .then(data => { allProjects = data; renderProjects('all'); })
        .catch(() => renderProjects('all'));

})();