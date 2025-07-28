import type { UserItemRef } from 'src/lib/refs/user-item.ref.js';
import type z from 'zod';

import { ZodEntity } from '@nx-ddd/shared-domain';

import type { ItemIdentifier } from '../abstract-item.entity.js';
import { apparelItemPropsSchema } from '../../schemas/apparel.schema.js';
import { ApparelEntity } from './apparel.entity.js';

type GlovesProps = z.infer<typeof apparelItemPropsSchema>;

@ZodEntity(apparelItemPropsSchema)
export default class GlovesEntity extends ApparelEntity<GlovesProps> {
  override get equipped(): boolean {
    return this.character?.equippedGloves === this;
  }

  protected override getIdentifier(): ItemIdentifier {
    throw new Error('Method not implemented.');
  }

  protected override applyEffect(character: UserItemRef): void {
    if (character.equippedGloves === this) {
      character.equippedGloves = null;
      return;
    }

    character.equippedGloves = this;
  }
}
