import { GET } from './route';
import { NextResponse } from 'next/server';
import { createMocks } from 'node-mocks-http';
import db from '../../utilites/db';

// Mock db and NextResponse
jest.mock('../../utilites/db', () => jest.fn());
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((body, options) => ({ ...body, ...options })),
  },
}));

describe('API Test - Check Existed Agent', () => {
  beforeAll(() => {
    process.env.NODE_ENV = 'test';
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  //success case
  it('should return success response when user exists', async () => {
    const awsId = 'AWS124';
    const dbResponse = [
      {
        AgentExists: 1,
        AgentID: 2,
        AWSID: awsId,
        UserRoleID: 2,
        UserRole: 'Admin',
      },
    ];

    // Mock db response to simulate user existence
    db.mockResolvedValue(dbResponse);

    const { req } = createMocks({
      method: 'GET',
      url: `/api/checkAgent?awsId=${awsId}`,
    });

    const response = await GET(req);

    expect(NextResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'User exists',
        code: 1,
        user: dbResponse[0],
      }),
      expect.objectContaining({ status: 200 }),
    );
  });

  //failure case
  it('should return 404 when user does not exist', async () => {
    const awsId = 'AWS125';

    // Mock db response to simulate user not found
    db.mockResolvedValue([{ AgentExists: 0 }]);

    const { req } = createMocks({
      method: 'GET',
      url: `/api/checkAgent?awsId=${awsId}`,
    });

    const response = await GET(req);

    expect(NextResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'User does not exist',
        code: 0,
      }),
      expect.objectContaining({ status: 404 }),
    );
  });

  //failure case
  it('should return 400 when awsId is missing', async () => {
    const { req } = createMocks({
      method: 'GET',
      url: '/api/checkAgent', // No awsId query parameter
    });

    const response = await GET(req);

    expect(NextResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Missing awsId query parameter',
      }),
      expect.objectContaining({ status: 400 }),
    );
  });

  //failure case
  it('should return 500 when there is a database error', async () => {
    const awsId = 'AWS126';

    // Mock db response to throw an error
    db.mockRejectedValue(new Error('Database connection error'));

    const { req } = createMocks({
      method: 'GET',
      url: `/api/checkAgent?awsId=${awsId}`,
    });

    const response = await GET(req);

    expect(NextResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Cannot load existing agentUser',
      }),
      expect.objectContaining({ status: 500 }),
    );
  });
});
