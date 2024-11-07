import { POST } from './route';
import { NextResponse } from 'next/server';
import { createMocks } from 'node-mocks-http';

import db from '../../utilites/db';
import { after } from 'node:test';

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((body, options) => ({ ...body, ...options })),
  },
}));

describe('API Test - Submit Payment Information', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

 afterAll(async () => { 
    if (db.end) await db.end();
  });

  it('should return success response with transaction details', async () => {
    const requestData = {
      customerName: 'abc',
      customerEmail: 'abc@gmail.com',
      agentId: 1,
      supportRegionId: 2,
      manyChatId: '1',
      contactLink: 'https://www.facebook.com',
      amount: 50000,
      month: 2,
      note: 'This is me',
      walletId: 2,
      screenShot: [
        { url: 'https://your-bucket-name.s3.amazonaws.com/path/to/image.png' },
      ],
    };

    const { req } = createMocks({
      method: 'POST',
      body: requestData,
    });

    const response = await POST(req);

    expect(NextResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'success',
        transactionId: expect.any(Number),
        screenShotId: expect.arrayContaining([
          expect.objectContaining({
            [Symbol.async_id_symbol]: expect.any(Number),
            [Symbol.trigger_async_id_symbol]: expect.any(Number),
          }),
        ]),
        logId: expect.any(Number),
      }),
      expect.objectContaining({
        status: 200,
      }),
    );

   
    expect(response.status).toBe(200); 
  });
});
