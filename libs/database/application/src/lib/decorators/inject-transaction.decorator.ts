import { InjectTransaction } from '@nestjs-cls/transactional';

import { DATABASE_CONNECTION_NAME } from '../constants/index.js';

export function InjectDrizzleTransaction() {
  return InjectTransaction(DATABASE_CONNECTION_NAME);
}
