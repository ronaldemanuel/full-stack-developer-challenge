import { RelationshipNotLoadedError, WatchedList } from '@nx-ddd/shared-domain';
import { UserEntity } from '@nx-ddd/user-domain';

import type { UserPostRefProps } from '../../schemas/entity.schemas';
import { PostLikeRemoved } from '../../events/post-like-removed.event';
import { PostLikedEvent } from '../../events/post-liked.event';
import { LikeEntity } from '../like.entity';
import { PostEntity } from '../post.entity';

export interface UserPostRefRelations {
  likes: LikeEntity[];
  createdPosts: PostEntity[];
}

export interface UserPostRefWatchedRelations {
  likes: WatchedList<LikeEntity>;
  createdPosts: WatchedList<PostEntity>;
}

// @ts-expect-error: Expect error because of the override of the cast method
export class UserEntityPostRef extends UserEntity {
  protected $relations: () => UserPostRefRelations;
  public readonly $watchedRelations: UserPostRefWatchedRelations;
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
    this.$watchedRelations = {
      likes: new WatchedList(relations().likes),
      createdPosts: new WatchedList(relations().createdPosts),
    };
  }

  public get likes(): LikeEntity[] {
    return this.$watchedRelations.likes.currentItems;
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
    relations?: () => UserPostRefRelations,
    id?: string,
  ): UserEntityPostRef {
    if (user instanceof UserEntityPostRef) {
      return user;
    }
    const casted = super.cast<
      UserPostRefProps,
      UserEntity,
      UserEntityPostRef,
      [() => UserPostRefRelations, id?: string]
    >(user, (user as UserEntityPostRef).$relations || relations, id);
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
      const probablyRelations = relations
        ? relations()
        : casted.$relations
          ? casted.$relations()
          : (() => {
              throw new RelationshipNotLoadedError('Relations not provided');
            })();
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
