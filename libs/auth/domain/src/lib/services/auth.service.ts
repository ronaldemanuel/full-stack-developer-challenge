import type { Session } from '../interfaces/session.interface.js';

export namespace AuthService {
  export const TOKEN = 'AUTH';

  export type AuthHandler = (req: Request) => Promise<Response>;

  export interface Service {
    getSession(headers: Headers): Promise<Session | null>;
    getHandler(): AuthHandler;
    getFirstOrganizationSlug(headers: Headers): Promise<string | null>;
    getOrganizationInfo(
      headers: Headers,
      organizationSlug: string,
    ): Promise<{ name: string; slug: string } | null>;
  }
}
