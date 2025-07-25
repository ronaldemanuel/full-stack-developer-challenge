import z from 'zod';

import { searchParamsPropsSchema } from '@nx-ddd/shared-domain';

export const searchPostsFilterSchema = z.object({
  search: z.string().optional(),
  authorId: z.string().optional(),
});

export const searchPostsInputSchema = searchParamsPropsSchema({
  filterSchema: searchPostsFilterSchema,
});

export const getPostByIdInputSchema = z.object({
  id: z.string(),
});

export type SearchPostsFilter = z.infer<typeof searchPostsFilterSchema>;
export type SearchPostsInput = z.infer<typeof searchPostsInputSchema>;
export type GetPostByIdInput = z.infer<typeof getPostByIdInputSchema>;
