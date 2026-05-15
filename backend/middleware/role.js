// Role-Based Access Control Middleware
// Accepts allowed roles as arguments
// Returns 403 Forbidden if user role is not in allowed list

module.exports = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return res.status(403).json({ message: 'Access denied: insufficient permissions' });
  next();
};