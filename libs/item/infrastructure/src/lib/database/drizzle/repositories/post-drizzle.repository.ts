import { Injectable } from '@nestjs/common';

import type { DrizzleDB, SQL } from '@nx-ddd/database-infrastructure';
import {
  asc,
  count,
  desc,
  eq,
  getTableColumns,
  InjectDrizzle,
  like,
  or,
  sql,
} from '@nx-ddd/database-infrastructure';
import { post } from '@nx-ddd/database-infrastructure/drizzle/schema';
import { PostEntity, PostRepository } from '@nx-ddd/post-domain';
import { NotFoundError } from '@nx-ddd/shared-domain';

@Injectable()
export class PostDrizzleRepository implements PostRepository.Repository {
  sortableFields: string[] = ['title', 'createdAt'];
  constructor(
    @InjectDrizzle()
    private readonly db: DrizzleDB,
  ) {}

  findById(id: string): Promise<PostEntity> {
    return this._get(id);
  }
  async findAll(): Promise<PostEntity[]> {
    return this.db.query.post
      .findMany()
      .then((posts) =>
        posts.map((post) => new PostEntity(post as any, post.id)),
      );
  }
  async insert(entity: PostEntity): Promise<void> {
    await this.db.insert(post).values(entity.toJSON());
  }
  async delete(id: string): Promise<void> {
    await this.db.delete(post).where(eq(post.id, id));
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
    const countWithQuery = this.db.$with('total').as(
      this.db
        .select({
          count: count(post.id).as('count'),
        })
        .from(post)
        .where(filterCondition),
    );
    const preQuery = this.db
      .with(countWithQuery)
      .select({
        data: post,
        total: countWithQuery.count,
      })
      .from(post)
      .innerJoin(countWithQuery, sql`1=1`)
      .where(filterCondition)
      .limit(props.perPage)
      .offset((props.page - 1) * props.perPage)
      .orderBy(orderBy);
    const query = await preQuery;
    const total = query[0]?.total ?? 0;
    const items = query.map((item) => {
      return new PostEntity(item.data as any, item.data.id);
    });

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
    });
    if (!data) {
      throw new NotFoundError(`Post with id ${id} not found`);
    }
    return new PostEntity(data as any, data.id);
  }
}
