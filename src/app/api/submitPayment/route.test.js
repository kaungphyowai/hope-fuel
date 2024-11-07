import { POST } from './route';
import { NextResponse } from 'next/server';
import { createMocks } from 'node-mocks-http';

import db from '../../utilites/db';

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
    const processedResponse = {
      ...response,
      screenShotId: response.screenShotId.map((item) => ({
        // Only include non-symbol properties
        ...Object.fromEntries(
          Object.entries(item).filter(([key]) => typeof key !== 'symbol'),
        ),
      })),
    };

   expect(processedResponse).toEqual(
     expect.objectContaining({
       logId: expect.any(Number),
       screenShotId: expect.arrayContaining([]), // Expect empty array if URLs are invalid
       status: 'success',
       transactionId: expect.any(Number),
     }),
     expect.objectContaining({
       status: 200,
     }),
   );

   
    expect(response.status).toBe("success"); 
  });
});
