import { Inject } from '@nestjs/common';

import { DRIZZLE_TOKEN } from '../constants/index.js';

export function InjectDrizzle() {
  return Inject(DRIZZLE_TOKEN);
}
