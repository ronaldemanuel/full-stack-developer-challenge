import { BadRequestException } from '@nestjs/common';

import {
  Entity,
  RelationshipNotLoadedError,
  WatchedList,
  ZodEntity,
} from '@nx-ddd/shared-domain';

import type { PostProps } from '../schemas/entity.schemas';
import type { LikeEntity } from './like.entity';
import type { UserEntityPostRef } from './refs/user-entity-post.ref';
import { PostCreatedEvent } from '../events/post-created.event';
import { PostLikeRemovedEvent } from '../events/post-like-removed.event';
import { PostLikedEvent } from '../events/post-liked.event';
import { postPropsSchema } from '../schemas/entity.schemas';

export interface PostRelations {
  owner: UserEntityPostRef;
  likes: LikeEntity[];
}

export interface PostWatchedRelations {
  likes: WatchedList<LikeEntity>;
}

@ZodEntity(postPropsSchema)
// @ts-expect-error: Because of the override of the create method
export class PostEntity extends Entity<PostProps> {
  private $relations: () => PostRelations;
  private _likes: WatchedList<LikeEntity>;

  public get $watchedRelations(): PostWatchedRelations {
    return {
      likes: this._likes,
    };
  }

  public recieveLike(like: LikeEntity): void {
    const user = like.user;
    if (this.likes.some((like) => like.user.id === user.id)) {
      throw new BadRequestException(
        `User ${user.id} already liked this post ${this.id}`,
      );
    }
    this._likes.add(like);
    this.apply(
      new PostLikedEvent({
        userId: user.id,
        postId: this.id,
        date: new Date(),
      }),
    );
  }

  public removeLike(like: LikeEntity): void {
    const user = like.user;
    const likeIndex = this.likes.findIndex((l) => l.user.id === user.id);
    if (likeIndex === -1) {
      throw new BadRequestException(
        `User ${user.id} has not liked this post ${this.id}`,
      );
    }
    this._likes.remove(like);
    this.apply(
      new PostLikeRemovedEvent({
        userId: user.id,
        postId: this.id,
        date: new Date(),
      }),
    );
  }

  public get likes(): LikeEntity[] {
    if (!this.$watchedRelations.likes) {
      throw new RelationshipNotLoadedError('Likes not loaded');
    }
    return this.$watchedRelations.likes.getItems();
  }

  public get likesCount(): number {
    return this.likes.length;
  }

  constructor(props: PostProps, relations: () => PostRelations, id?: string) {
    super(props, id);
    this.$relations = relations;
    this._likes = new WatchedList(this.$relations().likes);
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
    likes: LikeEntity[] = [],
  ): PostEntity {
    const post = new PostEntity(
      {
        ...props,
        ownerId: owner.id,
      },
      () => ({
        owner,
        likes,
      }),
    );
    post.apply(new PostCreatedEvent(post.toJSON()));
    return post;
  }
}
