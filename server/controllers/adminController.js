const Course = require('../models/Course');
const User=require('../models/User');
// ---------------- APPROVE COURSE ----------------
const approveCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { action } = req.body; // 'approve' or 'reject'

        if (!['approve', 'reject'].includes(action)) {
            return res.status(400).json({ message: 'Invalid action. Use "approve" or "reject"' });
        }

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        if (action === 'approve') {
            course.status = 'published';
            course.publishedAt = new Date();
        } else if (action === 'reject') {
            course.status = 'draft';
            course.publishedAt = null;
        }

        await course.save();

        res.json({ message: `Course ${action}d successfully`, course });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ---------------- GET PENDING COURSES ----------------
const getPendingCourses = async (req, res) => {
    try {
        const courses = await Course.find({ status: 'draft' }).populate('creatorId', 'name email');
        res.json({ courses });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all pending creator users
// Get pending creator users
const getPendingUsers = async (req, res) => {
    try {
        const users = await User.find({ 
            role: 'creator',
            'creatorInfo.approved': false 
        }).select('name email role creatorInfo createdAt');

        console.log("user",users);
        

        res.json({ 
            success: true,
            count: users.length,
            users: users.map(user => ({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                bio: user.creatorInfo?.bio,
                appliedAt: user.creatorInfo?.appliedAt,
                approved: user.creatorInfo?.approved,
                createdAt: user.createdAt
            }))
        });
    } catch (err) {
        res.status(500).json({ 
            success: false,
            error: err.message 
        });
    }
};

// Approve a creator user
const approveUser = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        if (user.role !== 'creator') {
            return res.status(400).json({ 
                success: false,
                message: 'User is not a creator' 
            });
        }

        if (user.creatorInfo?.approved) {
            return res.status(400).json({ 
                success: false,
                message: 'User is already approved' 
            });
        }

        // Update creator approval status
        user.creatorInfo.approved = true;
        await user.save();

        res.json({ 
            success: true,
            message: 'Creator approved successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                approved: user.creatorInfo.approved
            }
        });
    } catch (err) {
        res.status(500).json({ 
            success: false,
            error: err.message 
        });
    }
};

// Reject a creator user (delete or mark as rejected)
const rejectUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { reason } = req.body;
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        if (user.role !== 'creator') {
            return res.status(400).json({ 
                success: false,
                message: 'User is not a creator' 
            });
        }

        // Option 1: Delete the user
        await User.findByIdAndDelete(userId);

        // Option 2: Or mark as rejected (if you want to keep record)
        // user.creatorInfo.rejected = true;
        // user.creatorInfo.rejectionReason = reason;
        // await user.save();

        res.json({ 
            success: true,
            message: 'Creator application rejected successfully'
        });
    } catch (err) {
        res.status(500).json({ 
            success: false,
            error: err.message 
        });
    }
};

module.exports = { approveCourse, getPendingCourses,approveUser,rejectUser,getPendingUsers };
