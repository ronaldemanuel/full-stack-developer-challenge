import { TRPCParamType } from '../enums/index.js';
import { createTrpcParamDecorator } from '../utils/param-utils.js';

export const Input = createTrpcParamDecorator(TRPCParamType.INPUT);
