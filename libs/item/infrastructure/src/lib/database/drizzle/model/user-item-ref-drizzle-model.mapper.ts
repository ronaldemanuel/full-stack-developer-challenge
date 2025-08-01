import { UserItemRef } from '@nx-ddd/post-domain';

export class UserItemRefDrizzleModelMapper {
  static toEntity(data: any): UserItemRef {
    return new UserItemRef(data.props, () => ({ inventory: [] }), data.id);
  }

  static toPersistence(entity: UserItemRef) {
    return {
      ...entity.toJSON(),
    };
  }
}
