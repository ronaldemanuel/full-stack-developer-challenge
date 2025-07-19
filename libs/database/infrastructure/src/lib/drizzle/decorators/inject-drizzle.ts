import { InjectTransaction } from '@nestjs-cls/transactional';
import { Inject } from '@nestjs/common';

import { DRIZZLE_CONNECTION_NAME, DRIZZLE_TOKEN } from '../constants/index.js';

export function InjectDrizzle() {
  return Inject(DRIZZLE_TOKEN);
}

export function InjectDrizzleTransaction() {
  return InjectTransaction(DRIZZLE_CONNECTION_NAME);
}
