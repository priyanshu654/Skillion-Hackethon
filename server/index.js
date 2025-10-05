require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const adminRoutes = require('./routes/adminRoutes');
const learnerRoutes = require('./routes/learnerRoutes');

const app = express();

// ----------------- Middleware -----------------
const corsOptions = {
  origin: [
    'http://localhost:3000',    // Create React App default
    'http://localhost:5173',    // Vite default
    'http://localhost:5174',    // Vite alternative
    'http://127.0.0.1:3000',   // Localhost IP
    'http://127.0.0.1:5173',
    'https://skillion-hackethon-r6st.vercel.app'
       // Vite IP
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // If you're using cookies/auth headers
};
app.use(cors(corsOptions));
app.use(express.json());

// ----------------- Routes -----------------
app.use('/api/auth', authRoutes);
app.use('/api/course', courseRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/learner', learnerRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('✅ MicroCourses LMS API is running...');
});

// ----------------- MongoDB Connection -----------------
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/microcourses';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));
