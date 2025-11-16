// Import weather and members functionality
import { fetchWeatherData } from './weather.js';
import { loadMemberSpotlights } from './members.js';

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Set last modified date and year
    document.getElementById('lastModified').textContent = document.lastModified;
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Mobile menu toggle (reuse from directory)
    const menuToggle = document.querySelector('#menuButton');
    const navMenu = document.querySelector('#navMenu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
        });
    }
    
    // Load dynamic content for home page
    fetchWeatherData();
    loadMemberSpotlights();
});