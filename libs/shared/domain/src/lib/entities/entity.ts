import { AggregateRoot } from '@nestjs/cqrs';
import { v4 as uuidV4 } from 'uuid';

export interface EntityProps {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEntity<Props = object> {
  get id(): string;
  update(newProps: Partial<Props>): void;
}

export abstract class Entity<
    Props = object,
    Json extends Required<EntityProps & Props> = Required<EntityProps & Props>,
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

  static create<
    T extends Entity<any, any>, // a instância que será retornada
    P = any, // os props
  >(this: new (props: P) => T, props: P): T {
    return new this(props) as T;
  }

  toJSON(): Json {
    return {
      ...this.props,
      id: this._id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    } as Json;
  }

  static cast<
    P,
    T extends Entity<P, any>,
    S extends T,
    RestArgs extends any[] = [],
  >(
    this: new (props: P, ...args: RestArgs) => S,
    entity: T,
    ...args: RestArgs
  ): S {
    return Object.assign(
      new this((entity as any).props as P, ...args) as S,
      entity,
    ) as S;
  }
  protected get createdAt(): Date {
    return (this.props as any).createdAt ?? new Date();
  }
  protected get updatedAt(): Date {
    return (this.props as any).updatedAt ?? new Date();
  }
}
