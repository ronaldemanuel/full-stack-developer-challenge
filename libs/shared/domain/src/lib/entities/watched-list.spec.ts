import { describe, expect, it } from 'vitest';

import { Entity } from './entity';
import { WatchedList } from './watched-list';

class TestEntity extends Entity<object> {}

describe('Core WatchedList', () => {
  it('should be able to instantiate', () => {
    const testList = new WatchedList<TestEntity>();

    expect(testList.getItems()).toEqual([]);
    expect(testList.getNewItems()).toEqual([]);
    expect(testList.getRemovedItems()).toEqual([]);
  });

  it('should be able to instantiate with initial items', () => {
    const el1 = new TestEntity({}, '1');
    const el2 = new TestEntity({}, '2');
    const numberList = new WatchedList<TestEntity>([el1, el2]);

    expect(numberList.getItems()).toEqual([el1, el2]);
    expect(numberList.exists(el1)).toBe(true);
    expect(numberList.exists(el2)).toBe(true);
  });

  it('should be able to add a new item', () => {
    const numberList = new WatchedList<TestEntity>();
    const el1 = new TestEntity({}, '1');

    numberList.add(el1);

    expect(numberList.getItems()).toEqual([el1]);
    expect(numberList.getNewItems()).toEqual([el1]);
    expect(numberList.getRemovedItems()).toEqual([]);
  });

  it('should be able to remove an item', () => {
    const el1 = new TestEntity({}, '1');
    const el2 = new TestEntity({}, '2');
    const numberList = new WatchedList<TestEntity>([el1, el2]);

    numberList.remove(el2);

    expect(numberList.getItems()).toEqual([el1]);
    expect(numberList.getNewItems()).toEqual([]);
    expect(numberList.getRemovedItems()).toEqual([el2]);
  });

  it('should be able to add an already removed item', () => {
    const el1 = new TestEntity({}, '1');
    const el2 = new TestEntity({}, '2');
    const numberList = new WatchedList<TestEntity>([el1, el2]);

    numberList.remove(el2);
    numberList.add(el2);

    expect(numberList.getItems()).toEqual([el1, el2]);
    expect(numberList.getNewItems()).toEqual([]);
    expect(numberList.getRemovedItems()).toEqual([]);
  });

  it('should be able to remove a new item', () => {
    const el1 = new TestEntity({}, '1');
    const el2 = new TestEntity({}, '2');
    const el3 = new TestEntity({}, '3');
    const numberList = new WatchedList<TestEntity>([el1, el2]);

    numberList.add(el3);
    numberList.remove(el3);

    expect(numberList.getItems()).toEqual([el1, el2]);
    expect(numberList.getNewItems()).toEqual([]);
    expect(numberList.getRemovedItems()).toEqual([]);
  });
});
