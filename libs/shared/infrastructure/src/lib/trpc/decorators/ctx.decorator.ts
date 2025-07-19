import { TRPCParamType } from '../enums/index.js';
import { createTrpcParamDecorator } from '../utils/param-utils.js';

export const Ctx = createTrpcParamDecorator(TRPCParamType.CTX);
