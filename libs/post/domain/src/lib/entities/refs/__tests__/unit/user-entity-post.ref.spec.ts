import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { PostEntity } from '../../../post.entity.js';
import { PostLikeRemoved } from '../../../../events/post-like-removed.event.js';
import { PostLikedEvent } from '../../../../events/post-liked.event.js';
import { PostEntityMockFactory } from '../../../../factories/post-entity-mock.factory.js';
import { UserPostEntityRefFactory } from '../../../../factories/user-post-entity-ref.factory.js';
import { LikeEntity } from '../../../like.entity.js';
import { UserEntityPostRef } from '../../user-entity-post.ref.js';

describe('UserEntityPostRef', () => {
  let userPostRef: UserEntityPostRef;
  let post: PostEntity;

  beforeEach(() => {
    // Setup basic user with empty relations
    const likes: LikeEntity[] = [];
    const createdPosts: PostEntity[] = [];

    // Use UserPostEntityRefFactory to create the user
    userPostRef = UserPostEntityRefFactory(
      { email: 'test@example.com' },
      { likes, createdPosts },
      '123e4567-e89b-12d3-a456-426614174001',
    );

    // Create a test post using PostEntityMockFactory
    post = PostEntityMockFactory(
      {
        title: 'Test Post',
        content: 'This is a test post content.',
      },
      { owner: userPostRef },
      '123e4567-e89b-12d3-a456-426614174000',
    );

    // Spy on apply method to verify events
    vi.spyOn(userPostRef, 'apply');
  });

  describe('constructor', () => {
    it('should initialize correctly when casting from UserEntity', () => {
      const stub = { email: 'test@example.com', id: 'user-id-123' };
      const ref = UserPostEntityRefFactory(
        { email: stub.email },
        { createdPosts: [], likes: [] },
        stub.id,
      );
      expect(ref).toBeInstanceOf(UserEntityPostRef);
      expect(ref.id).toBe(stub.id);
      expect(ref.email).toBe(stub.email);
    });
  });

  describe('likedPosts getter', () => {
    it('should return empty array when no likes exist', () => {
      expect(userPostRef.likedPosts).toEqual([]);
    });

    it('should return array of posts when likes exist', () => {
      // Create a like
      const like = LikeEntity.create(userPostRef, post);

      // Add like to user using factory
      userPostRef = UserPostEntityRefFactory(
        { email: 'test@example.com' },
        { likes: [like], createdPosts: [] },
        '123e4567-e89b-12d3-a456-426614174001',
      );

      expect(userPostRef.likedPosts).toEqual([post]);
    });
  });

  describe('toggleLike method', () => {
    it('should add a like when post is not liked', () => {
      // Initial state - no likes
      expect(userPostRef.likedPosts).toEqual([]);

      // Toggle like
      userPostRef.toggleLike(post);

      // Should have added a like
      expect(userPostRef.likedPosts.length).toBe(1);
      expect(userPostRef.likedPosts[0]).toBe(post);

      // Should have applied PostLikeRemoved event
      expect(userPostRef.apply).toHaveBeenCalledWith(
        expect.any(PostLikeRemoved),
      );

      // Verify event data
      const eventArg = vi.mocked(userPostRef.apply).mock
        .calls[0][0] as PostLikeRemoved;
      expect(eventArg).toBeInstanceOf(PostLikeRemoved);
      expect(eventArg).toEqual(
        expect.objectContaining({
          userId: userPostRef.id,
          postId: post.id,
          date: expect.any(Date),
        }),
      );
    });

    it('should remove a like when post is already liked', () => {
      // Create a like
      const like = LikeEntity.create(userPostRef, post);
      const likes = [like];

      // Setup user with existing like using factory
      userPostRef = UserPostEntityRefFactory(
        { email: 'test@example.com' },
        { likes: likes, createdPosts: [] },
        '123e4567-e89b-12d3-a456-426614174001',
      );

      // Spy on apply method again (since we recreated the userPostRef)
      vi.spyOn(userPostRef, 'apply');

      // Initial state - has a like
      expect(userPostRef.likedPosts.length).toBe(1);

      // Toggle like to remove it
      userPostRef.toggleLike(post);

      // Should have removed the like
      expect(userPostRef.likedPosts).toEqual([]);

      // Should have applied PostLikedEvent
      expect(userPostRef.apply).toHaveBeenCalledWith(
        expect.any(PostLikedEvent),
      );

      // Verify event data
      const eventArg = vi.mocked(userPostRef.apply).mock
        .calls[0][0] as PostLikedEvent;
      expect(eventArg).toBeInstanceOf(PostLikedEvent);
      expect(eventArg).toEqual(
        expect.objectContaining({
          userId: userPostRef.id,
          postId: post.id,
          date: expect.any(Date),
        }),
      );
    });

    it('should correctly handle toggling like multiple times', () => {
      // Toggle like on (first time)
      userPostRef.toggleLike(post);
      expect(userPostRef.likedPosts.length).toBe(1);

      // Toggle like off
      userPostRef.toggleLike(post);
      expect(userPostRef.likedPosts).toEqual([]);

      // Toggle like on again
      userPostRef.toggleLike(post);
      expect(userPostRef.likedPosts.length).toBe(1);
    });

    it('should handle multiple liked posts correctly', () => {
      const post1 = PostEntityMockFactory(
        {
          title: 'Test Post 1',
          content: 'This is test post 1 content.',
        },
        { owner: userPostRef },
        '123e4567-e89b-12d3-a456-426614174100',
      );
      const post2 = PostEntityMockFactory(
        {
          title: 'Test Post 2',
          content: 'This is test post 2 content.',
        },
        { owner: userPostRef },
        '123e4567-e89b-12d3-a456-426614174200',
      );

      // Like multiple posts
      userPostRef.toggleLike(post1);
      userPostRef.toggleLike(post2);

      expect(userPostRef.likedPosts.length).toBe(2);
      expect(userPostRef.likedPosts).toContainEqual(post1);
      expect(userPostRef.likedPosts).toContainEqual(post2);

      // Unlike one post
      userPostRef.toggleLike(post1);

      expect(userPostRef.likedPosts.length).toBe(1);
      expect(userPostRef.likedPosts).not.toContainEqual(post1);
      expect(userPostRef.likedPosts).toContainEqual(post2);
    });
  });
});
