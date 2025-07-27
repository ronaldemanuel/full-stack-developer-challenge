import type { Entity } from '../entities/entity';
import type { IRepository } from './repository.contracts';
import type {
  ISearchable,
  SearchParams,
} from './searchable-repository.contracts';
import { InMemoryRepository } from './in-memory.repository';
import { SearchResult } from './searchable-repository.contracts';

export abstract class InMemorySearchableRepository<E extends Entity>
  extends InMemoryRepository<E>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  implements IRepository<E>, ISearchable<E, any, any>
{
  sortableFields: string[] = [];

  async search(props: SearchParams): Promise<SearchResult<E>> {
    const itemsFiltered = await this.applyFilter(this.items, props.filter);
    const itemsSorted = await this.applySort(
      itemsFiltered,
      props.sort,
      props.sortDir,
    );
    const itemsPaginated = await this.applyPaginate(
      itemsSorted,
      props.page,
      props.perPage,
    );
    return new SearchResult({
      items: itemsPaginated,
      total: itemsFiltered.length,
      currentPage: props.page,
      perPage: props.perPage,
      sort: props.sort,
      sortDir: props.sortDir,
      filter: props.filter,
    });
  }

  protected abstract applyFilter(
    items: E[],
    filter: string | null,
  ): Promise<E[]>;

  protected async applySort(
    items: E[],
    sort: string | null,
    sortDir: string | null,
  ): Promise<E[]> {
    if (!sort || !this.sortableFields.includes(sort)) {
      return items;
    }
    return Promise.resolve(
      [...items].sort((a, b) => {
        const aProps = a.toJSON();
        const bProps = b.toJSON();

        const sortA = aProps[sort as keyof typeof aProps];
        const sortB = bProps[sort as keyof typeof bProps];

        if (sortA < sortB) {
          return sortDir === 'asc' ? -1 : 1;
        }
        if (sortA > sortB) {
          return sortDir === 'asc' ? 1 : -1;
        }
        return 0;
      }),
    );
  }

  protected async applyPaginate(
    items: E[],
    page: SearchParams['page'],
    perPage: SearchParams['perPage'],
  ): Promise<E[]> {
    const start = (page - 1) * perPage;
    const limit = start + perPage;
    return Promise.resolve(items.slice(start, limit));
  }
}
