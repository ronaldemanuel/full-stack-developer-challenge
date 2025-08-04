import { itemsRouter as adaptItemRouter } from '@nx-ddd/item-presentation';

import { ItemModule } from '../../item.module';

export const itemRouter = adaptItemRouter(ItemModule);
