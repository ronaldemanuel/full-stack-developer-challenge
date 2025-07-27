import { CreatePostCommand } from './create-post.command';
import { DeletePostCommand } from './delete-post.command';
import { ToggleLikeCommand } from './toggle-like.command';

export * from './create-post.command';
export * from './delete-post.command';

export const commands = [
  CreatePostCommand.Handler,
  DeletePostCommand.Handler,
  ToggleLikeCommand.Handler,
];
