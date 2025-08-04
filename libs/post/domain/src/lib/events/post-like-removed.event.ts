import { Validated } from 'validated-extendable';

import type { IEvent } from '@nx-ddd/jobs-events-domain';
import { EventTypes } from '@nx-ddd/jobs-events-domain';

import { postLikeRemovedPropsSchema } from '../schemas/event.schemas';

export class PostLikeRemovedEvent
  extends Validated(postLikeRemovedPropsSchema)
  implements IEvent
{
  get identifier(): EventTypes {
    return EventTypes.POST_CREATED;
  }
}
