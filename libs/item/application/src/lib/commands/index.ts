import { AddItemToInventoryCommand } from './add-item-to-inventory.command.js';
import { UseItemCommand } from './use-item.command.js';

export * from './use-item.command.js';
export * from './add-item-to-inventory.command.js';

export const commands = [
  UseItemCommand.Handler,
  AddItemToInventoryCommand.Handler,
];
