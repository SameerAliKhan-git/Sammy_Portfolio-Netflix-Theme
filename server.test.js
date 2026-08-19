const request = require('supertest');
const app = require('./server');

describe('API Endpoints', () => {
  // Test Main Page
  test('GET / should return 200', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toMatch(/text\/html/);
  });

  // Test Health Check
  test('GET /api/health should return healthy status', async () => {
    const response = await request(app).get('/api/health');
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('healthy');
    expect(response.body).toHaveProperty('uptime');
  });

  // Test 404
  test('GET /non-existent-route should return 404 page', async () => {
    const response = await request(app).get('/non-existent-route');
    expect(response.statusCode).toBe(404);
    expect(response.headers['content-type']).toMatch(/text\/html/);
  });

  // Test Contact Form Validation
  test('POST /api/contact with invalid email should return 400', async () => {
    const response = await request(app)
      .post('/api/contact')
      .send({
        name: 'Test User',
        email: 'invalid-email', // Invalid email
        message: 'This is a test message that is long enough.'
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test('POST /api/contact with short message should return 400', async () => {
    const response = await request(app)
      .post('/api/contact')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        message: 'Short' // Too short
      });
    expect(response.statusCode).toBe(400);
  });

  // Test Honeypot
  test('POST /api/contact with honeypot filled should return success but mark as spam', async () => {
    const response = await request(app)
      .post('/api/contact')
      .send({
        name: 'Spam Bot',
        email: 'spam@bot.com',
        message: 'This is a spam message.',
        website: 'http://spam.com' // Honeypot field
      });
    // Should return 200 to fool the bot, but not process it
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
