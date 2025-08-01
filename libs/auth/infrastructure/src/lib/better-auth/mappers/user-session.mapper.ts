import type { InventoryItemEntity } from '@nx-ddd/item-domain';
import { UserSession } from '@nx-ddd/auth-domain';

export class UserSessionMapper {
  static toEntity(data: any, coin: InventoryItemEntity): UserSession {
    return new UserSession(data, () => ({ inventory: [coin] }), data.id);
  }
}
