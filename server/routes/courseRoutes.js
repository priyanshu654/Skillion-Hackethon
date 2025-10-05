const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    createCourse,
    addLesson,
    updateCourse,
    updateLesson,
    deleteCourse,
    deleteLesson,
    getMyCourses,
    getMyCourseDetails,
    getCourseDetailsForAdmin,
    getPublishedCourses
} = require('../controllers/courseController');

// Public route to get all published courses

// Creator routes
router.post('/create', auth(['creator']), createCourse);
router.post('/:courseId/lessons', auth(['creator']), addLesson);
router.put('/:courseId', auth(['creator']), updateCourse);
router.put('/:courseId/lesson/:lessonId', auth(['creator']), updateLesson);
router.delete('/:courseId', auth(['creator']), deleteCourse);
router.delete('/:courseId/lesson/:lessonId', auth(['creator']), deleteLesson);
router.get('/my-courses',auth(['creator']),getMyCourses);
router.get('/my-courses/:courseId',auth([]),getMyCourseDetails);

// Admin route for course preview
router.get('/admin-preview/:courseId', auth(['admin']), getCourseDetailsForAdmin);
router.get('/published',getPublishedCourses);

module.exports = router;