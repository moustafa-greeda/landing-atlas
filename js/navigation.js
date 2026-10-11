import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11.1.15/swiper-bundle.min.mjs';

export function initNavigation() {
  const burger = document.getElementById('burger');
  const menu = document.getElementById('menu');

  if (burger && menu) {
    burger.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      burger.setAttribute('aria-expanded', isOpen);
    });
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      menu.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    }));
  }

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const swipers = [];

  const swiperEl = document.querySelector('.ind-swiper');
  if (swiperEl) {
    // Mirrors the real Tamkeen site's service carousel: Swiper with
    // slidesPerView "auto" (card width comes from CSS) and no loop.
    const swiper = new Swiper(swiperEl, {
      slidesPerView: 'auto',
      spaceBetween: 20,
      longSwipes: true,
      speed: reduceMotion ? 0 : 300,
      breakpoints: { 0: { spaceBetween: 16 }, 768: { spaceBetween: 20 } }
    });

    swipers.push(swiper);

    document.getElementById('next')?.addEventListener('click', () => swiper.slideNext());
    document.getElementById('prev')?.addEventListener('click', () => swiper.slidePrev());

    const tabs = document.querySelectorAll('.filters .pbtn');
    tabs.forEach(button => button.addEventListener('click', () => {
      const wasSelected = button.getAttribute('aria-selected') === 'true';
      tabs.forEach(tab => {
        tab.setAttribute('aria-selected', 'false');
        tab.classList.remove('dark');
        tab.classList.add('outline');
      });

      const slides = [...swiperEl.querySelectorAll('.svc')];
      if (wasSelected) {
        slides.forEach(slide => slide.classList.remove('off'));
        return;
      }

      button.setAttribute('aria-selected', 'true');
      button.classList.add('dark');
      button.classList.remove('outline');
      const filter = button.dataset.filter;
      slides.forEach(slide => slide.classList.toggle('off', slide.dataset.type !== filter));

      const firstIndex = slides.findIndex(slide => slide.dataset.type === filter);
      if (firstIndex !== -1) swiper.slideTo(firstIndex);
    }));
  }

  const galleryEl = document.querySelector('.g-swiper');
  if (galleryEl) {
    // Mirrors the real site's "auto swiper": loop + zero-delay autoplay so
    // slides glide continuously rather than pausing between steps.
    swipers.push(new Swiper(galleryEl, {
      slidesPerView: 'auto',
      spaceBetween: 40,
      centeredSlides: true,
      loop: true,
      speed: reduceMotion ? 0 : 3000,
      autoplay: reduceMotion ? false : { delay: 0, disableOnInteraction: false },
      breakpoints: { 768: { slidesPerView: 3 } }
    }));
  }

  // Swiper only reads the text direction at init; the language toggle flips
  // <html dir> at runtime, so keep every slider in sync with it.
  new MutationObserver(() => {
    const dir = document.documentElement.dir === 'ltr' ? 'ltr' : 'rtl';
    swipers.forEach(s => s.changeLanguageDirection(dir));
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] });
}