const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    getEnrolledCourses,
    enrollCourse,
    markLessonComplete,
    getCourseProgress,
    getCertificates
} = require('../controllers/learnerController');

router.get('/enrolled-courses', auth(['learner']), getEnrolledCourses);
router.post('/:courseId/enroll', auth(['learner']), enrollCourse);
router.post('/:courseId/lesson/:lessonId/complete', auth(['learner']), markLessonComplete);
router.get('/:courseId/progress', auth(['learner']), getCourseProgress);
router.get('/certificates', auth(['learner']), getCertificates);

module.exports = router;