// routes/hospitalRoutes.js
const express = require('express');
const Hospital = require('../models/hospitalSchema');
const authMiddleware = require('../controllers/authMiddleware')

const router = express.Router();

// 👇 PUBLIC: Get all active hospitals (no auth needed)
router.get('/', async (req, res) => {
  try {
    const hospitals = await Hospital.find({ isActive: true })
      .select('name address contact specialties rating totalReviews')
      .sort({ name: 1 });
    
    res.json({ success: true, count: hospitals.length, data: hospitals });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 👇 PUBLIC: Get single hospital by ID
router.get('/:id', async (req, res) => {
  try {
    const hospital = await Hospital.findOne({ 
      _id: req.params.id, 
      isActive: true 
    });

    if (!hospital) {
      return res.status(404).json({ success: false, message: 'Hospital not found' });
    }

    res.json({ success: true, data: hospital });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 👇 ADMIN ONLY: Create new hospital
router.post('/', async (req, res) => {
  try {
    const hospital = new Hospital(req.body);
    await hospital.save();
    res.status(201).json({ success: true, data: hospital });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: err.message });
    }
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 👇 ADMIN ONLY: Update hospital
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!hospital) {
      return res.status(404).json({ success: false, message: 'Hospital not found' });
    }

    res.json({ success: true, data: hospital });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: err.message });
    }
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 👇 ADMIN ONLY: Soft delete hospital (set isActive = false)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) {
      return res.status(404).json({ success: false, message: 'Hospital not found' });
    }

    hospital.isActive = false;
    await hospital.save();

    res.json({ success: true, message: 'Hospital deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;