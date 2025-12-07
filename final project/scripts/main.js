// scripts/main.js - Main entry point
import { initNavigation } from './utils.js';

// Get current page
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop();
    return page || 'index.html';
}

// Initialize everything
async function initPageSpecific() {
    const currentPage = getCurrentPage();
    
    // Common initialization
    initNavigation();
    setCurrentYear();
    
    // Page-specific initialization
    if (currentPage === 'index.html' || currentPage === '') {
        await initHomePage();
    } else if (currentPage === 'trails.html') {
        await initTrailsPage();
    } else if (currentPage === 'resources.html') {
        await initResourcesPage();
    }
}

// Home page
async function initHomePage() {
    try {
        const featuredBtn = document.getElementById('view-featured-details');
        if (featuredBtn) {
            const modalModule = await import('./modal.js');
            featuredBtn.addEventListener('click', () => {
                const featuredTrail = {
                    id: 1,
                    name: "Mount Kigali Summit Trail",
                    difficulty: "moderate",
                    length: 8.5,
                    location: "Kigali",
                    duration: "3 hours",
                    elevation: 350,
                    description: "Panoramic views of Kigali city from the summit. This popular trail offers a perfect day hike with beautiful scenery and diverse flora.",
                    image: "images/trail-1.jpg",
                    features: ["City views", "Bird watching", "Photography spots", "Picnic areas"],
                    bestSeason: "Dry season",
                    permitRequired: false,
                    access: "Easy access from Kigali city center",
                    trailhead: "Kigali Golf Club entrance"
                };
                modalModule.showModal(featuredTrail);
            });
        }
        
        initQuickSearch();
        initFormValidation();
        
    } catch (error) {
        console.error('Home page error:', error);
    }
}

// Trails page
async function initTrailsPage() {
    try {
        const [trailsModule, filtersModule, modalModule] = await Promise.all([
            import('./trails-data.js'),
            import('./filters.js'),
            import('./modal.js')
        ]);
        
        await trailsModule.initTrailsDisplay();
        filtersModule.initFilters();
        
        window.showModal = modalModule.showModal;
        window.closeModal = modalModule.closeModal;
        
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                modalModule.closeModal();
            }
        });
        
    } catch (error) {
        console.error('Trails page error:', error);
        showError('Failed to load trails. Please try again.');
    }
}

// Resources page
async function initResourcesPage() {
    try {
        const formModule = await import('./form-handler.js');
        formModule.initFormHandlers();
        
        initChecklist();
        
    } catch (error) {
        console.error('Resources page error:', error);
    }
}

// Quick search
function initQuickSearch() {
    document.querySelectorAll('.difficulty-btn, .location-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const type = e.target.classList.contains('difficulty-btn') ? 'difficulty' : 'location';
            const value = e.target.dataset[type];
            localStorage.setItem('quickSearch', JSON.stringify({ [type]: value }));
            window.location.href = `trails.html?${type}=${value}`;
        });
    });
}

// Checklist
function initChecklist() {
    const checkboxes = document.querySelectorAll('.checklist input[type="checkbox"]');
    const resetBtn = document.getElementById('reset-checklist');
    const saveBtn = document.getElementById('save-checklist');
    
    if (checkboxes.length > 0) {
        checkboxes.forEach(cb => cb.addEventListener('change', updateChecklistProgress));
        updateChecklistProgress();
        loadChecklistState();
    }
    
    if (resetBtn) resetBtn.addEventListener('click', resetChecklist);
    if (saveBtn) saveBtn.addEventListener('click', saveChecklistState);
}

function updateChecklistProgress() {
    const progressElement = document.getElementById('checklist-progress');
    if (!progressElement) return;
    
    const checkboxes = document.querySelectorAll('.checklist input[type="checkbox"]');
    const total = checkboxes.length;
    const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
    const percentage = total > 0 ? Math.round((checked / total) * 100) : 0;
    
    progressElement.innerHTML = `
        <div class="progress-bar">
            <div class="progress-fill" style="width: ${percentage}%"></div>
        </div>
        <span class="progress-text">${checked}/${total} items (${percentage}%)</span>
    `;
}

function loadChecklistState() {
    try {
        const saved = localStorage.getItem('checklistState');
        if (!saved) return;
        
        const state = JSON.parse(saved);
        Object.values(state).forEach(itemList => {
            itemList.forEach(item => {
                const checkbox = document.getElementById(item.id);
                if (checkbox) checkbox.checked = item.checked;
            });
        });
        updateChecklistProgress();
    } catch (error) {
        console.error('Error loading checklist:', error);
    }
}

function saveChecklistState() {
    try {
        const state = {};
        document.querySelectorAll('.checklist').forEach((list, index) => {
            const items = list.querySelectorAll('input[type="checkbox"]');
            state[`list-${index}`] = Array.from(items).map(item => ({
                id: item.id,
                checked: item.checked
            }));
        });
        
        localStorage.setItem('checklistState', JSON.stringify(state));
        showNotification('Checklist saved!');
    } catch (error) {
        console.error('Error saving checklist:', error);
    }
}

function resetChecklist() {
    document.querySelectorAll('.checklist input[type="checkbox"]').forEach(cb => cb.checked = false);
    localStorage.removeItem('checklistState');
    updateChecklistProgress();
    showNotification('Checklist reset!');
}

// Form validation
function initFormValidation() {
    const form = document.getElementById('newsletter-form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        const terms = document.getElementById('terms');
        if (!terms.checked) {
            e.preventDefault();
            showNotification('Please agree to the terms and conditions');
        }
    });
}

// Utility functions
function setCurrentYear() {
    const currentYearElement = document.getElementById('current-year');
    
    // Check if the element exists before trying to update it
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    } else {
        console.log('Note: current-year element not found on this page');
    }
}


function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 12px 24px;
        border-radius: 4px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Initialize
document.addEventListener('DOMContentLoaded', initPageSpecific);