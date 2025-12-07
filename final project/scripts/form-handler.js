// scripts/form-handler.js - Form handling functionality
import { loadUserPreferences, saveUserPreferences } from './utils.js';

// Initialize form handlers
export function initFormHandlers() {
    // Newsletter form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        setupNewsletterForm(newsletterForm);
    }
    
    // Reset checklist button
    const resetChecklistBtn = document.getElementById('reset-checklist');
    if (resetChecklistBtn) {
        resetChecklistBtn.addEventListener('click', resetChecklist);
    }
    
    // Save checklist button
    const saveChecklistBtn = document.getElementById('save-checklist');
    if (saveChecklistBtn) {
        saveChecklistBtn.addEventListener('click', saveChecklistState);
    }
    
    // Load saved checklist state
    loadChecklistState();
}

// Setup newsletter form
function setupNewsletterForm(form) {
    form.addEventListener('submit', (event) => {
        // Validate form before submission
        if (!validateNewsletterForm()) {
            event.preventDefault();
            return;
        }
        
        // Get form data
        const formData = new FormData(form);
        const formValues = Object.fromEntries(formData);
        
        // Save form data to localStorage
        saveFormData(formValues);
        
        // Save user preferences
        const userPrefs = {
            experience: formValues.experience,
            newsletter: formValues.newsletter === 'on'
        };
        saveUserPreferences(userPrefs);
        
        // Form will submit normally to form-action.html
    });
}

// Validate newsletter form
function validateNewsletterForm() {
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const terms = document.getElementById('terms');
    
    // Remove existing error messages
    removeFormErrors();
    
    let isValid = true;
    let errors = [];
    
    if (!name.value || name.value.trim().length < 2) {
        errors.push('Please enter a valid name (minimum 2 characters)');
        isValid = false;
    }
    
    if (!email.value || !isValidEmail(email.value)) {
        errors.push('Please enter a valid email address');
        isValid = false;
    }
    
    if (!terms.checked) {
        errors.push('Please agree to the terms and conditions');
        isValid = false;
    }
    
    if (!isValid) {
        showFormErrors(errors);
    }
    
    return isValid;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Remove form errors
function removeFormErrors() {
    const existingErrors = document.querySelectorAll('.form-error');
    existingErrors.forEach(error => error.remove());
}

// Show form errors
function showFormErrors(errors) {
    const form = document.querySelector('form');
    if (!form) return;
    
    errors.forEach(error => {
        const errorElement = document.createElement('div');
        errorElement.className = 'form-error';
        errorElement.style.cssText = `
            background-color: #f8d7da;
            color: #721c24;
            padding: 10px;
            border-radius: 4px;
            margin: 10px 0;
            border: 1px solid #f5c6cb;
        `;
        errorElement.textContent = error;
        
        form.insertBefore(errorElement, form.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (errorElement.parentNode) {
                errorElement.remove();
            }
        }, 5000);
    });
}

// Save form data to localStorage
function saveFormData(data) {
    try {
        const existingSubmissions = JSON.parse(localStorage.getItem('newsletterSubmissions') || '[]');
        
        const submission = {
            ...data,
            timestamp: new Date().toISOString(),
            id: Date.now()
        };
        
        existingSubmissions.unshift(submission);
        const limitedSubmissions = existingSubmissions.slice(0, 10);
        
        localStorage.setItem('newsletterSubmissions', JSON.stringify(limitedSubmissions));
        
    } catch (error) {
        console.error('Error saving form data:', error);
    }
}

// Save checklist state
function saveChecklistState() {
    try {
        const checklistState = {};
        const checklists = document.querySelectorAll('.checklist');
        
        checklists.forEach((checklist, index) => {
            const items = checklist.querySelectorAll('input[type="checkbox"]');
            const state = [];
            
            items.forEach(item => {
                state.push({
                    id: item.id,
                    checked: item.checked
                });
            });
            
            checklistState[`checklist-${index}`] = state;
        });
        
        localStorage.setItem('checklistState', JSON.stringify(checklistState));
        
        // Show confirmation
        const saveBtn = document.getElementById('save-checklist');
        if (saveBtn) {
            const originalText = saveBtn.textContent;
            saveBtn.textContent = 'Checklist Saved!';
            
            setTimeout(() => {
                saveBtn.textContent = originalText;
            }, 2000);
        }
        
    } catch (error) {
        console.error('Error saving checklist state:', error);
    }
}

// Load checklist state
function loadChecklistState() {
    try {
        const savedState = localStorage.getItem('checklistState');
        if (!savedState) return;
        
        const checklistState = JSON.parse(savedState);
        
        Object.values(checklistState).forEach(stateList => {
            stateList.forEach(itemState => {
                const checkbox = document.getElementById(itemState.id);
                if (checkbox) {
                    checkbox.checked = itemState.checked;
                }
            });
        });
        
    } catch (error) {
        console.error('Error loading checklist state:', error);
    }
}

// Reset checklist
function resetChecklist() {
    const checkboxes = document.querySelectorAll('.checklist input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    localStorage.removeItem('checklistState');
    
    // Show confirmation
    const resetBtn = document.getElementById('reset-checklist');
    if (resetBtn) {
        const originalText = resetBtn.textContent;
        resetBtn.textContent = 'Checklist Reset!';
        
        setTimeout(() => {
            resetBtn.textContent = originalText;
        }, 2000);
    }
}
