import { postsRouter as adaptPostRouter } from '@nx-ddd/post-presentation';

import { PostModule } from '../../post.module';

export const postsRouter = adaptPostRouter(PostModule);
