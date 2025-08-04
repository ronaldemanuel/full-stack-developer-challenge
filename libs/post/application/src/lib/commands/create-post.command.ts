import type { ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CommandHandler, EventPublisher } from '@nestjs/cqrs';
import { Validated } from 'validated-extendable';

import type { UserEntityPostRef } from '@nx-ddd/post-domain';
import { PostEntity, PostRepository } from '@nx-ddd/post-domain';

import type { CreatePostInput } from '../schemas/commands';
import { createPostInputSchema } from '../schemas/commands';

export namespace CreatePostCommand {
  export type Input = CreatePostInput;
  export type Output = void;
  class CreatePostCommand extends Validated(createPostInputSchema) {
    user: UserEntityPostRef;
    constructor(data: Input, user: UserEntityPostRef) {
      super(data);
      this.user = user;
    }
  }

  export function create(data: Input, user: UserEntityPostRef) {
    return new CreatePostCommand(data, user);
  }

  @CommandHandler(CreatePostCommand)
  export class Handler implements ICommandHandler<CreatePostCommand, Output> {
    constructor(
      @Inject(PostRepository.TOKEN)
      private readonly postRepository: PostRepository.Repository,
      @Inject(EventPublisher)
      private readonly eventPublisher: EventPublisher,
    ) {}

    async execute(command: CreatePostCommand): Promise<Output> {
      const post = this.eventPublisher.mergeObjectContext(
        PostEntity.create(
          {
            title: command.title,
            content: command.content,
          },
          command.user,
        ),
      );
      await this.postRepository.insert(post);
      post.commit();
    }
  }
}
