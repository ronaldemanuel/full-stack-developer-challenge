import type { PipeTransform, Type } from '@nestjs/common';
import { isNil, isString } from '@nestjs/common/utils/shared.utils.js';

import 'reflect-metadata';

import type { TRPCParamType } from '../enums/index.js';
import { PARAM_ARGS_METADATA } from '../constants/index.js';

export type ParamData = object | string | number;
export type ParamsMetadata = Record<
  number,
  {
    index: number;
    data?: ParamData;
  }
>;

function assignMetadata(
  args: ParamsMetadata,
  paramtype: TRPCParamType,
  index: number,
  data?: ParamData,
  ...pipes: (Type<PipeTransform> | PipeTransform)[]
) {
  return {
    ...args,
    [`${paramtype}:${index}`]: {
      index,
      data,
      pipes,
    },
  };
}

export const createTrpcParamDecorator = (paramtype: TRPCParamType) => {
  return (data?: ParamData): ParameterDecorator =>
    (target, key, index) => {
      const args =
        Reflect.getMetadata(
          PARAM_ARGS_METADATA,
          target.constructor,
          key as string
        ) || {};
      Reflect.defineMetadata(
        PARAM_ARGS_METADATA,
        assignMetadata(args, paramtype, index, data),
        target.constructor,
        key as string
      );
    };
};

export const addPipesMetadata = (
  paramtype: TRPCParamType,
  data: any,
  pipes: (Type<PipeTransform> | PipeTransform)[],
  target: Record<string, any>,
  key: string | symbol,
  index: number
) => {
  const args =
    Reflect.getMetadata(PARAM_ARGS_METADATA, target.constructor, key) || {};
  const hasParamData = isNil(data) || isString(data);
  const paramData = hasParamData ? data : undefined;
  const paramPipes = hasParamData ? pipes : [data, ...pipes];

  Reflect.defineMetadata(
    PARAM_ARGS_METADATA,
    assignMetadata(args, paramtype, index, paramData!, ...paramPipes),
    target.constructor,
    key
  );
};

export const createTrpcPipesParamDecorator =
  (paramtype: TRPCParamType) =>
  (
    data?: any,
    ...pipes: (Type<PipeTransform> | PipeTransform)[]
  ): ParameterDecorator =>
  (target, key, index) => {
    addPipesMetadata(paramtype, data, pipes, target, key as string, index);
  };
