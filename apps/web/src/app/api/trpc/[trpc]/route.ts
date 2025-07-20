import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

import { appRouter } from '@nx-ddd/api-infrastructure';
import { createTRPCContext } from '@nx-ddd/shared-infrastructure';

import { appContext } from '@/lib/app-context';
import { setCorsHeaders } from '@/lib/cors';
import type { NextRequest } from 'next/server';

export const OPTIONS = (req: Request) => {
  const response = new Response(null, {
    status: 204,
  });
  setCorsHeaders(req, response);
  return response;
};

const handler = async (req: NextRequest) => {
  const response = await fetchRequestHandler({
    endpoint: '/api/trpc',
    router: appRouter,
    req,
    createContext: () =>
      createTRPCContext({
        appContext: appContext,
        headers: req.headers,
      }),
    onError({ error, path }) {
      console.error(`>>> tRPC Error on '${path}'`, error);
    },
  });

  setCorsHeaders(req, response);
  return response;
};

export { handler as GET, handler as POST };
