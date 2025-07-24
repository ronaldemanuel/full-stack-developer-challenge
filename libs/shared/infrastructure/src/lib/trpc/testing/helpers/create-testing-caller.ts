import type { INestApplicationContext } from '@nestjs/common';

import {
  createCallerFactory,
  createTRPCContext,
} from '@nx-ddd/shared-presentation';

export async function createTestingCaller<
  T extends Parameters<typeof createCallerFactory>[0],
>(router: T, appContext: INestApplicationContext) {
  const headers = new Headers();
  headers.set('x-trpc-expo-auth', 'Bearer ' + 'test');
  const context = await createTRPCContext({
    headers: headers,
    appContext: appContext,
  });
  const createCaller = createCallerFactory(router);
  return createCaller(context);
}

export type TestingCaller = Awaited<ReturnType<typeof createTestingCaller>>;
