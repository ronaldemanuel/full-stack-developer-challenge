import type { UserProps } from '@nx-ddd/user-domain';
import { RelationshipNotLoadedError } from '@nx-ddd/shared-domain';
import { UserEntity } from '@nx-ddd/user-domain';

import type { PostEntity } from '../post.entity.js';
import { PostLikeRemoved } from '../../events/post-like-removed.event.js';
import { PostLikedEvent } from '../../refs/post-liked.event.js';
import { LikeEntity } from '../like.entity.js';

export interface UserPostRefRelations {
  likes: LikeEntity[];
  createdPosts: PostEntity[];
}

export class UserEntityPostRef extends UserEntity {
  private $relations: () => UserPostRefRelations;

  constructor(
    props: UserProps,
    relations: () => UserPostRefRelations = () => {
      throw new RelationshipNotLoadedError('Relations not provided');
    },
    id?: string,
  ) {
    super(props, id);
    this.$relations = relations;
  }

  public get likes(): LikeEntity[] {
    return this.$relations().likes;
  }

  public get likedPosts(): PostEntity[] {
    return this.likes.map((like) => like.post);
  }

  public get likesCount(): number {
    return this.likes.length;
  }

  public toggleLike(post: PostEntity): void {
    const existingLike = this.likes.find((like) => like.post.id === post.id);
    if (existingLike) {
      this.likes.splice(
        this.likes.findIndex((like) => like.id === existingLike.id),
        1,
      );
      this.apply(
        new PostLikedEvent({
          userId: this.id,
          postId: post.id,
          date: new Date(),
        }),
      );
    } else {
      this.likes.push(LikeEntity.create(this, post));
      this.apply(
        new PostLikeRemoved({
          userId: this.id,
          postId: post.id,
          date: new Date(),
        }),
      );
    }
  }
}
