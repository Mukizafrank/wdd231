// Responsive Navigation
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('nav');

hamburger.addEventListener('click', () => {
    nav.classList.toggle('active');
});

// Close navigation when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('header')) {
        nav.classList.remove('active');
    }
});