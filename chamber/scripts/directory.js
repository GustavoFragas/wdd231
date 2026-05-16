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

        // Image
        const img = document.createElement('img');
        img.src = `images/${member.imageFilename}`;
        img.alt = `Logo of ${member.name}`;
        img.loading = "lazy";
        img.width = 200;
        img.height = 150;
        img.onerror = () => { img.src = `https://placehold.co/200x150?text=${encodeURIComponent(member.name)}`; };

        // Name
        const name = document.createElement('h2');
        name.textContent = member.name;

        // Description
        const desc = document.createElement('p');
        desc.textContent = member.description;
        
        // Address
        const address = document.createElement('p');
        address.textContent = member.address;

        // Phone
        const phone = document.createElement('p');
        phone.textContent = member.phone;

        // Website
        const link = document.createElement('a');
        link.href = member.websiteUrl;
        link.textContent = "Visit Website";
        link.target = "_blank";

        card.appendChild(img);
        card.appendChild(name);
        card.appendChild(desc);
        card.appendChild(address);
        card.appendChild(phone);
        card.appendChild(link);

        container.appendChild(card);
    });
}

// TOGGLE VIEW EVENTS
const gridBtn = document.getElementById('grid-btn');
const listBtn = document.getElementById('list-btn');
const container = document.getElementById('directory-container');

gridBtn.addEventListener('click', () => {
    container.classList.remove('list-view');
});

listBtn.addEventListener('click', () => {
    container.classList.add('list-view');
});

// FOOTER DATES
const currentYearSpan = document.getElementById('currentyear');
const lastModifiedSpan = document.getElementById('lastModified');
if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();
if (lastModifiedSpan) lastModifiedSpan.textContent = document.lastModified;

// DARK MODE
const darkBtn = document.getElementById('darkmode');
darkBtn.addEventListener('click', () => {
    document.body.parentNode.classList.toggle('dark-mode');
});

getMembersData();
