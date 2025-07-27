import type { Provider } from '@nestjs/common';
import { Module } from '@nestjs/common';

import { UserRepository } from '@nx-ddd/user-domain';

import { UserDrizzleRepository } from './database/drizzle/repositories/user-drizzle.repository.js';

const providers: Provider[] = [
  {
    provide: UserRepository.TOKEN,
    useClass: UserDrizzleRepository, // Assuming you have a concrete implementation of the repository
  },
];

@Module({
  imports: [],
  providers: [...providers],
  exports: [UserRepository.TOKEN],
})
export class UserModule {}
