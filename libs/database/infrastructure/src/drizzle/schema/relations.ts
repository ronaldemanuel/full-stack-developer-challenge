import { relations } from 'drizzle-orm';

import { user } from './auth-schema';
import { like, post, userItem } from './schema';

export const postRelations = relations(post, ({ one, many }) => ({
  owner: one(user, {
    fields: [post.onwerId],
    references: [user.id],
  }),
  likes: many(like),
}));

export const likeRelations = relations(like, ({ one }) => ({
  post: one(post, {
    fields: [like.postId],
    references: [post.id],
  }),
  user: one(user, {
    fields: [like.userId],
    references: [user.id],
  }),
}));

export const userRelations = relations(user, ({ many }) => ({
  likes: many(like),
  createdPosts: many(post),
  inventory: many(userItem),
}));

export const userItemRelations = relations(userItem, ({ one }) => ({
  user: one(user, {
    fields: [userItem.userId],
    references: [user.id],
  }),
}));
