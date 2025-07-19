// import { authRouter } from './router/auth';
// import { postRouter } from './router/post';
import { createTRPCRouter } from '@nx-ddd/shared-infrastructure';

export const appRouter = createTRPCRouter({});

// export type definition of API
export type AppRouter = typeof appRouter;
