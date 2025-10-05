const Course = require('../models/Course');
const User = require('../models/User');

// ---------------- CREATE COURSE ----------------
const createCourse = async (req, res) => {
    try {
        const { title, description, image } = req.body;
        const creatorId = req.user.userId;

        const user = await User.findById(creatorId);
        if (!user || user.role !== 'creator' || user.creatorInfo.approved !== true) {
            return res.status(403).json({ 
                success: false,
                message: 'Only approved creators can create courses' 
            });
        }

        const course = new Course({
            title,
            description,
            image,
            creatorId,
            status: 'draft',
            lessons: []
        });

        await course.save();

        // Add course to creatorInfo
        user.creatorInfo.coursesCreated.push(course._id);
        await user.save();

        res.status(201).json({ 
            success: true,
            message: 'Course created successfully', 
            course: {
                _id: course._id,
                title: course.title,
                description: course.description,
                status: course.status
            }
        });
    } catch (err) {
        res.status(500).json({ 
            success: false,
            error: err.message 
        });
    }
};

// ---------------- ADD LESSON ----------------
const addLesson = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, content, orderIndex, transcript } = req.body;
        const creatorId = req.user.userId;

        const user = await User.findById(creatorId);
        if (!user || user.role !== 'creator') {
            return res.status(403).json({ 
                success: false,
                message: 'Not a creator' 
            });
        }

        if (!user.creatorInfo.coursesCreated.includes(courseId)) {
            return res.status(403).json({ 
                success: false,
                message: 'You can only add lessons to your own courses' 
            });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ 
                success: false,
                message: 'Course not found' 
            });
        }

        if (course.lessons.some(l => l.orderIndex === orderIndex)) {
            return res.status(400).json({ 
                success: false,
                message: 'Lesson orderIndex already exists' 
            });
        }

        course.lessons.push({ title, content, orderIndex, transcript });
        course.updatedAt = new Date();
        await course.save();

        // Get the added lesson with its ID
        const addedLesson = course.lessons[course.lessons.length - 1];

        res.status(201).json({ 
            success: true,
            message: 'Lesson added successfully', 
            lesson: addedLesson,
            totalLessons: course.lessons.length
        });
    } catch (err) {
        res.status(500).json({ 
            success: false,
            error: err.message 
        });
    }
};

// ---------------- UPDATE COURSE ----------------
const updateCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, description, image, status } = req.body;
        const creatorId = req.user.userId;

        const user = await User.findById(creatorId);
        if (!user || !user.creatorInfo.coursesCreated.includes(courseId)) {
            return res.status(403).json({ 
                success: false,
                message: 'Cannot update this course' 
            });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ 
                success: false,
                message: 'Course not found' 
            });
        }

        course.title = title || course.title;
        course.description = description || course.description;
        course.image = image || course.image;
        course.status = status || course.status;
        course.updatedAt = new Date();

        await course.save();

        res.json({ 
            success: true,
            message: 'Course updated successfully', 
            course: {
                _id: course._id,
                title: course.title,
                description: course.description,
                status: course.status
            }
        });
    } catch (err) {
        res.status(500).json({ 
            success: false,
            error: err.message 
        });
    }
};

// ---------------- UPDATE LESSON ----------------
const updateLesson = async (req, res) => {
    try {
        const { courseId, lessonId } = req.params;
        const { title, content, orderIndex, transcript } = req.body;
        const creatorId = req.user.userId;

        const user = await User.findById(creatorId);
        if (!user || !user.creatorInfo.coursesCreated.includes(courseId)) {
            return res.status(403).json({ 
                success: false,
                message: 'Cannot update lesson in this course' 
            });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ 
                success: false,
                message: 'Course not found' 
            });
        }

        const lesson = course.lessons.id(lessonId);
        if (!lesson) {
            return res.status(404).json({ 
                success: false,
                message: 'Lesson not found' 
            });
        }

        // If orderIndex changes, ensure uniqueness
        if (orderIndex && orderIndex !== lesson.orderIndex) {
            if (course.lessons.some(l => l._id.toString() !== lessonId && l.orderIndex === orderIndex)) {
                return res.status(400).json({ 
                    success: false,
                    message: 'orderIndex already exists' 
                });
            }
            lesson.orderIndex = orderIndex;
        }

        lesson.title = title || lesson.title;
        lesson.content = content || lesson.content;
        lesson.transcript = transcript || lesson.transcript;
        course.updatedAt = new Date();

        await course.save();

        res.json({ 
            success: true,
            message: 'Lesson updated successfully', 
            lesson: lesson
        });
    } catch (err) {
        res.status(500).json({ 
            success: false,
            error: err.message 
        });
    }
};

// ---------------- DELETE COURSE ----------------
const deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const creatorId = req.user.userId;

        const user = await User.findById(creatorId);
        if (!user || !user.creatorInfo.coursesCreated.includes(courseId)) {
            return res.status(403).json({ 
                success: false,
                message: 'Cannot delete this course' 
            });
        }

        await Course.findByIdAndDelete(courseId);

        // Remove from creatorInfo.coursesCreated
        user.creatorInfo.coursesCreated = user.creatorInfo.coursesCreated.filter(id => id.toString() !== courseId);
        await user.save();

        res.json({ 
            success: true,
            message: 'Course deleted successfully' 
        });
    } catch (err) {
        res.status(500).json({ 
            success: false,
            error: err.message 
        });
    }
};

