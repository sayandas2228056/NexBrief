const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  summary: String,
  imageUrl: String,
  sourceUrl: {
    type: String,
    required: true,
    unique: true, // Avoid duplicate bookmarks per user
  },
  publishedAt: Date,
}, { timestamps: true });

// Create a compound index to ensure a user can only bookmark a URL once
bookmarkSchema.index({ user: 1, sourceUrl: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', bookmarkSchema); 