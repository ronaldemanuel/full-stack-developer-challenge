import { Entity } from '@nx-ddd/shared-domain';

import type { LikeProps } from '../schemas/entity.schemas';
import type { PostEntity } from './post.entity';
import type { UserEntityPostRef } from './refs/user-entity-post.ref';

interface LikeEntityRelations {
  user: UserEntityPostRef;
  post: PostEntity;
}

// @ts-expect-error: Expect error because of overriding the create method
export class LikeEntity extends Entity<LikeProps> {
  private $relations: () => LikeEntityRelations;

  constructor(
    props: LikeProps,
    relations: () => LikeEntityRelations,
    id?: string,
  ) {
    super(props, id);
    this.$relations = relations;
  }

  get user(): UserEntityPostRef {
    return this.$relations().user;
  }

  get post(): PostEntity {
    return this.$relations().post;
  }

  static override create(
    user: UserEntityPostRef,
    post: PostEntity,
  ): LikeEntity {
    return new LikeEntity(
      {
        userId: user.id,
        postId: post.id,
      },
      () => {
        return {
          user,
          post,
        };
      },
    );
  }
}
