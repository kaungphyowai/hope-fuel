import { createMocks } from 'node-mocks-http';
import { GET } from './route';
import db from '../../utilites/db';

jest.mock('../../utilites/db');

describe('API Test - Check Existed Agent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
     afterEach(async () => {
       if (db.end) await db.end();
     });

  it('should return 200 and agent data if agent exists', async () => {
    // Mocking database response to simulate an existing agent
    db.mockResolvedValue([
      {
        AgentExists: 1,
        AgentID: 2,
        AWSID: 'AWS124',
        UserRoleID: 2,
        UserRole: 'Admin',
      },
    ]);

    const { req, res } = createMocks({
      method: 'GET',
      url: 'http://localhost:3000/api/checkAgent?awsId=AWS124',
    });

    await GET(req, res);

    // Check status code
    expect(res._getStatusCode()).toBe(200);

    // Parse and verify response body
    const responseBody = JSON.parse(res._getData());
    expect(responseBody).toEqual({
      message: 'User exists',
      code: 1,
      user: {
        AgentExists: 1,
        AgentID: 2,
        AWSID: 'AWS124',
        UserRoleID: 2,
        UserRole: 'Admin',
      },
    });
  });

  it('should return 404 if agent does not exist', async () => {
    db.mockResolvedValue([]); // Simulate no agent found

    const { req, res } = createMocks({
      method: 'GET',
      url: 'http://localhost:3000/api/checkAgent?awsId=AWS123', // Non-existent AWS ID
    });

    await GET(req, res);

    expect(res._getStatusCode()).toBe(404);
    const responseBody = JSON.parse(res._getData());
    expect(responseBody).toEqual({ message: 'User does not exist', code: 0 });
  });

  it('should return 400 if awsId is missing', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      url: '/api/checkAgent',
    });

    await GET(req, res);

    expect(res._getStatusCode()).toBe(400);
    const responseBody = JSON.parse(res._getData());
    expect(responseBody).toEqual({ error: 'Missing awsId query parameter' });
  });

  it('should return 500 on database error', async () => {
    db.mockRejectedValue(new Error('Database connection error'));

    const { req, res } = createMocks({
      method: 'GET',
      url: 'http://localhost:3000/api/checkAgent?awsId=AWS124',
    });

    await GET(req, res);

    expect(res._getStatusCode()).toBe(500);
    const responseBody = JSON.parse(res._getData());
    expect(responseBody).toEqual({ error: 'Cannot load existing agentUser' });
  });
});
