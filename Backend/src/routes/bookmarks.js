const express = require('express');
const router = express.Router();
const Bookmark = require('../models/Bookmark');
const { authenticateToken } = require('../middleware/auth');

// Protect all bookmark routes
router.use(authenticateToken);

// GET all bookmarks for the logged-in user
router.get('/', async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.json(bookmarks);
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    res.status(500).json({ error: 'Failed to fetch bookmarks' });
  }
});

// POST a new bookmark
router.post('/', async (req, res) => {
  const { title, summary, imageUrl, sourceUrl, publishedAt } = req.body;
  const userId = req.user.userId;

  try {
    const newBookmark = new Bookmark({
      user: userId,
      title,
      summary,
      imageUrl,
      sourceUrl,
      publishedAt,
    });
    await newBookmark.save();
    res.status(201).json(newBookmark);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'This article is already bookmarked.' });
    }
    console.error('Error creating bookmark:', error);
    res.status(500).json({ error: 'Failed to save bookmark' });
  }
});

// DELETE a bookmark
router.delete('/:id', async (req, res) => {
  try {
    const bookmark = await Bookmark.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }
    res.status(200).json({ message: 'Bookmark removed' });
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    res.status(500).json({ error: 'Failed to delete bookmark' });
  }
});

module.exports = router; 