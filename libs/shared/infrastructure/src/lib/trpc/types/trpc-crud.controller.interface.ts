/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AbstractCrudService } from '@nx-ddd/shared-application';
import type { Entity, SearchParams, SearchResult } from '@nx-ddd/shared-domain';

export interface ITrpcCrudController<
  E extends Entity,
  InputDto extends Record<string, any>,
  UpdateDto extends Record<string, any> = InputDto,
  SearchFilter = string,
> {
  service: AbstractCrudService<E, InputDto, UpdateDto, SearchFilter>;
  create?: (input: InputDto) => Promise<E>;
  findById?: (id: string) => Promise<E>;
  findAll?: () => Promise<E[]>;
  update?: (id: string, input: UpdateDto) => Promise<E>;
  delete?: (id: string) => Promise<boolean>;
  search?: (
    props: SearchParams<SearchFilter>,
  ) => Promise<SearchResult<E, SearchFilter>>;
}
