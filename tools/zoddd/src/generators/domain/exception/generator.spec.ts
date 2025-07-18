import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { domainExceptionGenerator } from './generator';
import { DomainExceptionGeneratorSchema } from './schema';

describe('domain-exception generator', () => {
  let tree: Tree;
  const options: DomainExceptionGeneratorSchema = { name: 'test' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await domainExceptionGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});
