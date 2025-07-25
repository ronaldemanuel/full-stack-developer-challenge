import type { Provider } from '@nestjs/common';
import { Module } from '@nestjs/common';

import { PostApplicationModule } from '@nx-ddd/post-application';
import { PostRepository } from '@nx-ddd/post-domain';
import { PostTrpcController } from '@nx-ddd/post-presentation';

import { PostDrizzleRepository } from './database/drizzle/repositories/post-drizzle.repository.js';

const providers: Provider[] = [
  {
    provide: PostRepository.TOKEN,
    useClass: PostDrizzleRepository, // Assuming you have a concrete implementation of the repository
  },
];

@Module({
  imports: [
    {
      module: PostApplicationModule,
      providers: providers,
    },
  ],
  providers: [...providers, PostTrpcController],
  exports: [PostRepository.TOKEN],
})
export class ItemModule {}
