import { generateMock } from '@anatine/zod-mock';

import type { UserProps } from '../entities/user.entity.js';
import { UserEntity } from '../entities/user.entity.js';
import { userSchema } from '../schemas/user.schema.js';

export function UserEntityMockFactory(
  overrides: Partial<UserProps> = {},
  id?: string,
) {
  const mock = generateMock(userSchema);

  return new UserEntity(
    {
      ...mock,
      ...overrides,
    },
    id,
  );
}
