import { Entity, RelationshipNotLoadedError } from '@nx-ddd/shared-domain';

import type { LikeProps } from '../schemas/entity.schemas';
import type { PostEntity } from './post.entity';
import type { UserEntityPostRef } from './refs/user-entity-post.ref';

interface LikeEntityRelations {
  user: UserEntityPostRef;
  post: PostEntity;
}

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

  static override create(props: LikeProps): LikeEntity;
  static override create(user: UserEntityPostRef, post: PostEntity): LikeEntity;

  static override create(
    userOrProps: UserEntityPostRef | LikeProps,
    post?: PostEntity,
  ): LikeEntity {
    if (post) {
      const user = userOrProps as UserEntityPostRef;
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
        `${user.id}-${post.id}`,
      );
    } else {
      const props = userOrProps as LikeProps;
      return new LikeEntity(
        props,
        () => {
          throw new RelationshipNotLoadedError('Relations not provided');
        },
        `${props.userId}-${props.postId}`,
      );
    }
  }
}
