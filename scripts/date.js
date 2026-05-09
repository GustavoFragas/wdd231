// Dynamically set current year in footer
const currentYearSpan = document.getElementById("currentyear");
if(currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
}

// Dynamically set last modified date
const lastModifiedP = document.getElementById("lastModified");
if(lastModifiedP) {
    lastModifiedP.textContent = `Last Modification: ${document.lastModified}`;
}