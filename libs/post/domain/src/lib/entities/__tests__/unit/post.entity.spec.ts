import { UserEntity } from '@nx-ddd/user-domain';

import { PostEntity } from '../../post.entity.js';
import { UserEntityPostRef } from '../../refs/user-entity-post.ref.js';

const mockOwner = (id = '123e4567-e89b-12d3-a456-426614174000') => {
  return UserEntityPostRef.cast(
    UserEntity.create({
      email: '',
    }),
    () => ({
      createdPosts: [],
      likes: [],
    }),
  );
};

describe('Post Entity', () => {
  describe('when creating a post entity', () => {
    it('should create a post entity with the correct properties', () => {
      const postProps = {
        title: 'Test Post',
        content: 'This is a test post content.',
        createdAt: new Date(),
        updatedAt: new Date(),
        ownerId: '123e4567-e89b-12d3-a456-426614174000',
      };

      const post = PostEntity.create(postProps, mockOwner());

      expect(post).toBeInstanceOf(PostEntity);
      expect(post.title).toBe('Test Post');
      expect(post.content).toBe('This is a test post content.');
    });
    it('should throw an error if title is too short', () => {
      const postProps = {
        title: 'Test',
        content: 'This is a test post content.',
        createdAt: new Date(),
        updatedAt: new Date(),
        ownerId: '123e4567-e89b-12d3-a456-426614174000',
      };

      expect(() => PostEntity.create(postProps, mockOwner())).toThrowError();
    });
  });
  describe('when updating a post entity', () => {
    it('should update the post entity with new properties', () => {
      const postProps = {
        title: 'Initial Title',
        content: 'Initial content.',
        createdAt: new Date(),
        updatedAt: new Date(),
        ownerId: '123e4567-e89b-12d3-a456-426614174000',
      };

      const post = PostEntity.create(postProps, mockOwner());
      const newProps = { title: 'Updated Title', content: 'Updated content.' };

      post.update(newProps);

      expect(post.title).toBe('Updated Title');
      expect(post.content).toBe('Updated content.');
    });
    it('should not update the post entity with invalid properties', () => {
      const postProps = {
        title: 'Valid Title',
        content: 'Valid content.',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const post = PostEntity.create(postProps, mockOwner());
      const invalidProps = { title: 'A' }; // Invalid title

      expect(() => post.update(invalidProps)).toThrowError();
    });
  });
});
