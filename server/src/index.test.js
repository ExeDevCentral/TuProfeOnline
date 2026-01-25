const request = require('supertest');
const app = require('./index'); // Assuming we export app from index.js

describe('API Health Check', () => {
  test('GET /api/health returns 200', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });
});