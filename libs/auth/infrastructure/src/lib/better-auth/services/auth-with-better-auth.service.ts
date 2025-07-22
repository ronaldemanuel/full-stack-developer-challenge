import { Inject, Injectable } from '@nestjs/common';

import type { AuthService, Session } from '@nx-ddd/auth-domain';
import { UserEntity } from '@nx-ddd/user-domain';

import type { BetterAuth } from '../factories/better-auth.factory.js';
import { BETTER_AUTH_TOKEN } from '../factories/better-auth.factory.js';

@Injectable()
export class AuthWithBetterAuthService implements AuthService.Service {
  constructor(
    @Inject(BETTER_AUTH_TOKEN) private readonly betterAuth: BetterAuth,
  ) {}
  async getSession(headers: Headers): Promise<Session | null> {
    const session = await this.betterAuth.api.getSession({
      headers,
    });
    if (!session) {
      return null;
    }
    if (!session.session) {
      return null;
    }

    const user = new UserEntity(session.user, session.user.id);

    return {
      expiresAt: session.session.expiresAt,
      token: session.session.token,
      user,
    };
  }
  getHandler(): (req: Request) => Promise<Response> {
    return this.betterAuth.handler;
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
    }

    return activeOrganizationSlug;
  }

  async getOrganizationInfo(
    headers: Headers,
    organizationSlug: string,
  ): Promise<{ name: string; slug: string } | null> {
    const organization = await this.betterAuth.api.getFullOrganization({
      query: { organizationSlug },
      headers,
    });

    if (!organization) return null;

    return { name: organization.name, slug: organization.slug };
  }
}
