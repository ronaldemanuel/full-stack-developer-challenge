import type { UserItemRefRelations } from 'src/lib/refs/user-item.ref.js';
import type { UserItemRefProps } from 'src/lib/schemas/user-item-ref.schema.js';
import { UserItemRef } from 'src/lib/refs/user-item.ref.js';

import { UserEntityMockFactory } from '@nx-ddd/user-domain';

export function UserItemRefFactory(
  overrides: Partial<UserItemRefProps> = {},
  relationOverrides: Partial<UserItemRefRelations> = {},
  id?: string,
) {
  const data = UserEntityMockFactory(overrides, id);

  console.log(data);

  const user = UserItemRef.cast(
    data,
    () => {
      return {
        inventory: relationOverrides.inventory ?? [],
      };
    },
    id,
  );

  console.log(user);

  return user;
}
