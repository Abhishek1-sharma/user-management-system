const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Image = require('../models/Image');
const auth = require('../middleware/auth');

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    /image\/(jpeg|png|webp)/.test(file.mimetype)
      ? cb(null, true)
      : cb(new Error('Only JPEG/PNG/WEBP allowed'));
  }
});

// Upload image
router.post('/upload', auth, upload.single('image'), async (req, res) => {
  try {
    const img = await Image.create({
      userId: req.user.id,
      filename: req.file.filename,
      path: req.file.path
    });
    res.status(201).json({ message: 'Image saved', image: img });
  } catch {
    res.status(500).json({ message: 'Upload failed' });
  }
});

// Get user's images
router.get('/my', auth, async (req, res) => {
  const images = await Image.find({ userId: req.user.id }).sort('-capturedAt');
  res.json(images);
});

// Admin: get all images
router.get('/all', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Admin' && req.user.role !== 'Supervisor')
      return res.status(403).json({ message: 'Forbidden' });
    
    const images = await Image.find()
      .populate('userId', 'username role')
      .sort('-capturedAt');
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;