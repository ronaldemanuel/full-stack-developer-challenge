/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1)
 * 2. You want to create a new middleware or type of procedure (see Part 3)
 *
 * tl;dr - this is where all the tRPC server stuff is created and plugged in.
 * The pieces you will need to use are documented accordingly near the end
 */
import type { INestApplicationContext } from '@nestjs/common';
import type { Unwrap } from '@trpc/server/unstable-core-do-not-import';
import type { OpenApiMeta } from 'trpc-to-openapi';
import { Logger } from '@nestjs/common';
import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';

import { AuthService } from '@nx-ddd/auth-domain';
import { UserEntity } from '@nx-ddd/user-domain';

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = async (opts: {
  headers: Headers;
  appContext: INestApplicationContext | null;
}) => {
  const logger = new Logger('TRPC');
  const { appContext } = opts;
  if (!appContext) {
    logger.error(
      'No application context available. Ensure the app context is initialized.',
    );
    throw new Error('Application context is not initialized.');
  }

  const session = await appContext
    .get<AuthService.Service>(AuthService.TOKEN)
    .getSession(opts.headers);

  const source = opts.headers.get('x-trpc-source') ?? 'unknown';
  logger.log('>>> tRPC Request from ' + source + ' by ' + session?.user.email);
  return {
    session: session
      ? {
          ...session,
          user: new UserEntity(
            {
              ...session.user,
            },
            session.user.id,
          ),
        }
      : null,
    appContext: appContext,
    logger,
  };
};

export type ContextType = Unwrap<typeof createTRPCContext>;

/**
 * 2. INITIALIZATION
 *
 * This is where the trpc api is initialized, connecting the context and
 * transformer
 */
export const t = initTRPC
  .meta<OpenApiMeta>()
  .context<typeof createTRPCContext>()
  .create({
    transformer: superjson,
    errorFormatter: ({ shape, error }) => ({
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }),
    sse: {
      maxDurationMs: 5 * 60 * 1_000, // 5 minutes
      ping: {
        enabled: true,
        intervalMs: 3_000,
      },
      client: {
        reconnectAfterInactivityMs: 5_000,
      },
    },
  });

/**
 * Create a server-side caller
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these
 * a lot in the /src/server/api/routers folder
 */

/**
 * This is how you create new routers and subrouters in your tRPC API
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;
