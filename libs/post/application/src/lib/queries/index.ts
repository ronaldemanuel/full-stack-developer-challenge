import { GetPostByIdQuery } from './get-post-by-id.query';
import { SearchPostsQuery } from './search-posts.query';

export * from './get-post-by-id.query';
export * from './search-posts.query';

export const queries = [GetPostByIdQuery.Handler, SearchPostsQuery.Handler];
