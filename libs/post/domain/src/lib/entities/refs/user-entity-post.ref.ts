import { RelationshipNotLoadedError } from '@nx-ddd/shared-domain';
import { UserEntity } from '@nx-ddd/user-domain';

import type { UserPostRefProps } from '../../schemas/entity.schemas.js';
import { PostLikeRemoved } from '../../events/post-like-removed.event.js';
import { PostLikedEvent } from '../../events/post-liked.event.js';
import { LikeEntity } from '../like.entity.js';
import { PostEntity } from '../post.entity.js';

export interface UserPostRefRelations {
  likes: LikeEntity[];
  createdPosts: PostEntity[];
}

// @ts-expect-error: Expect error because of the override of the cast method
export class UserEntityPostRef extends UserEntity {
  private $relations: () => UserPostRefRelations;
  protected override props: UserPostRefProps;

  constructor(
    props: UserPostRefProps,
    relations: () => UserPostRefRelations = () => {
      throw new RelationshipNotLoadedError('Relations not provided');
    },
    id?: string,
  ) {
    super(props, id);
    this.props = props;
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

  static override cast(
    user: UserEntity,
    relations: () => UserPostRefRelations = () => {
      throw new RelationshipNotLoadedError('Relations not provided');
    },
    id?: string,
  ): UserEntityPostRef {
    const casted = super.cast<
      UserPostRefProps,
      UserEntity,
      UserEntityPostRef,
      [() => UserPostRefRelations, id?: string]
    >(user, relations, id);
    const likes = (casted.props.likes || []).map((like) => {
      const post = new PostEntity(
        {
          ...like.post!,
          ownerId: casted.id, // Ensure ownerId is set correctly
        },
        () => ({
          owner: casted,
        }),
        like.post!.id,
      );

      return new LikeEntity(
        like,
        () => ({
          user: casted,
          post: post,
        }),
        like.id,
      );
    });

    const createdPosts: PostEntity[] = [];
    try {
      const probablyRelations = relations();
      casted.$relations = () => probablyRelations;
    } catch {
      casted.$relations = () => {
        return {
          likes: likes,
          createdPosts: createdPosts,
        };
      };
    }

    return casted;
  }
}
