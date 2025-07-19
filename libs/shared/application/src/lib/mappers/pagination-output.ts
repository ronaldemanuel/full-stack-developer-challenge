import type { Entity, PaginationOutput } from '@nx-ddd/shared-domain';

export class PaginationOutputMapper {
  static toOutput<Item = any>(
    items: Item[],
    result: PaginationOutput<Entity>
  ): PaginationOutput<Item> {
    return {
      items,
      total: result.total,
      currentPage: result.currentPage,
      lastPage: result.lastPage,
      perPage: result.perPage,
    };
  }
}
