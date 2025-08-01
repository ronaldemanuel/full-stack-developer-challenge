import { beforeEach, describe, expect, it } from 'vitest';

import {
  BootsEntity,
  ChestEntity,
  GlovesEntity,
  HelmetEntity,
  HpPotionEntity,
  ItemEntity,
  ITEMS,
  MpPotionEntity,
  OneHandedWeaponEntity,
  SpPotionEntity,
  TwoHandedWeaponEntity,
} from '@nx-ddd/item-domain';

import { InMemoryItemRepository } from '../../in-memory-item.repository';

describe('InMemoryItemRepository', () => {
  let repository: InMemoryItemRepository;

  beforeEach(() => {
    repository = new InMemoryItemRepository();
  });

  // F.I.R.S.T. - Fast, Independent, Repeatable, Self-validating, Timely
  describe('find', () => {
    it('should return all items from ITEMS constant mapped to their respective classes', async () => {
      const items = await repository.findAll();

      expect(items).toHaveLength(Object.keys(ITEMS).length);
      expect(items.every((item) => item instanceof ItemEntity)).toBeTruthy();
    });

    it('should return items with correct class instances', async () => {
      const items = await repository.findAll();

      const itemTypeMap = {
        'dragonscale-helmet': HelmetEntity,
        'dragonscale-armor': ChestEntity,
        'dragonscale-boots': BootsEntity,
        'dragonscale-gautlets': GlovesEntity,
        'leather-helmet': HelmetEntity,
        'leather-bracers': GlovesEntity,
        'leather-armor': ChestEntity,
        'leather-boots': BootsEntity,
        'daedric-battleaxe': TwoHandedWeaponEntity,
        'ebony-sword': OneHandedWeaponEntity,
        'iron-sword': OneHandedWeaponEntity,
        'potion-of-health': HpPotionEntity,
        'potion-of-enhanced-stamina': SpPotionEntity,
        'potion-of-extra-magicka': MpPotionEntity,
      };

      items.forEach((item) => {
        const expectedClass = itemTypeMap[item.id as keyof typeof itemTypeMap];

        expect(item).toBeInstanceOf(expectedClass);
      });
    });
  });

  describe('findByIdentifier', () => {
    it('should return the correct item when given a valid ID', async () => {
      const item = await repository.findById('dragonscale-helmet');

      expect(item).toBeDefined();
      expect(item).toBeInstanceOf(HelmetEntity);
      expect(item.id).toBe('dragonscale-helmet');
    });

    it('should return undefined when given an invalid ID', async () => {
      await expect(
        repository.findById('non-existent-item'),
      ).rejects.toThrowError();
    });
  });

  describe('findIdListByType', () => {
    it('should return IDs of items matching the given type', async () => {
      const result = await repository.findIdListByType('weapon');
      expect(result).toEqual([
        'daedric-battleaxe',
        'ebony-sword',
        'iron-sword',
      ]);
    });

    it('should return an empty array if no items match the type', async () => {
      const result = await repository.findIdListByType('ring');
      expect(result).toEqual([]);
    });
  });
});
