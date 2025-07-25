import { ZodEntity } from '@nx-ddd/shared-domain';
import { UserEntity } from '@nx-ddd/user-domain';

import type BootsEntity from '../entities/apparel/boots.entity.js';
import type ChestEntity from '../entities/apparel/chest.entity.js';
import type GlovesEntity from '../entities/apparel/gloves.entity.js';
import type HelmetEntity from '../entities/apparel/helmet.entity.js';
import type { WeaponEntity } from '../entities/weapon/weapon.entity.js';
import type { UserItemRefProps } from '../schemas/user-item-ref.schema.js';
import { userItemRefPropsSchema } from '../schemas/user-item-ref.schema.js';

@ZodEntity(userItemRefPropsSchema)
// @ts-expect-error: Because of the override of the create method
export class UserItemRef extends UserEntity {
  equippedHelmet: HelmetEntity | null = null;
  equippedChest: ChestEntity | null = null;
  equippedBoots: BootsEntity | null = null;
  equippedGloves: GlovesEntity | null = null;

  leftHand: WeaponEntity | null = null;
  rightHand: WeaponEntity | null = null;

  static override create(props: UserItemRefProps): UserItemRefProps {
    const post = super.create<UserItemRef, UserItemRefProps>(props);
    post.props.createdAt = post.props.createdAt ?? new Date();
    post.props.updatedAt = post.props.updatedAt ?? new Date();
    return post;
  }
}
