import { Validated } from 'validated-extendable';

import type { IEvent } from '@nx-ddd/job-events-domain';
import { EventTypes } from '@nx-ddd/job-events-domain';

import { postLikedEventPropsSchema } from '../schemas/event.schemas.js';

export class PostLikedEvent
  extends Validated(postLikedEventPropsSchema)
  implements IEvent
{
  get identifier(): EventTypes {
    return EventTypes.POST_CREATED;
  }
}
