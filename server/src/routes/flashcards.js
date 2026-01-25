const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../config/database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get all decks for the user
router.get('/decks', authenticate, async (req, res) => {
  try {
    const decks = await prisma.flashcardDeck.findMany({
      where: {
        userId: req.user.id,
        deletedAt: null
      },
      include: {
        course: {
          select: { id: true, title: true }
        },
        _count: {
          select: { cards: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(decks);
  } catch (error) {
    console.error('Error fetching decks:', error);
    res.status(500).json({ error: 'Error fetching decks' });
  }
});

// Get public decks
router.get('/decks/public', authenticate, async (req, res) => {
  try {
    const decks = await prisma.flashcardDeck.findMany({
      where: {
        isPublic: true,
        deletedAt: null
      },
      include: {
        user: {
          select: { id: true, name: true }
        },
        course: {
          select: { id: true, title: true }
        },
        _count: {
          select: { cards: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(decks);
  } catch (error) {
    console.error('Error fetching public decks:', error);
    res.status(500).json({ error: 'Error fetching public decks' });
  }
});

// Create a new deck
router.post('/decks',
  authenticate,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').optional().trim(),
    body('courseId').optional().isString(),
    body('color').optional().isString(),
    body('isPublic').optional().isBoolean()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, description, courseId, color = '#3b82f6', isPublic = false } = req.body;

      const deck = await prisma.flashcardDeck.create({
        data: {
          title,
          description,
          courseId,
          color,
          isPublic,
          userId: req.user.id
        },
        include: {
          course: {
            select: { id: true, title: true }
          }
        }
      });

      res.status(201).json(deck);
    } catch (error) {
      console.error('Error creating deck:', error);
      res.status(500).json({ error: 'Error creating deck' });
    }
  }
);

// Get a specific deck with cards
router.get('/decks/:id', authenticate, async (req, res) => {
  try {
    const deck = await prisma.flashcardDeck.findFirst({
      where: {
        id: req.params.id,
        OR: [
          { userId: req.user.id },
          { isPublic: true }
        ],
        deletedAt: null
      },
      include: {
        course: {
          select: { id: true, title: true }
        },
        cards: {
          orderBy: { order: 'asc' }
        },
        user: {
          select: { id: true, name: true }
        }
      }
    });

    if (!deck) {
      return res.status(404).json({ error: 'Deck not found' });
    }

    res.json(deck);
  } catch (error) {
    console.error('Error fetching deck:', error);
    res.status(500).json({ error: 'Error fetching deck' });
  }
});

// Update a deck
router.put('/decks/:id',
  authenticate,
  [
    body('title').optional().trim().notEmpty(),
    body('description').optional().trim(),
    body('courseId').optional().isString(),
    body('color').optional().isString(),
    body('isPublic').optional().isBoolean()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const deck = await prisma.flashcardDeck.findFirst({
        where: {
          id: req.params.id,
          userId: req.user.id,
          deletedAt: null
        }
      });

      if (!deck) {
        return res.status(404).json({ error: 'Deck not found' });
      }

      const { title, description, courseId, color, isPublic } = req.body;

      const updatedDeck = await prisma.flashcardDeck.update({
        where: { id: req.params.id },
        data: {
          ...(title !== undefined && { title }),
          ...(description !== undefined && { description }),
          ...(courseId !== undefined && { courseId: courseId || null }),
          ...(color !== undefined && { color }),
          ...(isPublic !== undefined && { isPublic })
        },
        include: {
          course: {
            select: { id: true, title: true }
          }
        }
      });

      res.json(updatedDeck);
    } catch (error) {
      console.error('Error updating deck:', error);
      res.status(500).json({ error: 'Error updating deck' });
    }
  }
);

// Delete a deck (soft delete)
router.delete('/decks/:id', authenticate, async (req, res) => {
  try {
    const deck = await prisma.flashcardDeck.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
        deletedAt: null
      }
    });

    if (!deck) {
      return res.status(404).json({ error: 'Deck not found' });
    }

    await prisma.flashcardDeck.update({
      where: { id: req.params.id },
      data: { deletedAt: new Date() }
    });

    res.json({ message: 'Deck deleted successfully' });
  } catch (error) {
    console.error('Error deleting deck:', error);
    res.status(500).json({ error: 'Error deleting deck' });
  }
});

// Add a card to a deck
router.post('/decks/:deckId/cards',
  authenticate,
  [
    body('front').trim().notEmpty().withMessage('Front is required'),
    body('back').trim().notEmpty().withMessage('Back is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const deck = await prisma.flashcardDeck.findFirst({
        where: {
          id: req.params.deckId,
          userId: req.user.id,
          deletedAt: null
        }
      });

      if (!deck) {
        return res.status(404).json({ error: 'Deck not found' });
      }

      const { front, back } = req.body;

      // Get the highest order number
      const lastCard = await prisma.flashcard.findFirst({
        where: { deckId: req.params.deckId },
        orderBy: { order: 'desc' }
      });

      const order = lastCard ? lastCard.order + 1 : 0;

      const card = await prisma.flashcard.create({
        data: {
          front,
          back,
          order,
          deckId: req.params.deckId
        }
      });

      res.status(201).json(card);
    } catch (error) {
      console.error('Error creating card:', error);
      res.status(500).json({ error: 'Error creating card' });
    }
  }
);

// Update a card
router.put('/cards/:id',
  authenticate,
  [
    body('front').optional().trim().notEmpty(),
    body('back').optional().trim().notEmpty()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const card = await prisma.flashcard.findFirst({
        where: {
          id: req.params.id,
          deck: {
            userId: req.user.id,
            deletedAt: null
          }
        }
      });

      if (!card) {
        return res.status(404).json({ error: 'Card not found' });
      }

      const { front, back } = req.body;

      const updatedCard = await prisma.flashcard.update({
        where: { id: req.params.id },
        data: {
          ...(front !== undefined && { front }),
          ...(back !== undefined && { back })
        }
      });

      res.json(updatedCard);
    } catch (error) {
      console.error('Error updating card:', error);
      res.status(500).json({ error: 'Error updating card' });
    }
  }
);

