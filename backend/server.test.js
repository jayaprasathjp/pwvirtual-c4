const request = require('supertest');
const app = require('./server');

// Mock the AI Service
jest.mock('./services/aiService', () => {
  return {
    generateFanResponse: jest.fn().mockResolvedValue('Mocked AI response'),
    generateStaffInsights: jest.fn().mockResolvedValue('Mocked AI response')
  };
});

describe('Backend API Tests', () => {
  it('should return ok for health check', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('ok');
  });

  it('should return error if no message is provided to /api/chat', async () => {
    const res = await request(app).post('/api/chat').send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body.errors[0].msg).toEqual('Invalid value');
  });

  it('should return a mocked reply from /api/chat', async () => {
    const res = await request(app).post('/api/chat').send({ message: 'Where is gate A?', language: 'Spanish' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.reply).toEqual('Mocked AI response');
    expect(res.body.cached).toBe(false);
    
    // Test cache hit
    const resCached = await request(app).post('/api/chat').send({ message: 'Where is gate A?', language: 'Spanish' });
    expect(resCached.statusCode).toEqual(200);
    expect(resCached.body.cached).toBe(true);
  });

  it('should return error if no crowdData is provided to /api/insights', async () => {
    const res = await request(app).post('/api/insights').send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body.errors[0].msg).toEqual('Invalid value');
  });

  it('should return mocked recommendations from /api/insights', async () => {
    const res = await request(app).post('/api/insights').send({ crowdData: { gateA: 'crowded' } });
    expect(res.statusCode).toEqual(200);
    expect(res.body.recommendations).toEqual('Mocked AI response');
    expect(res.body.cached).toBe(false);

    // Test cache hit
    const resCached = await request(app).post('/api/insights').send({ crowdData: { gateA: 'crowded' } });
    expect(resCached.statusCode).toEqual(200);
    expect(resCached.body.cached).toBe(true);
  });
});
