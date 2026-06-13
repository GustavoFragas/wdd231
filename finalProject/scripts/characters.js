// characters.js — Multi-Database page (ES Module)
import { initNav } from './nav.js';
import { getFavorites, toggleFavorite, isFavorite } from './storage.js';

initNav();

const API = 'https://rickandmortyapi.com/api/character';

// State
let currentPage  = 1;
let totalPages   = 1;
let currentChars = [];
let showFavsOnly = false;
let activeCharId = null;

// DOM refs
const grid        = document.getElementById('character-grid');
const prevBtn     = document.getElementById('prev-page');
const nextBtn     = document.getElementById('next-page');
const pageInfo    = document.getElementById('page-info');
const resultsInfo = document.getElementById('results-info');
const searchInput = document.getElementById('search-input');
const statusSel   = document.getElementById('filter-status');
const speciesSel  = document.getElementById('filter-species');
const genderSel   = document.getElementById('filter-gender');
const favToggle   = document.getElementById('fav-toggle');
const modal       = document.getElementById('char-modal');

// ── Fetch + Render ────────────────────────────────────────────────────────────
async function fetchCharacters(page = 1) {
  const params = new URLSearchParams({ page });
  const name    = searchInput.value.trim();
  const status  = statusSel.value;
  const species = speciesSel.value;
  const gender  = genderSel.value;

  if (name)    params.set('name', name);
  if (status)  params.set('status', status);
  if (species) params.set('species', species);
  if (gender)  params.set('gender', gender);

  grid.innerHTML = '<p class="loading-msg">Loading characters from the multiverse…</p>';

  try {
    const res = await fetch(`${API}?${params}`);
    if (res.status === 404) {
      grid.innerHTML = '<p class="empty-msg">No characters found in this dimension.</p>';
      resultsInfo.textContent = '0 results';
      prevBtn.disabled = true;
      nextBtn.disabled = true;
      pageInfo.textContent = 'Page 0';
      return;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    totalPages   = data.info.pages;
    currentChars = data.results;

    renderGrid(showFavsOnly
      ? currentChars.filter(c => isFavorite(c.id))
      : currentChars
    );

    const shown = showFavsOnly
      ? currentChars.filter(c => isFavorite(c.id)).length
      : currentChars.length;

    resultsInfo.textContent = `Showing ${shown} of ${data.info.count} characters`;
    pageInfo.textContent = `Page ${currentPage} / ${totalPages}`;
    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= totalPages;

  } catch (err) {
    grid.innerHTML = `<p class="empty-msg">Error loading data: ${err.message}</p>`;
    console.error('Fetch error:', err);
  }
}

// ── Render grid (uses forEach array method) ───────────────────────────────────
function renderGrid(chars) {
  if (!chars.length) {
    grid.innerHTML = '<p class="empty-msg">No characters match your filters.</p>';
    return;
  }

  grid.innerHTML = '';

  // Using forEach array method as required
  chars.forEach(char => {
    const status = char.status.toLowerCase();
    const saved  = isFavorite(char.id);

    const article = document.createElement('article');
    article.classList.add('char-card');
    article.setAttribute('role', 'listitem');
    article.setAttribute('tabindex', '0');
    article.setAttribute('aria-label', `${char.name}, ${char.status} ${char.species}`);

    // Template literals for all HTML construction
    article.innerHTML = `
      <img src="${char.image}" alt="${char.name}" width="300" height="300" loading="lazy">
      <div class="char-card-body">
        <h3>${char.name}</h3>
        <div class="char-meta">
          <span class="badge badge-${status}">${char.status}</span>
          <span>${char.species}</span>
        </div>
        <div class="char-meta">
          <span>📍 ${char.location.name}</span>
        </div>
        <div class="char-footer">
          <span style="font-size:0.75rem;color:var(--muted);">ID: ${char.id}</span>
          <button
            type="button"
            class="fav-btn ${saved ? 'saved' : ''}"
            aria-label="${saved ? 'Remove from favorites' : 'Add to favorites'}"
            data-id="${char.id}"
          >${saved ? '⭐' : '☆'}</button>
        </div>
      </div>
    `;

    // Click to open modal
    article.addEventListener('click', (e) => {
      if (e.target.closest('.fav-btn')) return;
      openModal(char);
    });
    article.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(char);
      }
    });

    // Favorite button
    article.querySelector('.fav-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      const added = toggleFavorite(char.id);
      const btn = e.currentTarget;
      btn.classList.toggle('saved', added);
      btn.textContent = added ? '⭐' : '☆';
      btn.setAttribute('aria-label', added ? 'Remove from favorites' : 'Add to favorites');
    });

    grid.appendChild(article);
  });
}

