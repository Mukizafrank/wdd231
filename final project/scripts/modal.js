// scripts/modal.js - Fixed version
let currentModal = null;

export function showModal(trail) {
    if (!trail) return;
    
    if (currentModal) closeModal();
    
    const modalHTML = createModalHTML(trail);
    let modalContainer = document.getElementById('modal-container');
    
    if (!modalContainer) {
        modalContainer = document.createElement('div');
        modalContainer.id = 'modal-container';
        document.body.appendChild(modalContainer);
    }
    
    modalContainer.innerHTML = modalHTML;
    currentModal = modalContainer.querySelector('.modal');
    
    setTimeout(() => {
        currentModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        addModalListeners(trail);
        focusModal();
    }, 10);
}

function createModalHTML(trail) {
    const safeTrail = {
        id: trail.id || 0,
        name: trail.name || 'Unknown Trail',
        difficulty: trail.difficulty || 'unknown',
        length: trail.length ?? 'N/A',
        location: trail.location || 'Unknown',
        duration: trail.duration || 'Unknown',
        elevation: trail.elevation ?? 'N/A',
        bestSeason: trail.bestSeason || 'Year-round',
        permitRequired: trail.permitRequired ? 'Yes' : 'No',
        description: trail.description || 'No description available.',
        image: trail.image || 'images/default-trail.jpg',
        features: Array.isArray(trail.features) ? trail.features : [],
        access: trail.access || 'Not specified',
        trailhead: trail.trailhead || 'Not specified',
        waterSources: trail.waterSources || 'Not specified',
        wildlife: trail.wildlife || 'Not specified'
    };
    
    return `
        <div class="modal" role="dialog" aria-labelledby="modal-title" aria-modal="true">
            <div class="modal-overlay" tabindex="-1"></div>
            <div class="modal-content">
                <button class="close-modal" aria-label="Close modal">&times;</button>
                
                <h2 id="modal-title">${escapeHtml(safeTrail.name)}</h2>
                
                <div class="modal-image">
                    <img src="${escapeHtml(safeTrail.image)}" 
                         alt="${escapeHtml(safeTrail.name)}" 
                         loading="lazy">
                </div>
                
                <div class="modal-details">
                    <div class="detail-row">
                        <span class="detail-label">Difficulty:</span>
                        <span class="difficulty ${escapeHtml(safeTrail.difficulty)}">
                            ${escapeHtml(safeTrail.difficulty)}
                        </span>
                    </div>
                    
                    <div class="detail-row">
                        <span class="detail-label">Length:</span>
                        <span>${escapeHtml(safeTrail.length)} km</span>
                    </div>
                    
                    <div class="detail-row">
                        <span class="detail-label">Location:</span>
                        <span>${escapeHtml(safeTrail.location)}</span>
                    </div>
                    
                    <div class="detail-row">
                        <span class="detail-label">Duration:</span>
                        <span>${escapeHtml(safeTrail.duration)}</span>
                    </div>
                    
                    <div class="detail-row">
                        <span class="detail-label">Elevation:</span>
                        <span>${escapeHtml(safeTrail.elevation)} m</span>
                    </div>
                    
                    <div class="detail-row">
                        <span class="detail-label">Best Season:</span>
                        <span>${escapeHtml(safeTrail.bestSeason)}</span>
                    </div>
                    
                    <div class="detail-row">
                        <span class="detail-label">Permit Required:</span>
                        <span>${escapeHtml(safeTrail.permitRequired)}</span>
                    </div>
                </div>
                
                <div class="modal-description">
                    <h3>Description</h3>
                    <p>${escapeHtml(safeTrail.description)}</p>
                </div>
                
                ${safeTrail.features.length > 0 ? `
                <div class="modal-features">
                    <h3>Features</h3>
                    <div class="features-list">
                        ${safeTrail.features.map(feature => 
                            `<span class="feature-tag">${escapeHtml(feature)}</span>`
                        ).join('')}
                    </div>
                </div>
                ` : ''}
                
                <div class="modal-additional">
                    <div class="additional-info">
                        <h4>Additional Information</h4>
                        <p><strong>Access:</strong> ${escapeHtml(safeTrail.access)}</p>
                        <p><strong>Trailhead:</strong> ${escapeHtml(safeTrail.trailhead)}</p>
                        <p><strong>Water Sources:</strong> ${escapeHtml(safeTrail.waterSources)}</p>
                        <p><strong>Wildlife:</strong> ${escapeHtml(safeTrail.wildlife)}</p>
                    </div>
                </div>
                
                <div class="modal-actions">
                    <button class="btn btn-secondary save-favorite-btn" 
                            data-trail-id="${safeTrail.id}">
                        Save to Favorites
                    </button>
                    <button class="btn btn-outline close-modal-btn">
                        Close
                    </button>
                </div>
            </div>
        </div>
    `;
}

function addModalListeners(trail) {
    if (!currentModal) return;
    
    currentModal.querySelectorAll('.close-modal, .close-modal-btn, .modal-overlay').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    const saveBtn = currentModal.querySelector('.save-favorite-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', async () => {
            const utils = await import('./utils.js');
            utils.saveToFavorites(trail);
            showSaveConfirmation(saveBtn);
        });
    }
    
    document.addEventListener('keydown', handleModalKeyboard);
}

function handleModalKeyboard(event) {
    if (!currentModal) return;
    if (event.key === 'Escape') closeModal();
    if (event.key === 'Tab') trapModalFocus(event);
}

function trapModalFocus(event) {
    const focusable = currentModal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    
    if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
    }
}

function focusModal() {
    const closeBtn = currentModal.querySelector('.close-modal');
    if (closeBtn) setTimeout(() => closeBtn.focus(), 100);
}

export function closeModal() {
    if (!currentModal) return;
    
    currentModal.classList.remove('active');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleModalKeyboard);
    
    setTimeout(() => {
        const container = document.getElementById('modal-container');
        if (container) container.innerHTML = '';
        currentModal = null;
    }, 300);
}

function showSaveConfirmation(button) {
    const originalText = button.textContent;
    button.textContent = 'Saved!';
    button.disabled = true;
    
    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
    }, 2000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}