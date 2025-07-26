import type { UserItemRef } from 'src/lib/refs/user-item.ref.js';
import type { ConsumableItemProps } from 'src/lib/schemas/consumable.schema.js';

import { ItemEntity } from '../abstract-item.entity.js';

export abstract class ConsumableEntity<
  T extends ConsumableItemProps = ConsumableItemProps,
> extends ItemEntity<T> {
  get effectValue() {
    return this.props.effectValue;
  }

  get consumableType(): 'hp-potion' | 'mp-potion' | 'sp-potion' {
    return this.props.consumableType;
  }

  protected removeItem(character: UserItemRef) {
    character.removeItemFromInventory(this.id);
  }
}
