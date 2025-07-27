import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

import type { AppRouter } from './trpc/routers/api.router';
import { appRouter } from './trpc/routers/api.router';
import { NestFactory } from '@nestjs/core';
import { InternalDisabledLogger } from '@nx-ddd/shared-infrastructure';
import { AppModule } from './app.module';
/**
 * Inference helpers for input types
 * @example
 * type PostByIdInput = RouterInputs['post']['byId']
 *      ^? { id: number }
 **/
type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helpers for output types
 * @example
 * type AllPostsOutput = RouterOutputs['post']['all']
 *      ^? Post[]
 **/
type RouterOutputs = inferRouterOutputs<AppRouter>;

export { appRouter };
export type { AppRouter, RouterInputs, RouterOutputs };

export function getAppContext() {
  try {
    return NestFactory.createApplicationContext(AppModule, {
      logger: new InternalDisabledLogger(),
    });
  } catch (error) {
    console.error('Error creating application context:', error);
    return null;
  }
}
