import { spots } from '../data/spots.mjs';

// ── Footer dates ─────────────────────────────────────────────────────────────
const currentYearSpan = document.getElementById('currentyear');
const lastModifiedSpan = document.getElementById('lastModified');
if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();
if (lastModifiedSpan) lastModifiedSpan.textContent = document.lastModified;

// ── Dark mode ─────────────────────────────────────────────────────────────────
const darkBtn = document.getElementById('darkmode');
darkBtn.addEventListener('click', () => {
    const html = document.documentElement;
    html.classList.toggle('dark-mode');
    const isDark = html.classList.contains('dark-mode');
    darkBtn.setAttribute('aria-pressed', String(isDark));
});

// ── Hamburger nav ─────────────────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const primaryNav = document.getElementById('primaryNav');
hamburger.addEventListener('click', () => {
    const isOpen = primaryNav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
});

// ── localStorage visit message ─────────────────────────────────────────────────
function displayVisitMessage() {
    const msgEl = document.getElementById('visit-message');
    const lastVisit = localStorage.getItem('discoverLastVisit');
    const now = Date.now();

    let message = '';

    if (!lastVisit) {
        // First visit ever
        message = 'Welcome! Let us know if you have any questions.';
    } else {
        const msInDay = 1000 * 60 * 60 * 24;
        const daysSince = Math.floor((now - Number(lastVisit)) / msInDay);

        if (daysSince < 1) {
            message = 'Back so soon! Awesome!';
        } else if (daysSince === 1) {
            message = 'You last visited 1 day ago.';
        } else {
            message = `You last visited ${daysSince} days ago.`;
        }
    }

    // Save current visit timestamp
    localStorage.setItem('discoverLastVisit', String(now));

    if (msgEl) msgEl.textContent = message;
}

displayVisitMessage();

// ── Build discover cards from JSON ────────────────────────────────────────────
function buildCards(items) {
    const gallery = document.getElementById('discover-gallery');
    if (!gallery) return;

    gallery.innerHTML = '';

    items.forEach((spot, index) => {
        const article = document.createElement('article');
        article.classList.add('discover-card', `area-${index + 1}`);
        // Named grid area: area1 … area8
        article.style.gridArea = `area${index + 1}`;

        const h2 = document.createElement('h2');
        h2.textContent = spot.name;

        const figure = document.createElement('figure');
        const img = document.createElement('img');
        img.src = spot.image;
        img.alt = spot.alt;
        img.loading = 'lazy';
        img.width = 300;
        img.height = 200;
        img.onerror = () => {
            img.src = `https://placehold.co/300x200/00532b/white?text=${encodeURIComponent(spot.name)}`;
        };
        figure.appendChild(img);

        const address = document.createElement('address');
        address.textContent = spot.address;

        const p = document.createElement('p');
        p.textContent = spot.description;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = 'Learn More';
        btn.classList.add('learn-more-btn');
        btn.addEventListener('click', () => {
            alert(`More info about ${spot.name} coming soon!`);
        });

        article.appendChild(h2);
        article.appendChild(figure);
        article.appendChild(address);
        article.appendChild(p);
        article.appendChild(btn);

        gallery.appendChild(article);
    });
}

buildCards(spots);
