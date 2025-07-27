import { Injectable } from '@nestjs/common';

import type { DrizzleDB, DrizzleTX } from '@nx-ddd/database-infrastructure';
import type { SQL } from '@nx-ddd/database-infrastructure/drizzle/operators';
import type {
  PostEntity,
  UserEntityPostRef,
  UserRepositoryPostRef,
} from '@nx-ddd/post-domain';
import {
  InjectDrizzle,
  InjectDrizzleTransaction,
} from '@nx-ddd/database-infrastructure';
import {
  and,
  asc,
  desc,
  eq,
  getTableColumns,
  like,
  or,
  sql,
} from '@nx-ddd/database-infrastructure/drizzle/operators';
import {
  like as likeSchema,
  post,
} from '@nx-ddd/database-infrastructure/drizzle/schema';
import { PostLikedAggregate, PostRepository } from '@nx-ddd/post-domain';
import {
  NotFoundError,
  RelationshipNotLoadedError,
} from '@nx-ddd/shared-domain';

import { LikeDrizzleModelMapper } from '../model/like-drizzle-model.mapper';
import { PostDrizzleModelMapper } from '../model/post-drizzle-model.mapper';

@Injectable()
export class PostDrizzleRepository implements PostRepository.Repository {
  sortableFields: string[] = ['title', 'createdAt'];
  constructor(
    @InjectDrizzle()
    private readonly db: DrizzleDB,
    @InjectDrizzleTransaction()
    private readonly tx: DrizzleTX,
  ) {}
  findById(id: string): Promise<PostEntity>;
  findById(
    id: string,
    scopes: { likedByUserId: string },
  ): Promise<PostLikedAggregate>;
  findById(
    id: string,
    scopes?: { likedByUserId: string } | undefined,
  ): Promise<PostEntity | PostLikedAggregate> {
    return this._get(id, scopes);
  }
  userRepository?: UserRepositoryPostRef.Repository | undefined;
  async saveUser(user: UserEntityPostRef) {
    if (!this.userRepository) {
      throw new RelationshipNotLoadedError('User repository is not defined');
    }
    // generate a upsert query that toggles the likes of the user creating new likes if they don't exist and removing them if they do
    await Promise.all([
      user.$watchedRelations.likes.getRemovedItems().length
        ? this.tx.execute(
            sql`
    DELETE FROM ${likeSchema}
    WHERE (user_id, post_id) IN (
      ${sql.join(
        user.$watchedRelations.likes
          .getRemovedItems()
          .map((like) => sql`(${like.user.id}, ${like.post.id})`),
        sql`, `,
      )}
    )`,
          )
        : undefined,
      user.$watchedRelations.likes.getNewItems().length
        ? this.tx
            .insert(likeSchema)
            .values(
              user.$watchedRelations.likes
                .getNewItems()
                .map((like) => LikeDrizzleModelMapper.toPersistence(like)),
            )
        : undefined,
    ]);
  }

  async findAll(): Promise<PostEntity[]> {
    return this.db.query.post
      .findMany({
        with: {
          owner: {
            with: {
              likes: true,
            },
          },
        },
      })
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
  async update(entity: PostEntity): Promise<void> {
    await this.tx
      .update(post)
      .set(PostDrizzleModelMapper.toPersistence(entity));
    if (this.userRepository) {
      await Promise.all([
        entity.$watchedRelations.likes.getRemovedItems().length
          ? this.tx.execute(
              sql`
    DELETE FROM ${likeSchema}
    WHERE (user_id, post_id) IN (
      ${sql.join(
        entity.$watchedRelations.likes
          .getRemovedItems()
          .map((like) => sql`(${like.user.id}, ${like.post.id})`),
        sql`, `,
      )}
    )`,
            )
          : undefined,
        entity.$watchedRelations.likes.getNewItems().length
          ? this.tx
              .insert(likeSchema)
              .values(
                entity.$watchedRelations.likes
                  .getNewItems()
                  .map((like) => LikeDrizzleModelMapper.toPersistence(like)),
              )
          : undefined,
      ]);
    }
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
      filterCondition = or(like(post.title, '%' + filter + '%'));
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
        owner: true,
        likes: true,
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

  private async _get(
    id: string,
    scopes?: { likedByUserId: string } | undefined,
  ): Promise<PostEntity | PostLikedAggregate> {
    const data = await this.db.query.post.findFirst({
      where: eq(post.id, id),
      with: {
        owner: true,
        likes: true,
      },
      extras: {
        // returns true if the post is liked by the user with the given id
        metaLiked: scopes?.likedByUserId
          ? sql<boolean>`EXISTS (
              ${this.db
                .select()
                .from(likeSchema)
                .where(
                  and(
                    eq(likeSchema.postId, id),
                    eq(likeSchema.userId, scopes.likedByUserId),
                  ),
                )}
            )`.as('metaLiked')
          : sql<boolean>`false`.as('metaLiked'),
      },
    });

    if (!data) {
      throw new NotFoundError(`Post with id ${id} not found`);
    }
    const response = PostDrizzleModelMapper.toEntity(data);

    if (scopes?.likedByUserId) {
      return PostLikedAggregate.create({
        liked: data.metaLiked,
        post: response,
      });
    }

    return response;
  }
}
