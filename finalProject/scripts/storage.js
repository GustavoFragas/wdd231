// storage.js — localStorage utilities (ES Module)

const FAVORITES_KEY = 'citadel_favorites';

/** Return array of saved character IDs */
export function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
  } catch {
    return [];
  }
}

/** Toggle a character ID in favorites. Returns new saved state (bool). */
export function toggleFavorite(id) {
  const favs = getFavorites();
  const idx = favs.indexOf(id);
  if (idx === -1) {
    favs.push(id);
  } else {
    favs.splice(idx, 1);
  }
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
  return idx === -1; // true = just added
}

/** Check if an ID is favorited */
export function isFavorite(id) {
  return getFavorites().includes(id);
}

/** Save any key/value pair */
export function saveItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/** Get any key */
export function getItem(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}
