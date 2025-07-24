import { Injectable } from '@nestjs/common';

import type { DrizzleDB } from '@nx-ddd/database-infrastructure';
import {
  asc,
  desc,
  eq,
  getTableColumns,
  InjectDrizzle,
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
    const sortFieldKey = (props.sort || 'createdAt') as keyof typeof columns;
    const sortField = post[sortFieldKey]!;
    const { filter, sort, page, perPage, sortDir } = props;
    const query = this.db.query.post.findMany({
      where: filter ? eq(post.title, filter) : undefined,
      orderBy: sort
        ? sortDir === 'asc'
          ? asc(post[sortFieldKey]!)
          : desc(sortField)
        : undefined,
      limit: perPage,
      offset: (page - 1) * perPage,
    });

    // raw query to get total count
    const totalCountQuery = await this.db
      .select({ count: this.db.$count(post.id) })
      .from(post)
      .where(filter ? eq(post.title, filter) : undefined)
      .then((result) => result[0]?.count || 0);

    return query.then((posts) => {
      const entities = posts.map(
        (post) => new PostEntity(post as any, post.id),
      );
      return new PostRepository.SearchResult({
        items: entities,
        total: totalCountQuery,
        currentPage: page,
        perPage,
        sort,
        sortDir,
        filter,
      });
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
