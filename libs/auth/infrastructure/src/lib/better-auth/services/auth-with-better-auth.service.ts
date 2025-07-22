import { Inject, Injectable } from '@nestjs/common';

import type {
  ActiveOrganization,
  AuthService,
  Session,
} from '@nx-ddd/auth-domain';

import type { BetterAuth } from '../factories/better-auth.factory.js';
import { BETTER_AUTH_TOKEN } from '../factories/better-auth.factory.js';

@Injectable()
export class AuthWithBetterAuthService implements AuthService.Service {
  constructor(
    @Inject(BETTER_AUTH_TOKEN) private readonly betterAuth: BetterAuth,
  ) {}

  getHandler(): (req: Request) => Promise<Response> {
    return this.betterAuth.handler;
  }

  getSession(headers: Headers): Promise<Session | null> {
    return this.betterAuth.api.getSession({ headers });
  }

  getSessionsList(headers: Headers): Promise<Session['session'][]> {
    return this.betterAuth.api.listSessions({ headers });
  }

  getDeviceSessionsList(headers: Headers): Promise<Session[]> {
    return this.betterAuth.api.listDeviceSessions({ headers });
  }

  async getFirstOrganizationSlug(headers: Headers): Promise<string | null> {
    let activeOrganizationSlug: string | null = null;

    const organization = await this.betterAuth.api.getFullOrganization({
      headers,
    });

    activeOrganizationSlug = organization?.slug ?? null;

    if (!activeOrganizationSlug) {
      const firstOrganizationId = await this.betterAuth.api.listOrganizations({
        headers,
      });

      activeOrganizationSlug = firstOrganizationId?.[0]?.slug ?? null;

      await this.betterAuth.api.setActiveOrganization({
        body: {
          organizationId: firstOrganizationId?.[0]?.id,
        },
        headers,
      });
    }

    return activeOrganizationSlug;
  }

  async getFullOrganization(
    headers: Headers,
    query?: { organizationId?: string; organizationSlug?: string },
  ): Promise<ActiveOrganization | null> {
    const organization = await this.betterAuth.api.getFullOrganization({
      query,
      headers,
    });

    if (!organization) return null;

    return organization;
  }
}