// Delete a card
router.delete('/cards/:id', authenticate, async (req, res) => {
  try {
    const card = await prisma.flashcard.findFirst({
      where: {
        id: req.params.id,
        deck: {
          userId: req.user.id,
          deletedAt: null
        }
      }
    });

    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }

    await prisma.flashcard.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Card deleted successfully' });
  } catch (error) {
    console.error('Error deleting card:', error);
    res.status(500).json({ error: 'Error deleting card' });
  }
});

// Get cards for review (spaced repetition)
router.get('/review/:deckId', authenticate, async (req, res) => {
  try {
    const deck = await prisma.flashcardDeck.findFirst({
      where: {
        id: req.params.deckId,
        OR: [
          { userId: req.user.id },
          { isPublic: true }
        ],
        deletedAt: null
      }
    });

    if (!deck) {
      return res.status(404).json({ error: 'Deck not found' });
    }

    const now = new Date();

    // Get cards that are due for review
    const dueCards = await prisma.flashcard.findMany({
      where: {
        deckId: req.params.deckId,
        OR: [
          // Cards never reviewed
          {
            reviews: {
              none: {
                userId: req.user.id
              }
            }
          },
          // Cards due for review
          {
            reviews: {
              some: {
                userId: req.user.id,
                nextReview: {
                  lte: now
                }
              }
            }
          }
        ]
      },
      include: {
        reviews: {
          where: { userId: req.user.id },
          orderBy: { reviewedAt: 'desc' },
          take: 1
        }
      },
      orderBy: { order: 'asc' },
      take: 20 // Limit to 20 cards per session
    });

    res.json(dueCards);
  } catch (error) {
    console.error('Error fetching review cards:', error);
    res.status(500).json({ error: 'Error fetching review cards' });
  }
});

// Submit a review (spaced repetition algorithm)
router.post('/review/:cardId',
  authenticate,
  [
    body('quality').isInt({ min: 0, max: 5 }).withMessage('Quality must be between 0 and 5')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { quality } = req.body;

      // Get the card and check ownership
      const card = await prisma.flashcard.findFirst({
        where: {
          id: req.params.cardId,
          deck: {
            OR: [
              { userId: req.user.id },
              { isPublic: true }
            ],
            deletedAt: null
          }
        },
        include: {
          reviews: {
            where: { userId: req.user.id },
            orderBy: { reviewedAt: 'desc' },
            take: 1
          }
        }
      });

      if (!card) {
        return res.status(404).json({ error: 'Card not found' });
      }

      const lastReview = card.reviews[0];
      let easeFactor = lastReview ? lastReview.easeFactor : 2.5;
      let interval = lastReview ? lastReview.interval : 1;
      let repetitions = lastReview ? lastReview.repetitions : 0;

      // Spaced repetition algorithm (similar to Anki)
      if (quality >= 3) {
        // Correct response
        if (repetitions === 0) {
          interval = 1;
        } else if (repetitions === 1) {
          interval = 6;
        } else {
          interval = Math.round(interval * easeFactor);
        }
        repetitions += 1;
      } else {
        // Incorrect response
        repetitions = 0;
        interval = 1;
      }

      // Adjust ease factor
      easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

      // Calculate next review date
      const nextReview = new Date();
      nextReview.setDate(nextReview.getDate() + interval);

      // Upsert the review
      const review = await prisma.flashcardReview.upsert({
        where: {
          cardId_userId: {
            cardId: req.params.cardId,
            userId: req.user.id
          }
        },
        update: {
          easeFactor,
          interval,
          repetitions,
          nextReview,
          quality,
          reviewedAt: new Date()
        },
        create: {
          cardId: req.params.cardId,
          userId: req.user.id,
          easeFactor,
          interval,
          repetitions,
          nextReview,
          quality
        }
      });

      res.json(review);
    } catch (error) {
      console.error('Error submitting review:', error);
      res.status(500).json({ error: 'Error submitting review' });
    }
  }
);

module.exports = router;