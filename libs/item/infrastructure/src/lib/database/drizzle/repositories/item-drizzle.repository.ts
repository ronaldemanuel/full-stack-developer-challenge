import { Inject, Injectable } from '@nestjs/common';
import { ITEMS } from 'node_modules/@nx-ddd/post-domain/src/lib/constants/items.js';

import type { DrizzleDB, DrizzleTX } from '@nx-ddd/database-infrastructure';
import type { ItemEntity } from '@nx-ddd/post-domain';
import type { UserRepository } from '@nx-ddd/user-domain';
import {
  InjectDrizzle,
  InjectDrizzleTransaction,
} from '@nx-ddd/database-infrastructure';
import { and, eq } from '@nx-ddd/database-infrastructure/drizzle/operators';
import { user, userItem } from '@nx-ddd/database-infrastructure/drizzle/schema';
import { ItemMapper, ItemRepository } from '@nx-ddd/post-domain';
import { NotFoundError } from '@nx-ddd/shared-domain';

@Injectable()
export class ItemDrizzleRepository implements ItemRepository.Repository {
  constructor(
    @InjectDrizzle()
    private readonly db: DrizzleDB,
    @InjectDrizzleTransaction()
    private readonly tx: DrizzleTX,
    @Inject(ItemRepository.TOKEN)
    private readonly itemRepository: ItemRepository.Repository,
  ) {}

  async findById(id: string): Promise<ItemEntity> {
    const item = await this.itemRepository.findById(id);

    if (!item) {
      throw new NotFoundError('Item not found');
    }

    return ItemMapper.toDomain(item);
  }

  async findByUserId(userId: string): Promise<ItemEntity[]> {
    const rows = await this.db.query.userItem.findMany({
      where: eq(userItem.userId, userId),
    });

    const entities = await Promise.all(
      rows.map(async (row) => {
        const itemData = await this.itemRepository.findById(row.itemId);
        if (!itemData) return null;

        return ItemMapper.toDomain(itemData);
      }),
    );

    return entities.filter((entity): entity is ItemEntity => entity !== null);
  }

  async findAll(): Promise<ItemEntity[]> {
    return Object.values(ITEMS).map((data) => ItemMapper.toDomain(data));
  }

  async update(item: ItemEntity): Promise<void> {
    const { id: itemId } = item;

    const character = item.character;

    if (!character.id) {
      throw new Error(
        'characterId (usuário) é obrigatório para atualizar o inventário',
      );
    }

    const existing = await this.db.query.userItem.findFirst({
      where: and(
        eq(userItem.userId, character.id),
        eq(userItem.itemId, itemId),
      ),
    });

    if (!existing) {
      await this.db.insert(userItem).values({
        userId: character.id,
        itemId,
      });
    } else {
      this.db
        .update(user)
        .set({
          hpLevel: character.hpLevel,
          spLevel: character.spLevel,
          mpLevel: character.mpLevel,
        })
        .where(eq(user.id, character.id));
    }
  }

  userRepository?: UserRepository.Repository | undefined;

  insert(entity: ItemEntity): Promise<void> {
    throw new Error('Method not implemented.');
  }

  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
