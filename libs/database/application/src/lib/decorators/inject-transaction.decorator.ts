import { InjectTransaction as OriginalTransactional } from '@nestjs-cls/transactional';

import { DATABASE_CONNECTION_NAME } from '../constants/index.js';

export function InjectTransaction() {
  return OriginalTransactional(DATABASE_CONNECTION_NAME);
}
