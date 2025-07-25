import { PostEntity, UserEntityPostRef } from '@nx-ddd/post-domain';

export class PostDrizzleModelMapper {
  static toEntity(data: any): PostEntity {
    const ownerEntity = new UserEntityPostRef(
      {
        email: data.owner.email,
      },
      () => {
        return {
          likes: [],
          createdPosts: [],
        };
      },
    );
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
      }),
      data.id,
    );

    return postEntity;
  }

  static toPersistence(entity: PostEntity) {
    return {
      ...entity.toJSON(),
      onwerId: entity.owner.id,
    };
  }
}
