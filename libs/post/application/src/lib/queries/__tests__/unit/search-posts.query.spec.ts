/*
https://docs.nestjs.com/fundamentals/testing#unit-testing
*/

import { CqrsModule } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  PostEntityMockFactory,
  PostInMemoryRepository,
  PostRepository,
} from '@nx-ddd/post-domain';

import { SearchPostsQuery } from '../../search-posts.query.js';

describe('SearchPostsQuery', () => {
  let searchPostsQuery: SearchPostsQuery.Handler;
  let postRepository: PostRepository.Repository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CqrsModule.forRoot()],
      controllers: [],
      providers: [
        SearchPostsQuery.Handler,
        {
          provide: PostRepository.TOKEN,
          useClass: PostInMemoryRepository,
        },
      ],
    }).compile();

    searchPostsQuery = moduleRef.get<SearchPostsQuery.Handler>(
      SearchPostsQuery.Handler,
    );
    postRepository = moduleRef.get<PostRepository.Repository>(
      PostRepository.TOKEN,
    );
  });

  it('should be defined', () => {
    expect(searchPostsQuery).toBeDefined();
  });

  it('should search posts with filters and return paginated results', async () => {
    // Arrange
    const mockPost1 = PostEntityMockFactory();
    const mockPost2 = PostEntityMockFactory();

    // Spy on the toJSON methods
    const toJSONSpy1 = vi.spyOn(mockPost1, 'toJSON');
    const toJSONSpy2 = vi.spyOn(mockPost2, 'toJSON');

    const mockPosts = [mockPost1, mockPost2];

    // Create a proper search result
    const searchResult = new PostRepository.SearchResult({
      items: mockPosts,
      total: 2,
      currentPage: 1,
      perPage: 10,
      sort: null,
      sortDir: null,
      filter: null,
    });

    // Mock the search method
    vi.spyOn(postRepository, 'search').mockResolvedValue(searchResult);

    const query = SearchPostsQuery.create({
      page: 1,
      perPage: 10,
      filter: {
        search: 'test',
        authorId: '123',
      },
    });

    // Act
    const result = await searchPostsQuery.execute(query);

    // Assert
    expect(postRepository.search).toHaveBeenCalled();
    expect(postRepository.search).toHaveBeenCalledWith(
      expect.objectContaining({
        _filter: {
          search: 'test',
          authorId: '123',
        },
        _page: 1,
        _perPage: 10,
      }),
    );

    expect(toJSONSpy1).toHaveBeenCalled();
    expect(toJSONSpy2).toHaveBeenCalled();

    expect(result).toEqual({
      items: [mockPost1.toJSON(), mockPost2.toJSON()],
      total: 2,
      currentPage: 1,
      perPage: 10,
      lastPage: 1,
    });
  });
});
