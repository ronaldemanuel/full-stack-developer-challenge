import type { Entity } from '../entities/entity';

export type IntersectRepositories<L, R> = {
  [K in keyof (L & R)]: K extends keyof L
    ? L[K]
    : K extends keyof R
      ? R[K]
      : never;
};

export interface IReadableRepository<E extends Entity> {
  findById(id: string): Promise<E>;
  findAll(): Promise<E[]>;
}

export interface IInsertableRepository<E extends Entity> {
  insert(entity: E): Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface IDeletableRepository<_E extends Entity> {
  delete(id: string): Promise<void>;
}

export interface IUpdatableRepository<E extends Entity> {
  update(entity: E): Promise<void>;
}

export interface IRepository<E extends Entity>
  extends IReadableRepository<E>,
    IInsertableRepository<E>,
    IDeletableRepository<E>,
    IUpdatableRepository<E> {}
