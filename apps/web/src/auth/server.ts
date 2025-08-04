import { cache } from 'react';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { appContext } from '@/lib/app-context';

import { AuthService } from '@nx-ddd/auth-domain';

import 'server-only';

import { setCorsHeaders } from '@/lib/cors';
import { toNextJsHandler } from 'better-auth/next-js';

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

  static getHandler = cache<
    () => {
      GET: (request: Request) => Promise<Response>;
      POST: (request: Request) => Promise<Response>;
      OPTIONS: (request: Request) => Promise<Response>;
    }
  >(() => {
    if (!this.service)
      return {
        GET: async () => NextResponse.error(),
        POST: async () => NextResponse.error(),
        OPTIONS: async () => NextResponse.json({}),
      };

    const { GET, POST } = toNextJsHandler(this.service.getHandler());
    return {
      GET: async (request: Request) => {
        const response = await GET(request);
        setCorsHeaders(request, response);
        return response;
      },
      POST: async (request: Request) => {
        const response = await POST(request);
        setCorsHeaders(request, response);
        return response;
      },
      OPTIONS: async (request: Request) => {
        const response = NextResponse.json({});
        setCorsHeaders(request, response);
        return response;
      },
    };
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
