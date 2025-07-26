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
  protected readonly _createdAt: Date;
  protected readonly _updatedAt: Date;

  constructor(props: Props, id?: string) {
    super();
    this.props = props;
    this._id = id ?? uuidV4();
    if (!id) {
      this._createdAt = new Date();
      this._updatedAt = new Date();
    } else {
      this._createdAt = (props as any).createdAt ?? new Date();
      this._updatedAt = (props as any).updatedAt ?? new Date();
    }
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

  equals(entity: Entity): boolean {
    if (this === entity) return true;
    if (this._id !== entity.id) return false;
    return this.props === entity.props;
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
      new this((entity as any).props, ...args) as S,
      entity,
    ) as S;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }
}
