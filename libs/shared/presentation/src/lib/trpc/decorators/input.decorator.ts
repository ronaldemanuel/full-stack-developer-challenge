import { TRPCParamType } from '../enums/index';
import { createTrpcParamDecorator } from '../utils/param-utils';

export const Input = createTrpcParamDecorator(TRPCParamType.INPUT);
