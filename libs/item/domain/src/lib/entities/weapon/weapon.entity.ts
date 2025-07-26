import type { WeaponItemProps } from 'src/lib/schemas/weapon.schema.js';

import { WearableItemsEntity } from '../wearable-items.entity.js';

export abstract class WeaponEntity<
  T extends WeaponItemProps = WeaponItemProps,
> extends WearableItemsEntity<T> {
  get damageValue(): number {
    return this.props.damageValue;
  }

  get weaponType(): 'one-hand' | 'two-hands' {
    return this.props.weaponType;
  }
}
