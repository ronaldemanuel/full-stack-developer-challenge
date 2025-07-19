import type { Type } from '@nestjs/common';
import type { TRPCRouterRecord } from '@trpc/server';

import type { NestResolver } from './adapt-nestjs-controller-method.js';
import { adaptNestjsControllerToTrpcResolver } from './adapt-nestjs-controller-method.js';

export function createNestjsTrpcRouter<
  T extends Type<Record<string, any>>,
  R extends TRPCRouterRecord
>(controller: T, builder: (resolver: NestResolver<T>, Module: Type<any>) => R) {
  return <M>(Module: Type<M>) => {
    const resolver = adaptNestjsControllerToTrpcResolver(Module, controller);
    return builder(resolver, Module);
  };
}
