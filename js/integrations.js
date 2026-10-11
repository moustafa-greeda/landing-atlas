export function initIntegrations(getMessages) {
  initNewsletter(getMessages);
}

function initNewsletter(getMessages) {
  const form = document.getElementById('nlForm');
  if (!form) return;

  form.addEventListener('submit', event => {
    event.preventDefault();
    const email = document.getElementById('nlEmail').value.trim();
    const messages = getMessages();
    const message = document.getElementById('nlMsg');

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      message.textContent = messages.nlErr;
      return;
    }

    const config = window.GHASIQ || {};
    if (!config.ajax) {
      message.textContent = messages.nlOk;
      form.reset();
      return;
    }

    const formData = new FormData();
    formData.append('action', 'ghasiq_subscribe');
    formData.append('nonce', config.nonce);
    formData.append('email', email);
    fetch(config.ajax, { method: 'POST', body: formData, credentials: 'same-origin' })
      .then(response => response.json())
      .then(result => {
        message.textContent = result && result.success ? messages.nlOk : messages.nlErr;
        if (result && result.success) form.reset();
      })
      .catch(() => { message.textContent = messages.nlErr; });
  });
}