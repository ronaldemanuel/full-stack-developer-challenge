import type { Type } from '@nestjs/common';
import { Inject } from '@nestjs/common';

import type { Entity } from '../entities/entity';
import { getRepositoryToken } from '../factories/get-repository-token';

export function InjectRepository<T extends Entity>(
  entity: Type<T> | string,
  relationships?: (Type | string)[]
) {
  return Inject(getRepositoryToken(entity, relationships));
}
