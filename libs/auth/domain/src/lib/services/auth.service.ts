import type { UserEntity } from '@nx-ddd/user-domain';

import type { ActiveOrganization } from '../schemas/active-organization.schema';
import type { AuthProviders } from '../schemas/auth-providers.schema';
import type { Session } from '../schemas/session.schema';

export namespace AuthService {
  export const TOKEN = 'AUTH';

  export type AuthHandler = (req: Request) => Promise<Response>;

  export interface Service {
    getHandler(): AuthHandler;

    getSession(headers: Headers): Promise<Session | null>;
    getSessionsList(headers: Headers): Promise<Session['session'][]>;
    getDeviceSessionsList(headers: Headers): Promise<Session[]>;

    getFirstOrganizationSlug(headers: Headers): Promise<string | null>;
    getFullOrganization(
      headers: Headers,
      query?: {
        organizationId?: string;
        organizationSlug?: string;
      },
    ): Promise<ActiveOrganization | null>;

    registerUser(
      user: UserEntity,
      provider: 'credentials',
      password: string,
      rememberMe?: boolean,
      headers?: Headers,
    ): Promise<UserEntity>;
    registerUser(
      user: UserEntity,
      provider: Exclude<AuthProviders, 'credentials'>,
      rememberMe?: boolean,
      headers?: Headers,
    ): Promise<UserEntity>;
  }
}
