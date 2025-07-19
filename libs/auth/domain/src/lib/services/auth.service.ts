import type { Session } from '../interfaces/session.interface.js';

export namespace AuthService {
  export const TOKEN = 'AUTH';
  export interface Service {
    getSession(headers: Headers): Promise<Session | null>;
    getHandler(): (req: Request) => Promise<Response>;
  }
}
