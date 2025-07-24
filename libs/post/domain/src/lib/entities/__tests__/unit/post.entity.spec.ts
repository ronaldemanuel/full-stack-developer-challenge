import { PostEntity } from '../../post.entity.js';

describe('Post Entity', () => {
  describe('when creating a post entity', () => {
    it('should create a post entity with the correct properties', () => {
      const postProps = {
        title: 'Test Post',
        content: 'This is a test post content.',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const post = PostEntity.create(postProps);

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
      };

      expect(() => PostEntity.create(postProps)).toThrowError();
    });
  });
  describe('when updating a post entity', () => {
    it('should update the post entity with new properties', () => {
      const postProps = {
        title: 'Initial Title',
        content: 'Initial content.',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const post = PostEntity.create(postProps);
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

      const post = PostEntity.create(postProps);
      const invalidProps = { title: 'A' }; // Invalid title

      expect(() => post.update(invalidProps)).toThrowError();
    });
  });
});
