import z from 'zod';

export const postSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(5).max(255),
  content: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const postPropsSchema = postSchema
  .omit({
    id: true,
  })
  .partial({
    createdAt: true,
    updatedAt: true,
  });

export type Post = z.infer<typeof postSchema>;
export type PostProps = z.infer<typeof postPropsSchema>;
