import { getConsumers } from '@/lib/inngest';
import { serve } from 'inngest/next';

import { inngest } from '@nx-ddd/jobs-events-infrastructure';

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: await getConsumers(),
});
