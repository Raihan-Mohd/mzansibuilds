const request = require('supertest');
const app = require('./server'); 

describe('MzansiBuilds API Tests', () => {
  
  // Test: Does the home route work?
  it('should return a 200 OK status on the home route', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('Backend Engine is running');
  });

});