import { EventSchemas, Inngest } from 'inngest';
import { NestInngest } from 'nest-inngest';

import { eventsMap } from '@nx-ddd/jobs-events-domain';

export const inngest = new Inngest({
  id: 'skyrim-inventory',
  schemas: new EventSchemas().fromZod(eventsMap),
});

export const EventsInngest = NestInngest.from(inngest);
