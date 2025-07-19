import type { INestApplicationContext, Type } from '@nestjs/common';
import type { ContextId } from '@nestjs/core';
import { ExternalContextCreator } from '@nestjs/core';

import { PARAM_ARGS_METADATA } from '../constants/index.js';
import { TRPCParamType } from '../enums/index.js';

export function createNestjsTrpcHandler<
  T extends Record<string, any>,
  Key extends keyof T = keyof T
>(
  moduleContext: INestApplicationContext,
  resolvedController: T,
  method: Key,
  contextId: ContextId,
  moduleCls: Type<any>
) {
  const externalContextCreator = moduleContext.get(ExternalContextCreator);
  const handler = externalContextCreator.create(
    resolvedController,
    resolvedController[method],
    method as string,
    PARAM_ARGS_METADATA,
    {
      exchangeKeyForValue(type, data, args) {
        if (type === TRPCParamType.INPUT) {
          return args[0];
        } else if (type === TRPCParamType.CTX) {
          return args[1];
        } else if (type === TRPCParamType.SIGNAL) {
          return args[2];
        }
        return {
          ctx: args[1],
          input: args[0],
          signal: args[2],
        };
      },
    },
    contextId,
    moduleCls.name,
    {
      interceptors: true,
    },
    'rpc'
  ) as unknown as T[Key];
  return handler;
}
