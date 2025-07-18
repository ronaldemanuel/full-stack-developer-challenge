import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { domainRepositoryGenerator } from './generator';
import { DomainRepositoryGeneratorSchema } from './schema';

describe('domain-repository generator', () => {
  let tree: Tree;
  const options: DomainRepositoryGeneratorSchema = { name: 'test' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await domainRepositoryGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});
