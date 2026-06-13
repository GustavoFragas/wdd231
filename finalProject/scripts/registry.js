// registry.js — Galactic Registry form (ES Module)
import { initNav } from './nav.js';
import { saveItem } from './storage.js';

initNav();

const form = document.getElementById('registry-form');

// Set timestamp hidden field
document.getElementById('timestamp').value = new Date().toISOString();

// ── Validation helpers ────────────────────────────────────────────────────────
function setError(input, msg) {
  const group = input.closest('.form-group');
  group.classList.add('error');
  group.querySelector('.error-msg').textContent = msg;
}

function clearError(input) {
  const group = input.closest('.form-group');
  group.classList.remove('error');
  group.querySelector('.error-msg').textContent = '';
}

function validateForm() {
  let valid = true;

  const fullName = form.elements['fullName'];
  const email    = form.elements['email'];
  const dimension= form.elements['dimension'];
  const favChar  = form.elements['favCharacter'];

  // Full name
  if (fullName.value.trim().length < 2) {
    setError(fullName, 'Name must be at least 2 characters.');
    valid = false;
  } else { clearError(fullName); }

  // Email
  if (!fullName.validity.valid || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    if (email.value.trim() === '') {
      setError(email, 'Email is required.');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      setError(email, 'Please enter a valid email address.');
      valid = false;
    } else { clearError(email); }
  } else { clearError(email); }

  // Email re-check independent
  if (email.value.trim() === '') {
    setError(email, 'Email is required.');
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    setError(email, 'Please enter a valid email address.');
    valid = false;
  } else { clearError(email); }

  // Dimension
  if (dimension.value.trim() === '') {
    setError(dimension, 'Dimension is required.');
    valid = false;
  } else if (!/^[A-Za-z0-9\-\s]{1,20}$/.test(dimension.value.trim())) {
    setError(dimension, 'Invalid format. Use alphanumeric characters and hyphens only.');
    valid = false;
  } else { clearError(dimension); }

  // Favorite character
  if (!favChar.value) {
    setError(favChar, 'Please select a character.');
    valid = false;
  } else { clearError(favChar); }

  return valid;
}

// Inline validation on blur
['fullName', 'email', 'dimension', 'favCharacter'].forEach(name => {
  const field = form.elements[name];
  if (field) {
    field.addEventListener('blur', () => validateForm());
    field.addEventListener('input', () => {
      if (field.closest('.form-group').classList.contains('error')) validateForm();
    });
  }
});

// ── Submit ────────────────────────────────────────────────────────────────────
form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  const data = {
    fullName:     form.elements['fullName'].value.trim(),
    email:        form.elements['email'].value.trim(),
    dimension:    form.elements['dimension'].value.trim(),
    favCharacter: form.elements['favCharacter'].value,
    quote:        form.elements['quote'].value.trim(),
    theory:       form.elements['theory'].value.trim(),
    timestamp:    new Date().toLocaleString()
  };

  // Save to localStorage using storage module
  saveItem('citadel_registration', data);

  // Navigate to thank-you page
  window.location.href = 'thankyou.html';
});
