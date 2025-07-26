import type { UserEntity } from 'src/lib/entities/user.entity.js';
import type { UserRepository } from 'src/lib/repositories/user.repository.js';

import { InMemoryRepository } from '@nx-ddd/shared-domain';

export class UserInMemoryRepository
  extends InMemoryRepository<UserEntity>
  implements UserRepository.Repository
{
  override items: UserEntity[] = [];
}
