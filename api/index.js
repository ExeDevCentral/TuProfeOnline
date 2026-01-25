// Vercel Serverless Function - Express API
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'EduStream API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Example API routes (add your routes here)
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Export for Vercel Serverless Function
module.exports = app;
