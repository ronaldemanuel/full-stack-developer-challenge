import type { ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CommandHandler, EventPublisher } from '@nestjs/cqrs';
import { Validated } from 'validated-extendable';

import { PostEntity, PostRepository } from '@nx-ddd/post-domain';
import { InjectRepository } from '@nx-ddd/shared-domain';

import type { CreatePostInput } from '../schemas/commands.js';
import { createPostInputSchema } from '../schemas/commands.js';

export namespace CreatePostCommand {
  export type Input = CreatePostInput;
  export type Output = void;

  class CreatePostCommand extends Validated(createPostInputSchema) {}

  export function create(data: Input) {
    return new CreatePostCommand(data);
  }

  @CommandHandler(CreatePostCommand)
  export class Handler implements ICommandHandler<CreatePostCommand, Output> {
    constructor(
      @InjectRepository(PostRepository.TOKEN)
      private readonly postRepository: PostRepository.Repository,
      @Inject(EventPublisher)
      private readonly eventPublisher: EventPublisher,
    ) {}

    async execute(command: CreatePostCommand): Promise<Output> {
      const post = this.eventPublisher.mergeObjectContext(
        PostEntity.create(command),
      );
      await this.postRepository.insert(post);
      post.commit();
    }
  }
}
