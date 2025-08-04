import { AddItemToInventoryCommand } from './add-item-to-inventory.command';
import { UseItemCommand } from './use-item.command';

export * from './use-item.command';
export * from './add-item-to-inventory.command';

export const commands = [
  UseItemCommand.Handler,
  AddItemToInventoryCommand.Handler,
];
