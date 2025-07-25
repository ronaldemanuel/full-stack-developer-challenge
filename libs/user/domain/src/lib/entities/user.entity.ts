import { Entity } from '@nx-ddd/shared-domain';

export interface UserProps {
  email: string;
}

export class UserEntity extends Entity<UserProps> {
  get email(): string {
    return this.props.email;
  }
}
