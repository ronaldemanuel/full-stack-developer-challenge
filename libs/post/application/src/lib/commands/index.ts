import { CreatePostCommand } from './create-post.command.js';
import { DeletePostCommand } from './delete-post.command.js';

export * from './create-post.command.js';
export * from './delete-post.command.js';

export const commands = [CreatePostCommand.Handler, DeletePostCommand.Handler];
