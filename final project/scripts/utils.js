// scripts/utils.js - Utility functions module

// Navigation functionality
export function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking outside on mobile
        document.addEventListener('click', (event) => {
            if (window.innerWidth < 768 && 
                !event.target.closest('.main-nav') && 
                !event.target.closest('.nav-toggle')) {
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
            }
        });
    }
}

// Fetch trails data with error handling
export async function fetchTrailsData() {
    try {
        const response = await fetch('data/trails.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Validate data structure
        if (!Array.isArray(data)) {
            throw new Error('Invalid data format: expected array');
        }
        
        return data;
        
    } catch (error) {
        console.error('Error fetching trails data:', error);
        return getFallbackTrailData();
    }
}

// Fallback trail data
function getFallbackTrailData() {
    return [
        {
            id: 1,
            name: "Mount Kigali Summit Trail",
            difficulty: "moderate",
            length: 8.5,
            location: "Kigali",
            duration: "3 hours",
            elevation: 350,
            description: "Panoramic views of Kigali city from the summit.",
            image: "images/trail-1.jpg",
            features: ["City views", "Bird watching", "Photography spots"],
            rating: 4.5,
            bestSeason: "Dry season",
            permitRequired: false
        }
    ];
}

// Local Storage utilities
export function saveUserPreferences(preferences) {
    try {
        localStorage.setItem('trailTrackerPrefs', JSON.stringify(preferences));
        return true;
    } catch (error) {
        console.error('Error saving preferences:', error);
        return false;
    }
}

export function loadUserPreferences() {
    try {
        const prefs = localStorage.getItem('trailTrackerPrefs');
        return prefs ? JSON.parse(prefs) : null;
    } catch (error) {
        console.error('Error loading preferences:', error);
        return null;
    }
}

export function saveToFavorites(trail) {
    try {
        const favorites = JSON.parse(localStorage.getItem('trailFavorites') || '[]');
        
        // Check if already in favorites
        const exists = favorites.some(fav => fav.id === trail.id);
        
        if (!exists) {
            favorites.push({
                id: trail.id,
                name: trail.name,
                difficulty: trail.difficulty,
                length: trail.length,
                location: trail.location,
                savedAt: new Date().toISOString()
            });
            
            localStorage.setItem('trailFavorites', JSON.stringify(favorites));
            return true;
        }
        
        return false;
    } catch (error) {
        console.error('Error saving to favorites:', error);
        return false;
    }
}

export function getFavorites() {
    try {
        return JSON.parse(localStorage.getItem('trailFavorites') || '[]');
    } catch (error) {
        console.error('Error getting favorites:', error);
        return [];
    }
}

// Utility functions
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
