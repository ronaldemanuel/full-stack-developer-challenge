import type { Type } from '@nestjs/common';

import type { Entity } from '../entities/entity.js';

export function getRepositoryToken<T extends Entity>(
  entity: Type<T> | string,
  relationships?: (Type | string)[]
) {
  const model = typeof entity === 'string' ? entity : entity.name;
  const includeRelations: string[] = [];
  if (relationships && relationships.length > 0) {
    relationships.forEach((relation) => {
      if (typeof relation === 'string') {
        includeRelations.push(relation);
      } else {
        includeRelations.push(relation.name);
      }
    });
  }
  let token = model + 'Repository';
  if (includeRelations.length) {
    token += 'With';
    includeRelations.sort().forEach((relation, index) => {
      if (index !== includeRelations.length - 1) {
        token += relation + 'And';
      } else {
        token += relation;
      }
    });
  }
  return token;
}
