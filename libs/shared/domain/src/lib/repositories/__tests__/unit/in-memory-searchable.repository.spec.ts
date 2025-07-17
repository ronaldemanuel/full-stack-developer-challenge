import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Entity } from '../../../entities/entity.js';
import { InMemorySearchableRepository } from '../../in-memory-searchable.repository.js';
import {
  SearchParams,
  SearchResult,
} from '../../searchable-repository.contracts.js';

interface StubEntityProps {
  name: string;
  price: number;
}

class StubEntity extends Entity<StubEntityProps> {
  get name(): string {
    return this.props.name;
  }
}

class StubInMemorySearchableRepository extends InMemorySearchableRepository<StubEntity> {
  override sortableFields: string[] = ['name'];

  public async applyFilter(
    items: StubEntity[],
    filter: string | null
  ): Promise<StubEntity[]> {
    if (!filter) {
      return items;
    }

    return Promise.resolve(
      items.filter((item) => {
        return item.name.toLowerCase().includes(filter.toLowerCase());
      })
    );
  }

  public override async applyPaginate(
    items: StubEntity[],
    page: SearchParams['page'],
    perPage: SearchParams['perPage']
  ): Promise<StubEntity[]> {
    return super.applyPaginate(items, page, perPage);
  }

  public override async applySort(
    items: StubEntity[],
    sort: string | null,
    sortDir: string | null
  ): Promise<StubEntity[]> {
    return super.applySort(items, sort, sortDir);
  }
}

