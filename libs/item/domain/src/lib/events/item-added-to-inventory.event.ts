import { Validated } from 'validated-extendable';

import type { IEvent } from '@nx-ddd/jobs-events-domain';
import { EventTypes } from '@nx-ddd/jobs-events-domain';

import { itemSchema } from '../schemas/item.schema';

export class ItemAddedToInventoryEvent
  extends Validated(itemSchema)
  implements IEvent
{
  get identifier(): EventTypes {
    return EventTypes.ITEM_ADDED;
  }
}
