import type { PostEntity } from '../entities/index.js';

export class PostLikedAggregate {
  constructor(
    public readonly post: PostEntity,
    public readonly liked: boolean,
  ) {}

  static create({
    post,
    liked,
  }: {
    post: PostEntity;
    liked: boolean;
  }): PostLikedAggregate {
    return new PostLikedAggregate(post, liked);
  }

  toJSON() {
    return {
      ...this.post.toJSON(),
      meta: {
        liked: this.liked,
      },
    };
  }
}
