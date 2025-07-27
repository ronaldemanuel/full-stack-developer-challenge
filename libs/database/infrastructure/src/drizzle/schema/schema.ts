import { sql } from 'drizzle-orm';
import { pgTable, primaryKey } from 'drizzle-orm/pg-core';

import { user } from './auth-schema';

export const post = pgTable('post', (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  title: t.varchar({ length: 256 }).notNull(),
  content: t.text().notNull(),
  onwerId: t
    .text('owner_id')
    .references(() => user.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: 'date', withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
}));

export const like = pgTable(
  'like',
  (t) => ({
    userId: t
      .text('user_id')
      .notNull()
      .references(() => user.id, {
        onDelete: 'cascade',
      }),
    postId: t
      .uuid('post_id')
      .notNull()
      .references(() => post.id, {
        onDelete: 'cascade',
      }),
    createdAt: t.timestamp().defaultNow().notNull(),
    updatedAt: t
      .timestamp({ mode: 'date', withTimezone: true })
      .$onUpdateFn(() => sql`now()`),
  }),
  (t) => ({
    pk: primaryKey({
      columns: [t.userId, t.postId],
      name: 'like_pkey',
    }),
  }),
);
