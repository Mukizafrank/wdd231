async function loadMembers() {
  const response = await fetch("data/members.json");
  const members = await response.json();
  displayMembers(members);
}

function displayMembers(members) {
  const container = document.getElementById("members");
  container.innerHTML = "";

  members.forEach(member => {
    const card = document.createElement("div");
    card.classList.add("member-card");

    card.innerHTML = `
      <img src="${member.image}" alt="${member.name}">
      <h3>${member.name}</h3>
      <p>${member.address}</p>
      <p>${member.phone}</p>
      <a href="${member.website}" target="_blank">Visit Website</a>
      <p class="membership-level">Level: ${member.membership}</p>
    `;

    container.appendChild(card);
  });
}

// Toggle between grid and list view
document.getElementById("gridBtn").addEventListener("click", () => {
  document.getElementById("members").classList.add("grid-view");
  document.getElementById("members").classList.remove("list-view");
});

document.getElementById("listBtn").addEventListener("click", () => {
  document.getElementById("members").classList.add("list-view");
  document.getElementById("members").classList.remove("grid-view");
});
// hamburger menu
const menuButton = document.getElementById("menuButton");
const navMenu = document.getElementById("navMenu");

menuButton.addEventListener("click", () => {
  navMenu.classList.toggle("open");
});
// Footer date
document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("lastModified").textContent = document.lastModified;

loadMembers();
