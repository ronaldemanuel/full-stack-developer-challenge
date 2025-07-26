/*
https://docs.nestjs.com/fundamentals/testing#unit-testing
*/

import { Test } from '@nestjs/testing';

import { PostDrizzleRepository } from '../../post-drizzle.repository.js';

describe('PostDrizzleRepository', () => {
  let postDrizzleRepository: PostDrizzleRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [], // Add
      controllers: [], // Add
      providers: [], // Add
    }).compile();

    postDrizzleRepository = moduleRef.get<PostDrizzleRepository>(
      PostDrizzleRepository,
    );
  });

  it('should be defined', () => {
    expect(postDrizzleRepository).toBeDefined();
  });
});
