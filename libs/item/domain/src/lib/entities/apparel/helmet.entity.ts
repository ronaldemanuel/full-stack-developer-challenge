import type { UserItemRef } from 'src/lib/refs/user-item.ref';
import type z from 'zod';

import { ZodEntity } from '@nx-ddd/shared-domain';

import type { ItemIdentifier } from '../abstract-item.entity';
import { apparelItemPropsSchema } from '../../schemas/apparel.schema';
import { ApparelEntity } from './apparel.entity';

type HelmetProps = z.infer<typeof apparelItemPropsSchema>;

@ZodEntity(apparelItemPropsSchema)
export class HelmetEntity extends ApparelEntity<HelmetProps> {
  override get equipped(): boolean {
    return this.character?.equippedHelmet === this;
  }

  protected override getIdentifier(): ItemIdentifier {
    return 'helmet';
  }

  protected override applyEffect(character: UserItemRef): void {
    if (character.equippedHelmet === this) {
      character.equippedHelmet = null;
      return;
    }

    character.equippedHelmet = this;
  }
}
