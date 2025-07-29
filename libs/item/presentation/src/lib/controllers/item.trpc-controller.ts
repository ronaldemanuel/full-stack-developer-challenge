import { Inject } from '@nestjs/common';
import z from 'zod';

import type { inferProcedureBuilderResolverContext } from '@nx-ddd/shared-presentation';
import {
  addItemToInventoryInputSchema,
  AddItemToInventoryUseCase,
  ListAllItemsUseCase,
  ListUserInventoryUseCase,
  useItemInputSchema,
  UseItemUseCase,
} from '@nx-ddd/item-application';
import { itemSchema, UserItemRef } from '@nx-ddd/item-domain';
import {
  createNestjsTrpcRouter,
  Ctx,
  Input,
  protectedProcedure,
  publicProcedure,
} from '@nx-ddd/shared-presentation';

export class ItemTrpcController {
  @Inject(ListAllItemsUseCase.UseCase)
  private readonly listAllItemsUseCase!: ListAllItemsUseCase.UseCase;
  @Inject(ListUserInventoryUseCase.UseCase)
  private readonly listUserInventoryUseCase!: ListUserInventoryUseCase.UseCase;
  @Inject(UseItemUseCase.UseCase)
  private readonly useItemUseCase!: UseItemUseCase.UseCase;
  @Inject(AddItemToInventoryUseCase.UseCase)
  private readonly addItemToInventoryUseCase!: AddItemToInventoryUseCase.UseCase;

  async getAllItems() {
    return this.listAllItemsUseCase.execute({});
  }

  async getUserItems(
    @Ctx() ctx: inferProcedureBuilderResolverContext<typeof protectedProcedure>,
  ) {
    return await this.listUserInventoryUseCase.execute(
      UserItemRef.cast(ctx.session.user),
    );
  }

  async useItem(
    @Input()
    input: UseItemUseCase.Input,
    @Ctx() ctx: inferProcedureBuilderResolverContext<typeof protectedProcedure>,
  ) {
    return await this.useItemUseCase.execute({
      ...input,
      user: UserItemRef.cast(ctx.session.user),
    });
  }

  async addItemToInventory(
    @Input()
    input: AddItemToInventoryUseCase.Input,
    @Ctx() ctx: inferProcedureBuilderResolverContext<typeof protectedProcedure>,
  ) {
    return await this.addItemToInventoryUseCase.execute({
      ...input,
      user: UserItemRef.cast(ctx.session.user),
    });
  }
}

export const itemsRouter = createNestjsTrpcRouter(
  ItemTrpcController,
  (adapter) => {
    return {
      getAllItems: publicProcedure
        .input(z.object({}))
        .query(adapter.adaptMethod('getAllItems')),
      getUserItems: publicProcedure
        .input(z.object({}))
        .output(z.array(itemSchema))
        .query(adapter.adaptMethod('getUserItems')),
      useItem: protectedProcedure
        .input(useItemInputSchema)
        .mutation(adapter.adaptMethod('useItem')),
      addItemToInventory: protectedProcedure
        .input(addItemToInventoryInputSchema)
        .mutation(adapter.adaptMethod('addItemToInventory')),
    };
  },
);
