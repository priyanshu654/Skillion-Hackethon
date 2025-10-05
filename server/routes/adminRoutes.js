const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { approveCourse, getPendingCourses ,approveUser,rejectUser,getPendingUsers} = require('../controllers/adminController');

// Admin-only routes
router.get('/pending', auth(['admin']), getPendingCourses);
router.post('/courses/:courseId/approve', auth(['admin']), approveCourse);
router.patch('/users/:userId/approve', auth(['admin']), approveUser);
router.patch('/users/:userId/reject', auth(['admin']), rejectUser);
router.get('/users/pending', auth(['admin']), getPendingUsers);

module.exports = router;
