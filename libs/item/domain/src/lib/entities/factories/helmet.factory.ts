import type { ApparelItemSchemaProps } from 'src/lib/schemas/apparel.schema.js';
import { generateMock } from '@anatine/zod-mock';
import { apparelItemSchema } from 'src/lib/schemas/apparel.schema.js';

import type { ItemRelations } from '../abstract-item.entity.js';
import HelmetEntity from '../apparel/helmet.entity.js';

// HelmetEntityMockFactory.ts

export function HelmetEntityMockFactory(
  overrides: Partial<ApparelItemSchemaProps> = {},
  relationOverrides: Partial<ItemRelations> = {},
  id?: string,
) {
  const mock = generateMock(apparelItemSchema);

  return new HelmetEntity(
    {
      ...mock,
      ...overrides,
    },
    () => ({
      ...relationOverrides,
    }),
    id,
  );
}
