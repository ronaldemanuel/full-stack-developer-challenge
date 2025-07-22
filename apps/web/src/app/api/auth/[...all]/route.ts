import { ServerAuthService } from '@/auth/server';
import { toNextJsHandler } from 'better-auth/next-js';

const handler = ServerAuthService.getHandler();

export const { GET, POST } = toNextJsHandler(handler);
