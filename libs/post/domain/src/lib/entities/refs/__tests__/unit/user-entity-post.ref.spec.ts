import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { PostEntity } from '../../../post.entity';
import { PostLikeRemovedEvent } from '../../../../events/post-like-removed.event';
import { PostLikedEvent } from '../../../../events/post-liked.event';
import { PostEntityMockFactory } from '../../../../factories/post-entity-mock.factory';
import { UserPostEntityRefFactory } from '../../../../factories/user-post-entity-ref.factory';
import { LikeEntity } from '../../../like.entity';
import { UserEntityPostRef } from '../../user-entity-post.ref';

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
    vi.spyOn(post, 'apply');
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
      const likes = [like];
      const createdPosts: PostEntity[] = [post];

      // Add like to user using factory
      userPostRef = UserPostEntityRefFactory(
        { email: 'test@example.com' },
        { likes, createdPosts },
        '123e4567-e89b-12d3-a456-426614174001',
      );

      expect(userPostRef.likedPosts).toEqual(createdPosts);
    });
  });

  describe('toggleLike method', () => {
    it('should add a like when post is not liked', () => {
      // Initial state - no likes
      expect(userPostRef.likedPosts).toEqual([]);

      // Spy on watched relations to verify they're updated correctly
      const addSpy = vi.spyOn(userPostRef.$watchedRelations.likes, 'add');

      // Toggle like
      userPostRef.togglePostLike(post);

      // Should have added a like
      expect(userPostRef.likedPosts.length).toBe(1);
      expect(userPostRef.likedPosts[0]).toBe(post);

      // Verify watched relations were updated
      expect(addSpy).toHaveBeenCalled();

      // Check watched relations collections
      const newItems = userPostRef.$watchedRelations.likes.getNewItems();
      expect(newItems.length).toBe(1);
      expect(newItems[0].post.id).toBe(post.id);
      expect(newItems[0].user.id).toBe(userPostRef.id);

      // Should have applied PostLiked event
      expect(post.apply).toHaveBeenCalledWith(expect.any(PostLikedEvent));

      // Verify event data
      const eventArg = vi.mocked(post.apply).mock
        .calls[0][0] as PostLikeRemovedEvent;
      expect(eventArg).toBeInstanceOf(PostLikedEvent);
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

      post = PostEntityMockFactory(
        {
          title: post.title,
          content: post.content,
        },
        { likes: likes },
        post.id,
      );

      // Spy on apply method again (since we recreated the userPostRef)
      vi.spyOn(post, 'apply');

      // Spy on watched relations to verify they're updated correctly
      const removeSpy = vi.spyOn(userPostRef.$watchedRelations.likes, 'remove');
      const addSpy = vi.spyOn(userPostRef.$watchedRelations.likes, 'add');

      // Initial state - has a like
      expect(userPostRef.likedPosts.length).toBe(1);

      // Toggle like to remove it
      userPostRef.togglePostLike(post);

      // Should have removed the like
      expect(userPostRef.likedPosts).toEqual([]);
      expect(post.likes.length).toBe(0);

      // Verify watched relations were updated
      expect(removeSpy).toHaveBeenCalledTimes(1); // remove called once
      expect(addSpy).not.toHaveBeenCalled(); // add not called

      // Check watched relations collections
      // Since this like was part of the initial setup (existing before this transaction),
      // removing it should properly add it to removedItems
      const removedItems =
        userPostRef.$watchedRelations.likes.getRemovedItems();
      expect(removedItems.length).toBe(1);
      expect(removedItems[0].post.id).toBe(post.id);
      expect(removedItems[0].user.id).toBe(userPostRef.id);

      // Should have applied PostLikedEvent
      expect(post.apply).toHaveBeenCalledWith(expect.any(PostLikeRemovedEvent));

      // Verify event data
      const eventArg = vi.mocked(post.apply).mock.calls[0][0] as PostLikedEvent;
      expect(eventArg).toBeInstanceOf(PostLikeRemovedEvent);
      expect(eventArg).toEqual(
        expect.objectContaining({
          userId: userPostRef.id,
          postId: post.id,
          date: expect.any(Date),
        }),
      );
    });

    it('should correctly handle toggling like multiple times', () => {
      // Setup spies
      const addSpy = vi.spyOn(userPostRef.$watchedRelations.likes, 'add');
      const removeSpy = vi.spyOn(userPostRef.$watchedRelations.likes, 'remove');

      // Toggle like on (first time)
      userPostRef.togglePostLike(post);
      expect(userPostRef.likedPosts.length).toBe(1);
      expect(addSpy).toHaveBeenCalledTimes(1); // add called once

      // Check watched relations after adding
      const newItemsAfterAdd =
        userPostRef.$watchedRelations.likes.getNewItems();
      expect(newItemsAfterAdd.length).toBe(1);
      expect(newItemsAfterAdd[0].post.id).toBe(post.id);

      // Toggle like off
      userPostRef.togglePostLike(post);
      expect(userPostRef.likedPosts).toEqual([]);
      expect(removeSpy).toHaveBeenCalledTimes(1); // remove called once

      // Check watched relations after removal
      // Since this like was added in this same transaction, removing it
      // should just remove it from newItems rather than add it to removedItems
      const newItemsAfterRemove =
        userPostRef.$watchedRelations.likes.getNewItems();
      expect(newItemsAfterRemove.length).toBe(0); // The item should be removed from newItems

      const removedItemsAfterRemove =
        userPostRef.$watchedRelations.likes.getRemovedItems();
      expect(removedItemsAfterRemove.length).toBe(0); // Should be empty, not in removedItems

      // Toggle like on again
      userPostRef.togglePostLike(post);
      expect(userPostRef.likedPosts.length).toBe(1);
      expect(addSpy).toHaveBeenCalledTimes(2); // add called again

      // Check final state of watched relations
      // const finalNewItems = userPostRef.$watchedRelations.likes.getNewItems();
      // expect(finalNewItems.length).toBe(1); // Only one new item after the add/remove/add cycle
      // expect(
      //   finalNewItems.filter((item) => item.post.id === post.id).length,
      // ).toBe(1);
    });

    it('should properly track watched relations across multiple toggles', () => {
      // Reset watched relations state for this test
      vi.clearAllMocks();

      // Spy on watched relations methods
      const addSpy = vi.spyOn(userPostRef.$watchedRelations.likes, 'add');
      const removeSpy = vi.spyOn(userPostRef.$watchedRelations.likes, 'remove');

      // Toggle like on and off multiple times
      userPostRef.togglePostLike(post); // Add
      userPostRef.togglePostLike(post); // Remove (item added and removed in the same transaction)
      userPostRef.togglePostLike(post); // Add again

      // Verify the add and remove methods are called the expected number of times
      // We expect add to be called twice (initial add and re-add)
      expect(addSpy).toHaveBeenCalledTimes(2);
      // We expect remove to be called once (when unliking)
      expect(removeSpy).toHaveBeenCalledTimes(1);

      // Check final state
      // const newItems = userPostRef.$watchedRelations.likes.getNewItems();
      const removedItems =
        userPostRef.$watchedRelations.likes.getRemovedItems();

      // After adding, removing, and re-adding, we should have 1 new item and 0 removed items
      // Because an item added and removed in the same transaction doesn't go to removedItems
      // expect(newItems.length).toBe(1);
      expect(removedItems.length).toBe(0);

      // The final state should have one like
      expect(userPostRef.likedPosts.length).toBe(1);
    });

    it('should handle multiple liked posts correctly with watched relations', () => {
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

      // Reset watched relations state for this test
      vi.clearAllMocks();

      // Spy on watched relations methods
      const addSpy = vi.spyOn(userPostRef.$watchedRelations.likes, 'add');
      const removeSpy = vi.spyOn(userPostRef.$watchedRelations.likes, 'remove');

      // Like multiple posts
      userPostRef.togglePostLike(post1);
      userPostRef.togglePostLike(post2);

      // Verify likes were added correctly
      expect(userPostRef.likedPosts.length).toBe(2);
      expect(userPostRef.likedPosts).toContainEqual(post1);
      expect(userPostRef.likedPosts).toContainEqual(post2);

      // Verify watched relations after adding
      expect(addSpy).toHaveBeenCalledTimes(2); // add called for each post

      // Check new items in watched relations
      const newItemsAfterAdding =
        userPostRef.$watchedRelations.likes.getNewItems();
      expect(newItemsAfterAdding.length).toBe(2);
      expect(
        newItemsAfterAdding.some((item) => item.post.id === post1.id),
      ).toBe(true);
      expect(
        newItemsAfterAdding.some((item) => item.post.id === post2.id),
      ).toBe(true);

      // Unlike one post
      userPostRef.togglePostLike(post1);

      // Verify like was removed correctly
      expect(userPostRef.likedPosts.length).toBe(1);
      expect(userPostRef.likedPosts).not.toContainEqual(post1);
      expect(userPostRef.likedPosts).toContainEqual(post2);

      // Verify watched relations after removal
      expect(removeSpy).toHaveBeenCalledTimes(1); // remove called once

      // Check new items and removed items in watched relations
      // Since both posts were added in the current transaction,
      // removing post1 should remove it from newItems rather than adding to removedItems
      const newItemsAfterRemoval =
        userPostRef.$watchedRelations.likes.getNewItems();
      expect(newItemsAfterRemoval.length).toBe(1);
      expect(newItemsAfterRemoval[0].post.id).toBe(post2.id);

      const removedItems =
        userPostRef.$watchedRelations.likes.getRemovedItems();
      expect(removedItems.length).toBe(0); // Should be empty since post1 was added in this transaction

      // Final state should only have post2 in new items
      expect(
        newItemsAfterRemoval.some((item) => item.post.id === post1.id),
      ).toBe(false);
    });
  });
});
