const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// Input validation helper
const validateUserInput = (username, password, userRole) => {
  const errors = [];
  if (!username || username.trim().length < 3)
    errors.push('Username must be at least 3 characters');
  if (!password || password.length < 6)
    errors.push('Password must be at least 6 characters');
  if (!['Admin', 'Supervisor', 'Worker'].includes(userRole))
    errors.push('Invalid role — must be Admin, Supervisor, or Worker');
  return errors;
};

// Get all users (Admin only)
router.get('/', auth, role('Admin'), async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Create user (Admin only)
router.post('/', auth, role('Admin'), async (req, res) => {
  try {
    const { username, password, role: userRole } = req.body;

    // Validate input
    const errors = validateUserInput(username, password, userRole);
    if (errors.length > 0)
      return res.status(400).json({ message: errors[0] });

    // Check duplicate
    const exists = await User.findOne({ username: username.trim() });
    if (exists)
      return res.status(400).json({ message: 'Username already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      username: username.trim(),
      password: hashed,
      role: userRole
    });

    res.status(201).json({
      message: 'User created successfully',
      user: { ...user.toObject(), password: undefined }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update role (Admin only)
router.patch('/:id/role', auth, role('Admin'), async (req, res) => {
  try {
    const { role: newRole } = req.body;

    if (!['Admin', 'Supervisor', 'Worker'].includes(newRole))
      return res.status(400).json({ message: 'Invalid role' });

    // Prevent changing own role
    if (req.params.id === req.user.id)
      return res.status(400).json({ message: 'Cannot change your own role' });

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: newRole },
      { new: true, select: '-password' }
    );

    if (!user)
      return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Role updated successfully', user });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user (Admin only)
router.delete('/:id', auth, role('Admin'), async (req, res) => {
  try {
    // Prevent self deletion
    if (req.params.id === req.user.id)
      return res.status(400).json({ message: 'Cannot delete your own account' });

    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ message: 'User not found' });

    // Prevent deleting other admins
    if (user.role === 'Admin')
      return res.status(400).json({ message: 'Cannot delete an Admin account' });

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;