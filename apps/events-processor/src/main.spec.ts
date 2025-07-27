import { describe, it } from 'vitest';

import { lambdaHandler } from './main';

describe('Events Processor', () => {
  it('should run tests', () => {
    const mockdata = {
      pattern: 'app-queue/send-email',
      event: {
        ctx: {
          userId: 'user-id-123',
        },
        data: {
          id: 'sendVerificationEmail',
          data: {
            to: 'john@doe.com',
            data: {
              url: 'https://example.com/verify',
              user: {
                name: 'John Doe',
                email: 'john@doe.com',
              },
              token: '1234',
            },
          },
          identifier: 'app-queue/send-email',
        },
        eventName: 'sendVerificationEmail',
      },
    };

    // This is a placeholder test to ensure the test suite runs
    lambdaHandler(
      {
        Records: [
          {
            body: JSON.stringify(mockdata),
          },
        ],
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {} as any, // Mocking the context
      () => {
        // Do nothing
      },
    );
  });
});
