import { z } from 'zod/v4';
import { createEnv } from '@t3-oss/env-nextjs';

export const env = createEnv({
  server: {
    EMAIL_FROM: z.email(),
    EMAIL_PROVIDER: z.enum(['aws', 'smtp', 'local']).default('smtp'),
    EMAIL_SMTP_HOST: z.string().optional(),
    EMAIL_SMTP_PORT: z.coerce.number().optional(),
    EMAIL_SMTP_USER: z.string().optional(),
    EMAIL_SMTP_PASS: z.string().optional(),
  },
  experimental__runtimeEnv: {},
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === 'lint',
});
