import { appContext } from '@/lib/app-context';
import { AuthService } from '@nx-ddd/auth-domain';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { cache } from 'react';
import 'server-only';

export const getSession = cache(async () =>
  appContext
    ?.get<AuthService.Service>(AuthService.TOKEN)
    .getSession(await headers())
);

export const getHandler = cache(() => {
  const authService = appContext?.get<AuthService.Service>(AuthService.TOKEN);
  if (!authService) {
    return async () => {
      NextResponse.json({});
    };
  }

  return authService.getHandler();
});
