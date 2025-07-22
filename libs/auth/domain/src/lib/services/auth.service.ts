import type { ActiveOrganization } from '../schemas/active-organization.schema.js';
import type { Session } from '../schemas/session.schema.js';

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
  }
}
