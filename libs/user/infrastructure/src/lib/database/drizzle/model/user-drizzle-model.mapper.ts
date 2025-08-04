import { UserEntity } from '@nx-ddd/user-domain';

export class UserDrizzleModelMapper {
  static toEntity(data: any): UserEntity {
    return new UserEntity(data, data.id);
  }

  static toPersistence(entity: UserEntity) {
    return {
      ...entity.toJSON(),
    };
  }
}
