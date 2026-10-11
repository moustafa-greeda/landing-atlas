export async function loadPartials() {
  const nodes = [...document.querySelectorAll('[data-include]')];
  await Promise.all(nodes.map(async node => {
    const url = node.getAttribute('data-include');
    const response = await fetch(url);
    node.outerHTML = await response.text();
  }));
}
