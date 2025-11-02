// Course Data Array
const courses = [
    { code: "CSE110", name: "Programming Building Blocks", credits: 3, completed: true },
    { code: "WDD130", name: "Web Fundamentals", credits: 3, completed: true },
    { code: "CSE111", name: "Programming with Functions", credits: 3, completed: false },
    { code: "WDD231", name: "Web Frontend Development I", credits: 3, completed: false },
    { code: "CIT160", name: "Introduction to Programming", credits: 3, completed: true }
];

// Display courses with filtering
function displayCourses(filter = 'all') {
    const courseGrid = document.getElementById('course-cards');
    courseGrid.innerHTML = '';
    
    const filteredCourses = filter === 'all' 
        ? courses 
        : courses.filter(course => course.code.includes(filter));
    
    filteredCourses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = `course-card ${course.completed ? 'completed' : ''}`;
        courseCard.innerHTML = `
            <div class="course-code">${course.code}</div>
            <div class="course-name">${course.name}</div>
            <div class="course-credits">Credits: ${course.credits}</div>
            ${course.completed ? '<div class="completed-badge">Completed</div>' : ''}
        `;
        courseGrid.appendChild(courseCard);
    });
    
    updateCreditTotal(filteredCourses);
}

// Update credit total using reduce()
function updateCreditTotal(coursesArray) {
    const totalCredits = coursesArray.reduce((sum, course) => sum + course.credits, 0);
    document.getElementById('total-credits').textContent = totalCredits;
}

// Filter button functionality
document.querySelectorAll('.filter-buttons button').forEach(button => {
    button.addEventListener('click', (e) => {
        // Remove active class from all buttons
        document.querySelectorAll('.filter-buttons button').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to clicked button
        e.target.classList.add('active');
        
        const filter = e.target.dataset.filter;
        displayCourses(filter);
    });
});

// Initialize with all courses
displayCourses();
document.querySelector('[data-filter="all"]').classList.add('active');