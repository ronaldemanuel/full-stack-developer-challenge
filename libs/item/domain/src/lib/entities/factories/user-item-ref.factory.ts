import { UserEntityMockFactory } from '@nx-ddd/user-domain';

import type { UserItemRefRelations } from '../../refs/user-item.ref';
import type { UserItemRefProps } from '../../schemas/user-item-ref.schema';
import { UserItemRef } from '../../refs/user-item.ref';

export function UserItemRefFactory(
  overrides: Partial<UserItemRefProps> = {},
  relationOverrides: Partial<UserItemRefRelations> = {},
  id?: string,
) {
  const data = UserEntityMockFactory(overrides, id);

  return UserItemRef.cast(
    data,
    () => ({
      inventory: relationOverrides.inventory ?? [],
    }),
    id,
  );
}
