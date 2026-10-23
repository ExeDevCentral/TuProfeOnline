const express = require('express');
const router = express.Router();
const prisma = require('../config/database');

// GET /api/courses
router.get('/', async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      where: { deletedAt: null },
      include: { teacher: { select: { id: true, name: true, email: true } } }
    });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
