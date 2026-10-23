const express = require('express');
const router = express.Router();
const prisma = require('../config/database');

// GET /api/flashcards
router.get('/', async (req, res) => {
  try {
    const decks = await prisma.flashcardDeck.findMany({
      where: { deletedAt: null },
      include: { cards: true }
    });
    res.json(decks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
