// import { authRouter } from './router/auth';
// import { postRouter } from './router/post';
import { postsRouter } from '@nx-ddd/post-infrastructure';
import { createTRPCRouter } from '@nx-ddd/shared-infrastructure';

export const appRouter = createTRPCRouter({
  post: postsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
