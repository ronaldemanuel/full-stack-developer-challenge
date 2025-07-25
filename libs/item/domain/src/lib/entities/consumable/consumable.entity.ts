import { ItemEntity } from '../abstract-item.entity.js';

export abstract class ConsumableEntity extends ItemEntity {
  protected effectLevel = 1;

  protected consume(): void {
    this.props.stackNumber -= 1;
  }
}
