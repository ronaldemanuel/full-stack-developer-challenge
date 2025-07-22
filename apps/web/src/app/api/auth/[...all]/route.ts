import { getHandler } from '@/auth/server';
import { toNextJsHandler } from 'better-auth/next-js';

const handler = getHandler();

export const { GET, POST } = toNextJsHandler(handler);
