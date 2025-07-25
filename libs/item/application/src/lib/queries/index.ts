import { GetPostByIdQuery } from './get-post-by-id.query.js';
import { SearchPostsQuery } from './search-posts.query.js';

export * from './get-post-by-id.query.js';
export * from './search-posts.query.js';

export const queries = [GetPostByIdQuery.Handler, SearchPostsQuery.Handler];
