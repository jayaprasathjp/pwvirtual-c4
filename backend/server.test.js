const request = require('supertest');
const app = require('./server');

// Mock the GoogleGenAI so we don't actually hit the API during tests
jest.mock('@google/genai', () => {
  return {
    GoogleGenAI: jest.fn().mockImplementation(() => {
      return {
        models: {
          generateContent: jest.fn().mockResolvedValue({
            text: 'Mocked AI response'
          })
        }
      };
    })
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
    expect(res.body.error).toEqual('Message is required');
  });

  it('should return a mocked reply from /api/chat', async () => {
    const res = await request(app).post('/api/chat').send({ message: 'Where is gate A?' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.reply).toEqual('Mocked AI response');
  });

  it('should return error if no crowdData is provided to /api/insights', async () => {
    const res = await request(app).post('/api/insights').send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual('Crowd data is required');
  });

  it('should return mocked recommendations from /api/insights', async () => {
    const res = await request(app).post('/api/insights').send({ crowdData: { gateA: 'crowded' } });
    expect(res.statusCode).toEqual(200);
    expect(res.body.recommendations).toEqual('Mocked AI response');
  });
});
