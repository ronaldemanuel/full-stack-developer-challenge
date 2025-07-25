import z from 'zod';

import { postSchema } from '@nx-ddd/post-domain';

export const getPostByIdPresentationOutputSchema = postSchema.extend({
  meta: z
    .object({
      liked: z.boolean(),
    })
    .optional(),
});
