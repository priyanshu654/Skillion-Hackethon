const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String }, // Markdown, HTML, video URL
  orderIndex: { type: Number, required: true },
  transcript: { type: String },
  createdAt: { type: Date, default: Date.now }
}, { _id: true });

const courseSchema = new mongoose.Schema({
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  image:{ type: String},
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  publishedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lessons: [lessonSchema]
});

module.exports = mongoose.model('Course', courseSchema);
