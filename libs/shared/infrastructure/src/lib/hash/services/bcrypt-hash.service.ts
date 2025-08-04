import { Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';

import type { HashService } from '@nx-ddd/shared-domain';

@Injectable()
export class BCryptHashService implements HashService.Service {
  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, 10);
  }

  async compare(value: string, hashedValue: string): Promise<boolean> {
    return bcrypt.compare(value, hashedValue);
  }
}
