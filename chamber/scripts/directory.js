const membersUrl = 'data/members.json';

async function getMembersData() {
    try {
        const response = await fetch(membersUrl);
        const data = await response.json();
        displayMembers(data.members);
    } catch (error) {
        console.error("Error fetching member data:", error);
    }
}

function displayMembers(members) {
    const container = document.getElementById('directory-container');
    container.innerHTML = '';

    members.forEach(member => {
        const card = document.createElement('div');
        card.classList.add('card');

        const img = document.createElement('img');
        img.src = `images/${member.imageFilename}`;
        img.alt = `Logo of ${member.name}`;
        img.loading = "lazy";
        img.width = 200;
        img.height = 150;
        img.onerror = () => { img.src = `https://placehold.co/200x150?text=${encodeURIComponent(member.name)}`; };

        const name = document.createElement('h2');
        name.textContent = member.name;

        const desc = document.createElement('p');
        desc.textContent = member.description;

        const address = document.createElement('p');
        address.textContent = member.address;

        const phone = document.createElement('p');
        phone.textContent = member.phone;

        const link = document.createElement('a');
        link.href = member.websiteUrl;
        link.textContent = "Visit Website";
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        card.appendChild(img);
        card.appendChild(name);
        card.appendChild(desc);
        card.appendChild(address);
        card.appendChild(phone);
        card.appendChild(link);

        container.appendChild(card);
    });
}

const gridBtn = document.getElementById('grid-btn');
const listBtn = document.getElementById('list-btn');
const container = document.getElementById('directory-container');

function setView(mode) {
    if (mode === 'list') {
        container.classList.add('list-view');
        listBtn.setAttribute('aria-pressed', 'true');
        gridBtn.setAttribute('aria-pressed', 'false');
    } else {
        container.classList.remove('list-view');
        gridBtn.setAttribute('aria-pressed', 'true');
        listBtn.setAttribute('aria-pressed', 'false');
    }
}

gridBtn.addEventListener('click', () => setView('grid'));
listBtn.addEventListener('click', () => setView('list'));

setView('grid');

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

getMembersData();
