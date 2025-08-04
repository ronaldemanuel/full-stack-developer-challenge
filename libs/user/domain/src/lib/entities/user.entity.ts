import { Entity, ZodEntity } from '@nx-ddd/shared-domain';

import type { UserProps } from '../schemas/user.schema';
import { userPropsSchema } from '../schemas/user.schema';

@ZodEntity(userPropsSchema)
export class UserEntity extends Entity<UserProps> {
  constructor(props: UserProps, id?: string) {
    super(props, id);
  }

  get email(): string {
    return this.props.email;
  }

  get hpLevel(): number {
    return this.props.hpLevel ?? 0;
  }

  set hpLevel(value: number) {
    this.props.hpLevel = value;
  }

  get spLevel(): number {
    return this.props.spLevel ?? 0;
  }

  set spLevel(value: number) {
    this.props.spLevel = value;
  }

  get mpLevel(): number {
    return this.props.mpLevel ?? 0;
  }

  set mpLevel(value: number) {
    this.props.mpLevel = value;
  }

  get name(): string {
    return this.props.name;
  }
}
