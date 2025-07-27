import { createSelectSchema } from 'drizzle-zod';

import { post } from './schema';

export const postSelectSchema = createSelectSchema(post, {});
