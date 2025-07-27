import z from 'zod';

import { postSchema } from './entity.schemas';

export const postCreatedEventPropsSchema = postSchema;

export const postLikedEventPropsSchema = z.object({
  postId: z.string(),
  userId: z.string(),
  date: z.date().optional(),
});

export const postLikeRemovedPropsSchema = postLikedEventPropsSchema;

export type PostLikeRemovedProps = z.infer<typeof postLikeRemovedPropsSchema>;
export type PostCreatedEventProps = z.infer<typeof postCreatedEventPropsSchema>;
export type PostLikedEventProps = z.infer<typeof postLikedEventPropsSchema>;
