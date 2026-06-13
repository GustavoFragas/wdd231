// thankyou.js — Registration confirmation page (ES Module)
import { initNav } from './nav.js';
import { getItem } from './storage.js';

initNav();

const list = document.getElementById('registration-details');

const data = getItem('citadel_registration');

if (!data) {
  list.innerHTML = `<li style="color:var(--muted);">No registration found. <a href="registry.html">Register here</a>.</li>`;
} else {
  const fields = [
    { label: 'Full Name',          value: data.fullName },
    { label: 'Email',              value: data.email },
    { label: 'Dimension',          value: data.dimension },
    { label: 'Favorite Character', value: data.favCharacter },
    { label: 'Favorite Quote',     value: data.quote || '—' },
    { label: 'Theory',             value: data.theory || '—' },
    { label: 'Submitted',          value: data.timestamp }
  ];

  // Template literals to build list items
  list.innerHTML = fields
    .map(f => `<li><strong>${f.label}:</strong> ${f.value}</li>`)
    .join('');
}
