import { generateMock } from '@anatine/zod-mock';

import type { PostRelations } from '../entities/post.entity.js';
import type { PostProps } from '../schemas/entity.schemas.js';
import { PostEntity } from '../entities/post.entity.js';
import { postSchema } from '../schemas/entity.schemas.js';
import { UserPostEntityRefFactory } from './user-post-entity-ref.factory.js';

export function PostEntityMockFactory(
  overrides: Partial<PostProps> = {},
  relationOverrides: Partial<PostRelations> = {},
  id?: string,
) {
  const mock = generateMock(postSchema);
  const mockOwner = UserPostEntityRefFactory();

  return new PostEntity(
    {
      ...mock,
      ...overrides,
    },
    () => {
      return {
        owner: relationOverrides.owner ?? mockOwner,
      };
    },
    id,
  );
}
