import { generateMock } from '@anatine/zod-mock';

import type { UserProps } from '../schemas/user.schema';
import { UserEntity } from '../entities/user.entity';
import { userSchema } from '../schemas/user.schema';

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
