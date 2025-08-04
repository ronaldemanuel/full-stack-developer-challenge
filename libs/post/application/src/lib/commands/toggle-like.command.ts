import type { ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CommandHandler, EventPublisher } from '@nestjs/cqrs';
import { Validated } from 'validated-extendable';

import { Transactional } from '@nx-ddd/database-application';
import { PostRepository, UserEntityPostRef } from '@nx-ddd/post-domain';
import { UserRepository } from '@nx-ddd/user-domain';

import type { ToggleLikeInput } from '../schemas/commands';
import { toggleLikeInputSchema } from '../schemas/commands';

export namespace ToggleLikeCommand {
  export type Input = ToggleLikeInput;
  export type Output = void;

  class ToggleLikeCommand extends Validated(toggleLikeInputSchema) {}

  export function create(data: Input) {
    return new ToggleLikeCommand(data);
  }

  @CommandHandler(ToggleLikeCommand)
  export class Handler implements ICommandHandler<ToggleLikeCommand, Output> {
    constructor(
      @Inject(PostRepository.TOKEN)
      private readonly postRepository: PostRepository.Repository,
      @Inject(EventPublisher)
      private readonly eventPublisher: EventPublisher,
      @Inject(UserRepository.TOKEN)
      private userRepository: UserRepository.Repository,
    ) {
      postRepository.userRepository = userRepository;
    }

    @Transactional()
    async execute(command: ToggleLikeCommand): Promise<Output> {
      const user = this.eventPublisher.mergeObjectContext(
        UserEntityPostRef.cast(
          await this.userRepository.findById(command.userId),
        ),
      );
      const post = this.eventPublisher.mergeObjectContext(
        await this.postRepository.findById(command.postId),
      );

      user.togglePostLike(post);

      // Saves the user applying the cascaded changes
      await this.postRepository.update(post);
      post.commit();
    }
  }
}
