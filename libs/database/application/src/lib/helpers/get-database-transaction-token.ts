import { getTransactionToken } from '@nestjs-cls/transactional';

import { DATABASE_CONNECTION_NAME } from '../constants/index';

export function getDatabaseTransactionToken() {
  return getTransactionToken(DATABASE_CONNECTION_NAME);
}
