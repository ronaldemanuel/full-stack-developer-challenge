import { GetUserInventoryQuery } from './get-user-inventory.query.js';
import { GetAllItemsQuery } from './index.js';

export * from './get-user-inventory.query.js';
export * from './get-all-items.query.js';

export const queries = [
  GetUserInventoryQuery.Handler,
  GetAllItemsQuery.Handler,
];
