const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || "YOUR_SECRET_KEY"; // Use .env in production

// Helper to generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        { userId: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// ---------------- SIGNUP ----------------
const signup = async (req, res) => {
    try {
        const { name, email, password, role, bio } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email already registered' });

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user object
        const newUser = new User({
            name,
            email,
            passwordHash,
            role
        });

        // Add creatorInfo if role is creator
        if (role === 'creator') {
            newUser.creatorInfo = {
                bio: bio || '',
                appliedAt: new Date(),
                approved: false
            };
        }

        // Add studentInfo if role is learner
        if (role === 'learner') {
            newUser.studentInfo = {
                enrolledCourses: [],
                progress: [],
                joinedAt: new Date()
            };
        }

        // Add adminInfo if role is admin
        if (role === 'admin') {
            newUser.adminInfo = {
                department: '',
                joinedAt: new Date()
            };
        }

        await newUser.save();

        // Generate JWT token
        const token = generateToken(newUser);

        res.status(201).json({
            message: 'Signup successful',
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ---------------- LOGIN ----------------
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid email or password' });

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) return res.status(400).json({ message: 'Invalid email or password' });

        // Generate JWT token
        const token = generateToken(user);

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { signup, login };