describe('InMemoryRepository unit tests', () => {
  let sut: StubInMemorySearchableRepository;

  beforeEach(() => {
    sut = new StubInMemorySearchableRepository();
  });

  describe('applyFilter method', () => {
    it('should no filter items when filter param is null', async () => {
      const items = [new StubEntity({ name: 'name value', price: 50 })];
      const spyFilterMethod = vi.spyOn(items, 'filter');
      const itemsFiltered = await sut.applyFilter(items, null);
      expect(itemsFiltered).toStrictEqual(items);
      expect(spyFilterMethod).not.toHaveBeenCalled();
    });

    it('should filter using a filter param', async () => {
      const items = [
        new StubEntity({ name: 'test', price: 50 }),
        new StubEntity({ name: 'TEST', price: 50 }),
        new StubEntity({ name: 'fake', price: 50 }),
      ];
      const spyFilterMethod = vi.spyOn(items, 'filter');
      let itemsFiltered = await sut.applyFilter(items, 'TEST');
      expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
      expect(spyFilterMethod).toHaveBeenCalledTimes(1);

      itemsFiltered = await sut.applyFilter(items, 'test');
      expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
      expect(spyFilterMethod).toHaveBeenCalledTimes(2);

      itemsFiltered = await sut.applyFilter(items, 'no-filter');
      expect(itemsFiltered).toHaveLength(0);
      expect(spyFilterMethod).toHaveBeenCalledTimes(3);
    });
  });

  describe('applySort method', () => {
    it('should no sort items', async () => {
      const items = [
        new StubEntity({ name: 'b', price: 50 }),
        new StubEntity({ name: 'a', price: 50 }),
      ];

      let itemsSorted = await sut.applySort(items, null, null);
      expect(itemsSorted).toStrictEqual(items);

      itemsSorted = await sut.applySort(items, 'price', 'asc');
      expect(itemsSorted).toStrictEqual(items);
    });

    it('should sort items', async () => {
      const items = [
        new StubEntity({ name: 'b', price: 50 }),
        new StubEntity({ name: 'a', price: 50 }),
        new StubEntity({ name: 'c', price: 50 }),
      ];

      let itemsSorted = await sut.applySort(items, 'name', 'asc');
      expect(itemsSorted).toStrictEqual([items[1], items[0], items[2]]);

      itemsSorted = await sut.applySort(items, 'name', 'desc');
      expect(itemsSorted).toStrictEqual([items[2], items[0], items[1]]);
    });
  });

  describe('applyPaginate method', () => {
    it('should paginate items', async () => {
      const items = [
        new StubEntity({ name: 'a', price: 50 }),
        new StubEntity({ name: 'b', price: 50 }),
        new StubEntity({ name: 'c', price: 50 }),
        new StubEntity({ name: 'd', price: 50 }),
        new StubEntity({ name: 'e', price: 50 }),
      ];

      let itemsPaginated = await sut.applyPaginate(items, 1, 2);
      expect(itemsPaginated).toStrictEqual([items[0], items[1]]);

      itemsPaginated = await sut.applyPaginate(items, 2, 2);
      expect(itemsPaginated).toStrictEqual([items[2], items[3]]);

      itemsPaginated = await sut.applyPaginate(items, 3, 2);
      expect(itemsPaginated).toStrictEqual([items[4]]);

      itemsPaginated = await sut.applyPaginate(items, 4, 2);
      expect(itemsPaginated).toStrictEqual([]);
    });
  });

  describe('search method', () => {
    it('should apply only pagination when the other params are null', async () => {
      const entity = new StubEntity({ name: 'test', price: 50 });
      const items = Array(16).fill(entity);
      sut.items = items as StubEntity[];

      const params = await sut.search(new SearchParams());
      expect(params).toStrictEqual(
        new SearchResult({
          items: Array(15).fill(entity),
          total: 16,
          currentPage: 1,
          perPage: 15,
          sort: null,
          sortDir: null,
          filter: null,
        })
      );
    });

    it('should apply paginate and filter', async () => {
      const items = [
        new StubEntity({ name: 'test', price: 50 }),
        new StubEntity({ name: 'a', price: 50 }),
        new StubEntity({ name: 'TEST', price: 50 }),
        new StubEntity({ name: 'TeSt', price: 50 }),
      ];
      sut.items = items;

      let params = await sut.search(
        new SearchParams({
          page: 1,
          perPage: 2,
          filter: 'TEST',
        })
      );
      const expectedItems = [items[0], items[2]] as StubEntity[];

      expect(params).toStrictEqual(
        new SearchResult({
          items: expectedItems,
          total: 3,
          currentPage: 1,
          perPage: 2,
          sort: null,
          sortDir: null,
          filter: 'TEST',
        })
      );

      params = await sut.search(
        new SearchParams({
          page: 2,
          perPage: 2,
          filter: 'TEST',
        })
      );
      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[3]] as StubEntity[],
          total: 3,
          currentPage: 2,
          perPage: 2,
          sort: null,
          sortDir: null,
          filter: 'TEST',
        })
      );
    });

    it('should apply paginate and sort', async () => {
      const items = [
        new StubEntity({ name: 'b', price: 50 }),
        new StubEntity({ name: 'a', price: 50 }),
        new StubEntity({ name: 'd', price: 50 }),
        new StubEntity({ name: 'e', price: 50 }),
        new StubEntity({ name: 'c', price: 50 }),
      ];
      sut.items = items;

      let params = await sut.search(
        new SearchParams({
          page: 1,
          perPage: 2,
          sort: 'name',
        })
      );
      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[3], items[2]] as StubEntity[],
          total: 5,
          currentPage: 1,
          perPage: 2,
          sort: 'name',
          sortDir: 'desc',
          filter: null,
        })
      );

      params = await sut.search(
        new SearchParams({
          page: 2,
          perPage: 2,
          sort: 'name',
        })
      );
      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[4], items[0]] as StubEntity[],
          total: 5,
          currentPage: 2,
          perPage: 2,
          sort: 'name',
          sortDir: 'desc',
          filter: null,
        })
      );

      params = await sut.search(
        new SearchParams({
          page: 1,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
        })
      );
      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[1], items[0]] as StubEntity[],
          total: 5,
          currentPage: 1,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          filter: null,
        })
      );

      params = await sut.search(
        new SearchParams({
          page: 3,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
        })
      );
      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[3]] as StubEntity[],
          total: 5,
          currentPage: 3,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          filter: null,
        })
      );
    });

    it('should search using paginate, sort and filter', async () => {
      const items = [
        new StubEntity({ name: 'test', price: 50 }),
        new StubEntity({ name: 'a', price: 50 }),
        new StubEntity({ name: 'TEST', price: 50 }),
        new StubEntity({ name: 'e', price: 50 }),
        new StubEntity({ name: 'TeSt', price: 50 }),
      ];
      sut.items = items;

      let params = await sut.search(
        new SearchParams({
          page: 1,
          perPage: 2,
          sort: 'name',
          filter: 'TEST',
        })
      );
      const expectedItems = [items[0], items[4]] as StubEntity[];
      expect(params).toStrictEqual(
        new SearchResult({
          items: expectedItems,
          total: 3,
          currentPage: 1,
          perPage: 2,
          sort: 'name',
          sortDir: 'desc',
          filter: 'TEST',
        })
      );

      params = await sut.search(
        new SearchParams({
          page: 2,
          perPage: 2,
          sort: 'name',
          filter: 'TEST',
        })
      );
      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[2]] as StubEntity[],
          total: 3,
          currentPage: 2,
          perPage: 2,
          sort: 'name',
          sortDir: 'desc',
          filter: 'TEST',
        })
      );
    });
  });
});
