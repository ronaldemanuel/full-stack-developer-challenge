// import { authRouter } from './router/auth';
// import { postRouter } from './router/post';
import { itemRouter } from '@nx-ddd/item-infrastructure';
import { postsRouter } from '@nx-ddd/post-infrastructure';
import { createTRPCRouter } from '@nx-ddd/shared-presentation';

export const appRouter = createTRPCRouter({
  post: postsRouter,
  item: itemRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
