import type { Provider } from '@nestjs/common';
import { Module } from '@nestjs/common';

import { PostApplicationModule } from '@nx-ddd/post-application';
import { PostRepository } from '@nx-ddd/post-domain';
import { PostTrpcController } from '@nx-ddd/post-presentation';
import { UserModule } from '@nx-ddd/user-infrastructure';

import { PostDrizzleRepository } from './database/drizzle/repositories/post-drizzle.repository';

const providers: Provider[] = [
  {
    provide: PostRepository.TOKEN,
    useClass: PostDrizzleRepository, // Assuming you have a concrete implementation of the repository
  },
];

const imports = [UserModule];

@Module({
  imports: [
    {
      module: PostApplicationModule,
      providers: providers,
      imports: imports,
    },
    ...imports, // Spread the imports array to include UserModule
  ],
  providers: [...providers, PostTrpcController],
  exports: [PostRepository.TOKEN],
})
export class PostModule {}
