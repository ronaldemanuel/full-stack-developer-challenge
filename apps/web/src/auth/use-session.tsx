import { authClient } from './client';

type SessionData = NonNullable<
  ReturnType<typeof authClient.useSession>['data']
>;

type Session = SessionData['session'];

export type SessionUser = SessionData['user'];

export interface UseSessionReturn {
  session: Session | null;
  user: SessionUser | null;
  refetch: () => void;
}

export function useSession(): UseSessionReturn {
  const { data, isPending, error, refetch } = authClient.useSession();

  if (isPending) {
    return {
      session: null,
      user: null,
      refetch: () => {
        //
      },
    };
  }

  if (error) {
    return {
      session: null,
      user: null,
      refetch,
    };
  }

  return {
    session: data?.session ?? null,
    user: data?.user ?? null,
    refetch,
  };
}
