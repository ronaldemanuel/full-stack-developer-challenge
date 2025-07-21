import { Inject, Injectable } from '@nestjs/common';
import type { AuthService, Session } from '@nx-ddd/auth-domain';
import {
  BETTER_AUTH_TOKEN,
  type BetterAuth,
} from '../factories/better-auth.factory.js';
import { UserEntity } from '@nx-ddd/user-domain';

@Injectable()
export class AuthWithBetterAuthService implements AuthService.Service {
  constructor(
    @Inject(BETTER_AUTH_TOKEN) private readonly betterAuth: BetterAuth
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
}
