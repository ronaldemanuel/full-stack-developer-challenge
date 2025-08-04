import { Validated } from 'validated-extendable';

import type { IEvent } from '@nx-ddd/jobs-events-domain';
import { EventTypes } from '@nx-ddd/jobs-events-domain';

import { postSchema } from '../schemas/index';

export class PostCreatedEvent extends Validated(postSchema) implements IEvent {
  get identifier(): EventTypes {
    return EventTypes.POST_CREATED;
  }
}
