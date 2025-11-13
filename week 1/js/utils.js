// UTILITY FUNCTIONS

/**
 * Calculates the completion percentage for a given course.
 * @param {Object} course - The course object.
 * @returns {number} The completion percentage (0-100).
 */
function calculateProgress(course) {
    const totalLessons = course.lessons.length;
    if (totalLessons === 0) return 0;

    const completedLessons = course.lessons.filter(lesson => lesson.completed).length;
    return Math.round((completedLessons / totalLessons) * 100);
}

/**
 * Gets a course by its ID.
 * @param {number} courseId - The ID of the course to find.
 * @returns {Object|null} The course object or null if not found.
 */
function getCourseById(courseId) {
    return courses.find(c => c.id === courseId) || null;
}

/**
 * Updates course completion status based on lesson progress.
 * @param {Object} course - The course object to update.
 */
function updateCourseCompletionStatus(course) {
    const progress = calculateProgress(course);
    if (progress === 100 && !course.isCompleted) {
        course.isCompleted = true;
    }
}

