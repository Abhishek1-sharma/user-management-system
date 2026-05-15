const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filename: { type: String, required: true },
  path: { type: String, required: true },
  capturedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Image', ImageSchema);