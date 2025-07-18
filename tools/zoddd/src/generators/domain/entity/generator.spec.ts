import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { domainEntityGenerator } from './generator';
import { DomainEntityGeneratorSchema } from './schema';

describe('domain-entity generator', () => {
  let tree: Tree;
  const options: DomainEntityGeneratorSchema = { name: 'test' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await domainEntityGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});
