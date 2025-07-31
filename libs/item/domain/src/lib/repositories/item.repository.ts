import type { IReadableRepository } from '@nx-ddd/shared-domain';
import { getRepositoryToken } from '@nx-ddd/shared-domain';

import type { ItemEntity } from '../entities/abstract-item.entity';

export namespace ItemRepository {
  export const TOKEN = getRepositoryToken('Item');

  export type Repository = IReadableRepository<ItemEntity>;
}
