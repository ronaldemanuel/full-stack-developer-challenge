import type { UserEntityPostRef } from 'src/lib/entities/index.js';
import type { UserRepositoryPostRef } from 'src/lib/repositories/refs/user-repository-post.ref.js';

import { InMemoryRepository } from '@nx-ddd/shared-domain';

export class UserPostRefInMemoryRepository
  extends InMemoryRepository<UserEntityPostRef>
  implements UserRepositoryPostRef.Repository {}
