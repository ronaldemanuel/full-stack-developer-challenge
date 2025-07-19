import {
  SearchParams,
  type Entity,
  type ISearchableRepository,
  type SearchParamsProps,
} from '@nx-ddd/shared-domain';
import { PaginationOutputMapper } from '../mappers/pagination-output.js';

type MaybePromise<T> = T | Promise<T>;

export abstract class AbstractCrudService<
  E extends Entity,
  InputDto extends object,
  UpdateDto extends object = InputDto,
  SearchFilter = string,
  OutputDto = object
> {
  constructor(private readonly repo: ISearchableRepository<E, SearchFilter>) {}

  protected abstract fromInputToEntity(input: InputDto): MaybePromise<E>;
  protected fromUpdateToEntity(input: UpdateDto): MaybePromise<E> {
    return this.fromInputToEntity(input as unknown as InputDto);
  }
  protected abstract fromEntityToOutput(entity: E): MaybePromise<OutputDto>;

  async create(input: InputDto) {
    const entity = await this.fromInputToEntity(input);
    await this.repo.insert(entity);
    return this.fromEntityToOutput(entity);
  }

  async findById(id: string) {
    const found = await this.repo.findById(id);
    return this.fromEntityToOutput(found);
  }

  async findAll() {
    return Promise.all(
      (await this.repo.findAll()).map((el) => this.fromEntityToOutput(el))
    );
  }

  async update(id: string, input: UpdateDto) {
    const entity = await this.repo.findById(id);
    entity.update(input);
    await this.repo.update(entity);
    return this.fromEntityToOutput(entity);
  }

  async delete(id: string): Promise<true> {
    await this.repo.delete(id);
    return true;
  }

  async search(props: SearchParamsProps<SearchFilter>) {
    class SearchPropsClass extends SearchParams<SearchFilter> {}
    const searchParams = new SearchPropsClass(props);
    const searchResult = await this.repo.search(searchParams);
    const output = PaginationOutputMapper.toOutput(
      await Promise.all(
        searchResult.items.map((el) => this.fromEntityToOutput(el))
      ),
      searchResult
    );
    return output;
  }
}
