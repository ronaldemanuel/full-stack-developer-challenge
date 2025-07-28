import { Inject } from '@nestjs/common';

import type {
  inferProcedureBuilderResolverContext,
  protectedProcedure,
} from '@nx-ddd/shared-presentation';
import {
  AddItemToInventoryUseCase,
  ListAllItemsUseCase,
  ListUserInventoryUseCase,
  UseItemUseCase,
} from '@nx-ddd/item-application';
import { UserItemRef } from '@nx-ddd/item-domain';
import { Ctx, Input } from '@nx-ddd/shared-presentation';

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
