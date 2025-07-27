import { InMemoryRepository } from '@nx-ddd/shared-domain';

import type { UserEntity } from '../../../../entities/user.entity';
import type { UserRepository } from '../../../../repositories/user.repository';

export class UserInMemoryRepository
  extends InMemoryRepository<UserEntity>
  implements UserRepository.Repository
{
  override items: UserEntity[] = [];
}
