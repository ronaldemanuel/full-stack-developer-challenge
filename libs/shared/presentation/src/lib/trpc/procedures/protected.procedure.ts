import { TRPCError } from '@trpc/server';

import { UserEntity } from '@nx-ddd/user-domain';

import { timingMiddleware } from '../middlewares/timing.middleware.js';
import { t } from '../trpc.js';

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure
  .use(timingMiddleware)
  .use(({ ctx, next }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    const userEntity = new UserEntity(
      {
        ...ctx.session.user,
      },
      ctx.session.user.id,
    );
    return next({
      ctx: {
        // infers the `session` as non-nullable
        session: { ...ctx.session, user: userEntity },
      },
    });
  });
