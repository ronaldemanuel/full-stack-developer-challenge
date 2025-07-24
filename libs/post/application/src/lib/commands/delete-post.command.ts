import type { ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import { Validated } from 'validated-extendable';

import { PostRepository } from '@nx-ddd/post-domain';
import { InjectRepository } from '@nx-ddd/shared-domain';

import type { DeletePostInput } from '../schemas/commands.js';
import { deletePostInputSchema } from '../schemas/commands.js';

export namespace DeletePostCommand {
  export type Input = DeletePostInput;
  export type Output = void;
  class DeletePostCommand extends Validated(deletePostInputSchema) {}

  export function create(data: Input) {
    return new DeletePostCommand(data);
  }

  @CommandHandler(DeletePostCommand)
  export class Handler implements ICommandHandler<DeletePostCommand, Output> {
    constructor(
      @InjectRepository(PostRepository.TOKEN)
      private readonly postRepository: PostRepository.Repository,
    ) {}

    async execute(command: DeletePostCommand): Promise<Output> {
      await this.postRepository.delete(command.id);
    }
  }
}
