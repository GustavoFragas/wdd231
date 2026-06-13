// home.js — Home page logic (ES Module)
import { initNav } from './nav.js';
import { getFavorites } from './storage.js';

initNav();

const API = 'https://rickandmortyapi.com/api';

// ── Spotlight ─────────────────────────────────────────────────────────────────
async function loadSpotlight() {
  const el = document.getElementById('spotlight');
  try {
    const randomId = Math.floor(Math.random() * 826) + 1;
    const res = await fetch(`${API}/character/${randomId}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const char = await res.json();
    renderSpotlight(el, char);
  } catch (err) {
    el.innerHTML = `<p class="text-muted">Could not load character. ${err.message}</p>`;
  }
}

function renderSpotlight(el, char) {
  const status = char.status.toLowerCase();
  el.innerHTML = `
    <img src="${char.image}" alt="${char.name}" width="120" height="120" loading="lazy">
    <div>
      <h3>${char.name}</h3>
      <p class="text-muted" style="font-size:0.85rem;">${char.species} · ${char.gender}</p>
      <span class="badge badge-${status}">${char.status}</span>
      <p style="font-size:0.78rem;color:var(--muted);margin-top:0.4rem;">
        Origin: ${char.origin.name}
      </p>
    </div>
  `;
}

document.getElementById('new-spotlight')
  ?.addEventListener('click', loadSpotlight);

loadSpotlight();

// ── Stats ─────────────────────────────────────────────────────────────────────
async function loadStats() {
  try {
    const [charRes, epRes, locRes] = await Promise.all([
      fetch(`${API}/character`),
      fetch(`${API}/episode`),
      fetch(`${API}/location`)
    ]);

    if (!charRes.ok || !epRes.ok || !locRes.ok) throw new Error('API error');

    const [chars, eps, locs] = await Promise.all([
      charRes.json(), epRes.json(), locRes.json()
    ]);

    document.getElementById('stat-chars').textContent     = chars.info.count.toLocaleString();
    document.getElementById('stat-episodes').textContent  = eps.info.count.toLocaleString();
    document.getElementById('stat-locations').textContent = locs.info.count.toLocaleString();
    document.getElementById('stat-favorites').textContent = getFavorites().length;

  } catch (err) {
    console.error('Stats error:', err);
  }
}

loadStats();

// ── Featured Characters (array methods + template literals) ───────────────────
async function loadFeatured() {
  const grid = document.getElementById('featured-grid');
  try {
    // IDs of iconic characters
    const ids = [1, 2, 3, 4, 5, 6, 19, 25, 45, 71];
    const res = await fetch(`${API}/character/${ids.join(',')}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const chars = await res.json();

    // Use .map() array method to build card HTML strings
    const cards = chars.map(char => {
      const status = char.status.toLowerCase();
      return `
        <article style="background:var(--surface);border:1px solid var(--border);border-radius:8px;overflow:hidden;text-align:center;">
          <img src="${char.image}" alt="${char.name}" width="200" height="200" loading="lazy" style="width:100%;height:140px;object-fit:cover;">
          <div style="padding:0.6rem;">
            <p style="font-family:'Orbitron',sans-serif;font-size:0.75rem;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${char.name}</p>
            <span class="badge badge-${status}" style="font-size:0.7rem;">${char.status}</span>
          </div>
        </article>
      `;
    });

    grid.innerHTML = cards.join('');

  } catch (err) {
    grid.innerHTML = `<p class="text-muted">Could not load featured characters.</p>`;
    console.error('Featured error:', err);
  }
}

loadFeatured();
