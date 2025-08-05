import type { UserItemRef } from '../../refs/user-item.ref';
import type { ConsumableItemProps } from '../../schemas/consumable.schema';
import { ItemEntity } from '../abstract-item.entity';

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
