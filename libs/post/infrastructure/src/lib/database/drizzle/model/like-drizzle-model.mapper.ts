/* eslint-disable @typescript-eslint/no-explicit-any */
import { LikeEntity } from '@nx-ddd/post-domain';

export class LikeDrizzleModelMapper {
  static toDomain(like: any): LikeEntity {
    return LikeEntity.create(like.user, like.post);
  }
  static toPersistence(like: LikeEntity): any {
    return {
      userId: like.user.id,
      postId: like.post.id,
    };
  }
}
