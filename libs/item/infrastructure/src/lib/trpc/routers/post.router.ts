import { postsRouter as adaptPostRouter } from '@nx-ddd/post-presentation';

import { PostModule } from '../../item.module.js';

export const postsRouter = adaptPostRouter(PostModule);
