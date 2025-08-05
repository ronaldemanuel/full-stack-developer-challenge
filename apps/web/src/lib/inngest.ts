import {
  inngestSubject,
  ServerlessInngestService,
} from '@nx-ddd/jobs-events-infrastructure';

import 'server-only';

import { cache } from 'react';
import { firstValueFrom } from 'rxjs';

export const getConsumers = cache(async () => {
  const appContext = await firstValueFrom(inngestSubject);
  const functions = await appContext
    .get(ServerlessInngestService)
    .getHandlers();
  return functions;
});
