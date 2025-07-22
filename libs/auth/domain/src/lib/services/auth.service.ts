import type { Session } from '../interfaces/session.interface.js';

export namespace AuthService {
  export const TOKEN = 'AUTH';

  export type AuthHandler = (req: Request) => Promise<Response>;

  export interface Service {
    getSession(headers: Headers): Promise<Session | null>;
    getHandler(): AuthHandler;
  }
}
