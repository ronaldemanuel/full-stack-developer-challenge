import { LikeEntity, PostEntity, UserEntityPostRef } from '@nx-ddd/post-domain';

export class PostDrizzleModelMapper {
  static toEntity(data: any): PostEntity {
    const ownerEntity = new UserEntityPostRef(
      {
        ...data.owner,
      },
      () => {
        return {
          likes: [],
          createdPosts: [],
        };
      },
      data.owner.id,
    );
    let likes: LikeEntity[] = [];
    if (data.likes) {
      likes = data.likes.map((like: any) => {
        return new LikeEntity(
          like,
          () => ({
            user: ownerEntity,
            post: postEntity,
          }),
          like.id,
        );
      });
    }

    const postEntity = new PostEntity(
      {
        title: data.title,
        content: data.content,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt || undefined,
        ownerId: data.owner.id,
      },
      () => ({
        owner: ownerEntity,
        likes,
      }),
      data.id,
    );

    return postEntity;
  }

  static toPersistence(entity: PostEntity) {
    return {
      ...entity.toJSON(),
      id: undefined,
      onwerId: entity.owner.id,
    };
  }
}
