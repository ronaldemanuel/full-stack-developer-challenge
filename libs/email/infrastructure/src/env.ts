import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod/v4';

export function emailEnv() {
  return createEnv({
    server: {
      EMAIL_FROM: z.email(),
    },
    experimental__runtimeEnv: {},
    skipValidation:
      !!process.env.CI || process.env.npm_lifecycle_event === 'lint',
  });
}
