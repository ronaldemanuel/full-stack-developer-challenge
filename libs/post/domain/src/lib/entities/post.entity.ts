import { Entity, ZodEntity } from '@nx-ddd/shared-domain';

import type { PostProps } from '../schemas/entity.schemas';
import type { UserEntityPostRef } from './refs/user-entity-post.ref';
import { PostCreatedEvent } from '../events/post-created.event';
import { postPropsSchema } from '../schemas/entity.schemas';

export interface PostRelations {
  owner: UserEntityPostRef;
}

@ZodEntity(postPropsSchema)
// @ts-expect-error: Because of the override of the create method
export class PostEntity extends Entity<PostProps> {
  private $relations: () => PostRelations;

  constructor(props: PostProps, relations: () => PostRelations, id?: string) {
    super(props, id);
    this.$relations = relations;
  }

  get content() {
    return this.props.content ?? '';
  }

  get title() {
    return this.props.title;
  }

  get owner(): UserEntityPostRef {
    return this.$relations().owner;
  }

  static override create(
    props: Omit<PostProps, 'ownerId'>,
    owner: UserEntityPostRef,
  ): PostEntity {
    const post = new PostEntity(
      {
        ...props,
        ownerId: owner.id,
      },
      () => ({
        owner,
      }),
    );
    post.apply(new PostCreatedEvent(post.toJSON()));
    return post;
  }
}
