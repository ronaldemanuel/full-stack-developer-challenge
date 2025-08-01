import type { IReadableRepository } from '@nx-ddd/shared-domain';
import { getRepositoryToken } from '@nx-ddd/shared-domain';

import type { ItemEntity } from '../entities/abstract-item.entity';

export namespace ItemRepository {
  export const TOKEN = getRepositoryToken('Item');

  export interface Repository extends IReadableRepository<ItemEntity> {
    findIdListByType(type: string): Promise<string[]>;
  }
}
