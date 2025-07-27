import { base } from './base';
import { native } from './native';
import { web } from './web';

describe('config', () => {
  describe('base', () => {
    it('should be defined', () => {
      expect(base).toBeDefined();
    });
  });
  describe('web', () => {
    it('should be defined', () => {
      expect(web).toBeDefined();
    });
  });
  describe('native', () => {
    it('should be defined', () => {
      expect(native).toBeDefined();
    });
  });
});
