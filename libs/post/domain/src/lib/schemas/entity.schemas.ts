import z from 'zod';

export const postSchema = z.object({
  id: z.string(),
  title: z.string().min(5).max(255),
  content: z.string().optional(),
  ownerId: z.string(),
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

export const likeSchema = z.object({
  id: z.string(),
  userId: z.string(),
  postId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
});

export const likePropsSchema = likeSchema
  .omit({
    id: true,
  })
  .partial({
    updatedAt: true,
    createdAt: true,
  });

export type Post = z.infer<typeof postSchema>;
export type PostProps = z.infer<typeof postPropsSchema>;
export type Like = z.infer<typeof likeSchema>;
export type LikeProps = z.infer<typeof likePropsSchema>;
