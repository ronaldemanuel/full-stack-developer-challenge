import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import type {
  ActiveOrganization,
  AuthProviders,
  AuthService,
  Session,
} from '@nx-ddd/auth-domain';
import type { User } from '@nx-ddd/user-domain';
import { UserEntity } from '@nx-ddd/user-domain';

import type { BetterAuth } from '../factories/better-auth.factory';
import { BETTER_AUTH_TOKEN } from '../factories/better-auth.factory';

@Injectable()
export class AuthWithBetterAuthService implements AuthService.Service {
  constructor(
    @Inject(BETTER_AUTH_TOKEN) private readonly betterAuth: BetterAuth,
  ) {}
  registerUser(
    user: UserEntity,
    provider: Omit<AuthProviders, 'credentials'>,
    rememberMe?: boolean,
  ): Promise<UserEntity>;
  registerUser(
    user: UserEntity,
    provider: 'credentials',
    password: string,
    rememberMe?: boolean,
  ): Promise<UserEntity>;
  async registerUser(
    user: UserEntity,
    provider: AuthProviders,
    passwordOrRememberMe?: string | boolean,
    rememberMeOrHeaders?: boolean | Headers,
    headers?: Headers,
  ): Promise<UserEntity> {
    if (provider === 'credentials') {
      const password = passwordOrRememberMe as string;
      const rememberMe = rememberMeOrHeaders as boolean;
      const data = await this.betterAuth.api.signUpEmail({
        body: {
          email: user.email,
          name: user.name,
          password,
          rememberMe: rememberMe ?? false,
        },
        headers,
        returnHeaders: true,
      });
      return new UserEntity(data.response.user as User, data.response.user.id);
    } else {
      // const data = await this.betterAuth.api.signInSocial({
      //   body: {
      //     provider,
      //     disableRedirect: true,
      //     requestSignUp: true,
      //     loginHint: user.email,
      //   },
      //   headers: rememberMeOrHeaders as Headers,
      // });
      // if (data.url === undefined) {
      //   return new UserEntity(data.user, data.user.id);
      // } else {
      //   throw new BadRequestException(
      //     `Redirect is not allowed for provider ${provider}. Use credentials instead.`,
      //   );
      // }
      throw new BadRequestException(
        `Register is not allowed for provider ${provider}. Use credentials instead.`,
      );
    }
  }

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
    return this.betterAuth.api.listDeviceSessions({ headers }) as Promise<
      Session[]
    >;
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
