// MAIN APPLICATION LOGIC

// DOM Elements
const courseListEl = document.getElementById('course-list');
const homePageEl = document.getElementById('home-page');
const courseDetailEl = document.getElementById('course-detail');
const detailTitleEl = document.getElementById('detail-title');
const detailProgressEl = document.getElementById('detail-progress');
const lessonListEl = document.getElementById('lesson-list');
const markCompleteBtn = document.getElementById('mark-complete-btn');

let currentCourseId = null;

/**
 * Renders the list of courses on the Home Page.
 */
function renderCourseList() {
    courseListEl.innerHTML = ''; // Clear existing list

    courses.forEach(course => {
        const progress = calculateProgress(course);
        updateCourseCompletionStatus(course);
        
        const card = document.createElement('div');
        card.classList.add('course-card');
        if (course.isCompleted) {
            card.classList.add('completed-course');
        }
        card.onclick = () => showCourseDetail(course.id);

        card.innerHTML = `
            <h3>${course.title}</h3>
            <p>${course.description}</p>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progress}%;"></div>
            </div>
            <p class="status-text">
                Progress: ${progress}% 
                ${course.isCompleted ? '✅ **Completed**' : ''}
            </p>
        `;
        courseListEl.appendChild(card);
    });
}

/**
 * Switches the view to the Home Page.
 */
function showHomePage() {
    currentCourseId = null;
    renderCourseList(); // Re-render to update progress/completion status
    homePageEl.style.display = 'block';
    courseDetailEl.style.display = 'none';
}

/**
 * Switches the view to the Course Detail Page.
 * @param {number} courseId - The ID of the course to display.
 */
function showCourseDetail(courseId) {
    const course = getCourseById(courseId);
    if (!course) return;

    currentCourseId = courseId;
    const progress = calculateProgress(course);
    const isAllLessonsComplete = progress === 100;

    // 1. Update Detail Title
    detailTitleEl.textContent = course.title;

    // 2. Update Detail Progress
    detailProgressEl.innerHTML = `
        <p>Course Progress: <strong>${progress}%</strong></p>
        <div class="progress-bar">
            <div class="progress-fill" style="width: ${progress}%;"></div>
        </div>
    `;

    // 3. Update Lesson List
    lessonListEl.innerHTML = '';
    course.lessons.forEach(lesson => {
        const lessonItem = document.createElement('li');
        lessonItem.classList.add('lesson-item');
        if (lesson.completed) {
            lessonItem.classList.add('completed-lesson');
        }
        lessonItem.textContent = `${lesson.title} ${lesson.completed ? ' (Done)' : ''}`;
        lessonListEl.appendChild(lessonItem);
    });

    // 4. Update Completion Button
    if (course.isCompleted) {
        markCompleteBtn.textContent = '✅ Course Completed';
        markCompleteBtn.disabled = true;
    } else if (isAllLessonsComplete) {
         markCompleteBtn.textContent = 'Mark Course as Completed';
         markCompleteBtn.disabled = false;
    } else {
        markCompleteBtn.textContent = `Finish Remaining Lessons (${100 - progress}%)`;
        markCompleteBtn.disabled = true;
    }

    // 5. Switch View
    homePageEl.style.display = 'none';
    courseDetailEl.style.display = 'block';
}

/**
 * Marks the current course as fully completed.
 */
function markCourseCompleted() {
    const course = getCourseById(currentCourseId);
    if (!course) return;

    const progress = calculateProgress(course);
    if (progress === 100 && !course.isCompleted) {
        course.isCompleted = true;
        alert(`Congratulations! You've completed the course: ${course.title}! 🎉`);
        // Re-render the detail page to reflect the new status
        showCourseDetail(currentCourseId); 
    } else if (!course.isCompleted) {
         alert("You must complete all lessons before marking the course as completed.");
    }
}

// Event Listeners and Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the application
    courses.forEach(course => {
        updateCourseCompletionStatus(course);
    });
    showHomePage();
});

