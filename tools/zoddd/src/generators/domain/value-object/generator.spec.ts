import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { domainValueObjectGenerator } from './generator';
import { DomainValueObjectGeneratorSchema } from './schema';

describe('domain-value-object generator', () => {
  let tree: Tree;
  const options: DomainValueObjectGeneratorSchema = { name: 'test' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await domainValueObjectGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});
