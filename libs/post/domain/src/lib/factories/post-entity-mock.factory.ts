import { generateMock } from '@anatine/zod-mock';

import type { PostRelations } from '../entities/post.entity';
import type { PostProps } from '../schemas/entity.schemas';
import { PostEntity } from '../entities/post.entity';
import { postSchema } from '../schemas/entity.schemas';
import { UserPostEntityRefFactory } from './user-post-entity-ref.factory';

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
        likes: relationOverrides.likes ?? [],
      };
    },
    id,
  );
}
