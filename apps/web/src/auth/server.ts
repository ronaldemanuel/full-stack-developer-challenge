import { cache } from 'react';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { appContext } from '@/lib/app-context';

import { AuthService } from '@nx-ddd/auth-domain';

import 'server-only';

export const getSession = cache(async () =>
  appContext
    ?.get<AuthService.Service>(AuthService.TOKEN)
    .getSession(await headers()),
);

export const getHandler = cache<() => AuthService.AuthHandler>(() => {
  const authService = appContext?.get<AuthService.Service>(AuthService.TOKEN);
  if (!authService) {
    return async () => NextResponse.error();
  }

  return authService.getHandler();
});

export const getFirstOrganizationSlug = cache(async () => {
  const authService = appContext?.get<AuthService.Service>(AuthService.TOKEN);
  if (!authService) {
    return null;
  }

  return authService.getFirstOrganizationSlug(await headers());
});

export const getOrganizationInfo = cache(async (organizationSlug: string) => {
  const authService = appContext?.get<AuthService.Service>(AuthService.TOKEN);
  if (!authService) {
    return null;
  }

  return authService
    .getOrganizationInfo(await headers(), organizationSlug)
    .catch(() => null);
});
