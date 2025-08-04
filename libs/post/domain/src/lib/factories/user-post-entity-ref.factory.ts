import type { UserProps } from '@nx-ddd/user-domain';
import { UserEntityMockFactory } from '@nx-ddd/user-domain';

import type { UserPostRefRelations } from '../entities/index';
import { UserEntityPostRef } from '../entities/index';

export function UserPostEntityRefFactory(
  overrides: Partial<UserProps> = {},
  relationOverrides: Partial<UserPostRefRelations> = {},
  id?: string,
) {
  const data = UserEntityMockFactory(overrides, id);
  return UserEntityPostRef.cast(
    data,
    () => {
      return {
        likes: relationOverrides.likes ?? [],
        createdPosts: relationOverrides.createdPosts ?? [],
      };
    },
    id,
  );
}
