const User = require('../models/User');
const Course = require('../models/Course');
const crypto = require('crypto');

// ---------------- GET ENROLLED COURSES ----------------
const getEnrolledCourses = async (req, res) => {
    try {
        const learnerId = req.user.userId;

        const user = await User.findById(learnerId).populate({
            path: 'studentInfo.enrolledCourses',
            match: { status: 'published' }, // Only get published courses
            select: 'title description image status createdAt updatedAt publishedAt'
        });
        
        if (!user || user.role !== 'learner') {
            return res.status(403).json({ message: 'Only learners can access enrolled courses' });
        }

        // Filter out any null values that might have been populated
        const enrolledCourses = user.studentInfo.enrolledCourses.filter(course => course !== null);

        res.json({ 
            success: true,
            courses: enrolledCourses 
        });
    } catch (err) {
        res.status(500).json({ 
            success: false,
            error: err.message 
        });
    }
};

// ---------------- ENROLL IN COURSE ----------------
const enrollCourse = async (req, res) => {
    try {
        const learnerId = req.user.userId;
        const { courseId } = req.params;

        const user = await User.findById(learnerId);
        if (!user || user.role !== 'learner') return res.status(403).json({ message: 'Only learners can enroll' });

        const course = await Course.findById(courseId);
        if (!course || course.status !== 'published') return res.status(404).json({ message: 'Course not available' });

        const alreadyEnrolled = user.studentInfo.enrolledCourses.some(c => c.toString() === courseId);
        if (alreadyEnrolled) return res.status(400).json({ message: 'Already enrolled' });

        user.studentInfo.enrolledCourses.push(courseId);

        const progress = course.lessons.map(lesson => ({
            lessonId: lesson._id,
            completed: false
        }));

        user.studentInfo.progress.push({ courseId, lessons: progress });

        await user.save();

        res.json({ message: 'Enrolled successfully', course });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ---------------- MARK LESSON COMPLETE ----------------
const markLessonComplete = async (req, res) => {
    try {
        const learnerId = req.user.userId;
        const { courseId, lessonId } = req.params;

        const user = await User.findById(learnerId);
        if (!user || user.role !== 'learner') return res.status(403).json({ message: 'Only learners can mark progress' });

        const courseProgress = user.studentInfo.progress.find(p => p.courseId.toString() === courseId);
        if (!courseProgress) return res.status(400).json({ message: 'Not enrolled in this course' });

        const lessonProgress = courseProgress.lessons.find(l => l.lessonId.toString() === lessonId);
        if (!lessonProgress) return res.status(404).json({ message: 'Lesson not found in progress' });

        lessonProgress.completed = true;

        // Check if all lessons completed
        const allCompleted = courseProgress.lessons.every(l => l.completed);
        let certificate = null;

        if (allCompleted) {
            // Issue certificate with serial hash
            const hash = crypto.createHash('sha256').update(learnerId + courseId + Date.now()).digest('hex');
            certificate = {
                courseId,
                issuedAt: new Date(),
                serial: hash
            };
            user.studentInfo.certificates = user.studentInfo.certificates || [];
            user.studentInfo.certificates.push(certificate);
        }

        await user.save();

        res.json({
            message: 'Lesson marked complete',
            allCompleted,
            certificate
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ---------------- GET COURSE PROGRESS ----------------
const getCourseProgress = async (req, res) => {
    try {
        const learnerId = req.user.userId;
        const { courseId } = req.params;

        const user = await User.findById(learnerId);
        if (!user || user.role !== 'learner') return res.status(403).json({ message: 'Only learners can access progress' });

        const courseProgress = user.studentInfo.progress.find(p => p.courseId.toString() === courseId);
        if (!courseProgress) return res.status(404).json({ message: 'Not enrolled in this course' });

        const completedCount = courseProgress.lessons.filter(l => l.completed).length;
        const total = courseProgress.lessons.length;
        const percent = total > 0 ? (completedCount / total) * 100 : 0;

        res.json({ courseId, progress: percent, lessons: courseProgress.lessons });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ---------------- GET CERTIFICATES ----------------
const getCertificates = async (req, res) => {
    try {
        const learnerId = req.user.userId;
        const user = await User.findById(learnerId);
        if (!user || user.role !== 'learner') return res.status(403).json({ message: 'Only learners can access certificates' });

        res.json({ certificates: user.studentInfo.certificates || [] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getEnrolledCourses,
    enrollCourse,
    markLessonComplete,
    getCourseProgress,
    getCertificates
};