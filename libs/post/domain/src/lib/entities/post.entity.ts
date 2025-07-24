import { Entity, ZodEntity } from '@nx-ddd/shared-domain';

import type { PostProps } from '../schemas/post.schema.js';
import { PostCreatedEvent } from '../events/post-created.event.js';
import { postPropsSchema } from '../schemas/post.schema.js';

@ZodEntity(postPropsSchema)
// @ts-expect-error: Because of the override of the create method
export class PostEntity extends Entity<PostProps> {
  get content() {
    return this.props.content ?? '';
  }

  get title() {
    return this.props.title;
  }

  static override create(props: PostProps): PostEntity {
    const post = super.create<PostEntity, PostProps>(props);
    post.apply(new PostCreatedEvent(post.toJSON()));
    return post;
  }
}
