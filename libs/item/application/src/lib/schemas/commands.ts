import z from 'zod';

import { postSchema } from '@nx-ddd/post-domain';

export const createPostInputSchema = postSchema.pick({
  title: true,
  content: true,
});

export const deletePostInputSchema = z.object({
  id: z.string(),
});

export type CreatePostInput = z.infer<typeof createPostInputSchema>;
export type DeletePostInput = z.infer<typeof deletePostInputSchema>;
