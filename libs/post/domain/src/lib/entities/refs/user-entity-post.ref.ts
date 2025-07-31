import { WatchedList } from '@nx-ddd/shared-domain';
import { UserEntity } from '@nx-ddd/user-domain';

import type { UserPostRefProps } from '../../schemas/entity.schemas';
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
  private $relations: () => UserPostRefRelations;
  private _likes: WatchedList<LikeEntity>;
  private _createdPosts: WatchedList<PostEntity>;
  protected override props: UserPostRefProps;

  public get $watchedRelations(): UserPostRefWatchedRelations {
    return {
      likes: this._likes,
      createdPosts: this._createdPosts,
    };
  }

  constructor(
    props: UserPostRefProps,
    relations: () => UserPostRefRelations,
    id?: string,
  ) {
    super(props, id);
    this.props = props;
    this.$relations = relations.bind(this);
    this._likes = new WatchedList<LikeEntity>(this.$relations().likes);
    this._createdPosts = new WatchedList<PostEntity>(
      this.$relations().createdPosts,
    );
  }

  public get likes(): LikeEntity[] {
    return this._likes.getItems();
  }

  public get likedPosts(): PostEntity[] {
    return this.likes.map((like) => like.post);
  }

  public togglePostLike(post: PostEntity): LikeEntity | null {
    const existingLike = this.likes.find((like) => like.post.id === post.id);
    if (existingLike) {
      post.removeLike(existingLike);
      this._likes.remove(existingLike);
      return null;
    } else {
      const like = LikeEntity.create(this, post);
      post.recieveLike(like);
      this._likes.add(LikeEntity.create(this, post));
      return like;
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
          // NOMINAL NAO USAMOS ARROW FUNCTION TA OK
          const likes = (this.props.likes || []).map((like) => {
            const post = new PostEntity(
              {
                ...like.post!,
                ownerId: this.id, // Ensure ownerId is set correctly
              },
              () => ({
                owner: this,
                likes: [],
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
