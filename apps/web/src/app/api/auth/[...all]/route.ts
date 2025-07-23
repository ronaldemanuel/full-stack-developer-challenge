import { ServerAuthService } from '@/auth/server';

const handler = ServerAuthService.getHandler();

export const { GET, POST, OPTIONS } = handler;
