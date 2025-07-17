import { getTransactionToken } from '@nestjs-cls/transactional';

// TODO: Replace with new import
import { DRIZZLE_CONNECTION_NAME } from '../../infrastructure/database/drizzle';

export function getDrizzleTransactionToken() {
  return getTransactionToken(DRIZZLE_CONNECTION_NAME);
}
