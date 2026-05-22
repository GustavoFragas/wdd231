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

const apiKey = '17fad8ec4a7f65b85ab1ecc5eca758c7';
const lat = 42.36;
const lon = -71.06;
const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

const currentTemp = document.querySelector('#current-temp');
const weatherIcon = document.querySelector('#weather-icon');
const weatherDesc = document.querySelector('#weather-desc');
const forecastList = document.querySelector('#forecast');

async function getWeather() {
    try {
        const response = await fetch(currentUrl);
        if (response.ok) {
            const data = await response.json();
            displayCurrentWeather(data);
        } else {
            throw Error(await response.text());
        }
    } catch (error) {
        console.error('Error fetching current weather:', error);
    }
}

function displayCurrentWeather(data) {
    currentTemp.innerHTML = `${Math.round(data.main.temp)}&deg;F`;
    const iconsrc = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    const desc = data.weather[0].description;
    weatherIcon.setAttribute('src', iconsrc);
    weatherIcon.setAttribute('alt', desc);
    weatherDesc.textContent = desc;
}

async function getForecast() {
    try {
        const response = await fetch(forecastUrl);
        if (response.ok) {
            const data = await response.json();
            displayForecast(data);
        } else {
            throw Error(await response.text());
        }
    } catch (error) {
        console.error('Error fetching forecast:', error);
    }
}

function displayForecast(data) {
    const days = {};
    data.list.forEach(item => {
        const date = item.dt_txt.split(' ')[0];
        const hour = item.dt_txt.split(' ')[1];
        if (hour === '12:00:00' && !days[date]) {
            days[date] = item;
        }
    });

    const upcoming = Object.values(days).slice(0, 3);
    forecastList.innerHTML = '';
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    upcoming.forEach(item => {
        const li = document.createElement('li');
        const label = dayNames[new Date(item.dt * 1000).getDay()];
        li.innerHTML = `<strong>${label}:</strong> ${Math.round(item.main.temp)}&deg;F`;
        forecastList.appendChild(li);
    });
}

getWeather();
getForecast();

const membersUrl = 'data/members.json';

async function getSpotlights() {
    try {
        const response = await fetch(membersUrl);
        const data = await response.json();
        displaySpotlights(data.members);
    } catch (error) {
        console.error('Error fetching member data:', error);
    }
}

function displaySpotlights(members) {
    const eligible = members.filter(m => m.membershipLevel === 2 || m.membershipLevel === 3);
    const shuffled = eligible.sort(() => Math.random() - 0.5);
    const picks = shuffled.slice(0, 3);

    const container = document.getElementById('spotlight-container');
    container.innerHTML = '';

    const levelLabel = { 1: 'Bronze', 2: 'Silver', 3: 'Gold' };

    picks.forEach(member => {
        const card = document.createElement('div');
        card.classList.add('card', 'spotlight');

        const img = document.createElement('img');
        img.src = `images/${member.imageFilename}`;
        img.alt = `Logo of ${member.name}`;
        img.loading = 'lazy';
        img.width = 200;
        img.height = 150;
        img.onerror = () => { img.src = `https://placehold.co/200x150?text=${encodeURIComponent(member.name)}`; };

        const name = document.createElement('h3');
        name.textContent = member.name;

        const level = document.createElement('p');
        level.classList.add('level');
        level.textContent = `${levelLabel[member.membershipLevel]} Member`;

        const phone = document.createElement('p');
        phone.textContent = member.phone;

        const address = document.createElement('p');
        address.textContent = member.address;

        const link = document.createElement('a');
        link.href = member.websiteUrl;
        link.textContent = 'Visit Website';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';

        card.appendChild(img);
        card.appendChild(name);
        card.appendChild(level);
        card.appendChild(phone);
        card.appendChild(address);
        card.appendChild(link);

        container.appendChild(card);
    });
}

getSpotlights();
