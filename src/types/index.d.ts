import UserEntity from '@/database/entity/user';

declare global {
  namespace Express {
    export interface User extends UserEntity {}
  }
}
