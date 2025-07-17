import { AggregateRoot } from '@nestjs/cqrs';
import { v4 as uuidV4 } from 'uuid';

export interface IEntity<Props = object> {
  get id(): string;
  update(newProps: Partial<Props>): void;
}

export abstract class Entity<
    Props = object,
    Json extends Required<{ id: string } & Props> = Required<
      { id: string } & Props
    >
  >
  extends AggregateRoot
  implements IEntity<Props>
{
  protected readonly _id: string;
  protected readonly props: Props;

  constructor(props: Props, id?: string) {
    super();
    this.props = props;
    this._id = id ?? uuidV4();
  }

  get id() {
    return this._id;
  }

  update(newProps: Partial<Props>) {
    Object.assign(this.props as object, {
      ...newProps,
    });
  }

  toJSON(): Json {
    return {
      ...this.props,
      id: this._id,
    } as Json;
  }

  protected createdAt!: Date;
}
