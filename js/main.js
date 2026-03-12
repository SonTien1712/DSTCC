/* ============================================================
   main.js — DSTCC Website v3
   Handles: navbar scroll, dot navigation, scroll reveal, swiper
   ============================================================ */

// ---- 1. STICKY NAVBAR — adds .scrolled class ----
(function () {
    const navbar = document.getElementById('mainNav');
    if (!navbar) return;
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
})();


// ---- 2. DOT NAVIGATION — active state tracking ----
(function () {
    const SECTION_IDS = [
        'hero', 'gioi-thieu', 'linh-vuc',
        'phong-thi-nghiem', 'chuyen-gia',
        'du-an', 'tin-tuc', 'lien-he'
    ];
    const dots = document.querySelectorAll('#dot-nav a');
    if (!dots.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const id = entry.target.id;
            dots.forEach(d => d.classList.remove('active'));
            const activeDot = document.querySelector(`#dot-nav a[data-section="${id}"]`);
            if (activeDot) activeDot.classList.add('active');
        });
    }, { rootMargin: '-40% 0px -50% 0px' });

    SECTION_IDS.forEach(id => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
    });

    // Smooth scroll on dot click
    dots.forEach(dot => {
        dot.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(dot.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
})();


// ---- 3. SCROLL REVEAL — staggered entrance animation ----
(function () {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (!entry.isIntersecting) return;
            setTimeout(() => entry.target.classList.add('visible'), i * 85);
            io.unobserve(entry.target);
        });
    }, { threshold: 0.08 });

    els.forEach(el => io.observe(el));
})();


// ---- 4. SWIPER — Expert Advisors ----
(function () {
    if (typeof Swiper === 'undefined') return;
    new Swiper('.advisor-swiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        autoplay: { delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true },
        pagination: { el: '.swiper-pagination', clickable: true },
        breakpoints: {
            576: { slidesPerView: 2 },
            992: { slidesPerView: 3 },
            1200: { slidesPerView: 4 }
        }
    });
})();


// ---- 5. FACEBOOK MESSENGER PLUGIN ----
(function () {
    const chatbox = document.createElement('div');
    chatbox.id = 'fb-customer-chat';
    chatbox.className = 'fb-customerchat';
    chatbox.setAttribute('page_id', '106618588452865');
    chatbox.setAttribute('attribution', 'biz_inbox');
    document.body.appendChild(chatbox);

    window.fbAsyncInit = function () { FB.init({ xfbml: true, version: 'v12.0' }); };
    (function (d, s, id) {
        if (d.getElementById(id)) return;
        const js = d.createElement(s);
        js.id = id;
        js.src = 'https://connect.facebook.net/vi_VN/sdk/xfbml.customerchat.js';
        d.head.appendChild(js);
    }(document, 'script', 'facebook-jssdk'));
})();