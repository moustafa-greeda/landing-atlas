import { initLanguage } from './language.js';
import { initNavigation } from './navigation.js';
import { initAnimations } from './animations.js';
import { initIntegrations } from './integrations.js';
import { loadPartials } from './partials.js';

async function init() {
  document.documentElement.classList.add('js');
  await loadPartials();

  const getMessages = initLanguage();
  initNavigation();
  initAnimations();
  initIntegrations(getMessages);
}

init();