import type { Type } from '@nestjs/common';
import { Inject } from '@nestjs/common';

import type { Entity } from '../entities/entity.js';
import { getRepositoryToken } from '../factories/get-repository-token.js';

export function InjectRepository<T extends Entity>(
  entity: Type<T> | string,
  relationships?: (Type | string)[]
) {
  return Inject(getRepositoryToken(entity, relationships));
}
