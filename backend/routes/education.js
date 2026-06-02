const express = require('express');
const Education = require('../models/Education');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/education
router.get('/', async (req, res) => {
  try {
    const education = await Education.find().sort({ year: -1 });
    res.json(education);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/education
router.post('/', auth, async (req, res) => {
  try {
    const education = await Education.create(req.body);
    res.status(201).json(education);
  } catch (error) {
    res.status(400).json({ message: 'Bad request', error: error.message });
  }
});

// PUT /api/education/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const education = await Education.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!education) {
      return res.status(404).json({ message: 'Education not found' });
    }
    res.json(education);
  } catch (error) {
    res.status(400).json({ message: 'Bad request', error: error.message });
  }
});

// DELETE /api/education/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const education = await Education.findByIdAndDelete(req.params.id);
    if (!education) {
      return res.status(404).json({ message: 'Education not found' });
    }
    res.json({ message: 'Education deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
