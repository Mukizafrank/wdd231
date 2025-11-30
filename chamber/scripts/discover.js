import attractions from '../data/attractions.mjs';

console.log("✅ attractions.mjs imported successfully!");
console.log("Attractions data:", attractions);

class DiscoverPage {
    constructor() {
        console.log("✅ DiscoverPage constructor called");
        this.grid = document.getElementById('discover-grid');
        this.visitMessage = document.getElementById('visit-message');
        this.messageText = document.getElementById('message-text');
        this.closeButton = document.getElementById('close-message');
        
        this.init();
    }

    init() {
        console.log("✅ Displaying attractions");
        this.displayAttractions();
        this.showVisitMessage();
        this.setupEventListeners();
    }

    displayAttractions() {
        if (!this.grid) {
            console.error("❌ Grid element not found!");
            return;
        }
        
        this.grid.innerHTML = attractions.map(attraction => `
            <article class="attraction-card" data-id="${attraction.id}">
                <h2>${attraction.name}</h2>
                <figure>
                    <img 
                        src="${attraction.image}" 
                        alt="${attraction.name}" 
                        width="300" 
                        height="200"
                        loading="lazy"
                    >
                    <figcaption>${attraction.name}</figcaption>
                </figure>
                <address>${attraction.address}</address>
                <p>${attraction.description}</p>
                <button class="learn-more">Learn More</button>
            </article>
        `).join('');
        
        console.log("✅ Cards created successfully");
    }

    showVisitMessage() {
        const lastVisit = localStorage.getItem('lastVisit');
        const currentVisit = Date.now();
        
        let message;
        
        if (!lastVisit) {
            message = "Welcome! Let us know if you have any questions.";
        } else {
            const daysBetween = Math.floor((currentVisit - lastVisit) / (1000 * 60 * 60 * 24));
            
            if (daysBetween < 1) {
                message = "Back so soon! Awesome!";
            } else if (daysBetween === 1) {
                message = "You last visited 1 day ago.";
            } else {
                message = `You last visited ${daysBetween} days ago.`;
            }
        }
        
        this.messageText.textContent = message;
        this.visitMessage.style.display = 'flex';
        
        localStorage.setItem('lastVisit', currentVisit);
    }

    setupEventListeners() {
        this.closeButton.addEventListener('click', () => {
            this.visitMessage.style.display = 'none';
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("✅ DOM loaded - starting DiscoverPage");
    new DiscoverPage();
});