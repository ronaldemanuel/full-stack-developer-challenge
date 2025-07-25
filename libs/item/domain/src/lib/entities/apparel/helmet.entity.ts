import type { UserItemRef } from 'src/lib/refs/user-item.ref.js';
import type z from 'zod';
import { apparelItemPropsSchema } from 'src/lib/schemas/apparel.schema.js';

import { ZodEntity } from '@nx-ddd/shared-domain';

import type { ItemIdentifier } from '../abstract-item.entity.js';
import { ApparelEntity } from './apparel.entity.js';

type HelmetProps = z.infer<typeof apparelItemPropsSchema>;

@ZodEntity(apparelItemPropsSchema)
export default class HelmetEntity extends ApparelEntity<HelmetProps> {
  override get equipped(): boolean {
    return this.character?.equippedHelmet === this;
  }

  override set equipped(value: boolean) {
    this.equipped = value;
  }

  protected override getIdentifier(): ItemIdentifier {
    throw new Error('Method not implemented.');
  }

  protected override applyEffect(character: UserItemRef): void {
    if (character.equippedHelmet === this) {
      this.equipped = false;
      character.equippedHelmet = null;
      return;
    }

    if (character.equippedHelmet != null) {
      character.equippedHelmet.equipped = false;
    }

    this.equipped = true;
    character.equippedHelmet = this;
  }
}
