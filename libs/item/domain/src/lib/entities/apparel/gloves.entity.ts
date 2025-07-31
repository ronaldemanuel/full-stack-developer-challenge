import type { UserItemRef } from 'src/lib/refs/user-item.ref';
import type z from 'zod';

import { ZodEntity } from '@nx-ddd/shared-domain';

import type { ItemIdentifier } from '../abstract-item.entity';
import { apparelItemPropsSchema } from '../../schemas/apparel.schema';
import { ApparelEntity } from './apparel.entity';

type GlovesProps = z.infer<typeof apparelItemPropsSchema>;

@ZodEntity(apparelItemPropsSchema)
export class GlovesEntity extends ApparelEntity<GlovesProps> {
  override get equipped(): boolean {
    return this.character?.equippedGloves === this;
  }

  protected override getIdentifier(): ItemIdentifier {
    return 'gloves';
  }

  protected override applyEffect(character: UserItemRef): void {
    if (character.equippedGloves === this) {
      character.equippedGloves = null;
      return;
    }

    character.equippedGloves = this;
  }
}
