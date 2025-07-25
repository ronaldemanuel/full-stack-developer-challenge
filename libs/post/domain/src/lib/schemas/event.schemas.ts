import z from 'zod';

import { postSchema } from './entity.schemas.js';

export const postCreatedEventPropsSchema = postSchema;

export const postLikedEventPropsSchema = z.object({
  postId: z.string().uuid(),
  userId: z.string().uuid(),
  date: z.date().optional(),
});

export const postLikeRemovedPropsSchema = postLikedEventPropsSchema;

export type PostLikeRemovedProps = z.infer<typeof postLikeRemovedPropsSchema>;
export type PostCreatedEventProps = z.infer<typeof postCreatedEventPropsSchema>;
export type PostLikedEventProps = z.infer<typeof postLikedEventPropsSchema>;
