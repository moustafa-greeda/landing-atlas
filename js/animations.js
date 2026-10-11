export function initAnimations() {
  const root = document.documentElement;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduceMotion && matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.svc,.tilt').forEach(el => {
      const maxTilt = el.classList.contains('feat') ? 6 : 9;
      el.addEventListener('pointermove', event => {
        const bounds = el.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - .5;
        const y = (event.clientY - bounds.top) / bounds.height - .5;
        el.style.transform = `perspective(1000px) rotateY(${x * maxTilt}deg) rotateX(${-y * maxTilt}deg)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  if ('IntersectionObserver' in window && !reduceMotion) {
    const reveal = el => {
      el.classList.remove('pend');
      el.classList.add('in');
      // Drop the animation once it's done so the leftover filter/translate can't
      // flatten 3D tilt or create stacking contexts later.
      const steps = el.classList.contains('rv-stagger') ? el.children.length : 1;
      const delay = parseFloat(el.style.getPropertyValue('--rv-d')) || 0;
      setTimeout(() => el.classList.remove('in'), delay + 1000 + steps * 120 + 100);
      el.querySelectorAll('[data-count]').forEach((n, i) => setTimeout(() => countUp(n), delay + i * 120));
    };
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        reveal(entry.target);
        observer.unobserve(entry.target);
      }
    }), { threshold: .15, rootMargin: '0px 0px -8% 0px' });

    document.querySelectorAll('.rv').forEach(el => {
      // Siblings that reveal together (cards in a row) cascade instead of popping at once.
      const siblings = [...el.parentElement.children].filter(c => c.classList.contains('rv'));
      el.style.setProperty('--rv-d', `${siblings.indexOf(el) * 120}ms`);
      if (el.classList.contains('rv-stagger')) {
        [...el.children].forEach((child, i) => child.style.setProperty('--i', i));
      }
      if (el.getBoundingClientRect().top > innerHeight) {
        el.classList.add('pend');
        observer.observe(el);
      }
    });
  }

  initBizCardClips(root);
}

const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';

// Counts the number inside e.g. "+ ١٦٢ الف" or "3.2M+" up from 0, keeping the
// surrounding text and the digit script (Arabic-Indic or Latin) as written.
function countUp(el) {
  const text = el.textContent;
  const arabic = /[٠-٩]/.test(text);
  const latin = text.replace(/[٠-٩]/g, d => AR_DIGITS.indexOf(d));
  const match = latin.match(/\d+(?:\.(\d+))?/);
  if (!match) return;
  const target = parseFloat(match[0]);
  const decimals = match[1] ? match[1].length : 0;
  const before = text.slice(0, match.index);
  const after = text.slice(match.index + match[0].length);
  const format = v => {
    const s = v.toFixed(decimals);
    return before + (arabic ? s.replace(/\d/g, d => AR_DIGITS[d]) : s) + after;
  };

  const duration = 1600;
  const start = performance.now();
  let written = format(0);
  el.textContent = written;
  const tick = now => {
    // Stop if something else (the language toggle) rewrote the number meanwhile.
    if (el.textContent !== written) return;
    const t = Math.min((now - start) / duration, 1);
    written = t < 1 ? format(target * (1 - Math.pow(1 - t, 3))) : text;
    el.textContent = written;
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// The #company-services clip (RTL, objectBoundingBox units), as commands so it can be
// rebuilt in px. url() clips can't animate, but path() clips with matching commands can.
const BIZ_CLIP = [
  ['M', 0, .126], ['C', 0, .057, .032, 0, .071, 0], ['H', .787],
  ['C', .826, 0, .858, .057, .858, .126], ['C', .858, .196, .89, .253, .929, .253], ['C', .968, .253, 1, .309, 1, .379],
  ['V', .874], ['C', 1, .943, .968, 1, .929, 1], ['H', .071], ['C', .032, 1, 0, .943, 0, .874], ['V', .126], ['Z']
];
// Same commands with the top-corner notch flattened into a regular rounded corner.
const BIZ_CLIP_FULL = BIZ_CLIP.map((cmd, i) => ({
  3: ['C', .826, 0, .858, 0, .858, 0],
  4: ['C', .858, 0, .89, 0, .929, 0],
  5: ['C', .968, 0, 1, .057, 1, .126]
})[i] || cmd);

function toPx(cmds, w, h, ltr) {
  const x = v => ((ltr ? 1 - v : v) * w).toFixed(2);
  const y = v => (v * h).toFixed(2);
  const d = cmds.map(([c, ...n]) => {
    if (c === 'H') return c + x(n[0]);
    if (c === 'V') return c + y(n[0]);
    return c + n.map((v, i) => (i % 2 ? y(v) : x(v))).join(' ');
  }).join(' ');
  return `path("${d}")`;
}

function initBizCardClips(root) {
  const cards = [...document.querySelectorAll('.bcard .media.clipped')];
  if (!cards.length || !CSS.supports('clip-path', 'path("M0 0")')) return;

  const update = el => {
    const width = el.offsetWidth;
    const height = el.offsetHeight;
    if (!width) return;
    const ltr = root.dir === 'ltr';
    el.style.setProperty('--clip-rest', toPx(BIZ_CLIP, width, height, ltr));
    el.style.setProperty('--clip-full', toPx(BIZ_CLIP_FULL, width, height, ltr));
    el.classList.add('js-clip');
  };

  const resize = new ResizeObserver(entries => entries.forEach(e => update(e.target)));
  cards.forEach(el => resize.observe(el));
  new MutationObserver(() => cards.forEach(update))
    .observe(root, { attributes: true, attributeFilter: ['dir'] });
}