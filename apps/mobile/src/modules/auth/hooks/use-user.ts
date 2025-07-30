import { authClient } from '@/utils/auth';

export const useUser = () => {
  const { data: session } = authClient.useSession();

  console.log(session);

  return {
    user: session?.user,
    loggedIn: session?.user,
  };
};
