// Hamburger menu toggle
const hamburgerBtn = document.querySelector('#hamburger');
const navMenu = document.querySelector('#primaryNav ul');

hamburgerBtn.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    if (navMenu.classList.contains('open')) {
        hamburgerBtn.innerHTML = 'X';
    } else {
        hamburgerBtn.innerHTML = '&#9776;';
    }
});