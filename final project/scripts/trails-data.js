// scripts/trails-data.js - Trail data fetching and display module
import { fetchTrailsData } from './utils.js';

let allTrails = [];
let displayedTrails = [];

// Fetch and display trails
export async function initTrailsDisplay() {
    try {
        allTrails = await fetchTrailsData();
        displayedTrails = [...allTrails];
        
        displayTrails(displayedTrails);
        updateTrailCount();
        
        // Add event listeners to trail cards
        setTimeout(() => {
            addTrailCardListeners();
        }, 100);
        
    } catch (error) {
        console.error('Error initializing trails display:', error);
        showErrorMessage('Failed to load trail data. Please try again later.');
    }
}

// Display trails in the grid
export function displayTrails(trails) {
    const container = document.getElementById('trails-container');
    const noResults = document.getElementById('no-results');
    
    if (!container) return;
    
    if (trails.length === 0) {
        container.innerHTML = '';
        if (noResults) noResults.style.display = 'block';
        return;
    }
    
    if (noResults) noResults.style.display = 'none';
    
    // Use template literals and array methods (map)
    const trailCards = trails.map(trail => createTrailCard(trail)).join('');
    
    container.innerHTML = trailCards;
    displayedTrails = trails;
}

// Create trail card HTML using template literals
function createTrailCard(trail) {
    return `
        <article class="trail-card" data-id="${trail.id}">
            <img src="${trail.image || 'images/default-trail.jpg'}" 
                 alt="${trail.name}" 
                 loading="lazy"
                 class="trail-image">
            <div class="trail-card-content">
                <h3>${trail.name}</h3>
                <div class="trail-meta">
                    <span class="difficulty ${trail.difficulty}">${trail.difficulty}</span>
                    <span class="length">${trail.length} km</span>
                    <span class="location">${trail.location}</span>
                    <span class="duration">${trail.duration}</span>
                </div>
                <p class="trail-description">${trail.description}</p>
                <div class="trail-features">
                    ${(trail.features || []).map(feature => 
                        `<span class="feature-tag">${feature}</span>`
                    ).join('')}
                </div>
                <button class="btn btn-secondary view-details-btn" 
                        data-trail-id="${trail.id}"
                        aria-label="View details for ${trail.name}">
                    View Details
                </button>
            </div>
        </article>
    `;
}

// Add event listeners to trail cards
function addTrailCardListeners() {
    const viewButtons = document.querySelectorAll('.view-details-btn');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const trailId = parseInt(event.target.dataset.trailId);
            const trail = allTrails.find(t => t.id === trailId);
            
            if (trail) {
                // Import modal dynamically when needed
                import('./modal.js').then(modalModule => {
                    modalModule.showModal(trail);
                });
            }
        });
    });
}

// Update trail count display
export function updateTrailCount(filteredCount = null) {
    const countElement = document.getElementById('trail-count');
    
    if (countElement) {
        const totalCount = allTrails.length;
        const displayCount = filteredCount !== null ? filteredCount : totalCount;
        
        countElement.textContent = `Showing ${displayCount} of ${totalCount} trails`;
    }
}

// Show error message
function showErrorMessage(message) {
    const container = document.getElementById('trails-container');
    
    if (container) {
        container.innerHTML = `
            <div class="error-message">
                <h3>Error Loading Trails</h3>
                <p>${message}</p>
                <button class="btn btn-primary" onclick="location.reload()">
                    Try Again
                </button>
            </div>
        `;
    }
}

// Get all trails (for filtering)
export function getAllTrails() {
    return allTrails;
}

// Get displayed trails
export function getDisplayedTrails() {
    return displayedTrails;
}
