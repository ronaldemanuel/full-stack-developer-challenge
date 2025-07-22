import { cache } from 'react';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { appContext } from '@/lib/app-context';

import { AuthService } from '@nx-ddd/auth-domain';

import 'server-only';

export class ServerAuthService {
  private static _service: AuthService.Service | null;

  private constructor() {
    throw new Error('Static class');
  }

  private static get service() {
    if (this._service === undefined) {
      this._service =
        appContext?.get<AuthService.Service>(AuthService.TOKEN) ?? null;
    }

    return this._service;
  }

  static getHandler = cache<() => AuthService.AuthHandler>(() => {
    if (!this.service) return async () => NextResponse.error();

    return this.service.getHandler();
  });

  static getSession = cache(async () => {
    if (!this.service) return null;

    return this.service.getSession(await headers());
  });

  static getSessionsList = cache(async () => {
    if (!this.service) return [];

    return this.service.getSessionsList(await headers());
  });

  static getDeviceSessionsList = cache(async () => {
    if (!this.service) return [];

    return this.service.getDeviceSessionsList(await headers());
  });

  static getFirstOrganizationSlug = cache(async () => {
    if (!this.service) return null;

    return this.service.getFirstOrganizationSlug(await headers());
  });

  static getFullOrganization = cache(
    async (query?: { organizationId?: string; organizationSlug?: string }) => {
      if (!this.service) return null;

      return this.service.getFullOrganization(await headers(), query);
    },
  );
}
