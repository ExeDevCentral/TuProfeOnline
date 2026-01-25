require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const logger = require('./utils/logger');
const cache = require('./utils/cache');

const app = express();
const PORT = process.env.PORT || 3001;

// Security Middleware
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Rate limit exceeded', { ip: req.ip, url: req.url });
    res.status(429).json({ error: 'Too many requests' });
  }
});
app.use(limiter);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const classRoutes = require('./routes/classes');
const courseRoutes = require('./routes/courses');
const flashcardRoutes = require('./routes/flashcards');

app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/flashcards', flashcardRoutes);

// Health check with caching
app.get('/api/health', async (req, res) => {
  const cacheKey = 'health-check';
  const cached = await cache.get(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  const healthData = {
    status: 'ok',
    message: 'EduStream API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime()
  };

  await cache.set(cacheKey, healthData, 60); // Cache for 1 minute
  res.json(healthData);
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  });

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  logger.warn('404 Not Found', { url: req.url, method: req.method });
  res.status(404).json({ error: 'Not Found' });
});

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    logger.info('Server started', { port: PORT });
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
    console.log(`📡 Health check: http://0.0.0.0:${PORT}/api/health`);
    console.log(`🔐 Auth routes: http://0.0.0.0:${PORT}/api/auth`);
    console.log(`📚 Class routes: http://0.0.0.0:${PORT}/api/classes`);
  });
}

module.exports = app;
