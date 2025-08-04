import type { INestApplicationContext } from '@nestjs/common';
import type { TRPCRouterRecord } from '@trpc/server';

import {
  createCallerFactory,
  createTRPCContext,
  createTRPCRouter,
} from '@nx-ddd/shared-presentation';

export async function createTestingCaller<T extends TRPCRouterRecord>(
  records: T,
  appContext: INestApplicationContext,
) {
  const router = createTRPCRouter(records);
  const headers = new Headers();
  headers.set('x-trpc-expo-auth', 'Bearer ' + 'test');
  const context = await createTRPCContext({
    headers: headers,
    appContext: appContext,
  });

  const createCaller = createCallerFactory(router);
  return createCaller(context);
}

export type TestingCaller<T extends TRPCRouterRecord> = Awaited<
  ReturnType<typeof createTestingCaller<T>>
>;
