import type { INestApplicationContext, Type } from '@nestjs/common';
import type { ProcedureResolverOptions } from '@trpc/server/unstable-core-do-not-import';
import { ContextIdFactory } from '@nestjs/core';

import { createNestjsTrpcHandler } from './create-nestjs-trpc-handler';

export interface NestResolver<T extends Type<Record<string, any>>> {
  adaptMethod: <
    Key extends keyof InstanceType<T>,
    TContext extends Record<string, unknown>,
    TMeta,
    TContextOverrides,
    TInputOut
  >(
    method: Key
  ) => (
    opts: ProcedureResolverOptions<
      TContext,
      TMeta,
      TContextOverrides,
      TInputOut
    >
  ) => Promise<Awaited<ReturnType<InstanceType<T>[Key]>>>;
}

export function adaptNestjsControllerToTrpcResolver<
  T extends Type<Record<string, any>>
>(moduleCls: Type, controller: T): NestResolver<T> {
  const adaptMethod = <
    Key extends keyof InstanceType<T>,
    TContext extends Record<string, unknown>,
    TMeta,
    TContextOverrides,
    TInputOut
  >(
    method: Key
  ) => {
    const resolver = async (
      opts: ProcedureResolverOptions<
        TContext,
        TMeta,
        TContextOverrides,
        TInputOut
      >
    ): Promise<Awaited<ReturnType<InstanceType<T>[Key]>>> => {
      const ctx = opts.ctx as any;
      const appContext: INestApplicationContext = ctx.appContext;
      const moduleContext = appContext.select(moduleCls);
      const contextId = ContextIdFactory.create();
      moduleContext.registerRequestByContextId(ctx, contextId);
      const resolvedController: InstanceType<T> = await moduleContext.resolve(
        controller,
        contextId
      );
      const handler = createNestjsTrpcHandler<InstanceType<T>, Key>(
        moduleContext,
        resolvedController,
        method,
        contextId,
        moduleCls
      );
      const methodResult = handler(
        opts.input,
        {
          ...opts.ctx,
          appContext,
        },
        opts.signal
      );
      return await methodResult;
    };
    return resolver;
  };
  return { adaptMethod };
}
