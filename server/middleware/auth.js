const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Secret key (keep same as used during signup/login)
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Middleware factory — can restrict roles if needed
const auth = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
        //console.log("header",authHeader);
        
      // Check for Bearer token
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
      }

      const token = authHeader.split(' ')[1];

      // Verify token
      //console.log("token",token);
      
      const decoded = jwt.verify(token, JWT_SECRET);

      // Attach user info to request
      req.user = decoded;

      // Optional role-based restriction
      if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Access denied: insufficient role' });
      }

      // Optionally, fetch fresh user from DB (to ensure still valid)
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      next();
    } catch (err) {
      console.error('Auth middleware error:', err);
      res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
};

module.exports = auth;
