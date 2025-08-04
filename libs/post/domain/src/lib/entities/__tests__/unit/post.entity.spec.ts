import { PostEntityMockFactory } from '../../../factories/post-entity-mock.factory';
import { UserPostEntityRefFactory } from '../../../factories/user-post-entity-ref.factory';
import { PostEntity } from '../../post.entity';

describe('Post Entity', () => {
  describe('when creating a post entity', () => {
    it('should create a post entity with the correct properties', () => {
      const owner = UserPostEntityRefFactory(
        { email: 'test@example.com' },
        { createdPosts: [], likes: [] },
        '123e4567-e89b-12d3-a456-426614174000',
      );

      const postProps = {
        title: 'Test Post',
        content: 'This is a test post content.',
        createdAt: new Date(),
        updatedAt: new Date(),
        ownerId: owner.id,
      };

      const post = PostEntityMockFactory(postProps, { owner });

      expect(post).toBeInstanceOf(PostEntity);
      expect(post.title).toBe('Test Post');
      expect(post.content).toBe('This is a test post content.');
    });
    it('should throw an error if title is too short', () => {
      const owner = UserPostEntityRefFactory(
        { email: 'test@example.com' },
        { createdPosts: [], likes: [] },
        '123e4567-e89b-12d3-a456-426614174000',
      );

      const postProps = {
        title: 'Test', // Too short
        content: 'This is a test post content.',
        createdAt: new Date(),
        updatedAt: new Date(),
        ownerId: owner.id,
      };

      expect(() => PostEntityMockFactory(postProps, { owner })).toThrowError();
    });
  });
  describe('when updating a post entity', () => {
    it('should update the post entity with new properties', () => {
      const owner = UserPostEntityRefFactory(
        { email: 'test@example.com' },
        { createdPosts: [], likes: [] },
        '123e4567-e89b-12d3-a456-426614174000',
      );

      const postProps = {
        title: 'Initial Title',
        content: 'Initial content.',
        createdAt: new Date(),
        updatedAt: new Date(),
        ownerId: owner.id,
      };

      const post = PostEntityMockFactory(postProps, { owner });
      const newProps = { title: 'Updated Title', content: 'Updated content.' };

      post.update(newProps);

      expect(post.title).toBe('Updated Title');
      expect(post.content).toBe('Updated content.');
    });
    it('should not update the post entity with invalid properties', () => {
      const owner = UserPostEntityRefFactory(
        { email: 'test@example.com' },
        { createdPosts: [], likes: [] },
      );

      const postProps = {
        title: 'Valid Title',
        content: 'Valid content.',
        createdAt: new Date(),
        updatedAt: new Date(),
        ownerId: owner.id,
      };

      const post = PostEntityMockFactory(postProps, { owner });
      const invalidProps = { title: 'A' }; // Invalid title

      expect(() => post.update(invalidProps)).toThrowError();
    });
  });
});
