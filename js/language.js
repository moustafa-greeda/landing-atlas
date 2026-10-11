const EN = {
  brand: 'Kafaa', brandSub: 'Human Resources', brandFull: 'Kafaa HR',
  nAbout: 'About', nInd: 'Individuals', nBiz: 'Business services', nInv: 'Investors', nMedia: 'Media center', nContact: 'Contact us',
  book: 'Book a service', explore: 'Explore more', follow: 'Follow us',
  heroH: 'Kafaa, your best choice at every step',
  heroP: 'At Kafaa Human Resources we get you qualified staff and skilled workers that fit your needs, right away and with ease.',
  indH: 'Individual services', indP: 'We take daily household tasks off your hands and give you back your time, with qualified professionals who put your comfort first.',
  tLive: 'Live-in', tHour: 'Hourly', c1: 'Cleaning', c2: 'Cooks', c3: 'Domestic workers', c4: 'Drivers',
  bizH: 'Business services', bizP: 'Complete staffing solutions for the business and medical sectors, attracting the best qualified talent with modern, effective strategies.',
  b1: 'Business sector', b2: 'Medical sector',
  whyH: 'Why Kafaa is your best choice', whyP: 'We attract top talent from around the world and create a professional work experience for employees and employers. We focus on satisfaction, continuous development and client wellbeing, use the latest technology in every process, and manage all affairs of placed staff after hiring.',
  whyQ: 'We empower, so we can deliver an experience that meets all your needs.', moreAbout: 'More about Kafaa',
  s1: 'branches in the Kingdom', s2: 'homes served', s3: 'clients served', s4: 'hours', s5: 'workers placed',
  f1h: 'One easy-to-use app', f1p: 'We deliver our services in a unique way so you can request highly skilled home staff easily, instantly and safely. Download the app and enjoy every service with ease.', download: 'Download the app',
  f2h: 'Reliable, high-quality service', f2p: 'We are here to bring comfort to your life, whether you need a babysitter, a housekeeper or a cook, and to meet your needs efficiently.',
  f3h: '24 hours serving our clients everywhere', f3p: 'Because our goal is your comfort, Kafaa has a professional support team you can reach with any question.',
  ctaH1: 'Ready to start? Book your service', ctaH2: 'on our website', ctaP: 'Book the live-in or hourly service that suits you in a few quick steps on our website.',
  dlH: 'Book and manage your services instantly in the Kafaa app', dlP: 'For an easier life, book the service that suits you quickly and simply in a few short steps.',
  nlH: 'Stay in the loop', nlP: 'Subscribe now to get our latest news, services and offers.', email: 'Email', subscribe: 'Subscribe',
  nlOk: 'Subscribed. Watch your inbox for our next update.', nlErr: 'Enter a valid email address, like name@example.com.',
  ft1: 'Our services', ft1a: 'Live-in services', ft1b: 'Hourly services', ft3c: 'Careers', ft4a: 'Corporate governance', ft4b: 'IPO',
  ft5: 'Support center', ft5b: 'FAQ', ft6: 'More', ft6a: 'Privacy policy', ft6b: 'Terms & conditions', copy: '© 2026 Kafaa Human Resources'
};

const AR = { nlOk: 'تم الاشتراك. ترقّب جديدنا في بريدك.', nlErr: 'أدخل بريدًا إلكترونيًا صحيحًا، مثل name@example.com.' };

export function initLanguage() {
  const root = document.documentElement;
  root.lang = 'ar';
  root.dir = 'rtl';
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (!(key in AR)) AR[key] = el.textContent;
  });

  let lang = 'ar';
  try {
    if (localStorage.getItem('kafaa-lang') === 'en') lang = 'en';
  } catch (error) {}

  const getMessages = () => (lang === 'en' ? EN : AR);

  function applyLanguage() {
    const messages = getMessages();
    root.lang = lang;
    root.dir = lang === 'en' ? 'ltr' : 'rtl';
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const value = messages[el.dataset.i18n];
      if (value != null) el.textContent = value;
    });
    document.querySelectorAll('[data-ar]').forEach(el => {
      el.textContent = el.dataset[lang];
    });
    const label = document.getElementById('langLbl');
    if (label) label.textContent = lang === 'en' ? 'عربي' : 'EN';
  }

  document.getElementById('langBtn')?.addEventListener('click', () => {
    lang = lang === 'en' ? 'ar' : 'en';
    try {
      localStorage.setItem('kafaa-lang', lang);
    } catch (error) {}
    applyLanguage();
  });

  applyLanguage();
  return getMessages;
}