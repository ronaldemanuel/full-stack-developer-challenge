import type { UseSessionReturn } from './use-session';
import { useSession } from './use-session';

type UseUserReturn = Omit<UseSessionReturn, 'session'>;

export function useUser(): UseUserReturn {
  const { user, refetch } = useSession();

  return { user, refetch };
}
