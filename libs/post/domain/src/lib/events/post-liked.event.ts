import { Validated } from 'validated-extendable';

import type { IEvent } from '@nx-ddd/jobs-events-domain';
import { EventTypes } from '@nx-ddd/jobs-events-domain';

import { postLikedEventPropsSchema } from '../schemas/event.schemas';

export class PostLikedEvent
  extends Validated(postLikedEventPropsSchema)
  implements IEvent
{
  get identifier(): EventTypes {
    return EventTypes.POST_CREATED;
  }
}
