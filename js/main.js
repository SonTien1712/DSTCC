export function normalizeText(value) {
  return String(value).toLocaleLowerCase('vi').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
}

function initNavigation() {
  const nav = document.getElementById('mainNav');
  const toggle = nav?.querySelector('.navbar-toggler');
  const menu = document.getElementById('navbarResponsive');
  if (!nav || !toggle || !menu) return;
  const setMenu = open => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
    menu.classList.toggle('show', open);
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      toggle.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!nav.contains(event.target) || event.target.closest('a')) setMenu(false);
  });
  window.addEventListener('resize', () => { if (window.innerWidth >= 992) setMenu(false); }, {passive:true});
  const setOffset = () => document.documentElement.style.setProperty('--nav-offset', nav.offsetHeight + 'px');
  if ('ResizeObserver' in window) new ResizeObserver(setOffset).observe(nav);
  const onScroll = () => { nav.classList.toggle('scrolled', window.scrollY > 60); setOffset(); };
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
}

function initMotion() {
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver'in window))return;
  const observer=new IntersectionObserver(entries=>{
    for(const entry of entries)if(entry.isIntersecting){entry.target.classList.remove('reveal-pending');entry.target.classList.add('visible');observer.unobserve(entry.target);}
  },{threshold:0.06});
  for(const element of document.querySelectorAll('.reveal')){
    if(element.getBoundingClientRect().top>window.innerHeight)element.classList.add('reveal-pending');observer.observe(element);
  }
}

function initAnalytics() {
  const id=document.body.dataset.analyticsId;
  if(!/^G-[A-Z0-9]+$/.test(id||'')||['localhost','127.0.0.1','[::1]'].includes(location.hostname))return;
  window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments);};
  window.gtag('js',new Date());window.gtag('config',id);
  const script=document.createElement('script');script.src=`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;script.async=true;document.head.append(script);
}

if(typeof document!=='undefined'){document.documentElement.classList.add('js');initNavigation();initMotion();initAnalytics();}
