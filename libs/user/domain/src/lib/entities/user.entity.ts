import { Entity } from '@nx-ddd/shared-domain';

import type { UserProps } from '../schemas/user.schema';

export class UserEntity extends Entity<UserProps> {
  get email(): string {
    return this.props.email;
  }
  get name(): string {
    return this.props.name;
  }
}
