import { Injectable } from '@nestjs/common';

import type { DrizzleDB, DrizzleTX } from '@nx-ddd/database-infrastructure';
import type { Entity, IRepository } from '@nx-ddd/shared-domain';
import type { UserEntity, UserRepository } from '@nx-ddd/user-domain';
import {
  InjectDrizzle,
  InjectDrizzleTransaction,
} from '@nx-ddd/database-infrastructure';
import { eq } from '@nx-ddd/database-infrastructure/drizzle/operators';
import { user } from '@nx-ddd/database-infrastructure/drizzle/schema';
import { NotFoundError } from '@nx-ddd/shared-domain';

import { UserDrizzleModelMapper } from '../model/user-drizzle-model.mapper';

@Injectable()
export class UserDrizzleRepository implements UserRepository.Repository {
  sortableFields: string[] = ['title', 'createdAt'];
  postRepository?: IRepository<Entity>;
  constructor(
    @InjectDrizzle()
    private readonly db: DrizzleDB,
    @InjectDrizzleTransaction()
    private readonly tx: DrizzleTX,
  ) {}

  findById(id: string): Promise<UserEntity> {
    return this._get(id);
  }
  async findAll(): Promise<UserEntity[]> {
    return this.db.query.user
      .findMany({
        with: {
          createdPosts: this.postRepository ? true : undefined,
          likes: this.postRepository ? true : undefined,
        },
      })
      .then((users) => users.map(UserDrizzleModelMapper.toEntity));
  }
  async insert(entity: UserEntity): Promise<void> {
    await this.tx
      .insert(user)
      .values(UserDrizzleModelMapper.toPersistence(entity));
  }
  async delete(id: string): Promise<void> {
    await this.tx.delete(user).where(eq(user.id, id));
  }
  update(entity: UserEntity): Promise<void> {
    throw new Error('Method not implemented.');
  }
  // async search(
  //   props: UserRepository.SearchParams,
  // ): Promise<UserRepository.SearchResult> {
  //   const columns = getTableColumns(user);
  //   const sortFieldKey = (props.sort || user.createdAt) as keyof typeof columns;
  //   const sortField = user[sortFieldKey]!;
  //   const { filter, sort, page, perPage, sortDir } = props;
  //   let filterCondition: SQL | undefined;

  //   if (filter) {
  //     filterCondition = or(like(user.title, filter));
  //   }
  //   const orderBy = sort
  //     ? sortDir === 'asc'
  //       ? asc(user[sortFieldKey]!)
  //       : desc(sortField)
  //     : asc(user.createdAt);

  //   const data = await this.db.query.user.findMany({
  //     where: filterCondition,
  //     orderBy: orderBy,
  //     limit: props.perPage,
  //     offset: (props.page - 1) * props.perPage,
  //     with: {
  //       owner: {
  //         with: {
  //           likes: true,
  //         },
  //       },
  //     },
  //     extras: {
  //       total: this.db.$count(user, filterCondition).as(`total`),
  //     },
  //   });
  //   const items = data.map(UserDrizzleModelMapper.toEntity);
  //   const total = data[0]?.total || 0;
  //   return new UserRepository.SearchResult({
  //     items,
  //     total,
  //     currentPage: page,
  //     perPage: perPage,
  //     sort: sort,
  //     sortDir: sortDir,
  //     filter: filter,
  //   });
  // }

  private async _get(id: string): Promise<UserEntity> {
    const data = await this.db.query.user.findFirst({
      where: eq(user.id, id),
      with: {
        createdPosts: this.postRepository ? true : undefined,
        likes: this.postRepository
          ? {
              with: {
                post: true,
              },
            }
          : undefined,
      },
    });
    if (!data) {
      throw new NotFoundError(`user with id ${id} not found`);
    }
    return UserDrizzleModelMapper.toEntity(data);
  }
}
