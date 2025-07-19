import type { UserEntity } from '@nx-ddd/user-domain';

export interface Session {
  token: string;
  expiresAt: Date;
  user: UserEntity;
}
