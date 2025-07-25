import { Entity } from '@nx-ddd/shared-domain';

import type { UserProps } from '../schemas/user.schema.js';

export class UserEntity extends Entity<UserProps> {
  get email(): string {
    return this.props.email;
  }
}
