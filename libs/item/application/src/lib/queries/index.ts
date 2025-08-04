import { GetUserInventoryQuery } from './get-user-inventory.query';
import { GetAllItemsQuery } from './index';

export * from './get-user-inventory.query';
export * from './get-all-items.query';

export const queries = [
  GetUserInventoryQuery.Handler,
  GetAllItemsQuery.Handler,
];
