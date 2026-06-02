const express = require('express');
const Achievement = require('../models/Achievement');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/achievements
router.get('/', async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({ order: 1 });
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/achievements
router.post('/', auth, async (req, res) => {
  try {
    const achievement = await Achievement.create(req.body);
    res.status(201).json(achievement);
  } catch (error) {
    res.status(400).json({ message: 'Bad request', error: error.message });
  }
});

// PUT /api/achievements/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const achievement = await Achievement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }
    res.json(achievement);
  } catch (error) {
    res.status(400).json({ message: 'Bad request', error: error.message });
  }
});

// DELETE /api/achievements/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const achievement = await Achievement.findByIdAndDelete(req.params.id);
    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }
    res.json({ message: 'Achievement deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
