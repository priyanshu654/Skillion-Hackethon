const mongoose = require('mongoose');

const lessonProgressSchema = new mongoose.Schema({
  lessonId: { type: mongoose.Schema.Types.ObjectId, required: true }, // reference to Course.lessons._id
  completed: { type: Boolean, default: false }
}, { _id: false });

const courseProgressSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  lessons: [lessonProgressSchema],
  percentage: { type: Number, default: 0 } // calculated as completed lessons / total lessons
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['learner', 'creator', 'admin'], required: true },
  createdAt: { type: Date, default: Date.now },

  // Creator-specific fields
  creatorInfo: {
    bio: { type: String },
    appliedAt: { type: Date },
    approved: { type: Boolean, default: false },
    coursesCreated: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }] 
  },

  // Admin-specific fields
  adminInfo: {
    department: { type: String },
    joinedAt: { type: Date }
  },

  // Learner-specific fields
  studentInfo: {
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    progress: [courseProgressSchema],
    joinedAt: { type: Date }
  }
});

module.exports = mongoose.model('User', userSchema);
