import { authClient } from '@/utils/auth';

export const useUser = () => {
  const { data: session, refetch } = authClient.useSession();

  return {
    user: session?.user,
    loggedIn: session?.user,
    refetch,
  };
};
