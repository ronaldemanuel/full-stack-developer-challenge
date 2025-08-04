import type { UserRepository } from '@nx-ddd/user-domain';
import { InMemorySearchableRepository } from '@nx-ddd/shared-domain';

import type { PostEntity } from '../../../../entities/post.entity';
import type { PostRepository } from '../../../../repositories/post.repository';
import { PostLikedAggregate } from '../../../../aggregates/post-liked.aggregate';
import { UserEntityPostRef } from '../../../../entities/index';

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
  userRepository?: UserRepository.Repository | undefined;
  updateUserRef(user: UserEntityPostRef): Promise<void> {
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
    if (scopes?.likedByUserId && this.userRepository) {
      const user = UserEntityPostRef.cast(
        await this.userRepository?.findById(scopes.likedByUserId),
      );
      const liked = user?.likedPosts.find((p) => p.id === post.id);
      return new PostLikedAggregate(post, !!liked);
    }
    return post;
  }
}
