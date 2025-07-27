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
  private readonly _$watchedRelations: () => UserPostRefWatchedRelations;
  protected override props: UserPostRefProps;

  public get $watchedRelations(): UserPostRefWatchedRelations {
    return this._$watchedRelations();
  }

  constructor(
    props: UserPostRefProps,
    relations: () => UserPostRefRelations = () => {
      throw new RelationshipNotLoadedError('Relations not provided');
    },
    id?: string,
  ) {
    super(props, id);
    this.props = props;
    this.$relations = relations.bind(this);
    const likesWatchedList = new WatchedList(this.$relations().likes);
    const createdPostsWatchedList = new WatchedList(
      this.$relations().createdPosts,
    );
    this._$watchedRelations = () => {
      return {
        likes: likesWatchedList,
        createdPosts: createdPostsWatchedList,
      };
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
    return super.cast<
      UserPostRefProps,
      UserEntity,
      UserEntityPostRef,
      [() => UserPostRefRelations, id?: string]
    >(
      user,
      (user as UserEntityPostRef).$relations ||
        relations ||
        function (this: UserEntityPostRef) {
          const likes = (this.props.likes || []).map((like) => {
            const post = new PostEntity(
              {
                ...like.post!,
                ownerId: this.id, // Ensure ownerId is set correctly
              },
              () => ({
                owner: this,
              }),
              like.post!.id,
            );

            return new LikeEntity(
              like,
              () => ({
                user: this,
                post: post,
              }),
              like.id,
            );
          });
          const createdPosts: PostEntity[] = [];
          return {
            likes,
            createdPosts,
          };
        },
      id,
    );
  }
}
