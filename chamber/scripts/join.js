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

const timestampField = document.getElementById('timestamp');
timestampField.value = new Date().toLocaleString();

const cardButtons = document.querySelectorAll('.member-card button');
cardButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = document.getElementById(button.dataset.modal);
        modal.showModal();
    });
});

const closeButtons = document.querySelectorAll('.close-modal');
closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        button.closest('dialog').close();
    });
});

const dialogs = document.querySelectorAll('dialog');
dialogs.forEach(dialog => {
    dialog.addEventListener('click', (event) => {
        if (event.target === dialog) {
            dialog.close();
        }
    });
});
