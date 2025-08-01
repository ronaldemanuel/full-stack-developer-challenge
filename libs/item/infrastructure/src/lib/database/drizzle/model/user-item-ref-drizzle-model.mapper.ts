import { UserItemRef } from '@nx-ddd/item-domain';

export class UserItemRefDrizzleModelMapper {
  static toEntity(data: any): UserItemRef {
    return new UserItemRef(data, () => ({ inventory: [] }), data.id);
  }

  static toPersistence(entity: UserItemRef) {
    return {
      ...entity.toJSON(),
    };
  }
}
