import { Injectable } from '@nestjs/common';

import type {
  DrizzleDB,
  DrizzleTX,
  SQL,
} from '@nx-ddd/database-infrastructure';
import type { PostEntity } from '@nx-ddd/post-domain';
import {
  asc,
  desc,
  eq,
  getTableColumns,
  InjectDrizzle,
  InjectDrizzleTransaction,
  like,
  or,
} from '@nx-ddd/database-infrastructure';
import { post } from '@nx-ddd/database-infrastructure/drizzle/schema';
import { PostRepository } from '@nx-ddd/post-domain';
import { NotFoundError } from '@nx-ddd/shared-domain';

import { PostDrizzleModelMapper } from '../model/post-drizzle-model.mapper.js';

@Injectable()
export class PostDrizzleRepository implements PostRepository.Repository {
  sortableFields: string[] = ['title', 'createdAt'];
  constructor(
    @InjectDrizzle()
    private readonly db: DrizzleDB,
    @InjectDrizzleTransaction()
    private readonly tx: DrizzleTX,
  ) {}

  findById(id: string): Promise<PostEntity> {
    return this._get(id);
  }
  async findAll(): Promise<PostEntity[]> {
    return this.db.query.post
      .findMany()
      .then((posts) => posts.map(PostDrizzleModelMapper.toEntity));
  }
  async insert(entity: PostEntity): Promise<void> {
    await this.tx
      .insert(post)
      .values(PostDrizzleModelMapper.toPersistence(entity));
  }
  async delete(id: string): Promise<void> {
    await this.tx.delete(post).where(eq(post.id, id));
  }
  update(entity: PostEntity): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async search(
    props: PostRepository.SearchParams,
  ): Promise<PostRepository.SearchResult> {
    const columns = getTableColumns(post);
    const sortFieldKey = (props.sort || post.createdAt) as keyof typeof columns;
    const sortField = post[sortFieldKey]!;
    const { filter, sort, page, perPage, sortDir } = props;
    let filterCondition: SQL | undefined;

    if (filter) {
      filterCondition = or(like(post.title, filter));
    }
    const orderBy = sort
      ? sortDir === 'asc'
        ? asc(post[sortFieldKey]!)
        : desc(sortField)
      : asc(post.createdAt);

    const data = await this.db.query.post.findMany({
      where: filterCondition,
      orderBy: orderBy,
      limit: props.perPage,
      offset: (props.page - 1) * props.perPage,
      with: {
        owner: {
          with: {
            likes: true,
          },
        },
      },
      extras: {
        total: this.db.$count(post, filterCondition).as(`total`),
      },
    });
    const items = data.map(PostDrizzleModelMapper.toEntity);
    const total = data[0]?.total || 0;
    return new PostRepository.SearchResult({
      items,
      total,
      currentPage: page,
      perPage: perPage,
      sort: sort,
      sortDir: sortDir,
      filter: filter,
    });
  }

  private async _get(id: string): Promise<PostEntity> {
    const data = await this.db.query.post.findFirst({
      where: eq(post.id, id),
      with: {
        owner: {
          with: {
            likes: true,
          },
        },
      },
    });
    if (!data) {
      throw new NotFoundError(`Post with id ${id} not found`);
    }
    return PostDrizzleModelMapper.toEntity(data);
  }
}
