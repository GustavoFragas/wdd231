const currentYearSpan = document.getElementById('currentyear');
const lastModifiedSpan = document.getElementById('lastModified');
if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();
if (lastModifiedSpan) lastModifiedSpan.textContent = document.lastModified;

const darkBtn = document.getElementById('darkmode');
darkBtn.addEventListener('click', () => {
    const html = document.documentElement;
    html.classList.toggle('dark-mode');
    const isDark = html.classList.contains('dark-mode');
    darkBtn.setAttribute('aria-pressed', String(isDark));
});

const hamburger = document.getElementById('hamburger');
const primaryNav = document.getElementById('primaryNav');
hamburger.addEventListener('click', () => {
    const isOpen = primaryNav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
});

const params = new URLSearchParams(window.location.search);

document.getElementById('r-first').textContent = params.get('first-name');
document.getElementById('r-last').textContent = params.get('last-name');
document.getElementById('r-email').textContent = params.get('email');
document.getElementById('r-phone').textContent = params.get('phone');
document.getElementById('r-organization').textContent = params.get('organization');
document.getElementById('r-timestamp').textContent = params.get('timestamp');
