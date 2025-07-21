import { env } from '@/env.mjs';

export const setCorsHeaders = (req: Request, res: Response) => {
  // Set CORS headers for the response
  const origin = req.headers.get('origin');
  if (env.CORS_ALLOWED_ORIGINS?.length && origin) {
    const allowedOrigins = env.CORS_ALLOWED_ORIGINS;
    if (allowedOrigins.includes(origin)) {
      res.headers.set('Access-Control-Allow-Origin', origin);
    } else {
      const originaOrigin = allowedOrigins[0];
      if (originaOrigin) {
        res.headers.set('Access-Control-Allow-Origin', originaOrigin);
      }
    }
  }

  res.headers.set('Access-Control-Request-Method', '*');
  res.headers.set('Access-Control-Allow-Credentials', 'true');
  res.headers.set(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.headers.set(
    'Access-Control-Allow-Headers',
    'trpc-accept, content-type, x-access-token, x-csrf-token, authorization, x-trpc-source, x-trpc-accept, x-trpc-method, x-trpc-path, x-trpc-headers, x-trpc-query'
  );
};
