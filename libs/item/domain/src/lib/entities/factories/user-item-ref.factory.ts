import type { UserItemRefRelations } from 'src/lib/refs/user-item.ref';
import type { UserItemRefProps } from 'src/lib/schemas/user-item-ref.schema';

import { UserEntityMockFactory } from '@nx-ddd/user-domain';

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
