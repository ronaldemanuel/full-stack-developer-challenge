import type { IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { EventsHandler } from '@nestjs/cqrs';

import { ItemAddedToInventoryEvent } from '@nx-ddd/item-domain';

export namespace ItemAddedToInventoryEventHandler {
  export const TOKEN = 'ItemAddedToInventoryEventHandler';

  @EventsHandler(ItemAddedToInventoryEvent)
  export class Handler implements IEventHandler<ItemAddedToInventoryEvent> {
    private readonly logger = new Logger('ItemAddedToInventoryEventHandler');

    handle(event: ItemAddedToInventoryEvent) {
      this.logger.log(`Item added to inventory with ID: ${event.id}`);
    }
  }
}
