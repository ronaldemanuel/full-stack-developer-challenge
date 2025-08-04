import 'server-only';

import { getAppContext } from '@nx-ddd/api-infrastructure';
import { cache } from 'react';

const cachedGetAppContext = cache(async () => {
  const appContext = await getAppContext();
  return appContext;
});

export const appContext = await cachedGetAppContext();
