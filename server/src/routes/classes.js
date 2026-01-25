const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../config/database');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all classes (filtered by user role)
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    const userRole = req.userRole;

    let classes;

    if (userRole === 'TEACHER') {
      classes = await prisma.class.findMany({
        where: { teacherId: userId },
        include: {
          teacher: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          },
          enrollments: {
            include: {
              student: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          }
        },
        orderBy: { startTime: 'asc' }
      });
    } else if (userRole === 'STUDENT') {
      classes = await prisma.class.findMany({
        where: {
          enrollments: {
            some: {
              studentId: userId
            }
          }
        },
        include: {
          teacher: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          },
          enrollments: {
            where: {
              studentId: userId
            }
          }
        },
        orderBy: { startTime: 'asc' }
      });
    } else {
      // Admin sees all
      classes = await prisma.class.findMany({
        include: {
          teacher: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          },
          enrollments: {
            include: {
              student: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          }
        },
        orderBy: { startTime: 'asc' }
      });
    }

    res.json(classes);
  } catch (error) {
    console.error('Get classes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get class by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const userRole = req.userRole;

    const classItem = await prisma.class.findUnique({
      where: { id },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        enrollments: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    if (!classItem) {
      return res.status(404).json({ error: 'Class not found' });
    }

    // Check permissions
    if (userRole === 'STUDENT') {
      const isEnrolled = classItem.enrollments.some(e => e.studentId === userId);
      if (!isEnrolled) {
        return res.status(403).json({ error: 'Not enrolled in this class' });
      }
    } else if (userRole === 'TEACHER' && classItem.teacherId !== userId) {
      return res.status(403).json({ error: 'Not your class' });
    }

    res.json(classItem);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create class (Teacher/Admin only)
router.post('/',
  authenticate,
  requireRole('TEACHER', 'ADMIN'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('startTime').isISO8601().withMessage('Valid start time is required'),
    body('endTime').isISO8601().withMessage('Valid end time is required'),
    body('description').optional(),
    body('meetUrl').optional().isURL().withMessage('Invalid URL'),
    body('room').optional()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, description, startTime, endTime, meetUrl, room } = req.body;
      const teacherId = req.userRole === 'ADMIN' && req.body.teacherId ? req.body.teacherId : req.userId;

      const classItem = await prisma.class.create({
        data: {
          title,
          description,
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          meetUrl,
          room,
          teacherId,
          status: 'SCHEDULED'
        },
        include: {
          teacher: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          }
        }
      });

      res.status(201).json(classItem);
    } catch (error) {
      console.error('Create class error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Update class status
router.patch('/:id/status', authenticate, requireRole('TEACHER', 'ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['SCHEDULED', 'LIVE', 'COMPLETED', 'CANCELLED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const classItem = await prisma.class.findUnique({
      where: { id }
    });

    if (!classItem) {
      return res.status(404).json({ error: 'Class not found' });
    }

    if (req.userRole !== 'ADMIN' && classItem.teacherId !== req.userId) {
      return res.status(403).json({ error: 'Not your class' });
    }

    const updated = await prisma.class.update({
      where: { id },
      data: { status }
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Enroll in class (Student)
router.post('/:id/enroll', authenticate, requireRole('STUDENT'), async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const classItem = await prisma.class.findUnique({
      where: { id }
    });

    if (!classItem) {
      return res.status(404).json({ error: 'Class not found' });
    }

    // Check if already enrolled
    const existing = await prisma.classEnrollment.findUnique({
      where: {
        classId_studentId: {
          classId: id,
          studentId: userId
        }
      }
    });

    if (existing) {
      return res.status(400).json({ error: 'Already enrolled' });
    }

    const enrollment = await prisma.classEnrollment.create({
      data: {
        classId: id,
        studentId: userId
      },
      include: {
        class: {
          include: {
            teacher: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
