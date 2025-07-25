import { Validated } from 'validated-extendable';

import type { IEvent } from '@nx-ddd/job-events-domain';
import { EventTypes } from '@nx-ddd/job-events-domain';

import { postLikeRemovedPropsSchema } from '../schemas/event.schemas.js';

export class PostLikeRemoved
  extends Validated(postLikeRemovedPropsSchema)
  implements IEvent
{
  get identifier(): EventTypes {
    return EventTypes.POST_CREATED;
  }
}
