// nav.js — shared navigation + footer utilities (ES Module)

export function initNav() {
  // Hamburger toggle
  const hamburger = document.getElementById('hamburger');
  const primaryNav = document.getElementById('primaryNav');

  if (hamburger && primaryNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = primaryNav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Footer year + last modified
  const yearEl = document.getElementById('currentyear');
  const modEl  = document.getElementById('lastModified');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  if (modEl)  modEl.textContent  = document.lastModified;

  // Wayfinding — mark active nav link
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav#primaryNav a').forEach(link => {
    const linkPage = link.getAttribute('href').split('/').pop();
    if (linkPage === currentPath) link.classList.add('active');
  });
}
