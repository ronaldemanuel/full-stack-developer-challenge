import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod/v4';

export const env = createEnv({
  server: {
    AUTH_SECRET:
      process.env.NODE_ENV === 'production'
        ? z.string().min(1)
        : z.string().min(1).optional(),
    AUTH_GOOGLE_ID: z.string().min(1).optional(),
    AUTH_GOOGLE_SECRET: z.string().min(1).optional(),
    BASE_URL: z.string().min(1),
    NODE_ENV: z.enum(['development', 'production', 'test']).optional(),
    CORS_ALLOWED_ORIGINS: z
      .string()
      .optional()
      .default(
        'http://localhost:3000, http://localhost:8082, http://localhost:8081, expo://',
      )
      .transform((val) => val.split(',').map((val) => val.trim()))
      .pipe(z.array(z.string())),
  },
  experimental__runtimeEnv: {},
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === 'lint',
});
