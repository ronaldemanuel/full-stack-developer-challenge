import z from 'zod';

import { userSchema } from '@nx-ddd/user-domain';

export const postSchema = z.object({
  id: z.string(),
  title: z.string().min(5).max(255),
  content: z.string().optional(),
  ownerId: z.string(),
  owner: userSchema.optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
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
  post: postSchema.optional(),
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

export const userPostRefSchema = userSchema.extend({
  likes: z.array(likeSchema).optional(),
  createdPosts: z.array(postSchema).optional(),
});

export const userPostRefPropsSchema = userPostRefSchema
  .omit({
    id: true,
  })
  .partial({
    createdAt: true,
    updatedAt: true,
  });

export type UserPostRefProps = z.infer<typeof userPostRefPropsSchema>;
export type UserPostRef = z.infer<typeof userPostRefSchema>;
export type Post = z.infer<typeof postSchema>;
export type PostProps = z.infer<typeof postPropsSchema>;
export type Like = z.infer<typeof likeSchema>;
export type LikeProps = z.infer<typeof likePropsSchema>;
