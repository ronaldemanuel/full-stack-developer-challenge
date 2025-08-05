import type { QueryOptions } from '@tanstack/react-query';
import { authClient } from '@/utils/auth';
import { useQuery } from '@tanstack/react-query';

export const useSessionQueryOptions = {
  queryKey: ['session'],
  queryFn: async () => {
    const data = await authClient.getSession({
      query: {
        disableCookieCache: true,
      },
    });
    if (data.error) {
      throw new Error(data.error.message);
    }
    return data.data;
  },
} satisfies QueryOptions;

export const useUser = <
  TOverrides extends Partial<
    Parameters<
      typeof useQuery<
        Awaited<ReturnType<(typeof useSessionQueryOptions)['queryFn']>>
      >
    >[0]
  >,
>(
  overrides: TOverrides = {} as TOverrides,
) => {
  const {
    data: session,
    refetch,
    isFetching,
  } = useQuery({
    ...useSessionQueryOptions,
    ...overrides,
  });

  return {
    user: session?.user,
    loggedIn: session?.user,
    refetch,
    isFetching,
  };
};
