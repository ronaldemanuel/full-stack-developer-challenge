import type { UserProps } from '@nx-ddd/user-domain';
import { UserEntity } from '@nx-ddd/user-domain';

import type { PostEntity } from '../post.entity.js';
import { PostLikeRemoved } from '../../events/post-like-removed.event.js';
import { PostLikedEvent } from '../../events/post-liked.event.js';
import { LikeEntity } from '../like.entity.js';

export interface UserPostRefRelations {
  likes: LikeEntity[];
  createdPosts: PostEntity[];
}

export class UserEntityPostRef extends UserEntity {
  private $relations: UserPostRefRelations;

  constructor(props: UserProps, relations: UserPostRefRelations, id?: string) {
    super(props, id);
    this.$relations = relations;
  }

  public get likedPosts(): PostEntity[] {
    return this.$relations.likes.map((like) => like.post);
  }

  public toggleLike(post: PostEntity): void {
    const existingLike = this.$relations.likes.find(
      (like) => like.post.id === post.id,
    );
    if (existingLike) {
      this.$relations.likes = this.$relations.likes.filter(
        (like) => like.id !== existingLike.id,
      );
      this.apply(
        new PostLikedEvent({
          userId: this.id,
          postId: post.id,
          date: new Date(),
        }),
      );
    } else {
      this.$relations.likes.push(LikeEntity.create(this, post));
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
