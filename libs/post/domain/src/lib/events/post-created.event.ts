import { Validated } from 'validated-extendable';

import type { IEvent } from '@nx-ddd/job-events-domain';
import { EventTypes } from '@nx-ddd/job-events-domain';

import { postSchema } from '../schemas';

export class PostCreatedEvent extends Validated(postSchema) implements IEvent {
  get identifier(): EventTypes {
    return EventTypes.POST_CREATED;
  }
}