// ---------------- DELETE LESSON ----------------
const deleteLesson = async (req, res) => {
    try {
        const { courseId, lessonId } = req.params;
        const creatorId = req.user.userId;

        const user = await User.findById(creatorId);
        if (!user || !user.creatorInfo.coursesCreated.includes(courseId)) {
            return res.status(403).json({ 
                success: false,
                message: 'Cannot delete lesson in this course' 
            });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ 
                success: false,
                message: 'Course not found' 
            });
        }

        const lesson = course.lessons.id(lessonId);
        if (!lesson) {
            return res.status(404).json({ 
                success: false,
                message: 'Lesson not found' 
            });
        }

        const deletedOrderIndex = lesson.orderIndex;
        lesson.remove();

        // Adjust orderIndex for remaining lessons
        course.lessons.forEach(l => {
            if (l.orderIndex > deletedOrderIndex) {
                l.orderIndex -= 1;
            }
        });

        course.updatedAt = new Date();
        await course.save();

        res.json({ 
            success: true,
            message: 'Lesson deleted successfully', 
            totalLessons: course.lessons.length
        });
    } catch (err) {
        res.status(500).json({ 
            success: false,
            error: err.message 
        });
    }
};

// ---------------- GET INSTRUCTOR'S COURSES ----------------
const getMyCourses = async (req, res) => {
    try {
        const creatorId = req.user.userId;

        // Fetch courses created by this user
        const courses = await Course.find({ creatorId })
            .select('title description image status lessons createdAt updatedAt publishedAt')
            .sort({ createdAt: -1 });
        
        // Format response with course statistics
        const formattedCourses = courses.map(course => ({
            _id: course._id,
            title: course.title,
            description: course.description,
            image: course.image,
            status: course.status,
            totalLessons: course.lessons.length,
            createdAt: course.createdAt,
            updatedAt: course.updatedAt,
            publishedAt: course.publishedAt
        }));

        res.json({
            success: true,
            count: courses.length,
            courses: formattedCourses
        });

    } catch (err) {
        console.error('Error fetching instructor courses:', err);
        res.status(500).json({ 
            success: false,
            error: err.message 
        });
    }
};

// ---------------- GET INSTRUCTOR'S COURSE DETAILS ----------------
const getMyCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.params;
        //console.log(req.user);
        
        const creatorId = req.user.userId; // FIXED: Changed from req.user.id to req.user.userId

        // Verify user owns this course
        const course = await Course.findOne({ _id: courseId, creatorId });

        if (!course) {
            return res.status(404).json({ 
                success: false,
                message: 'Course not found or access denied' 
            });
        }

        res.json({
            success: true,
            course: {
                _id: course._id,
                title: course.title,
                description: course.description,
                image: course.image,
                status: course.status,
                lessons: course.lessons.map(lesson => ({
                    _id: lesson._id,
                    title: lesson.title,
                    content: lesson.content,
                    orderIndex: lesson.orderIndex,
                    transcript: lesson.transcript,
                    createdAt: lesson.createdAt
                })),
                createdAt: course.createdAt,
                updatedAt: course.updatedAt,
                publishedAt: course.publishedAt
            }
        });

    } catch (err) {
        console.error('Error fetching course details:', err);
        res.status(500).json({ 
            success: false,
            error: err.message 
        });
    }
};

// ---------------- GET COURSE DETAILS FOR ADMIN PREVIEW ----------------
const getCourseDetailsForAdmin = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user.userId;
        const userRole = req.user.role;

        console.log('Admin preview request:', { courseId, userId, userRole });

        // Allow admins to access any course
        let course;
        if (userRole === 'admin') {
            course = await Course.findById(courseId);
            console.log('Admin accessing course:', course ? 'Found' : 'Not found');
        } else {
            // Regular users can only access their own courses
            course = await Course.findOne({ _id: courseId, creatorId: userId });
            console.log('User accessing own course:', course ? 'Found' : 'Not found');
        }

        if (!course) {
            console.log('Course not found for user');
            return res.status(404).json({ 
                success: false,
                message: 'Course not found or access denied' 
            });
        }

        res.json({
            success: true,
            course: {
                _id: course._id,
                title: course.title,
                description: course.description,
                image: course.image,
                status: course.status,
                lessons: course.lessons.map(lesson => ({
                    _id: lesson._id,
                    title: lesson.title,
                    content: lesson.content,
                    orderIndex: lesson.orderIndex,
                    transcript: lesson.transcript,
                    createdAt: lesson.createdAt
                })),
                createdAt: course.createdAt,
                updatedAt: course.updatedAt,
                publishedAt: course.publishedAt
            }
        });

    } catch (err) {
        console.error('Error fetching course details:', err);
        res.status(500).json({ 
            success: false,
            error: err.message 
        });
    }
};

// ---------------- GET ALL PUBLISHED COURSES ----------------
const getPublishedCourses = async (req, res) => {
    try {
        const courses = await Course.find({ status: 'published' })
            .populate('creatorId', 'name')
            .select('title description image status lessons createdAt updatedAt publishedAt');

        res.json({ 
            success: true,
            courses: courses.map(course => ({
                _id: course._id,
                title: course.title,
                description: course.description,
                image: course.image,
                status: course.status,
                creatorName: course.creatorId?.name || 'Unknown',
                lessonsCount: course.lessons.length,
                createdAt: course.createdAt,
                updatedAt: course.updatedAt,
                publishedAt: course.publishedAt
            }))
        });
    } catch (err) {
        res.status(500).json({ 
            success: false,
            error: err.message 
        });
    }
};

module.exports = {
    createCourse,
    addLesson,
    updateCourse,
    updateLesson,
    deleteCourse,
    deleteLesson,
    getMyCourses,
    getMyCourseDetails,
    getCourseDetailsForAdmin,
    getPublishedCourses  // Add the new function
};