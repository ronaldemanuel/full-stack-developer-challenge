import z from 'zod';

import { postSchema } from '@nx-ddd/post-domain';

export const createPostInputSchema = postSchema.pick({
  title: true,
  content: true,
});

export const deletePostInputSchema = z.object({
  id: z.string(),
});

export const useItemInputSchema = z.object({
  userId: z.string().uuid(),
  itemId: z.string().uuid(),
});

export type CreatePostInput = z.infer<typeof createPostInputSchema>;
export type DeletePostInput = z.infer<typeof deletePostInputSchema>;
export type UseItemInput = z.infer<typeof useItemInputSchema>;
