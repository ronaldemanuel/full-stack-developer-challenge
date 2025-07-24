import React from 'react';
import { HydrateClient, prefetch, trpc } from '@/trpc/server';

import PostsPageClient from './page-client';

export default function PostsPage() {
  prefetch(trpc.post.search.queryOptions({}));
  return (
    <HydrateClient>
      <PostsPageClient />
    </HydrateClient>
  );
}
