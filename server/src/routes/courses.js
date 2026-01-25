const express = require('express');
const { param, body, validationResult } = require('express-validator');
const prisma = require('../config/database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const validateCuid = (fieldName) => [
    param(fieldName).isString().trim().isLength({ min: 20, max: 30 }).withMessage('Invalid ID format'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Get all published courses
router.get('/', authenticate, async (req, res) => {
    try {
        const courses = await prisma.course.findMany({
            where: { isPublished: true },
            include: {
                teacher: {
                    select: { name: true, avatar: true }
                },
                _count: {
                    select: { sections: true, enrollments: true }
                }
            }
        });
        res.json(courses);
    } catch (error) {
        console.error('Get courses error:', error);
        res.status(500).json({ error: 'Error fetching courses' });
    }
});

// Get My Courses (Enrolled)
router.get('/my-courses', authenticate, async (req, res) => {
    try {
        const enrollments = await prisma.courseEnrollment.findMany({
            where: { studentId: req.userId },
            include: {
                course: {
                    include: {
                        teacher: { select: { name: true } }
                    }
                }
            }
        });
        // Transform structure to match frontend expectation if needed, or return as is
        // Frontend likely expects a list of courses with progress
        const courses = enrollments.map(e => ({
            ...e.course,
            progress: e.progress,
            isCompleted: e.isCompleted
        }));

        res.json(courses);
    } catch (error) {
        console.error('Get my-courses error:', error);
        res.status(500).json({ error: 'Error fetching my courses' });
    }
});

// Get Course Details (with checking enrollment)
router.get('/:id', authenticate, validateCuid('id'), async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const course = await prisma.course.findUnique({
            where: { id },
            include: {
                teacher: {
                    select: { name: true, avatar: true, email: true }
                },
                sections: {
                    orderBy: { order: 'asc' },
                    include: {
                        lessons: {
                            orderBy: { order: 'asc' },
                            select: {
                                id: true,
                                title: true,
                                duration: true,
                                isFree: true,
                                videoUrl: true
                            }
                        }
                    }
                }
            }
        });

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Check enrollment
        const enrollment = await prisma.courseEnrollment.findUnique({
            where: {
                studentId_courseId: {
                    studentId: userId,
                    courseId: id
                }
            }
        });

        const isEnrolled = !!enrollment;
        const isOwner = course.teacherId === userId;
        const isAdmin = req.userRole === 'ADMIN';

        // Security: Hide video URLs if not authorized
        if (!isEnrolled && !isOwner && !isAdmin) {
            course.sections.forEach(section => {
                section.lessons.forEach(lesson => {
                    if (!lesson.isFree) {
                        lesson.videoUrl = null;
                    }
                });
            });
        }

        res.json({ ...course, isEnrolled });
    } catch (error) {
        console.error('Get course details error:', error);
        res.status(500).json({ error: 'Error fetching course details' });
    }
});

// Enroll in a course
router.post('/:id/enroll', authenticate, validateCuid('id'), async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        // Check if course exists first
        const course = await prisma.course.findUnique({ where: { id } });
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        const existing = await prisma.courseEnrollment.findUnique({
            where: { studentId_courseId: { studentId: userId, courseId: id } }
        });

        if (existing) {
            return res.status(400).json({ error: 'Already enrolled' });
        }

        await prisma.courseEnrollment.create({
            data: {
                studentId: userId,
                courseId: id
            }
        });

        res.json({ message: 'Successfully enrolled' });
    } catch (error) {
        console.error('Enrollment error:', error);
        res.status(500).json({ error: 'Error enrolling in course' });
    }
});

module.exports = router;
