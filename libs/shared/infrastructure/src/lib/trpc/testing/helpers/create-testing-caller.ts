import type { INestApplicationContext } from "@nestjs/common";

import { createCaller, createTRPCContext } from "../..";

export async function createTestingCaller(appContext: INestApplicationContext) {
  const headers = new Headers();
  headers.set("x-trpc-expo-auth", "Bearer " + "test");
  const context = await createTRPCContext({
    headers: headers,
    session: null,
    appContext: appContext,
  });
  return createCaller(context);
}

export type TestingCaller = Awaited<ReturnType<typeof createTestingCaller>>;
