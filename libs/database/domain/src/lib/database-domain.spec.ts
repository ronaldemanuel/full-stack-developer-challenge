import { databaseDomain } from './database-domain.js';

describe('databaseDomain', () => {
  it('should work', () => {
    expect(databaseDomain()).toEqual('database-domain');
  });
});