// ── Modal ─────────────────────────────────────────────────────────────────────
function openModal(char) {
  activeCharId = char.id;
  const status = char.status.toLowerCase();
  const saved  = isFavorite(char.id);

  document.getElementById('modal-img').src           = char.image;
  document.getElementById('modal-img').alt           = char.name;
  document.getElementById('modal-char-name').textContent = char.name;
  document.getElementById('modal-status').innerHTML  = `<span class="badge badge-${status}">${char.status}</span>`;
  document.getElementById('modal-species').textContent   = char.species;
  document.getElementById('modal-gender').textContent    = char.gender;
  document.getElementById('modal-type').textContent      = char.type || '—';
  document.getElementById('modal-origin').textContent    = char.origin.name;
  document.getElementById('modal-location').textContent  = char.location.name;
  document.getElementById('modal-episodes').textContent  = `${char.episode.length} episodes`;
  document.getElementById('modal-id').textContent        = `#${char.id}`;

  const favBtn = document.getElementById('modal-fav-btn');
  favBtn.textContent = saved ? '⭐ Remove from Favorites' : '⭐ Add to Favorites';
  favBtn.classList.toggle('btn-primary', saved);

  modal.showModal();
}

// Modal close
modal.querySelector('.modal-close').addEventListener('click', () => modal.close());
modal.addEventListener('click', (e) => { if (e.target === modal) modal.close(); });
modal.addEventListener('keydown', (e) => { if (e.key === 'Escape') modal.close(); });

// Modal favorite button
document.getElementById('modal-fav-btn').addEventListener('click', () => {
  if (activeCharId === null) return;
  const added = toggleFavorite(activeCharId);
  const favBtn = document.getElementById('modal-fav-btn');
  favBtn.textContent = added ? '⭐ Remove from Favorites' : '⭐ Add to Favorites';
  favBtn.classList.toggle('btn-primary', added);
  // Refresh star on grid card
  const gridBtn = grid.querySelector(`.fav-btn[data-id="${activeCharId}"]`);
  if (gridBtn) {
    gridBtn.classList.toggle('saved', added);
    gridBtn.textContent = added ? '⭐' : '☆';
  }
});

// ── Filters + Pagination ──────────────────────────────────────────────────────
function resetAndFetch() {
  currentPage = 1;
  fetchCharacters(currentPage);
}

// Debounce search
let searchTimer;
searchInput.addEventListener('input', () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(resetAndFetch, 400);
});

statusSel.addEventListener('change', resetAndFetch);
speciesSel.addEventListener('change', resetAndFetch);
genderSel.addEventListener('change', resetAndFetch);

prevBtn.addEventListener('click', () => {
  if (currentPage > 1) { currentPage--; fetchCharacters(currentPage); }
});

nextBtn.addEventListener('click', () => {
  if (currentPage < totalPages) { currentPage++; fetchCharacters(currentPage); }
});

// Favorites toggle — uses filter array method
favToggle.addEventListener('click', () => {
  showFavsOnly = !showFavsOnly;
  favToggle.classList.toggle('active', showFavsOnly);
  favToggle.textContent = showFavsOnly ? '⭐ All Characters' : '⭐ Favorites';

  if (showFavsOnly) {
    const favIds = getFavorites();
    if (!favIds.length) {
      grid.innerHTML = '<p class="empty-msg">No favorites saved yet. Click ☆ on any character.</p>';
      resultsInfo.textContent = '0 favorites';
      return;
    }
    // Fetch saved characters by IDs
    fetchFavorites(favIds);
  } else {
    fetchCharacters(currentPage);
  }
});

async function fetchFavorites(ids) {
  grid.innerHTML = '<p class="loading-msg">Loading your favorites…</p>';
  try {
    const res = await fetch(`${API}/${ids.join(',')}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    // data can be array or single object
    const chars = Array.isArray(data) ? data : [data];
    // filter array method usage
    const favChars = chars.filter(c => isFavorite(c.id));
    renderGrid(favChars);
    resultsInfo.textContent = `${favChars.length} favorited character${favChars.length !== 1 ? 's' : ''}`;
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    pageInfo.textContent = 'Favorites';
  } catch (err) {
    grid.innerHTML = `<p class="empty-msg">Error loading favorites: ${err.message}</p>`;
  }
}

// ── Init ──────────────────────────────────────────────────────────────────────
fetchCharacters(1);
