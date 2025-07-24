import type { Session } from '@nx-ddd/auth-domain';

export function auth() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return {} as any;
}

export function validateToken() {
  return {
    session: {
      createdAt: new Date(),
      expiresAt: new Date(),
      userId: 'user-id',
      id: 'session-id',
      token: 'token',
      updatedAt: new Date(),
    },
    user: {
      createdAt: new Date(),
      email: 'manuelnascimento5589@gmail.com',
      id: 'user-id',
      name: 'Manuel Nascimento',
      updatedAt: new Date(),
      emailVerified: true,
    },
  } as Session;
}
