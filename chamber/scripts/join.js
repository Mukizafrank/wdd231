// Set the hidden timestamp when the page loads
document.getElementById('timestamp').value = new Date().toISOString();

// Modal functionality
document.querySelectorAll('.info-btn').forEach(button => {
  button.addEventListener('click', () => {
    const modalId = button.getAttribute('data-modal');
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.showModal();
    }
  });
});

// Close modal functionality
document.querySelectorAll('.close-modal').forEach(button => {
  button.addEventListener('click', () => {
    const modal = button.closest('dialog');
    if (modal) {
      modal.close();
    }
  });
});

// Close modal when clicking on backdrop
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.addEventListener('click', (e) => {
    const dialogDimensions = dialog.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      dialog.close();
    }
  });
});