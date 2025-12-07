// scripts/filters.js - Trail filtering functionality
import { getAllTrails, displayTrails, updateTrailCount } from './trails-data.js';
import { loadUserPreferences, saveUserPreferences, debounce } from './utils.js';

let activeFilters = {
    difficulty: 'all',
    location: 'all',
    maxLength: 'all',
    searchTerm: ''
};

// Initialize filters
export function initFilters() {
    loadSavedPreferences();
    setupFilterListeners();
    applyFilters();
}

// Load saved user preferences from localStorage
function loadSavedPreferences() {
    const savedPrefs = loadUserPreferences();
    
    if (savedPrefs) {
        activeFilters = { ...activeFilters, ...savedPrefs };
        updateFilterControls();
    }
}

// Setup event listeners for filter controls
function setupFilterListeners() {
    // Difficulty filter
    const difficultyFilter = document.getElementById('difficulty-filter');
    if (difficultyFilter) {
        difficultyFilter.value = activeFilters.difficulty;
        difficultyFilter.addEventListener('change', (e) => {
            activeFilters.difficulty = e.target.value;
            applyFilters();
        });
    }
    
    // Location filter
    const locationFilter = document.getElementById('location-filter');
    if (locationFilter) {
        locationFilter.value = activeFilters.location;
        locationFilter.addEventListener('change', (e) => {
            activeFilters.location = e.target.value;
            applyFilters();
        });
    }
    
    // Length filter
    const lengthFilter = document.getElementById('length-filter');
    if (lengthFilter) {
        lengthFilter.value = activeFilters.maxLength;
        lengthFilter.addEventListener('change', (e) => {
            activeFilters.maxLength = e.target.value;
            applyFilters();
        });
    }
    
    // Search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = activeFilters.searchTerm;
        searchInput.addEventListener('input', debounce((e) => {
            activeFilters.searchTerm = e.target.value.toLowerCase();
            applyFilters();
        }, 300));
    }
    
    // Reset filters button
    const resetBtn = document.getElementById('reset-filters');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
    }
    
    // Save preferences button
    const saveBtn = document.getElementById('save-preferences');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveFilterPreferences);
    }
}

// Update filter controls to match active filters
function updateFilterControls() {
    const difficultyFilter = document.getElementById('difficulty-filter');
    const locationFilter = document.getElementById('location-filter');
    const lengthFilter = document.getElementById('length-filter');
    const searchInput = document.getElementById('search-input');
    
    if (difficultyFilter) difficultyFilter.value = activeFilters.difficulty;
    if (locationFilter) locationFilter.value = activeFilters.location;
    if (lengthFilter) lengthFilter.value = activeFilters.maxLength;
    if (searchInput) searchInput.value = activeFilters.searchTerm;
}

// Apply filters to trail data using array methods (filter)
export function applyFilters() {
    const trails = getAllTrails();
    
    if (!trails || trails.length === 0) return;
    
    // Use filter() array method
    const filteredTrails = trails.filter(trail => {
        // Difficulty filter
        if (activeFilters.difficulty !== 'all' && 
            trail.difficulty !== activeFilters.difficulty) {
            return false;
        }
        
        // Location filter
        if (activeFilters.location !== 'all' && 
            trail.location.toLowerCase() !== activeFilters.location) {
            return false;
        }
        
        // Length filter
        if (activeFilters.maxLength !== 'all' && 
            trail.length > parseInt(activeFilters.maxLength)) {
            return false;
        }
        
        // Search term filter
        if (activeFilters.searchTerm && 
            !trail.name.toLowerCase().includes(activeFilters.searchTerm) &&
            !trail.description.toLowerCase().includes(activeFilters.searchTerm)) {
            return false;
        }
        
        return true;
    });
    
    // Display filtered trails
    displayTrails(filteredTrails);
    updateTrailCount(filteredTrails.length);
    updateActiveFiltersDisplay();
}

// Reset all filters
function resetFilters() {
    activeFilters = {
        difficulty: 'all',
        location: 'all',
        maxLength: 'all',
        searchTerm: ''
    };
    
    updateFilterControls();
    applyFilters();
}

// Save current filter preferences
function saveFilterPreferences() {
    const prefsToSave = {
        difficulty: activeFilters.difficulty,
        location: activeFilters.location,
        maxLength: activeFilters.maxLength
    };
    
    saveUserPreferences(prefsToSave);
    showSaveConfirmation();
}

// Show save confirmation
function showSaveConfirmation() {
    const saveBtn = document.getElementById('save-preferences');
    if (!saveBtn) return;
    
    const originalText = saveBtn.textContent;
    saveBtn.textContent = 'Saved!';
    saveBtn.classList.add('saved');
    
    setTimeout(() => {
        saveBtn.textContent = originalText;
        saveBtn.classList.remove('saved');
    }, 2000);
}

// Update active filters display
function updateActiveFiltersDisplay() {
    const activeFiltersDisplay = document.getElementById('active-filters');
    
    if (!activeFiltersDisplay) return;
    
    const activeFilterLabels = [];
    
    if (activeFilters.difficulty !== 'all') {
        activeFilterLabels.push(`Difficulty: ${activeFilters.difficulty}`);
    }
    
    if (activeFilters.location !== 'all') {
        activeFilterLabels.push(`Location: ${activeFilters.location}`);
    }
    
    if (activeFilters.maxLength !== 'all') {
        activeFilterLabels.push(`Max length: ${activeFilters.maxLength}km`);
    }
    
    if (activeFilters.searchTerm) {
        activeFilterLabels.push(`Search: "${activeFilters.searchTerm}"`);
    }
    
    if (activeFilterLabels.length > 0) {
        activeFiltersDisplay.innerHTML = `
            <strong>Active filters:</strong> ${activeFilterLabels.join(', ')}
        `;
    } else {
        activeFiltersDisplay.innerHTML = '';
    }
}

