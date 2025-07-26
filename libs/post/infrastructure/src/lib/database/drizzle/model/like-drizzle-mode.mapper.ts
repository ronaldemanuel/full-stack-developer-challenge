import { LikeEntity } from 'node_modules/@nx-ddd/post-domain/src/lib/entities/like.entity.js';

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
