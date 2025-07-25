import { Inject } from '@nestjs/common';

import { InjectTransaction } from '@nx-ddd/database-application';

import { DRIZZLE_TOKEN } from '../constants/index.js';

export function InjectDrizzle() {
  return Inject(DRIZZLE_TOKEN);
}

export function InjectDrizzleTransaction() {
  return InjectTransaction();
}
