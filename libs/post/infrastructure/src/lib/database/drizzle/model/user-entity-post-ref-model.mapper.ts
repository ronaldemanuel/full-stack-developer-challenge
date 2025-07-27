import { LikeEntity, UserEntityPostRef } from '@nx-ddd/post-domain';

import { PostDrizzleModelMapper } from './post-drizzle-model.mapper';

export class UserEntityPostRefModelMapper {
  static toEntity(data: any): UserEntityPostRef {
    const rawLikes = data.likes || [];
    const likes = rawLikes.map((like: any) => {
      const post = PostDrizzleModelMapper.toEntity(like.post);
      return new LikeEntity(like, () => {
        return {
          post: post,
          user,
        };
      });
    });

    const user = new UserEntityPostRef(
      {
        ...data,
        email: data.email,
      },
      () => {
        return {
          likes: likes,
          createdPosts: [],
        };
      },
      data.id,
    );
    return user;
  }
}
