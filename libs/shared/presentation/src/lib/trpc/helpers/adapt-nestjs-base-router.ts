import type { Type } from '@nestjs/common';
import type { TRPCRouterRecord } from '@trpc/server';

import type { NestjsTrpcRouter } from './create-nestjs-trpc-router.js';
import { createTRPCRouter } from '../trpc.js';

export function adaptNestjsBaseRouter<
  R extends Record<string, NestjsTrpcRouter>,
>(routers: R) {
  return (modules: Record<keyof R, Type<any>>) => {
    const adaptedRouters: Record<keyof R, TRPCRouterRecord> = {} as Record<
      keyof R,
      TRPCRouterRecord
    >;

    for (const [key, router] of Object.entries(routers)) {
      (adaptedRouters as any)[key] = router(modules[key]);
    }

    return createTRPCRouter(adaptedRouters);
  };
}
