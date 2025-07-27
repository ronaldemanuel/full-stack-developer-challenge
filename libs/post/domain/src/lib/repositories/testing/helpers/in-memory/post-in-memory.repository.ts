import { InMemorySearchableRepository } from '@nx-ddd/shared-domain';

import type { UserEntityPostRef } from '../../../../entities/index';
import type { PostEntity } from '../../../../entities/post.entity';
import type { PostRepository } from '../../../../repositories/post.repository';
import type { UserRepositoryPostRef } from '../../../../repositories/refs/user-repository-post.ref';
import { PostLikedAggregate } from '../../../../aggregates/post-liked.aggregate';

export class PostInMemoryRepository
  extends InMemorySearchableRepository<PostEntity>
  implements PostRepository.Repository
{
  protected override applyFilter(
    items: PostEntity[],
    filter: string | null,
  ): Promise<PostEntity[]> {
    if (!filter) {
      return Promise.resolve(items);
    }
    const lowerFilter = filter.toLowerCase();
    return Promise.resolve(
      items.filter((item) => item.title.toLowerCase().includes(lowerFilter)),
    );
  }
  userRepository?: UserRepositoryPostRef.Repository | undefined;
  saveUser(user: UserEntityPostRef): Promise<void> {
    if (!this.userRepository) {
      throw new Error('User repository is not defined');
    }
    return this.userRepository.update(user);
  }
  override sortableFields: string[] = ['title', 'createdAt'];
  override findById(id: string): Promise<PostEntity>;
  override findById(
    id: string,
    scopes: { likedByUserId: string },
  ): Promise<PostLikedAggregate>;
  override async findById(
    id: string,
    scopes?: { likedByUserId: string } | undefined,
  ): Promise<PostEntity | PostLikedAggregate> {
    const post = await super.findById(id);
    if (scopes?.likedByUserId) {
      const user = await this.userRepository?.findById(scopes.likedByUserId);
      const liked = user?.likedPosts.find((p) => p.id === post.id);
      return new PostLikedAggregate(post, !!liked);
    }
    return post;
  }
}
