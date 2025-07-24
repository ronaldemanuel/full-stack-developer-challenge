'use client';

import React from 'react';
import { useTRPC } from '@/trpc/react';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function PostsPageClient() {
  const trpc = useTRPC();
  const { data: posts } = useSuspenseQuery(trpc.post.search.queryOptions({}));

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts.items.map((post) => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
