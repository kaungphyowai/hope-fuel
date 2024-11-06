import { POST } from './route';
require('dotenv').config({ path: '.env.local' });
import { createMocks } from 'node-mocks-http';

describe('API Test - Submit Payment Information', () => {
  it('should return success response with transactionId, screenShotId, and logId', async () => {
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
        {
          url: 'https://your-bucket-name.s3.amazonaws.com/path/to/image.png',
        },
      ],
    };

    const { req, res } = createMocks({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: requestData,
    });

    await POST(req, res);
    expect(res._getStatusCode()).toBe(200);

    const responseBody = res._getData();
    if (responseBody) {
      const parsedBody = JSON.parse(responseBody);
      expect(parsedBody).toHaveProperty('status', 'success');
      expect(parsedBody).toHaveProperty('transactionId');
      expect(parsedBody).toHaveProperty('screenShotId');
      expect(parsedBody).toHaveProperty('logId');
      expect(Array.isArray(parsedBody.screenShotId)).toBe(true);
    //  expect(parsedBody.screenShotId.length).toBeGreaterThan(0);
    } else {
      console.error('Response body is empty or undefined.');
    }
  });
});
