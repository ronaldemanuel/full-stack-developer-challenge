import { InMemoryRepository } from '@nx-ddd/shared-domain';

import type { UserEntityPostRef } from '../../../../entities/index';
import type { UserRepositoryPostRef } from '../../../../repositories/refs/user-repository-post.ref';

export class UserPostRefInMemoryRepository
  extends InMemoryRepository<UserEntityPostRef>
  implements UserRepositoryPostRef.Repository {}
